# 📖 GBPilot Bible: Source of Truth (SoT)

> База знаний, архитектура, стандарты разработки, продуктовая стратегия и политика монетизации SaaS-платформы **GBPilot** — автономного ИИ-копилота локального SEO и оптимизации Google Business Profile (GBP) & Generative Engine Optimization (GEO).

---

## 🗂 Структура Документации

| Документ | Назначение и Ключевое Содержание |
| :--- | :--- |
| [**01. PRD (Product Requirements Document)**](file:///c:/Sher_AI_Studio/projects/GBPilot/Bible_SoT/01_PRD.md) | Продуктовые требования, Операционная Триада (Разведка, Ассистент, Гард), User Personas, функциональный скоуп, метрики успеха. |
| [**02. Системная Архитектура**](file:///c:/Sher_AI_Studio/projects/GBPilot/Bible_SoT/02_ARCHITECTURE.md) | Микросервисный стек: FastAPI + Next.js 14 App Router, Celery/Redis, PostGIS, Railway, Supabase, Google Places API & Gemini 3.8 Flash. |
| [**03. Схема Базы Данных**](file:///c:/Sher_AI_Studio/projects/GBPilot/Bible_SoT/03_DATABASE_SCHEMA.md) | Реляционная модель PostgreSQL + PostGIS: таблицы `users`, `organizations`, `gbp_profiles`, `geo_grid_scans`, `rank_snapshots`, `proactive_recommendations`, `reviews`. |
| [**04. Спецификация REST API**](file:///c:/Sher_AI_Studio/projects/GBPilot/Bible_SoT/04_API_SPECIFICATION.md) | Полный контракт эндпоинтов: Google OAuth, асинхронный скрапинг, 1-Click мутации, Geo-Grid сканирование, диагностика `/api/v1/system/diagnostics`. |
| [**05. UI/UX Спецификация**](file:///c:/Sher_AI_Studio/projects/GBPilot/Bible_SoT/05_UI_UX_SPEC.md) | Дизайн-система Google Material 3, Кокпит Триады (`/dashboard`), тепловая карта Geo-Grid, лента 1-Click Action Cards. |
| [**06. Политика Монетизации и Тарифы**](file:///c:/Sher_AI_Studio/projects/GBPilot/Bible_SoT/06_MONETIZATION_AND_PRICING_POLICY.md) | Тарифная сетка по глубине автоматизации Триады (Starter $29, Pro $69, Agency $199), транзакционные Add-ons (NFC/QR стойки, цитирования), Unit-экономика (>93% маржа). |
| [**07. Анализ Конкурентов и Киллер-Фичи**](file:///c:/Sher_AI_Studio/projects/GBPilot/Bible_SoT/07_COMPETITIVE_INTELLIGENCE_AND_KILLER_FEATURES.md) | Разбор уязвимостей BrightLocal, LocalFalcon, Localo, Birdeye, Podium. 6 нечестных преимуществ GBPilot (1-Click Engine, Profile Guard, FTC Speedometer, GEO/LLM SOV). |
| [**08. Фреймворк JTBD и Сценарии**](file:///c:/Sher_AI_Studio/projects/GBPilot/Bible_SoT/08_JTBD_AND_CUSTOMER_SCENARIOS.md) | Jobs To Be Done (Bob Moesta 4 Forces of Progress), целевые персоны, Job Stories по Триаде, микромоменты (холодная конверсия, отражение диверсий, LSI-ответы). |
| [**09. Рынок Дубая и Локализация (ОАЭ)**](file:///c:/Sher_AI_Studio/projects/GBPilot/Bible_SoT/09_DUBAI_UAE_MARKET_LOCALIZATION_AND_GTM.md) | 6 адаптаций под Дубай (Башни/Кластеры, Makani, WhatsApp-first, снос отзывов по Закону о киберпреступности ОАЭ № 34/2021, пресет «Рамадан», Apple Maps/2GIS, тарифы в AED). |

---

## 🏛️ Архитектура Триады GBPilot

Продукт разделен на 3 глобальных взаимосвязанных модуля:
1. 🧭 **«Разведка» (Scout Radar — Глаза):** Geo-Grid тепловые карты рангов, радар шагов конкурентов, мониторинг видимости в ИИ (Google AI Overviews, Gemini, ChatGPT).
2. 🤖 **«Ассистент» (Action Copilot — Руки):** Ежедневная выработка до 5 точечных действий, автопостинг, 15-минутные ответы на отзывы с LSI-ключами района, оптимизация часов "Open Now".
3. 🛡️ **«Гард» (Defense Shield — Щит):** Контрразведка, мониторинг целостности данных Google Maps, 5-минутный автоматический откат вредоносных правок конкурентов (Diff Auto-Revert).

---

## 🎯 5 Фундаментальных Принципов GBPilot

1. **Автономность вместо аналитики:** Пользователь не должен сидеть в графиках. Система сама диагностирует проблему, формулирует решение и выполняет его по нажатию 1 кнопки или на полном автопилоте.
2. **Нулевой Time-to-Value (TTV):** От ввода названия заведения до интерактивного аудита здоровья профиля с тепловой картой 3x3 проходит менее 15 секунд.
3. **Бескомпромиссная защита (Profile Guard):** Любая вредоносная краудсорсинговая правка в Google Maps (смена номера телефона, графика или категории конкурентами) откатывается автоматически за 5 минут.
4. **Соблюдение комплаенса и анти-бан (FTC & Google):** Защита бизнеса от штрафов FTC за гейтинг отзывов и естественное распределение скорости сбора отзывов (Review Velocity Pacing).
5. **Высокая маржинальность (Unit Economics >90%):** Использование быстрых и дешевых моделей последнего поколения (Google Gemini 3.8 Flash) и эффективного скрапинга обеспечивает себестоимость обслуживания локации менее $1/месяц.
