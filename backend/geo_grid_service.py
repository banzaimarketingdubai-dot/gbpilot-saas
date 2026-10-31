"""
Geo-Grid scan service (Stage 0 foundation).

Responsibilities
- Build the scan grid (correct west->east / north->south orientation).
- Identify the user's OWN business by Google place_id (name match only as a last resort).
- Query Places API per point and keep the real Top-3 for every point.
- Distinguish rank states: FOUND / NOT_IN_TOP20 / NO_DATA (never invent a rank).
- Compute ARP / ATRP / SoLV.
- Cache (24h) + history + monthly quota per plan, persisted in `geo_scan_history`.

No synthetic ranks and no fallback coordinates are produced anywhere in this module.
"""
import asyncio
import logging
import math
import os
import re
import urllib.parse
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple

import models
from schemas import GeoGridScanRequest
from google_service import (
    search_places_grid_point,
    get_public_place_details,
    get_place_location_by_id,
)

logger = logging.getLogger("GBPilot.GeoGrid")

# Monthly number of billed (fresh) scans per location. Cache hits are free.
# FREE_SCOUT value is an assumption (not specified by the owner) - change here if needed.
PLAN_SCAN_LIMITS: Dict[str, int] = {
    "FREE_SCOUT": 2,
    "SLEEP_GUARD": 2,
    "STARTER": 2,
    "PRO_GROWTH": 5,
    "AGENCY": 15,
}
DEFAULT_PLAN = "FREE_SCOUT"
CACHE_TTL = timedelta(hours=24)
ALLOWED_STEPS = (250, 500, 1000)
ALLOWED_DIMENSIONS = (3, 5, 7)
ALLOWED_MODES = ("bias", "strict")
NOT_IN_TOP20_RANK = 21
MAX_PARALLEL_POINTS = 10

ACCURACY_NOTE = (
    "Оценка по Google Places API (Text Search с локацией точки). "
    "Это приближение выдачи Google Maps, а не сама выдача."
)

_SUPERADMINS = {
    e.strip().lower()
    for e in os.environ.get("SUPERADMIN_EMAILS", "0451611@gmail.com").split(",")
    if e.strip()
}

# In-process fallback when the database is unavailable (single instance only).
_MEMORY_HISTORY: List[Dict[str, Any]] = []
_TABLE_READY = False


# ----------------------------------------------------------------------------
# helpers
# ----------------------------------------------------------------------------
def _norm(text: Optional[str]) -> str:
    return re.sub(r"[\W_]+", "", (text or "").casefold())


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _as_utc(dt: datetime) -> datetime:
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def is_superadmin(email: Optional[str]) -> bool:
    return bool(email) and email.strip().lower() in _SUPERADMINS


def normalize_params(request: GeoGridScanRequest) -> Tuple[int, int, str]:
    dim = request.grid_size if request.grid_size in ALLOWED_DIMENSIONS else 3
    if request.grid_size == 9:
        dim = 3
    step = int(round(request.distance_meters or 500))
    step = min(ALLOWED_STEPS, key=lambda s: abs(s - step))
    mode = request.mode if request.mode in ALLOWED_MODES else "bias"
    return dim, step, mode


def build_grid(center_lat: float, center_lng: float, dim: int, step_m: float) -> List[Dict[str, float]]:
    """Row-major grid, north -> south, west -> east (pos 1 = north-west corner)."""
    lat_per_m = 1.0 / 111111.0
    lng_per_m = 1.0 / (111111.0 * max(0.1, math.cos(math.radians(center_lat))))
    half = dim // 2
    offsets = [i * step_m for i in range(-half, half + 1)]  # ascending: west/south -> east/north
    nodes: List[Dict[str, float]] = []
    pos = 1
    for dy in sorted(offsets, reverse=True):          # north first
        for dx in offsets:                            # west first
            nodes.append({
                "pos": pos,
                "lat": center_lat + dy * lat_per_m,
                "lng": center_lng + dx * lng_per_m,
            })
            pos += 1
    return nodes


def compute_metrics(grid: List[Dict[str, Any]]) -> Dict[str, Any]:
    with_data = [n for n in grid if n["state"] != "NO_DATA"]
    found = [n for n in with_data if n["state"] == "FOUND"]
    top3 = [n for n in found if n["rank"] is not None and n["rank"] <= 3]
    if with_data:
        arp = sum((n["rank"] if n["state"] == "FOUND" else NOT_IN_TOP20_RANK) for n in with_data) / len(with_data)
        solv = len(top3) / len(with_data) * 100.0
    else:
        arp, solv = None, None
    atrp = (sum(n["rank"] for n in found) / len(found)) if found else None
    return {
        "arp": round(arp, 2) if arp is not None else None,
        "atrp": round(atrp, 2) if atrp is not None else None,
        "solv": round(solv, 1) if solv is not None else None,
        "nodes_total": len(grid),
        "nodes_with_data": len(with_data),
        "nodes_found": len(found),
        "nodes_top3": len(top3),
    }


# ----------------------------------------------------------------------------
# persistence (cache / history / quota)
# ----------------------------------------------------------------------------
def _ensure_table(db) -> None:
    global _TABLE_READY
    if _TABLE_READY or db is None:
        return
    try:
        models.GeoScanHistory.__table__.create(bind=db.get_bind(), checkfirst=True)
        _TABLE_READY = True
    except Exception as e:
        logger.warning(f"[GeoGrid] Could not ensure geo_scan_history table: {e}")


def _find_latest(db, profile_key: str, cache_key: str) -> Optional[Dict[str, Any]]:
    if db is not None:
        try:
            _ensure_table(db)
            row = (
                db.query(models.GeoScanHistory)
                .filter(models.GeoScanHistory.profile_key == profile_key,
                        models.GeoScanHistory.cache_key == cache_key)
                .order_by(models.GeoScanHistory.created_at.desc())
                .first()
            )
            if row:
                return {"payload": row.payload, "created_at": _as_utc(row.created_at)}
            return None
        except Exception as e:
            logger.warning(f"[GeoGrid] history lookup failed: {e}")
            try:
                db.rollback()
            except Exception:
                pass
    rows = [r for r in _MEMORY_HISTORY if r["profile_key"] == profile_key and r["cache_key"] == cache_key]
    if rows:
        r = max(rows, key=lambda x: x["created_at"])
        return {"payload": r["payload"], "created_at": r["created_at"]}
    return None


def _count_billed_this_month(db, profile_key: str) -> int:
    now = _utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    if db is not None:
        try:
            _ensure_table(db)
            return (
                db.query(models.GeoScanHistory)
                .filter(models.GeoScanHistory.profile_key == profile_key,
                        models.GeoScanHistory.billed.is_(True),
                        models.GeoScanHistory.created_at >= month_start)
                .count()
            )
        except Exception as e:
            logger.warning(f"[GeoGrid] quota count failed: {e}")
            try:
                db.rollback()
            except Exception:
                pass
    return sum(
        1 for r in _MEMORY_HISTORY
        if r["profile_key"] == profile_key and r["billed"] and r["created_at"] >= month_start
    )


def _save_scan(db, profile_key: str, cache_key: str, request: GeoGridScanRequest,
               dim: int, step: int, mode: str, payload: Dict[str, Any]) -> None:
    m = payload.get("metrics", {})
    now = _utcnow()
    if db is not None:
        try:
            _ensure_table(db)
            db.add(models.GeoScanHistory(
                profile_key=profile_key, cache_key=cache_key, keyword=request.keyword.strip()[:200],
                grid_size=dim, step_m=step, mode=mode, billed=True,
                arp=m.get("arp"), atrp=m.get("atrp"), solv=m.get("solv"),
                payload=payload, created_at=now,
            ))
            db.commit()
            return
        except Exception as e:
            logger.warning(f"[GeoGrid] history save failed, using memory fallback: {e}")
            try:
                db.rollback()
            except Exception:
                pass
    _MEMORY_HISTORY.append({
        "profile_key": profile_key, "cache_key": cache_key, "billed": True,
        "created_at": now, "payload": payload,
    })


# ----------------------------------------------------------------------------
# own business resolution
# ----------------------------------------------------------------------------
async def _resolve_own_business(request: GeoGridScanRequest, fallback_name: str) -> Dict[str, Any]:
    """Returns {place_id, name, lat, lng, resolved_by}. Never invents coordinates."""
    place_id = (request.place_id or "").strip() or None
    lat, lng = request.lat, request.lng
    name = fallback_name
    resolved_by = "request" if place_id else "none"

    if place_id and (lat is None or lng is None):
        details = await asyncio.to_thread(get_place_location_by_id, place_id)
        if details:
            lat, lng = details.get("lat"), details.get("lng")
            name = details.get("name") or name

    if not place_id or lat is None or lng is None:
        query = " ".join(x for x in [fallback_name, request.address] if x).strip()
        if query:
            pd = await asyncio.to_thread(get_public_place_details, query)
            if pd:
                if not place_id and pd.get("place_id"):
                    place_id = pd.get("place_id")
                    resolved_by = "search"
                if (lat is None or lng is None) and pd.get("lat") is not None and pd.get("lng") is not None:
                    lat, lng = pd["lat"], pd["lng"]
                name = pd.get("business_name") or name

    return {"place_id": place_id, "name": name, "lat": lat, "lng": lng, "resolved_by": resolved_by}


def _profile_key(request: GeoGridScanRequest, fallback_name: str) -> str:
    pid = (request.profile_id or "").strip()
    if pid and pid.lower() != "default":
        return pid
    return f"name:{_norm(fallback_name) or 'unknown'}"


def _cache_key(keyword: str, dim: int, step: int, mode: str) -> str:
    return f"{_norm(keyword)}|{dim}|{step}|{mode}"


# ----------------------------------------------------------------------------
# quota meta
# ----------------------------------------------------------------------------
def _quota(db, profile_key: str, request: GeoGridScanRequest) -> Dict[str, Any]:
    plan = (request.plan_id or DEFAULT_PLAN).strip().upper()
    if plan not in PLAN_SCAN_LIMITS:
        plan = DEFAULT_PLAN
    used = _count_billed_this_month(db, profile_key)
    if is_superadmin(request.user_email):
        return {"plan_id": plan, "scans_used": used, "scans_limit": None, "scans_remaining": None}
    limit = PLAN_SCAN_LIMITS[plan]
    return {"plan_id": plan, "scans_used": used, "scans_limit": limit,
            "scans_remaining": max(0, limit - used)}


def _empty_response(status: str, message: str, meta: Dict[str, Any]) -> Dict[str, Any]:
    return {"status": status, "grid": [], "competitors": [],
            "metrics": compute_metrics([]), "meta": meta, "message": message}


# ----------------------------------------------------------------------------
# main entry
# ----------------------------------------------------------------------------
async def run_geo_grid(request: GeoGridScanRequest, db, db_profile_name: Optional[str] = None) -> Dict[str, Any]:
    keyword = (request.keyword or "").strip()
    fallback_name = (request.business_name or db_profile_name or "").strip()
    dim, step, mode = normalize_params(request)
    profile_key = _profile_key(request, fallback_name)
    cache_key = _cache_key(keyword, dim, step, mode)

    base_meta: Dict[str, Any] = {
        "keyword": keyword, "grid_size": dim, "step_m": step, "mode": mode,
        "accuracy_note": ACCURACY_NOTE, **_quota(db, profile_key, request),
    }

    if not keyword:
        return _empty_response("error", "Не указан ключевой запрос.", base_meta)

    latest = _find_latest(db, profile_key, cache_key)
    fresh = bool(latest and (_utcnow() - latest["created_at"]) < CACHE_TTL)

    def from_cache(status: str, message: str, stale: bool) -> Dict[str, Any]:
        payload = dict(latest["payload"])
        meta = dict(payload.get("meta") or {})
        meta.update(base_meta)
        meta.update({"cached": True, "stale": stale, "cached_at": latest["created_at"].isoformat()})
        payload.update({"status": status, "meta": meta, "message": message})
        return payload

    if request.cache_only:
        if latest:
            return from_cache("success", "Показан последний сохранённый скан.", not fresh)
        return _empty_response("no_cache", "Для этого запроса ещё нет сохранённого скана.", base_meta)

    allow_force = request.force_refresh and is_superadmin(request.user_email)
    if fresh and not allow_force:
        return from_cache(
            "success",
            "Скан не списан: за последние 24 часа по этому запросу и параметрам уже есть актуальный результат.",
            False,
        )

    if base_meta["scans_limit"] is not None and base_meta["scans_remaining"] <= 0:
        msg = (f"Лимит сканов на этот месяц исчерпан ({base_meta['scans_used']} из {base_meta['scans_limit']}). "
               "Счётчик обновится в начале следующего месяца или после смены тарифа.")
        if latest:
            return from_cache("limit_reached", msg, True)
        return _empty_response("limit_reached", msg, base_meta)

    # ---- resolve own business + center coordinates (no fallback coordinates) ----
    own = await _resolve_own_business(request, fallback_name)
    if own["lat"] is None or own["lng"] is None:
        return _empty_response(
            "error",
            "Не удалось определить координаты бизнеса. Укажите адрес или подключите профиль Google.",
            base_meta,
        )
    own_pid = own["place_id"]
    own_name_norm = _norm(own["name"] or fallback_name)
    base_meta.update({
        "own_place_id": own_pid, "own_name": own["name"], "own_resolved_by": own["resolved_by"],
        "center_lat": own["lat"], "center_lng": own["lng"],
    })

    def is_own(place: Dict[str, Any]) -> bool:
        if own_pid:
            return place.get("place_id") == own_pid
        pn = _norm(place.get("name"))
        return bool(own_name_norm and pn and (own_name_norm in pn or pn in own_name_norm))

    # ---- scan ----
    grid_nodes = build_grid(own["lat"], own["lng"], dim, step)
    sem = asyncio.Semaphore(MAX_PARALLEL_POINTS)

    async def scan_point(node: Dict[str, float]):
        async with sem:
            places = await asyncio.to_thread(
                search_places_grid_point, keyword, node["lat"], node["lng"], step, mode, step, 20
            )
        return node, places

    raw = await asyncio.gather(*[scan_point(n) for n in grid_nodes])

    grid: List[Dict[str, Any]] = []
    comp_map: Dict[str, Dict[str, Any]] = {}

    for node, places in raw:
        entry: Dict[str, Any] = {
            "pos": node["pos"], "lat": round(node["lat"], 6), "lng": round(node["lng"], 6),
            "rank": None, "state": "NO_DATA", "competitor": None, "competitor_url": None,
            "competitor_rating": None, "competitor_reviews": None, "top3": [],
        }
        if places is not None:
            rank = None
            for idx, p in enumerate(places):
                if is_own(p):
                    rank = idx + 1
                    break
            entry["rank"] = rank
            entry["state"] = "FOUND" if rank else "NOT_IN_TOP20"
            for idx, p in enumerate(places[:3]):
                entry["top3"].append({
                    "rank": idx + 1, "place_id": p.get("place_id") or "", "name": p.get("name") or "",
                    "rating": float(p.get("rating") or 0), "reviews_count": int(p.get("reviews_count") or 0),
                    "primary_category": p.get("primary_category") or "",
                    "google_maps_url": p.get("google_maps_url") or "", "is_you": is_own(p),
                })
            if places:
                lead = places[0]
                entry["competitor"] = "You" if is_own(lead) else (lead.get("name") or None)
                entry["competitor_url"] = lead.get("google_maps_url") or None
                entry["competitor_rating"] = float(lead.get("rating") or 0) or None
                entry["competitor_reviews"] = int(lead.get("reviews_count") or 0) or None

            for idx, p in enumerate(places):
                if is_own(p) or not (p.get("name") or "").strip():
                    continue
                key = p.get("place_id") or _norm(p.get("name"))
                c = comp_map.setdefault(key, {
                    "place_id": p.get("place_id") or "", "name": p.get("name"),
                    "address": p.get("address") or "", "google_maps_url": p.get("google_maps_url") or "",
                    "website_url": p.get("website_url") or "", "phone": p.get("phone") or "",
                    "rating": float(p.get("rating") or 0), "reviews_count": int(p.get("reviews_count") or 0),
                    "primary_category": p.get("primary_category") or "",
                    "secondary_categories": p.get("secondary_categories") or [],
                    "open_now": p.get("open_now"), "photos_count": int(p.get("photos_count") or 0),
                    "price_level": p.get("price_level") or "", "ranks": [], "wins": 0,
                })
                c["ranks"].append(idx + 1)
                if idx < 3:
                    c["wins"] += 1
        grid.append(entry)

    metrics = compute_metrics(grid)
    if metrics["nodes_with_data"] == 0:
        return _empty_response(
            "error",
            "Google Places API не вернул данные ни для одной точки (проверьте ключ API и лимиты). Скан не списан.",
            base_meta,
        )

    ranked = sorted(
        (c for c in comp_map.values() if c["wins"] > 0),
        key=lambda c: (-c["wins"], sum(c["ranks"]) / len(c["ranks"]), -c["reviews_count"]),
    )[:5]
    competitors = [{
        "place_id": c["place_id"], "name": c["name"], "address": c["address"],
        "google_maps_url": c["google_maps_url"], "website_url": c["website_url"], "phone": c["phone"],
        "rating": c["rating"], "reviews_count": c["reviews_count"],
        "primary_category": c["primary_category"], "secondary_categories": c["secondary_categories"],
        "open_now": c["open_now"], "photos_count": c["photos_count"], "price_level": c["price_level"],
        "grid_wins": c["wins"], "avg_rank": round(sum(c["ranks"]) / len(c["ranks"]), 1),
        "appearances": len(c["ranks"]),
    } for c in ranked]

    failed = metrics["nodes_total"] - metrics["nodes_with_data"]
    message = f"Скан выполнен: {metrics['nodes_with_data']} из {metrics['nodes_total']} точек."
    if failed:
        message += f" Для {failed} точек Google не ответил (показаны как «нет данных»)."

    payload = {"status": "success", "grid": grid, "competitors": competitors,
               "metrics": metrics, "meta": dict(base_meta), "message": message}
    _save_scan(db, profile_key, cache_key, request, dim, step, mode, payload)

    # refresh quota numbers after billing this scan
    payload["meta"].update(_quota(db, profile_key, request))
    payload["meta"].update({"cached": False, "stale": False, "cached_at": _utcnow().isoformat()})
    return payload
