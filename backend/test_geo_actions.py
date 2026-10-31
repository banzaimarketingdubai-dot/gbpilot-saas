"""Stage 3 tests: action plan journal, guidance, before/after, re-scan hint.
Run: python test_geo_actions.py
"""
import asyncio
import sys
from datetime import timedelta

import geo_actions_service as ga
import geo_grid_service as gg
from schemas import GeoGridScanRequest

GAP = {"id": "category:travel agency", "kind": "category", "title": "Категория «Travel Agency»",
       "detail": "У 2 из 3 лидеров есть категория «Travel Agency», у вас её нет."}
PK = ga.profile_key_for("loc-9", "Sir Visaranus")


def _reset():
    ga._MEMORY_ACTIONS.clear()
    gg._MEMORY_HISTORY.clear()


def test_profile_key_matches_scan_key():
    assert ga.profile_key_for("loc-9", "x") == "loc-9"
    assert ga.profile_key_for("default", "Sir Visaranus").startswith("name:")
    assert ga.profile_key_for(None, "Sir Visaranus") == ga.profile_key_for("default", "Sir Visaranus")


def test_create_is_idempotent_and_keeps_baseline():
    _reset()
    a = ga.create_action(None, PK, "visa run", GAP, 6.4, 22.0)
    b = ga.create_action(None, PK, "visa run", GAP, 9.9, 99.0)         # same gap again: no duplicate, baseline kept
    assert a["id"] == b["id"] and len(ga._MEMORY_ACTIONS) == 1
    assert b["status"] == "PENDING" and b["baseline_arp"] == 6.4 and b["baseline_solv"] == 22.0
    other_kw = ga.create_action(None, PK, "border run", GAP, 5.0, 10.0)  # same gap, another query: separate row
    assert other_kw["id"] != a["id"]


def test_status_transitions_and_scoping():
    _reset()
    a = ga.create_action(None, PK, "visa run", GAP, None, None)
    assert ga.set_status(None, a["id"], "someone-else", "APPLIED") is None   # other profile cannot touch it
    done = ga.set_status(None, a["id"], PK, "APPLIED")
    assert done["status"] == "APPLIED" and done["applied_at"] is not None
    back = ga.set_status(None, a["id"], PK, "PENDING")
    assert back["status"] == "PENDING" and back["applied_at"] is None
    try:
        ga.set_status(None, a["id"], PK, "DONE")
        assert False, "invalid status must raise"
    except ValueError:
        pass


def test_guidance_is_manual_and_has_real_links():
    cat = ga.build_guidance("category", "own-1")
    assert cat["manual"] is True and cat["review_link"] is None
    assert cat["links"]["profile_editor"].startswith("https://business.google.com")
    rev = ga.build_guidance("reviews", "own-1")
    assert rev["review_link"] == "https://search.google.com/local/writereview?placeid=own-1"
    assert ga.build_guidance("reviews", None)["review_link"] is None    # no place_id => no invented link
    assert ga.build_guidance("unknown-kind", None)["steps"]


def _scan(keyword, **kw):
    gg.search_places_grid_point = lambda *a, **k: [
        {"place_id": "a", "name": "A", "rating": 4.8, "reviews_count": 100, "primary_category": "Visa Service",
         "secondary_categories": [], "google_maps_url": "u", "address": "x"},
        {"place_id": "own-1", "name": "Sir Visaranus", "rating": 4.0, "reviews_count": 5,
         "primary_category": "Visa Service", "secondary_categories": [], "google_maps_url": "u2", "address": "y"}]
    gg.get_public_place_details = lambda q: {"place_id": "own-1", "business_name": "Sir Visaranus", "lat": 12.27, "lng": 109.2}
    gg.get_place_location_by_id = lambda pid: {"place_id": pid, "name": "Sir Visaranus", "lat": 12.27, "lng": 109.2}
    gg.get_place_profile_by_id = lambda pid: None
    req = GeoGridScanRequest(profile_id="loc-9", keyword=keyword, grid_size=3, distance_meters=500.0,
                             business_name="Sir Visaranus", address="x", plan_id="AGENCY", **kw)
    return asyncio.run(gg.run_geo_grid(req, None))


def test_before_after_and_rescan_hint():
    _reset()
    first = _scan("visa run")
    base = first["metrics"]
    for r in gg._MEMORY_HISTORY:                                  # the baseline scan was made 2 days ago (cache expired)
        r["created_at"] -= timedelta(days=2)
    a = ga.create_action(None, PK, "visa run", GAP, base["arp"], base["solv"])
    ga.set_status(None, a["id"], PK, "APPLIED")

    plan = ga.list_actions(None, PK, "visa run", "own-1")
    it = plan["items"][0]
    assert it["status"] == "APPLIED" and it["after"] is None and it["rescan_due"] is False
    assert it["guidance"]["manual"] is True

    # a re-scan after applying => "after" numbers are shown, but no re-scan reminder yet
    second = _scan("Visa Run ")                                   # same query (case/whitespace differ), fresh scan
    assert second["meta"]["cached"] is False
    plan = ga.list_actions(None, PK, "visa run", "own-1")
    it = plan["items"][0]
    assert it["after"] is not None and it["after"]["arp"] == second["metrics"]["arp"]

    # 8 days pass with no new scan => re-scan reminder
    _reset_scans_only = [r for r in gg._MEMORY_HISTORY]
    for r in _reset_scans_only:
        r["created_at"] -= timedelta(days=8)
    for row in ga._MEMORY_ACTIONS:
        row["applied_at"] -= timedelta(days=8) + timedelta(hours=1)
    plan = ga.list_actions(None, PK, "visa run", "own-1")
    assert plan["items"][0]["rescan_due"] is True and plan["rescan_due"] is True


def test_pending_never_asks_for_rescan_or_shows_after():
    _reset()
    _scan("visa run")
    ga.create_action(None, PK, "visa run", GAP, 1.0, 1.0)
    it = ga.list_actions(None, PK, "visa run", None)["items"][0]
    assert it["status"] == "PENDING" and it["after"] is None and it["rescan_due"] is False


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
    print("ALL PASSED" if not failed else f"{failed} FAILED")
    sys.exit(1 if failed else 0)
