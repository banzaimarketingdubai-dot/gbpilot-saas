"""Deterministic gap analysis: "you vs. the Top-3 leaders" built ONLY from real Places API fields.

No invented claims: every gap is derived from numbers/flags returned by Google and carries the
counts it was computed from. If a field is missing on Google's side, nothing is claimed about it.
"""
from __future__ import annotations

from datetime import datetime
from statistics import median
from typing import Any, Dict, List, Optional, Tuple

MAX_CATEGORY_GAPS = 6
PHOTOS_API_CAP = 10          # Places API returns at most 10 photo references per place


def _cat_list(p: Dict[str, Any]) -> List[str]:
    out: List[str] = []
    seen = set()
    for c in [p.get("primary_category")] + list(p.get("secondary_categories") or []):
        c = (c or "").strip()
        if c and c.casefold() not in seen:
            seen.add(c.casefold())
            out.append(c)
    return out


def _gap(gap_id: str, kind: str, title: str, detail: str, with_n: int, total: int) -> Dict[str, Any]:
    return {"id": gap_id, "kind": kind, "title": title, "detail": detail,
            "leaders_with": with_n, "leaders_total": total}


def compute_gaps(you: Optional[Dict[str, Any]], leaders: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Gaps between your card and the given leaders. Empty list when there is nothing to compare."""
    leaders = [l for l in (leaders or []) if l]
    n = len(leaders)
    if not you or n == 0:
        return []

    gaps: List[Dict[str, Any]] = []

    # --- categories (primary + additional types as returned by the API) ---
    your_cats = {c.casefold() for c in _cat_list(you)}
    counts: Dict[str, Tuple[str, int]] = {}
    for l in leaders:
        for c in _cat_list(l):
            key = c.casefold()
            if key in your_cats:
                continue
            label, k = counts.get(key, (c, 0))
            counts[key] = (label, k + 1)
    for key, (label, k) in sorted(counts.items(), key=lambda kv: (-kv[1][1], kv[1][0].casefold()))[:MAX_CATEGORY_GAPS]:
        gaps.append(_gap(
            f"category:{key}", "category", f"Категория «{label}»",
            f"У {k} из {n} лидеров есть категория «{label}», у вас её нет.", k, n))

    # --- presence flags ---
    for field, kind, title, missing_text in (
        ("website_url", "website", "Сайт", "сайт"),
        ("phone", "phone", "Телефон", "телефон"),
    ):
        k = sum(1 for l in leaders if (l.get(field) or "").strip())
        if k > 0 and not (you.get(field) or "").strip():
            gaps.append(_gap(kind, kind, title,
                             f"У {k} из {n} лидеров указан {missing_text}, у вас нет.", k, n))

    k_hours = sum(1 for l in leaders if l.get("has_hours"))
    if k_hours > 0 and not you.get("has_hours"):
        gaps.append(_gap("hours", "hours", "Часы работы",
                         f"У {k_hours} из {n} лидеров указаны часы работы, у вас нет.", k_hours, n))

    # --- numeric comparisons (only against leaders that actually have the value) ---
    l_ratings = [float(l["rating"]) for l in leaders if float(l.get("rating") or 0) > 0]
    your_rating = float(you.get("rating") or 0)
    if l_ratings:
        avg = sum(l_ratings) / len(l_ratings)
        if your_rating <= 0:
            gaps.append(_gap("rating", "rating", "Рейтинг",
                             f"У вас нет рейтинга, у лидеров в среднем {avg:.1f}.", len(l_ratings), n))
        elif your_rating < avg - 0.05:
            gaps.append(_gap("rating", "rating", "Рейтинг",
                             f"Ваш рейтинг {your_rating:.1f}, у лидеров в среднем {avg:.1f}.", len(l_ratings), n))

    l_reviews = [int(l.get("reviews_count") or 0) for l in leaders]
    your_reviews = int(you.get("reviews_count") or 0)
    med = median(l_reviews)
    if your_reviews < med:
        gaps.append(_gap("reviews", "reviews", "Количество отзывов",
                         f"У вас {your_reviews} отзывов, медиана у лидеров {int(med)}.",
                         sum(1 for r in l_reviews if r > your_reviews), n))

    l_photos = [int(l.get("photos_count") or 0) for l in leaders]
    your_photos = int(you.get("photos_count") or 0)
    med_photos = median(l_photos)
    if your_photos < med_photos:
        gaps.append(_gap("photos", "photos", "Фото",
                         f"В ответе API: у вас {your_photos}, медиана у лидеров {int(med_photos)} "
                         f"(API отдаёт не более {PHOTOS_API_CAP} фото на место).",
                         sum(1 for p in l_photos if p > your_photos), n))
    return gaps


def compute_review_velocity(snapshots: List[Tuple[datetime, Dict[str, Dict[str, Any]]]]) -> Dict[str, Dict[str, Any]]:
    """Reviews gained per week by place_id, from stored scan snapshots.

    `snapshots` = [(scan_time, {place_id: {"rating": float, "reviews_count": int}})]. A place needs at
    least two snapshots at least one day apart; otherwise `per_week` is None (shown as a dash).
    """
    series: Dict[str, List[Tuple[datetime, int]]] = {}
    for ts, snap in sorted(snapshots, key=lambda x: x[0]):
        for pid, v in (snap or {}).items():
            if not pid or v is None:
                continue
            series.setdefault(pid, []).append((ts, int(v.get("reviews_count") or 0)))

    out: Dict[str, Dict[str, Any]] = {}
    for pid, pts in series.items():
        first, last = pts[0], pts[-1]
        days = (last[0] - first[0]).total_seconds() / 86400.0
        per_week = None
        if len(pts) >= 2 and days >= 1.0:
            per_week = round((last[1] - first[1]) / days * 7.0, 1)
        out[pid] = {"per_week": per_week, "days": round(days, 1), "snapshots": len(pts),
                    "from_reviews": first[1], "to_reviews": last[1]}
    return out
