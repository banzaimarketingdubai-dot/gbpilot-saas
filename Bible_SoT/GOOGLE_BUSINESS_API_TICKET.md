# 📋 Google Business Profile API — Заявка на доступ (Support Case)

Данный документ содержит официальные реквизиты тикета и проекта для отслеживания статуса согласования Google Business Profile API.

---

## 📌 Реквизиты активного обращения в Google (Повторная подача)

| Параметр | Значение |
| :--- | :--- |
| **Актуальный номер обращения (Case ID)** | **`5-9695000042388`** |
| **Предыдущий номер обращения** | `8-2301000041527` *(от 15.10.2026 — скорректирован URL сайта)* |
| **Дата подачи новой заявки** | **19 октября 2026 г., 13:41** |
| **Текущий статус** | **На рассмотрении (Opened a support case — ожидаем ответ 20–29 октября 2026 г.)** |
| **Google-аккаунт заявителя** | `0451611@gmail.com` |
| **Google Cloud Project Number** | **`1025915570314`** |
| **Имя проекта в Google Cloud** | `GbPilot` |
| **Указанный сайт (совпадает с GBP)** | `https://www.instagram.com/svoi_nhatrang?igsh=MTk0bnZobmtrZjRpMg%3D%3D` |
| **Подтвержденный бизнес-профиль** | **Кафе СВОИ (Cafe SVOI)** (ID: `15286059258947661772`, 58 Cao Van Be, Nha Trang, Vietnam) |

---

## 📜 История первого обращения (`8-2301000041527` от 15–16 октября 2026 г.)

> **Причина отказа (16.10.2026):**
> *The website URL listed on your application form (`https://www.gbpilot.top`) does not exactly match the website URL displayed on your Google Business Profile.*
>
> **Решение (19.10.2026):** Подана новая заявка **`5-9695000042388`** с точным совпадением URL из карточки **Кафе СВОИ**.

---

## 📝 Поля для новой заявки (Copy-Paste)

- **Google Cloud Project Number:** `1025915570314`
- **Company / Business Name:** `Кафе СВОИ`
- **Business Profile ID:** `15286059258947661772`
- **Address:** `58 Cao Van Be, Nha Trang 650000, Vietnam`
- **Company Website URL:** `https://www.instagram.com/svoi_nhatrang?igsh=MTk0bnZobmtrZjRpMg%3D%3D` *(или точная строка из поля Website в кабинете GBP)*
- **Use Case:**
```text
Managing our verified Google Business Profile (Кафе СВОИ) and connected locations via our platform (GBPilot) using OAuth 2.0: syncing business hours, menus, and attributes, monitoring and responding to customer reviews, and publishing updates.
```

- **How did you hear about this API form:** `Google for Developers documentation`
- **Verified for 60+ days:** `Yes`
- **Active, allowlisted project previously:** `No`

---

## 🎯 Что произойдет после одобрения Google

1. **Письмо от Google Support:** На почту `0451611@gmail.com` поступит подтверждение об успешном внесении проекта в белый список (Allowlist).
2. **Активация квоты:** В [Google Cloud Console](https://console.cloud.google.com/) проекта `1025915570314` квота для Business Profile API автоматически вырастет с `0 QPM` до базовых **`300 QPM`** (Queries Per Minute).
3. **Библиотеки API для активации:**
   - `mybusinessbusinessinformation.googleapis.com` (My Business Business Information API)
   - `mybusinessaccountmanagement.googleapis.com` (My Business Account Management API)
   - `mybusiness.googleapis.com` (Google My Business API Gateway)

---

## 🛠️ Временный режим работы в приложении GBPilot
Пока заявка находится на проверке, в дашборде GBPilot задействован гибридный режим:
- **Кнопка «⚡ Add Venue via Search»:** прямое подключение любого заведения через публичный Google Places API без ожидания одобрения квоты GBP API.
