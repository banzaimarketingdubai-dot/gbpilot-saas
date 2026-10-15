# 📋 Google Business Profile API — Заявка на доступ (Support Case)

Данный документ содержит официальные реквизиты тикета и проекта для отслеживания статуса согласования Google Business Profile API.

---

## 📌 Реквизиты обращения в Google

| Параметр | Значение |
| :--- | :--- |
| **Номер обращения (Case ID)** | **`8-2301000041527`** |
| **Дата подачи заявки** | **15 октября 2026 г.** |
| **Текущий статус** | **В очереди на рассмотрении (Review time: 7–10 рабочих дней)** |
| **Ожидаемый срок решения** | **22–27 октября 2026 г.** |
| **Google-аккаунт заявителя** | `0451611@gmail.com` |
| **Google Cloud Project Number** | **`1025915570314`** |
| **Имя проекта в Google Cloud** | `GbPilot` |
| **Указанный сайт платформы** | `https://www.gbpilot.top` |
| **Подтвержденный бизнес-профиль** | **Кафе СВОИ (Cafe SVOI)** (ID: `15286059258947661772`, Nha Trang, Vietnam) |

---

## 📝 Текст заявки (Use Case Submitted)

```text
Developing a SaaS platform (GBPilot) to help local businesses manage Google Business Profiles via OAuth 2.0: syncing business hours and attributes, monitoring and responding to customer reviews, and publishing updates.
```

- **How did you hear about this API form:** `Google for Developers documentation`
- **Verified for 60+ days:** `Yes`
- **Active, allowlisted project previously:** `No` (первичная заявка на добавление в белый список)

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
