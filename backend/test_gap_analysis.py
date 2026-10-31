"""Stage 2 tests: deterministic gaps, review velocity from snapshots, end-to-end scan insights.
Run: python test_gap_analysis.py
"""
import asyncio
import sys
from datetime import datetime, timedelta, timezone

import geo_grid_service as gg
from gap_analysis import compute_gaps, compute_review_velocity
from schemas import GeoGridScanRequest, GeoGridScanResponse

OWN_ID = "own-1"


def _p(pid, name, **kw):
    base = {
        "place_id": pid, "name": name, "address": "addr", "rating": 4.5, "reviews_count": 50,
        "primary_category": "Visa Service", "secondary_categories": [], "website_url": "",
        "phone": "", "photos_count": 5, "open_now": None, "has_hours": False, "price_level": "",
        "google_maps_url": f"https://maps/{pid}",
    }
    base.update(kw)
    return base


def test_category_gap_counts_are_real():
    you = _p(OWN_ID, "You", primary_category="Visa Service")
    leaders = [
        _p("a", "A", secondary_categories=["Travel Agency", "Consultant"]),
        _p("b", "B", secondary_categories=["Travel Agency"]),
        _p("c", "C"),
    ]
    gaps = compute_gaps(you, leaders)
    cat = [g for g in gaps if g["kind"] == "category"]
    assert cat[0]["title"] == "Категория «Travel Agency»"
    assert (cat[0]["leaders_with"], cat[0]["leaders_total"]) == (2, 3)
    assert "2 из 3" in cat[0]["detail"]
    assert cat[1]["leaders_with"] == 1                       # Consultant only at one leader
    # a category you already have is never reported
    assert not any("Visa Service" in g["title"] for g in cat)


def test_no_gap_when_you_match_or_beat_leaders():
    you = _p(OWN_ID, "You", rating=4.9, reviews_count=500, photos_count=10, website_url="w", phone="1", has_hours=True)
    leaders = [_p("a", "A", website_url="w", phone="1", has_hours=True),
               _p("b", "B", website_url="w", phone="1", has_hours=True)]
    assert compute_gaps(you, leaders) == []


def test_presence_and_numeric_gaps():
    you = _p(OWN_ID, "You", rating=4.0, reviews_count=10, photos_count=1)
    leaders = [
        _p("a", "A", rating=4.8, reviews_count=100, website_url="w", phone="1", has_hours=True, photos_count=10),
        _p("b", "B", rating=4.6, reviews_count=80, website_url="w", photos_count=8),
        _p("c", "C", rating=4.4, reviews_count=60, photos_count=6),
    ]
    kinds = {g["kind"]: g for g in compute_gaps(you, leaders)}
    assert kinds["website"]["leaders_with"] == 2 and kinds["phone"]["leaders_with"] == 1
    assert kinds["hours"]["leaders_with"] == 1
    assert "4.0" in kinds["rating"]["detail"] and "4.6" in kinds["rating"]["detail"]
    assert "10 отзывов" in kinds["reviews"]["detail"] and "80" in kinds["reviews"]["detail"]
    assert "не более 10" in kinds["photos"]["detail"]


def test_nothing_claimed_without_data():
    assert compute_gaps(None, [_p("a", "A")]) == []          # your card unknown
    assert compute_gaps(_p(OWN_ID, "You"), []) == []          # no leaders
    # leaders have no website => no "website" gap
    gaps = compute_gaps(_p(OWN_ID, "You"), [_p("a", "A"), _p("b", "B")])
    assert not any(g["kind"] in ("website", "phone", "hours") for g in gaps)


def test_velocity_needs_two_snapshots_a_day_apart():
    t0 = datetime(2026, 10, 1, tzinfo=timezone.utc)
    one = compute_review_velocity([(t0, {"a": {"reviews_count": 10}})])
    assert one["a"]["per_week"] is None and one["a"]["snapshots"] == 1
    same_day = compute_review_velocity([
        (t0, {"a": {"reviews_count": 10}}), (t0 + timedelta(hours=3), {"a": {"reviews_count": 12}})])
    assert same_day["a"]["per_week"] is None
    two = compute_review_velocity([
        (t0, {"a": {"reviews_count": 10}}), (t0 + timedelta(days=14), {"a": {"reviews_count": 24}})])
    assert two["a"]["per_week"] == 7.0 and two["a"]["days"] == 14.0
    assert two["a"]["from_reviews"] == 10 and two["a"]["to_reviews"] == 24


def _setup(places_by_call):
    state = {"i": 0}

    def fake(*a, **k):
        return places_by_call()

    gg.search_places_grid_point = fake
    gg.get_public_place_details = lambda q: {"place_id": OWN_ID, "business_name": "Sir Visaranus", "lat": 12.27, "lng": 109.20}
    gg.get_place_location_by_id = lambda pid: {"place_id": pid, "name": "Sir Visaranus", "lat": 12.27, "lng": 109.20}
    gg._MEMORY_HISTORY.clear()
    return state


def _req(**kw):
    base = dict(profile_id="loc-2", keyword="visa run", grid_size=3, distance_meters=500.0,
                business_name="Sir Visaranus", address="60 Hon Chong", plan_id="AGENCY")
    base.update(kw)
    return GeoGridScanRequest(**base)


def test_end_to_end_gaps_own_profile_and_schema():
    leaders = [
        _p("a", "A", secondary_categories=["Travel Agency"], website_url="w", reviews_count=100),
        _p("b", "B", secondary_categories=["Travel Agency"], reviews_count=80),
        _p("c", "C", reviews_count=60),
    ]
    _setup(lambda: leaders)                                   # you are never in the results
    fetched = {"n": 0}

    def fake_profile(pid):
        fetched["n"] += 1
        return _p(pid, "Sir Visaranus", reviews_count=7, rating=0, photos_count=0)

    gg.get_place_profile_by_id = fake_profile
    res = asyncio.run(gg.run_geo_grid(_req(), None))
    assert res["status"] == "success" and fetched["n"] == 1
    assert res["own_profile"]["place_id"] == OWN_ID and res["own_profile"]["reviews_count"] == 7
    node = res["grid"][0]
    assert node["state"] == "NOT_IN_TOP20" and len(node["top3"]) == 3
    assert node["top3"][0]["secondary_categories"] == ["Travel Agency"]
    kinds = {g["kind"] for g in node["gaps"]}
    assert {"category", "website", "reviews", "rating"} <= kinds
    assert any(g["kind"] == "category" for g in res["overall_gaps"])
    parsed = GeoGridScanResponse(**res)                       # response schema keeps the new fields
    assert parsed.own_profile.name == "Sir Visaranus" and parsed.grid[0].gaps
    assert "snapshots" not in res


def test_you_in_results_needs_no_extra_lookup_and_is_excluded_from_leaders():
    me = _p(OWN_ID, "Sir Visaranus", reviews_count=5)
    results = [_p("a", "A", reviews_count=100), me, _p("b", "B", reviews_count=90)]
    _setup(lambda: results)
    gg.get_place_profile_by_id = lambda pid: (_ for _ in ()).throw(AssertionError("must not be called"))
    res = asyncio.run(gg.run_geo_grid(_req(), None))
    node = res["grid"][0]
    assert node["state"] == "FOUND" and node["rank"] == 2
    assert [t["is_you"] for t in node["top3"]] == [False, True, False]
    reviews_gap = [g for g in node["gaps"] if g["kind"] == "reviews"][0]
    assert reviews_gap["leaders_total"] == 2                  # compared against the 2 other leaders only


def test_velocity_accumulates_across_scans():
    _setup(lambda: [_p("a", "A", reviews_count=100), _p(OWN_ID, "Sir Visaranus", reviews_count=5)])
    gg.get_place_profile_by_id = lambda pid: None
    first = asyncio.run(gg.run_geo_grid(_req(keyword="first"), None))
    assert first["velocity"]["a"]["per_week"] is None and first["velocity"]["a"]["snapshots"] == 1
    # age the stored snapshot by 14 days, then scan again with 14 more reviews at leader "a"
    for row in gg._MEMORY_HISTORY:
        row["created_at"] -= timedelta(days=14)
    gg.search_places_grid_point = lambda *a, **k: [_p("a", "A", reviews_count=114), _p(OWN_ID, "Sir Visaranus", reviews_count=5)]
    second = asyncio.run(gg.run_geo_grid(_req(keyword="second"), None))
    assert second["velocity"]["a"]["per_week"] == 7.0 and second["velocity"]["a"]["snapshots"] == 2
    assert second["velocity"][OWN_ID]["per_week"] == 0.0


if __name__ == "__main__":
    failed = 0
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            try:
                fn()
                print("PASS", name)
            except Exception as e:  # noqa: BLE001
                failed += 1
                import traceback
                print("FAIL", name, repr(e))
                traceback.print_exc()
    print(f"{'ALL PASSED' if not failed else str(failed) + ' FAILED'}")
    sys.exit(1 if failed else 0)
