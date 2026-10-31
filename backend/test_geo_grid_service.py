"""Stage 0 tests for the Geo-Grid service. Run: python backend/test_geo_grid_service.py (or pytest)."""
import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

import geo_grid_service as gg
from schemas import GeoGridScanRequest, GeoGridScanResponse

OWN_ID = "ChIJ_own"


def _place(pid, name, rating=4.5, reviews=10):
    return {
        "place_id": pid, "name": name, "address": "addr", "google_maps_url": f"https://maps/{pid}",
        "website_url": "", "phone": "", "rating": rating, "reviews_count": reviews,
        "primary_category": "Visa Service", "secondary_categories": [], "open_now": None,
        "photos_count": 0, "price_level": "",
    }


def _patch(monkey_fn):
    gg.search_places_grid_point = monkey_fn
    gg.get_public_place_details = lambda q: {"place_id": OWN_ID, "business_name": "Sir Visaranus",
                                             "lat": 12.27, "lng": 109.20}
    gg.get_place_location_by_id = lambda pid: {"place_id": pid, "name": "Sir Visaranus", "lat": 12.27, "lng": 109.20}
    gg._MEMORY_HISTORY.clear()


def _req(**kw):
    base = dict(profile_id="loc-1", keyword="visa run", grid_size=3, distance_meters=500.0,
                business_name="Sir Visaranus", address="60 Hon Chong", plan_id="PRO_GROWTH")
    base.update(kw)
    return GeoGridScanRequest(**base)


def test_grid_orientation_north_west_first():
    nodes = gg.build_grid(12.27, 109.20, 3, 500)
    assert len(nodes) == 9
    assert nodes[0]["lat"] > nodes[8]["lat"]          # pos 1 is north, pos 9 is south
    assert nodes[0]["lng"] < nodes[2]["lng"]          # row goes west -> east (was mirrored before)
    assert abs(nodes[4]["lat"] - 12.27) < 1e-9 and abs(nodes[4]["lng"] - 109.20) < 1e-9


def test_metrics_states():
    grid = [
        {"state": "FOUND", "rank": 1}, {"state": "FOUND", "rank": 3}, {"state": "FOUND", "rank": 7},
        {"state": "NOT_IN_TOP20", "rank": None}, {"state": "NO_DATA", "rank": None},
    ]
    m = gg.compute_metrics(grid)
    assert m["nodes_with_data"] == 4 and m["nodes_found"] == 3 and m["nodes_top3"] == 2
    assert m["atrp"] == round((1 + 3 + 7) / 3, 2)
    assert m["arp"] == round((1 + 3 + 7 + 21) / 4, 2)
    assert m["solv"] == 50.0
    empty = gg.compute_metrics([{"state": "NO_DATA", "rank": None}])
    assert empty["arp"] is None and empty["solv"] is None


def test_scan_states_top3_and_place_id_matching():
    def fake(keyword, lat, lng, radius, mode, step, page):
        # center-ish call order is irrelevant: derive behaviour from latitude
        if lat > 12.2705:   # northern row -> no data
            return None
        if lng < 109.1999:  # west column -> not found
            return [_place("c1", "Competitor One"), _place("c2", "Competitor Two"), _place("c3", "C3")]
        return [_place("c1", "Competitor One"), _place(OWN_ID, "Сэр Визаранус"), _place("c3", "C3")]
    _patch(fake)
    res = asyncio.run(gg.run_geo_grid(_req(), None))
    GeoGridScanResponse(**res)  # schema valid
    assert res["status"] == "success"
    states = {n["state"] for n in res["grid"]}
    assert states == {"NO_DATA", "NOT_IN_TOP20", "FOUND"}
    found = [n for n in res["grid"] if n["state"] == "FOUND"]
    assert all(n["rank"] == 2 for n in found)                     # own name in Cyrillic still found by place_id
    assert all(n["top3"][1]["is_you"] for n in found)
    assert all(c["name"] != "Сэр Визаранус" for c in res["competitors"])
    assert res["competitors"][0]["name"] == "Competitor One"
    assert res["meta"]["own_place_id"] == OWN_ID and res["meta"]["scans_used"] == 1


def test_cache_does_not_bill_and_limit_blocks_new_scan():
    calls = {"n": 0}

    def fake(*a, **k):
        calls["n"] += 1
        return [_place(OWN_ID, "Sir Visaranus")]
    _patch(fake)
    req = _req(plan_id="FREE_SCOUT")          # limit 2 / month
    first = asyncio.run(gg.run_geo_grid(req, None))
    assert first["status"] == "success" and first["meta"]["scans_used"] == 1
    n_after_first = calls["n"]

    again = asyncio.run(gg.run_geo_grid(req, None))
    assert again["meta"]["cached"] is True and again["meta"]["scans_used"] == 1
    assert calls["n"] == n_after_first             # cache hit: no extra Google calls, not billed

    second = asyncio.run(gg.run_geo_grid(_req(plan_id="FREE_SCOUT", keyword="second query"), None))
    assert second["status"] == "success" and second["meta"]["scans_used"] == 2
    n_after_second = calls["n"]

    other = asyncio.run(gg.run_geo_grid(_req(plan_id="FREE_SCOUT", keyword="border run"), None))
    assert other["status"] == "limit_reached" and other["grid"] == []
    assert calls["n"] == n_after_second

    cache_only = asyncio.run(gg.run_geo_grid(_req(plan_id="FREE_SCOUT", keyword="border run", cache_only=True), None))
    assert cache_only["status"] == "no_cache"

    admin = asyncio.run(gg.run_geo_grid(
        _req(plan_id="FREE_SCOUT", keyword="border run", user_email="0451611@gmail.com"), None))
    assert admin["status"] == "success" and admin["meta"]["scans_limit"] is None


def test_all_no_data_is_error_and_not_billed():
    _patch(lambda *a, **k: None)
    res = asyncio.run(gg.run_geo_grid(_req(), None))
    assert res["status"] == "error" and res["grid"] == []
    assert gg._count_billed_this_month(None, "loc-1") == 0


def test_missing_coordinates_is_error_not_dubai():
    _patch(lambda *a, **k: [])
    gg.get_public_place_details = lambda q: None
    gg.get_place_location_by_id = lambda pid: None
    res = asyncio.run(gg.run_geo_grid(_req(), None))
    assert res["status"] == "error" and "координаты" in res["message"]


if __name__ == "__main__":
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    for t in tests:
        t()
        print("PASS", t.__name__)
    print(f"{len(tests)} tests passed")
