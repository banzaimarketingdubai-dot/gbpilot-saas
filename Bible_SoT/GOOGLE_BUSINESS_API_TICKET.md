# 📋 Google Business Profile API — Заявка на доступ (Support Case)

Данный документ содержит официальные реквизиты тикета и проекта для отслеживания статуса согласования Google Business Profile API.

---

## 📌 Реквизиты активного обращения в Google (Подача №3)

| Параметр | Значение |
| :--- | :--- |
| **Актуальный номер обращения (Case ID)** | **`7-8232000041779`** |
| **Дата подачи заявки** | **27 октября 2026 г., 14:56** |
| **Текущий статус** | **Opened a support case (На рассмотрении — ожидаем ответ 3–7 ноября 2026 г.)** |
| **Google-аккаунт заявителя** | `0451611@gmail.com` (Primary Owner профиля) |
| **Google Cloud Project Number** | **`1025915570314`** |
| **Имя проекта в Google Cloud** | `GbPilot` |
| **Указанный сайт (сайт заведения)** | **`https://svoi.gbpilot.top/`** |
| **Подтвержденный бизнес-профиль** | **Кафе СВОИ (Cafe SVOI)** (ID: `15286059258947661772`) |
| **Физический адрес** | `58 Cao Van Be, Nha Trang 650000, Khanh Hoa, Vietnam` |

---

## 📜 История всех обращений и причины отказов

### 1. Обращение №1: `8-2301000041527` (15–16 октября 2026 г.)
* **Указанный сайт:** `https://www.gbpilot.top`
* **Причина отказа (16.10.2026):**
  > *«The website URL listed on your application form (https://www.gbpilot.top) does not exactly match the website URL displayed on your Google Business Profile.»*
  *(В карточке кафе в Google Картах на тот момент стояла ссылка на Instagram).*

### 2. Обращение №2: `5-9695000042388` (19–22 октября 2026 г.)
* **Указанный сайт:** `https://www.instagram.com/svoi_nhatrang...`
* **Причина отказа (22.10.2026):**
  > *«The provided website URL is a social media link, which is not accepted for API verification. To resolve this issue and qualify for API access, the website URL you submit on your application must be an exact match to the one publicly visible on your verified Business Profile.»*
  *(Google категорически запрещает ссылки на соцсети для верификации API).*

### 3. Обращение №3: `7-8232000041779` (Успешно отправлено 27 октября 2026 г.)
* **Указанный сайт:** **`https://svoi.gbpilot.top/`**
* **Решение:** Развернут официальный двуязычный (RU/EN) сайт для **Кафе СВОИ** с пастельным дизайном, меню, галереей, точным адресом `58 Cao Van Be, Nha Trang 650000` и микроразметкой `Schema.org Restaurant / Cafe`. Ссылка на поддомен теперь полностью совпадает с карточкой в Google Maps и находится на автономном домене, соответствуя всем требованиям Google API Team.

---

## 🎯 Что произойдет после одобрения Google

1. **Письмо от Google Support:** На почту `0451611@gmail.com` поступит подтверждение об успешном внесении проекта `1025915570314` в белый список (Allowlist).
2. **Активация квоты:** В Google Cloud Console проекта `1025915570314` квота для Business Profile API автоматически вырастет с `0 QPM` до базовых **`300 QPM`** (Queries Per Minute).
3. **Библиотеки API для работы:**
   - `mybusinessbusinessinformation.googleapis.com` (My Business Business Information API)
   - `mybusinessaccountmanagement.googleapis.com` (My Business Account Management API)
   - `mybusiness.googleapis.com` (Google My Business API Gateway)

---

## 🛠️ Временный режим работы в приложении GBPilot
Пока заявка находится на рассмотрении, в дашборде GBPilot работает гибридный режим:
- **Кнопка «⚡ Add Venue via Search»:** прямое подключение заведений через публичный Google Places API без блокировки квоты GBP API.
