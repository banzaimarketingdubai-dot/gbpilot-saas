# 📋 Google Business Profile API — Заявка на доступ (Support Case)

Данный документ содержит официальные реквизиты тикета и проекта для отслеживания статуса согласования Google Business Profile API.

---

## 📌 Реквизиты новой заявки в Google (Подача №3)

| Параметр | Значение |
| :--- | :--- |
| **Актуальный статус** | **Подготовка к отправке заявки №3** |
| **Google-аккаунт заявителя** | `0451611@gmail.com` (Primary Owner профиля) |
| **Google Cloud Project Number** | **`1025915570314`** |
| **Имя проекта в Google Cloud** | `GbPilot` |
| **Подтвержденный бизнес-профиль** | **Кафе СВОИ (Cafe SVOI)** (ID: `15286059258947661772`) |
| **Физический адрес** | `58 Cao Van Be, Nha Trang 650000, Khanh Hoa, Vietnam` |
| **Официальный сайт заведения (Новый)** | **`https://svoi.gbpilot.top`** |

---

## 📜 История предыдущих обращений и причины отказов

### 1. Обращение №1: `8-2301000041527` (15–16 октября 2026 г.)
* **Указанный сайт:** `https://www.gbpilot.top`
* **Причина отказа (16.10.2026):**
  > *«The website URL listed on your application form (https://www.gbpilot.top) does not exactly match the website URL displayed on your Google Business Profile.»*
  *(В карточке кафе в Google Картах на тот момент стояла ссылка на Instagram).*

### 2. Обращение №2: `5-9695000042388` (19–22 октября 2026 г.)
* **Указанный сайт:** `https://www.instagram.com/svoi_nhatrang...`
* **Причина отказа (22.10.2026):**
  > *«The provided website URL is a social media link, which is not accepted for API verification. To resolve this issue and qualify for API access, the website URL you submit on your application must be an exact match to the one publicly visible on your verified Business Profile.»*
  *(Google категорически запрещает ссылки на социальные сети для API-верификации разработчиков).*

### 3. Решение для Обращения №3 (27 октября 2026 г.)
* Развернут официальный двуязычный (RU/EN) сайт-лендинг для **Кафе СВОИ**: **`https://www.gbpilot.top/svoi`** с пастельным дизайном, меню, галереей, адресом `58 Cao Van Be, Nha Trang 650000`, интеграцией Instagram-виджета `@svoi_nhatrang` и микроразметкой `Schema.org Restaurant / Cafe`.
* Ссылка меняется в карточке Google Business Profile ➔ та же ссылка указывается в форме Google API.

---

## 📝 Поля для подачи заявки №3 (Copy-Paste)

🔗 **Форма:** [Google Business Profile API Support Form](https://support.google.com/business/contact/api_default)

| Поле формы | Значение |
| :--- | :--- |
| **Topic / What can we help with?** | `Application for Basic API Access` |
| **Google Cloud Project Number** | `1025915570314` |
| **Company / Business Name** | `Кафе СВОИ` *(или `Cafe SVOI`)* |
| **Business Profile ID** | `15286059258947661772` |
| **Address** | `58 Cao Van Be, Nha Trang 650000, Vietnam` |
| **Company Website URL** | `https://svoi.gbpilot.top` |
| **Verified for 60+ days?** | `Yes` |
| **Active, allowlisted project previously?** | `No` |
| **How did you hear about this API form?** | `Google for Developers documentation` |

### Use Case Description (English):
```text
We are developing an internal business management and operations platform (GBPilot) to manage our verified Google Business Profile (Кафе СВОИ, ID: 15286059258947661772) and associated hospitality locations via standard OAuth 2.0 authorization.

Our use case requires the Google Business Profile APIs (Account Management, Business Information, and Reviews) for the following core operational workflows:
1. Automated synchronization and timely updates of operating hours, special holiday schedules, attributes (dining options, amenities), and digital menu items.
2. Centralized monitoring and prompt AI-assisted responses to verified customer reviews to ensure compliance with Google's Merchant Guidelines.
3. Publishing periodic local updates and announcements (community events, tea ceremonies, seasonal promotions) directly to our profile.

The standard web dashboard does not allow scheduled synchronization and automated audit checks for operational attributes across team shifts, which is why programmatic API access is required.
```

---

## 🎯 Что произойдет после одобрения Google

1. **Письмо от Google Support:** На почту `0451611@gmail.com` поступит подтверждение об успешном внесении проекта в белый список (Allowlist).
2. **Активация квоты:** В Google Cloud Console проекта `1025915570314` квота для Business Profile API автоматически вырастет с `0 QPM` до базовых **`300 QPM`** (Queries Per Minute).
3. **Библиотеки API для активации:**
   - `mybusinessbusinessinformation.googleapis.com` (My Business Business Information API)
   - `mybusinessaccountmanagement.googleapis.com` (My Business Account Management API)
   - `mybusiness.googleapis.com` (Google My Business API Gateway)
