# 📋 Google Business Profile API — Заявка на доступ (Support Case)

Данный документ содержит официальные реквизиты тикета и проекта для отслеживания статуса согласования Google Business Profile API.

---

## 📌 Реквизиты обращения в Google (Подача №3) — ✅ ОДОБРЕНО!

| Параметр | Значение |
| :--- | :--- |
| **Номер обращения (Case ID)** | **`7-8232000041779`** |
| **Дата подачи заявки** | 27 октября 2026 г., 14:56 |
| **Дата одобрения Google** | **29 октября 2026 г., 18:12** |
| **Текущий статус** | **✅ APPROVED (Одобрено Google GBP API Team — квота 300 QPM выделена)** |
| **Выделенная квота** | **300 Queries Per Minute (QPM)** |
| **Google Cloud Project Number** | **`1025915570314`** |
| **Имя проекта в Google Cloud** | `GbPilot` |
| **Google-аккаунт заявителя** | `0451611@gmail.com` |
| **Официальный сайт заведения** | `https://svoi.gbpilot.top/` |
| **Подтвержденный бизнес-профиль** | **Кафе СВОИ (Cafe SVOI)** (ID: `15286059258947661772`) |
| **Физический адрес** | `58 Cao Van Be, Nha Trang 650000, Khanh Hoa, Vietnam` |

---

## 📜 Официальный ответ от Google Business Profile API Team

> **От:** `googlebusinessprofile-support@google.com`  
> **Тема:** `[7-8232000041779] Your Business Profile support inquiry`  
> 
> *«Congratulations! We have reviewed your allowlist request, and your project (1025915570314) has been approved to use the Google Business Profile API.*  
> *Your project has been granted a default quota of 300 Queries Per Minute (QPM), as outlined in our Usage Limits and Quotas documentation.»*

---

## 📜 История всех обращений

### 1. Обращение №1: `8-2301000041527` (15–16 октября 2026 г.)
* **Указанный сайт:** `https://www.gbpilot.top`
* **Причина отказа:** Несовпадение URL сайта в форме и карточке заведения.

### 2. Обращение №2: `5-9695000042388` (19–22 октября 2026 г.)
* **Указанный сайт:** `https://www.instagram.com/svoi_nhatrang...`
* **Причина отказа:** Ссылки на социальные сети не принимаются для API-верификации разработчиков.

### 3. Обращение №3: `7-8232000041779` (27–29 октября 2026 г.) — 🚀 УСПЕХ
* **Указанный сайт:** `https://svoi.gbpilot.top/`
* **Результат:** Развернут отдельный сайт для кафе на поддомене `svoi.gbpilot.top`, синхронизирован с Google Maps карточкой. Заявка рассмотрена за 48 часов и **одобрена с базовой квотой 300 QPM**.

---

## 🚀 Чек-лист финальной активации в Google Cloud Console

Для проекта **`1025915570314` (`GbPilot`)**:

1. Открыть [Google Cloud Console — API Library](https://console.cloud.google.com/apis/library?project=1025915570314) под аккаунтом `0451611@gmail.com`.
2. Найти и нажать **«Enable» (Включить)** для библиотек:
   - **My Business Business Information API** (`mybusinessbusinessinformation.googleapis.com`) — чтение и обновление атрибутов, часов, меню, адресов.
   - **My Business Account Management API** (`mybusinessaccountmanagement.googleapis.com`) — управление локациями и аккаунтами.
   - **Google My Business API Gateway** (`mybusiness.googleapis.com`) — отзывы, ответы на отзывы, посты.
3. **OAuth 2.0 Client Credentials (Активированы):**
   - **Client ID:** `1025915570314-u36••••••••••••••••••••••••.apps.googleusercontent.com`
   - **Client Secret:** `GOCSPX-••••••••••••••••••••••••` (Хранится в `.env.local` и переменных окружения Railway/Vercel)
   - **Authorized Redirect URIs:**
     - `https://gbpilot-saas-production.up.railway.app/api/v1/auth/google/callback`
     - `https://www.gbpilot.top/api/v1/auth/google/callback`
     - `https://gbpilot.top/api/v1/auth/google/callback`
     - `http://localhost:3000/api/v1/auth/google/callback`

