"""Stage 3: action plan for Geo-Grid gaps (journal + before/after).

The app never writes to Google here (owner chose manual edits): every action is an instruction built from
the gap facts, and the owner confirms it was done. Baseline ARP/SoLV is saved when the action is added;
after the action is applied, a later scan of the same query gives the "after" numbers.
"""
from __future__ import annotations

import logging
import types
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional

import models
import geo_grid_service as gg

logger = logging.getLogger("GBPilot.GeoActions")

STATUSES = ("PENDING", "APPLIED", "DISMISSED")
RESCAN_AFTER_DAYS = 7

_MEMORY_ACTIONS: List[Dict[str, Any]] = []
_TABLE_READY = False
GBP_EDITOR_URL = "https://business.google.com/"


def profile_key_for(profile_id: Optional[str], business_name: Optional[str]) -> str:
    return gg._profile_key(types.SimpleNamespace(profile_id=profile_id), (business_name or "").strip())


def _kw(keyword: str) -> str:
    return (keyword or "").strip()[:200]


def _now() -> datetime:
    return datetime.now(timezone.utc)


def build_guidance(kind: str, own_place_id: Optional[str]) -> Dict[str, Any]:
    """Deterministic how-to for a gap kind. Links are real Google URLs; no invented claims."""
    steps_by_kind = {
        "category": ["Откройте профиль на business.google.com → «Изменить профиль» → «Информация о компании».",
                     "В поле «Категория» добавьте недостающую категорию из разрыва (дополнительные категории).",
                     "Сохраните и отметьте действие применённым."],
        "website": ["Откройте профиль на business.google.com → «Изменить профиль» → «Информация о компании».",
                    "Укажите адрес сайта и сохраните."],
        "phone": ["Откройте профиль на business.google.com → «Изменить профиль» → «Информация о компании».",
                  "Укажите основной номер телефона и сохраните."],
        "hours": ["Откройте профиль на business.google.com → «Изменить профиль» → «Часы работы».",
                  "Заполните часы работы и сохраните."],
        "photos": ["Откройте профиль на business.google.com → «Фото».",
                   "Добавьте реальные фото места, услуг и команды."],
        "rating": ["Отвечайте на отзывы и просите довольных клиентов оставить отзыв по ссылке ниже."],
        "reviews": ["Попросите клиентов оставить отзыв по ссылке или QR ниже.",
                    "Просите рассказать, какой услугой они воспользовались; готовые тексты отзывов не пишите (правила Google)."],
    }
    steps = steps_by_kind.get(kind, ["Откройте профиль на business.google.com и внесите правку вручную."])
    links: Dict[str, str] = {"profile_editor": GBP_EDITOR_URL}
    review_link = None
    if kind in ("rating", "reviews") and own_place_id:
        review_link = f"https://search.google.com/local/writereview?placeid={own_place_id}"
        links["review_form"] = review_link
    return {"steps": steps, "links": links, "review_link": review_link, "manual": True}


# ----------------------------- storage -----------------------------
def _ensure_table(db) -> None:
    global _TABLE_READY
    if _TABLE_READY or db is None:
        return
    try:
        models.GeoActionLog.__table__.create(bind=db.get_bind(), checkfirst=True)
        _TABLE_READY = True
    except Exception as e:
        logger.warning(f"[GeoActions] could not ensure geo_action_log table: {e}")


def _row_to_dict(r) -> Dict[str, Any]:
    def aware(dt):
        if dt is None:
            return None
        return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
    return {
        "id": r.id, "profile_key": r.profile_key, "keyword": r.keyword, "gap_id": r.gap_id,
        "kind": r.kind, "title": r.title, "detail": r.detail, "status": r.status,
        "baseline_arp": r.baseline_arp, "baseline_solv": r.baseline_solv,
        "created_at": aware(r.created_at), "updated_at": aware(r.updated_at), "applied_at": aware(r.applied_at),
    }


def _db_ok(db) -> bool:
    return db is not None


def create_action(db, profile_key: str, keyword: str, gap: Dict[str, Any],
                  baseline_arp: Optional[float], baseline_solv: Optional[float]) -> Dict[str, Any]:
    """Idempotent per (profile, query, gap id): returns the existing row if it is already in the plan."""
    keyword = _kw(keyword)
    gap_id = str(gap.get("id") or "")[:200]
    now = _now()
    if _db_ok(db):
        try:
            _ensure_table(db)
            existing = (db.query(models.GeoActionLog)
                        .filter(models.GeoActionLog.profile_key == profile_key,
                                models.GeoActionLog.keyword == keyword,
                                models.GeoActionLog.gap_id == gap_id).first())
            if existing:
                return _row_to_dict(existing)
            row = models.GeoActionLog(
                profile_key=profile_key, keyword=keyword, gap_id=gap_id, kind=str(gap.get("kind") or "")[:40],
                title=str(gap.get("title") or "")[:300], detail=str(gap.get("detail") or ""), status="PENDING",
                baseline_arp=baseline_arp, baseline_solv=baseline_solv, created_at=now, updated_at=now)
            db.add(row)
            db.commit()
            db.refresh(row)
            return _row_to_dict(row)
        except Exception as e:
            logger.warning(f"[GeoActions] create failed, using memory fallback: {e}")
            try:
                db.rollback()
            except Exception:
                pass
    for a in _MEMORY_ACTIONS:
        if a["profile_key"] == profile_key and a["keyword"] == keyword and a["gap_id"] == gap_id:
            return dict(a)
    row = {"id": len(_MEMORY_ACTIONS) + 1, "profile_key": profile_key, "keyword": keyword, "gap_id": gap_id,
           "kind": str(gap.get("kind") or ""), "title": str(gap.get("title") or ""),
           "detail": str(gap.get("detail") or ""), "status": "PENDING",
           "baseline_arp": baseline_arp, "baseline_solv": baseline_solv,
           "created_at": now, "updated_at": now, "applied_at": None}
    _MEMORY_ACTIONS.append(row)
    return dict(row)


def set_status(db, action_id: int, profile_key: str, status: str) -> Optional[Dict[str, Any]]:
    if status not in STATUSES:
        raise ValueError("bad status")
    now = _now()
    if _db_ok(db):
        try:
            _ensure_table(db)
            row = (db.query(models.GeoActionLog)
                   .filter(models.GeoActionLog.id == action_id, models.GeoActionLog.profile_key == profile_key).first())
            if not row:
                return None
            row.status = status
            row.updated_at = now
            row.applied_at = now if status == "APPLIED" else None
            db.commit()
            return _row_to_dict(row)
        except Exception as e:
            logger.warning(f"[GeoActions] status update failed: {e}")
            try:
                db.rollback()
            except Exception:
                pass
    for a in _MEMORY_ACTIONS:
        if a["id"] == action_id and a["profile_key"] == profile_key:
            a["status"] = status
            a["updated_at"] = now
            a["applied_at"] = now if status == "APPLIED" else None
            return dict(a)
    return None


def _load_actions(db, profile_key: str, keyword: Optional[str]) -> List[Dict[str, Any]]:
    if _db_ok(db):
        try:
            _ensure_table(db)
            q = db.query(models.GeoActionLog).filter(models.GeoActionLog.profile_key == profile_key)
            if keyword:
                q = q.filter(models.GeoActionLog.keyword == _kw(keyword))
            return [_row_to_dict(r) for r in q.order_by(models.GeoActionLog.created_at.asc()).all()]
        except Exception as e:
            logger.warning(f"[GeoActions] list failed: {e}")
            try:
                db.rollback()
            except Exception:
                pass
    rows = [dict(a) for a in _MEMORY_ACTIONS
            if a["profile_key"] == profile_key and (not keyword or a["keyword"] == _kw(keyword))]
    return sorted(rows, key=lambda a: a["created_at"])


def _scans_after(db, profile_key: str, keyword: str, after: datetime) -> List[Dict[str, Any]]:
    """Scans of this exact query made after `after`, newest first: [{created_at, arp, solv}]."""
    out: List[Dict[str, Any]] = []
    kw = _kw(keyword).casefold()
    if _db_ok(db):
        try:
            gg._ensure_table(db)
            q = (db.query(models.GeoScanHistory)
                 .filter(models.GeoScanHistory.profile_key == profile_key,
                         models.GeoScanHistory.created_at > after)
                 .order_by(models.GeoScanHistory.created_at.desc()))
            for r in q:
                if (r.keyword or "").strip().casefold() == kw:
                    out.append({"created_at": gg._as_utc(r.created_at), "arp": r.arp, "solv": r.solv})
            return out
        except Exception as e:
            logger.warning(f"[GeoActions] scans lookup failed: {e}")
            try:
                db.rollback()
            except Exception:
                pass
    for r in gg._MEMORY_HISTORY:
        if r["profile_key"] != profile_key or not r["created_at"] > after:
            continue
        meta = (r["payload"] or {}).get("meta") or {}
        if (meta.get("keyword") or "").strip().casefold() != kw:
            continue
        m = (r["payload"] or {}).get("metrics") or {}
        out.append({"created_at": r["created_at"], "arp": m.get("arp"), "solv": m.get("solv")})
    return sorted(out, key=lambda x: x["created_at"], reverse=True)


def list_actions(db, profile_key: str, keyword: Optional[str], own_place_id: Optional[str] = None) -> Dict[str, Any]:
    """Plan with guidance, before/after numbers and a re-scan hint for applied actions."""
    now = _now()
    items: List[Dict[str, Any]] = []
    for a in _load_actions(db, profile_key, keyword):
        item = dict(a)
        item["guidance"] = build_guidance(a["kind"], own_place_id)
        item["after"] = None
        item["rescan_due"] = False
        item["rescan_due_at"] = None
        if a["status"] == "APPLIED" and a["applied_at"]:
            scans = _scans_after(db, profile_key, a["keyword"], a["applied_at"])
            due_at = a["applied_at"] + timedelta(days=RESCAN_AFTER_DAYS)
            item["rescan_due_at"] = due_at
            if scans:
                latest = scans[0]
                item["after"] = {"at": latest["created_at"], "arp": latest["arp"], "solv": latest["solv"]}
            if now >= due_at and not any(s["created_at"] >= due_at for s in scans):
                item["rescan_due"] = True
        items.append(item)
    return {"items": items, "rescan_due": any(i["rescan_due"] for i in items)}
