import { OwnerGroundTruth } from '@/lib/groundTruth';
import { detectCurrencyByLocation } from '@/lib/inspection/auditEngine';

export type DirectoryPlatformId = 'APPLE_MAPS' | 'TWOGIS' | 'TRIPADVISOR' | 'TIMEOUT_PR';

export interface DirectoryFieldBlock {
  id: string;
  blockNumber: number;
  fieldTitle: string;
  exactCabinetPath: string;
  maxChars?: number;
  validationRule: string;
  value: string;
  isFreePreview: boolean;
  fieldType: 'TEXT' | 'CATALOG' | 'ATTRIBUTES' | 'MEDIA_SPEC' | 'COORDINATES';
}

export interface DirectoryPlatformBlueprint {
  id: DirectoryPlatformId;
  name: string;
  badge: string;
  portalUrl: string;
  portalDomain: string;
  aiCitationImpact: string;
  financialWhyText: string;
  estimatedMonthlyValue: string;
  completionTime: string;
  blocks: DirectoryFieldBlock[];
}

function clampText(text: string, maxLen: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  const sliced = clean.slice(0, maxLen - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  if (lastSpace > maxLen * 0.65) {
    return sliced.slice(0, lastSpace).replace(/[.,;:-]+$/, '') + '.';
  }
  return sliced.trim() + '.';
}

export function buildDirectoryBlueprints(
  profile: {
    name?: string;
    address?: string;
    city?: string;
    category?: string;
    phone?: string;
    website_url?: string;
    lat?: number;
    lng?: number;
  } | null,
  groundTruth?: OwnerGroundTruth | null
): DirectoryPlatformBlueprint[] {
  const bName = profile?.name && profile.name !== 'No Business Connected' ? profile.name.trim() : 'Your Business';
  const bCategory = profile?.category && !['local business', 'establishment'].includes(profile.category.toLowerCase())
    ? profile.category
    : 'Specialty Venue & Services';
  const bAddress = profile?.address || profile?.city || 'Central Business District';
  const bCity = profile?.city || (bAddress.toLowerCase().includes('dubai') ? 'Dubai' : 'City Center');
  const bPhone = profile?.phone && profile.phone !== '—' ? profile.phone : '+971 50 000 0000';
  const bWebsite = profile?.website_url || 'https://gbpilot.top';
  const lat = profile?.lat ? profile.lat.toFixed(5) : '25.08050';
  const lng = profile?.lng ? profile.lng.toFixed(5) : '55.14030';

  const currency = detectCurrencyByLocation(bAddress, undefined, profile?.city);
  const sym = currency.symbol;
  const isAed = currency.code === 'AED';

  const flagship = groundTruth?.flagshipOffering?.trim() || `Signature ${bCategory} & Top-Rated Client Service`;
  const persona = groundTruth?.guestPersona?.trim() || 'Local residents, expats, and international visitors';
  const rules = groundTruth?.venueRulesAndPerks?.trim() || 'Convenient parking, fast service, and comfortable atmosphere';

  //Price helper
  const p1 = isAed ? `${sym} 45` : `${sym}14`;
  const p2 = isAed ? `${sym} 65` : `${sym}22`;
  const p3 = isAed ? `${sym} 120` : `${sym}39`;
  const p4 = isAed ? `${sym} 190` : `${sym}59`;

  const estAppleVal = isAed ? 'AED 4,800 / мес' : '$1,300 / мес';
  const est2GisVal = isAed ? 'AED 3,900 / мес' : '$1,050 / мес';
  const estTripVal = isAed ? 'AED 5,400 / мес' : '$1,480 / мес';
  const estPrVal = isAed ? 'AED 7,200 / мес' : '$1,950 / мес';

  // 1. APPLE BUSINESS CONNECT (businessconnect.apple.com)
  const appleAboutRaw = `${bName} is an established ${bCategory.toLowerCase()} located at ${bAddress}. Specializing in ${flagship.toLowerCase()}, the venue serves ${persona.toLowerCase()}. Guests appreciate ${rules.toLowerCase()} with convenient access and verified operating hours.`;
  const appleShowcaseHeaderRaw = clampText(`Special: ${flagship}`, 38);
  const appleShowcaseBodyRaw = clampText(`Visit ${bName} for ${flagship.toLowerCase()}. ${rules}. Book or drop in today.`, 100);

  const appleBlueprint: DirectoryPlatformBlueprint = {
    id: 'APPLE_MAPS',
    name: 'Apple Business Connect (Apple Maps & CarPlay)',
    badge: '🍎 70%+ iPhone & Siri',
    portalUrl: 'https://businessconnect.apple.com',
    portalDomain: 'businessconnect.apple.com',
    aiCitationImpact: '+28% к индексу доверия Siri, Apple Intelligence и ChatGPT Search (iOS)',
    financialWhyText: 'Более 70% платежеспособных владельцев iPhone строят маршруты через Apple CarPlay и Siri. Если карточка в Apple Business Connect не заполнена на 100%, водители уезжают к конкурентам.',
    estimatedMonthlyValue: estAppleVal,
    completionTime: '3 минуты (Копипаст 7 блоков)',
    blocks: [
      {
        id: 'apple-1-name',
        blockNumber: 1,
        fieldTitle: 'Блок 1. Display Name (Отображаемое имя карточки)',
        exactCabinetPath: 'Place Card → Header → Display Name',
        maxChars: 100,
        validationRule: 'Правило модерации Apple: Только официальное название без рекламных приписок, эмодзи и КАПСЛОКА (иначе уйдет в бан модерации).',
        value: clampText(bName, 100),
        isFreePreview: true,
        fieldType: 'TEXT'
      },
      {
        id: 'apple-2-categories',
        blockNumber: 2,
        fieldTitle: 'Блок 2. Primary & Additional Categories (Категории Apple)',
        exactCabinetPath: 'Place Card → Details → Categories',
        validationRule: 'Выберите 1 основную категорию и ровно 2 дополнительные из классификатора Apple Maps.',
        value: `Primary Category: ${bCategory}\nAdditional Category 1: Local Services & Hospitality\nAdditional Category 2: Customer Care & Consultation`,
        isFreePreview: true,
        fieldType: 'ATTRIBUTES'
      },
      {
        id: 'apple-3-about',
        blockNumber: 3,
        fieldTitle: 'Блок 3. About This Place (Описание «О месте»)',
        exactCabinetPath: 'Place Card → About → Place Description',
        maxChars: 500,
        validationRule: 'Жесткий лимит Apple: строго до 500 символов. Пишется в 3-м лице («Компания предлагает...»). Запрещены ссылки, номера телефонов и слова «Скидка / Лучший №1».',
        value: clampText(appleAboutRaw, 500),
        isFreePreview: false,
        fieldType: 'TEXT'
      },
      {
        id: 'apple-4-showcase',
        blockNumber: 4,
        fieldTitle: 'Блок 4. Apple Showcase (Витрина спецпредложения на 30 дней)',
        exactCabinetPath: 'Place Card → Showcases → Add New Showcase',
        maxChars: 138,
        validationRule: 'Точный формат полей Apple Showcase: Заголовок (Header) — строго до 38 символов! Текст (Body) — строго до 100 символов! Кнопка (Action CTA) — выбор из списка.',
        value: `[Поле 1: Showcase Header — ${appleShowcaseHeaderRaw.length}/38 симв.]\n${appleShowcaseHeaderRaw}\n\n[Поле 2: Showcase Body — ${appleShowcaseBodyRaw.length}/100 симв.]\n${appleShowcaseBodyRaw}\n\n[Поле 3: Action Button CTA]\nButton Type: Book / Order Now\nTarget Link: ${bWebsite}`,
        isFreePreview: false,
        fieldType: 'TEXT'
      },
      {
        id: 'apple-5-coords',
        blockNumber: 5,
        fieldTitle: 'Блок 5. Location & CarPlay Arrival Point (Точка входа и высадки авто)',
        exactCabinetPath: 'Place Card → Location → Map Pin & Entrance Coordinates',
        validationRule: 'Apple CarPlay ведет машину не в центр здания, а к точке Arrival Point. Скопируйте координаты главного входа.',
        value: `Full Street Address: ${bAddress}\nPin Latitude: ${lat}\nPin Longitude: ${lng}\nArrival & Parking Note: ${rules}`,
        isFreePreview: false,
        fieldType: 'COORDINATES'
      },
      {
        id: 'apple-6-attributes',
        blockNumber: 6,
        fieldTitle: 'Блок 6. Good to Know (Чекбоксы атрибутов Apple Maps)',
        exactCabinetPath: 'Place Card → Details → Good to Know',
        validationRule: 'Отметьте эти галочки в кабинете Apple Business Connect — они включают показ в быстрых фильтрах CarPlay.',
        value: `☑ Accepts Apple Pay & Contactless Cards\n☑ ${rules}\n☑ Appointment / Walk-ins Welcome\n☑ Free Customer Wi-Fi\n☑ Air-Conditioned Indoor Space\n☑ Wheelchair Accessible Entrance`,
        isFreePreview: false,
        fieldType: 'ATTRIBUTES'
      },
      {
        id: 'apple-7-media',
        blockNumber: 7,
        fieldTitle: 'Блок 7. Cover Photo & Square Logo (Техтребования к фото Apple)',
        exactCabinetPath: 'Place Card → Photos & Logo → Upload Media',
        validationRule: 'Apple отклоняет фото с текстом или водяными знаками. Загрузите те же гео-тегированные фото из нашей библиотеки в указанных пропорциях.',
        value: `1. Cover Photo (Обложка карточки): Разрешение 1600 × 1040 px (формат 16:10), JPEG/PNG, без логотипов поверх фото.\n2. Company Logo (Квадратный логотип): 1024 × 1024 px (1:1), непрозрачный фон.\n3. Photo Caption (Подпись к фото №1): ${bName} — ${flagship} (${bCity}).`,
        isFreePreview: false,
        fieldType: 'MEDIA_SPEC'
      }
    ]
  };

  // 2. 2GIS BUSINESS (account.2gis.com)
  const twoGisShortRaw = clampText(`${bName} (${bCategory}): ${flagship}. ${rules}.`, 150);
  const twoGisFullRaw = `${bName} — профессиональный сервис в категории «${bCategory}», расположенный по адресу: ${bAddress}.\n\nКлючевая специализация и флагманские предложения:\n• ${flagship}\n• Внимательный сервис для гостей: ${persona}\n• Преимущества локации: ${rules}\n\nМы работаем ежедневно по актуальному графику. Доступна быстрая запись и консультация через WhatsApp и по телефону ${bPhone}. Постройте точный маршрут до входа в 2ГИС!`;

  const twoGisBlueprint: DirectoryPlatformBlueprint = {
    id: 'TWOGIS',
    name: '2GIS Business (Навигация по башням, этажам и моллам)',
    badge: '🗺️ Точный вход & Прайс',
    portalUrl: 'https://account.2gis.com',
    portalDomain: 'account.2gis.com',
    aiCitationImpact: '+24% к локальной выдаче по зданиям/кластерам и индексации прайс-листов',
    financialWhyText: 'Главный справочник для поиска точного входа в бизнес-центры, башни и моллы. Позволяет бесплатно выводить прайс-лист и кнопку WhatsApp прямо в списке поиска.',
    estimatedMonthlyValue: est2GisVal,
    completionTime: '4 минуты (Копипаст 6 блоков)',
    blocks: [
      {
        id: '2gis-1-short',
        blockNumber: 1,
        fieldTitle: 'Блок 1. Название и Короткое описание (Слоган в выдаче)',
        exactCabinetPath: 'Кабинет 2ГИС → Профиль → Инфо → Короткое описание',
        maxChars: 150,
        validationRule: 'Лимит 2ГИС: строго до 150 символов. Этот текст виден клиенту сразу в общем списке компаний до клика по карточке.',
        value: twoGisShortRaw,
        isFreePreview: true,
        fieldType: 'TEXT'
      },
      {
        id: '2gis-2-rubrics',
        blockNumber: 2,
        fieldTitle: 'Блок 2. Рубрики справочника 2ГИС и Контакты (WhatsApp)',
        exactCabinetPath: 'Кабинет 2ГИС → Профиль → Сферы деятельности и Контакты',
        validationRule: 'Добавьте до 3 смежных рубрик и обязательно вставьте прямую ссылку на WhatsApp для кнопки быстрого чата.',
        value: `Основная рубрика: ${bCategory}\nДоп. рубрики: Услуги для резидентов и туристов / Консультации и сервис\nТелефон: ${bPhone}\nСайт: ${bWebsite}\nСсылка кнопки WhatsApp: https://wa.me/${bPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Здравствуйте! Пишу вам из карточки 2ГИС (${bName}).`)}`,
        isFreePreview: true,
        fieldType: 'ATTRIBUTES'
      },
      {
        id: '2gis-3-fullbio',
        blockNumber: 3,
        fieldTitle: 'Блок 3. Расширенное описание компании (Вкладка «Инфо»)',
        exactCabinetPath: 'Кабинет 2ГИС → Профиль → Инфо → Полное описание',
        maxChars: 2000,
        validationRule: 'Лимит 2ГИС: до 2000 символов. Включены LSI-ключи для ранжирования во внутреннем поиске 2ГИС по услугам.',
        value: clampText(twoGisFullRaw, 2000),
        isFreePreview: false,
        fieldType: 'TEXT'
      },
      {
        id: '2gis-4-entrance',
        blockNumber: 4,
        fieldTitle: 'Блок 4. Этаж, Ориентир и блок «Как пройти / Парковка»',
        exactCabinetPath: 'Кабинет 2ГИС → Адрес и геометрия → Точка входа и Комментарий к адресу',
        validationRule: 'Уникальное поле 2ГИС: укажите ориентир входа и условия парковки, чтобы клиент или такси не плутали вокруг здания.',
        value: `Точный адрес: ${bAddress}\nКоординаты входа (Ш/Д): ${lat}, ${lng}\nКомментарий «Как пройти»: Главный вход с фасада здания, следуйте указателям ${bName}.\nПарковка и правила: ${rules}`,
        isFreePreview: false,
        fieldType: 'COORDINATES'
      },
      {
        id: '2gis-5-pricelist',
        blockNumber: 5,
        fieldTitle: 'Блок 5. Товары и услуги (Готовая таблица для вкладки «Цены»)',
        exactCabinetPath: 'Кабинет 2ГИС → Товары и услуги → Добавить позиции',
        validationRule: 'Формат прайса 2ГИС: «Категория — Название позиции — Цена — Описание до 100 символов». Профили с ценами получают на 40% больше кликов.',
        value: `1. [Флагман] ${flagship} — от ${p3} | Главный хит ${bName}, предварительная запись или заказ.\n2. [Стандарт] Базовая услуга / сет (${bCategory}) — ${p1} | Быстрое обслуживание без ожидания.\n3. [Премиум] Расширенный пакет для гостей — ${p4} | Включает индивидуальный сервис и приоритет.\n4. [Спецпредложение] Первый визит / Знакомство — ${p2} | Доступно при обращении из карт.`,
        isFreePreview: false,
        fieldType: 'CATALOG'
      },
      {
        id: '2gis-6-features',
        blockNumber: 6,
        fieldTitle: 'Блок 6. Дополнительные параметры и способы оплаты',
        exactCabinetPath: 'Кабинет 2ГИС → Профиль → Особенности и Оплата',
        validationRule: 'Отметьте эти пункты галочками в анкете характеристик 2ГИС.',
        value: `☑ Оплата картой / Наличными / Apple Pay / QR\n☑ ${rules}\n☑ Консультация и бронь в WhatsApp\n☑ Обслуживание на русском и английском языках\n☑ Wi-Fi для гостей`,
        isFreePreview: false,
        fieldType: 'ATTRIBUTES'
      }
    ]
  };

  // 3. TRIPADVISOR MANAGEMENT CENTER (tripadvisor.com/Owners)
  const tripDescRaw = `Welcome to ${bName}, a top-rated ${bCategory.toLowerCase()} in ${bCity} (${bAddress}). Known for ${flagship.toLowerCase()}, we provide an authentic, high-standard experience tailored for ${persona.toLowerCase()}. Visitors and locals choose ${bName} for our attention to detail and ${rules.toLowerCase()}. Conveniently located with easy taxi and pedestrian access, our team speaks English and is ready to welcome you daily.`;

  const tripBlueprint: DirectoryPlatformBlueprint = {
    id: 'TRIPADVISOR',
    name: 'TripAdvisor Owners (Главный донор для ChatGPT & Perplexity)',
    badge: '🦉 №1 для ChatGPT & Туристов',
    portalUrl: 'https://www.tripadvisor.com/Owners',
    portalDomain: 'tripadvisor.com/Owners',
    aiCitationImpact: '+42% к вероятности попадания в ТОП-3 рекомендаций ChatGPT и Perplexity',
    financialWhyText: 'ChatGPT и Perplexity напрямую парсят базу TripAdvisor при ответах на запросы «Best places / services in city». Заполненный профиль сразу выводит вас в ответы нейросетей.',
    estimatedMonthlyValue: estTripVal,
    completionTime: '3 минуты (Копипаст 5 блоков)',
    blocks: [
      {
        id: 'trip-1-title',
        blockNumber: 1,
        fieldTitle: 'Блок 1. Official Property Name & Location Cluster',
        exactCabinetPath: 'Management Center → Business Info → General Information',
        maxChars: 120,
        validationRule: 'Название должно на 100% совпадать с Google Business Profile (NAP Consistency), чтобы ИИ склеил рейтинги обеих площадок.',
        value: `Property Name: ${bName}\nAddress: ${bAddress}\nCity / District: ${bCity}\nPhone: ${bPhone}\nWebsite: ${bWebsite}`,
        isFreePreview: true,
        fieldType: 'TEXT'
      },
      {
        id: 'trip-2-description',
        blockNumber: 2,
        fieldTitle: 'Блок 2. Property Description (Англоязычное описание для ИИ и туристов)',
        exactCabinetPath: 'Management Center → Business Info → Description',
        maxChars: 1000,
        validationRule: 'Лимит TripAdvisor: до 1000 символов. Рекомендуется заполнять на английском языке, так как LLM-модели (ChatGPT/Perplexity) индексируют английский сниппет как глобальный источник.',
        value: clampText(tripDescRaw, 1000),
        isFreePreview: true,
        fieldType: 'TEXT'
      },
      {
        id: 'trip-3-features',
        blockNumber: 3,
        fieldTitle: 'Блок 3. Features, Specialties & Price Range (Теги фильтрации)',
        exactCabinetPath: 'Management Center → Business Info → Cuisines / Services & Features',
        validationRule: 'Отметьте эти теги в панели владельца TripAdvisor для попадания в подборки «Travelers Choice / Best Nearby».',
        value: `Price Range: $$ - $$$ (Mid-range / Premium Quality)\nSignature Highlight: ${flagship}\nBest For: ${persona}\nKey Amenities: ${rules}, English Spoken, Digital Payments Accepted`,
        isFreePreview: false,
        fieldType: 'ATTRIBUTES'
      },
      {
        id: 'trip-4-highlights',
        blockNumber: 4,
        fieldTitle: 'Блок 4. Menu / Service Highlights (Топ позиции для карточки)',
        exactCabinetPath: 'Management Center → Menu & Offerings → Featured Items',
        validationRule: 'Скопируйте и вставьте эти 3 ключевые позиции — нейросети цитируют их дословно, когда пользователь спрашивает «Что заказать / какую услугу выбрать».',
        value: `• Featured #1: ${flagship} (From ${p3})\n• Featured #2: Express / Daily Package for ${persona} (${p2})\n• Featured #3: Guest Advantage — ${rules}`,
        isFreePreview: false,
        fieldType: 'CATALOG'
      },
      {
        id: 'trip-5-photocaption',
        blockNumber: 5,
        fieldTitle: 'Блок 5. Primary Photo Captions (SEO-подписи к главным фото)',
        exactCabinetPath: 'Management Center → Photos → Manage Photos → Edit Caption',
        validationRule: 'Большинство владельцев оставляют подписи к фото пустыми. Заполненный Caption индексируется Google Images и мультимодальным поиском Gemini.',
        value: `Photo 1 (Primary Cover): ${bName} in ${bCity} — ${flagship}\nPhoto 2 (Interior / Process): Welcoming atmosphere for ${persona} at ${bName}\nPhoto 3 (Exterior / Entrance): Easy entrance and ${rules} at ${bAddress}`,
        isFreePreview: false,
        fieldType: 'MEDIA_SPEC'
      }
    ]
  };

  // 4. TIMEOUT / WHAT'S ON / LOCAL AI CURATED LISTS PR-KIT
  const prBlurbRaw = `Tucked away in ${bAddress}, ${bName} has quickly become a go-to spot in ${bCity} for anyone seeking ${flagship.toLowerCase()}. Tailored for ${persona.toLowerCase()}, the venue stands out by combining consistent quality with practical perks like ${rules.toLowerCase()}.`;

  const timeoutBlueprint: DirectoryPlatformBlueprint = {
    id: 'TIMEOUT_PR',
    name: 'TimeOut / What’s On / Блоги «Топ-10» (Editorial PR-Kit)',
    badge: '📰 Выход в статьи «Лучшие в городе»',
    portalUrl: 'https://www.timeoutdubai.com/contact-us',
    portalDomain: 'Editorial Desk / Local Media',
    aiCitationImpact: '+48% к цитированию в Google AI Overviews (Gemini) по запросам «Лучшие в районе»',
    financialWhyText: 'Одно упоминание вашего бизнеса в обзорной статье «Топ-10 мест района» навсегда закрепляет вас в ответах Google Gemini и ChatGPT. Мы подготовили готовое письмо и абзац в стиле редакции — просто отправьте его на email местных изданий.',
    estimatedMonthlyValue: estPrVal,
    completionTime: '2 минуты (Скопировать и отправить)',
    blocks: [
      {
        id: 'pr-1-subject',
        blockNumber: 1,
        fieldTitle: 'Блок 1. Тема письма в редакцию (Email Subject Line)',
        exactCabinetPath: 'Почта редакции (TimeOut / What’s On / Локальные Telegram-каналы и гиды)',
        maxChars: 90,
        validationRule: 'Короткая журналистская тема без спама — открываемость редакторами рубрик «New & Trending» выше 65%.',
        value: clampText(`Editorial Spotlights (${bCity}): ${bName} — ${flagship}`, 90),
        isFreePreview: true,
        fieldType: 'TEXT'
      },
      {
        id: 'pr-2-blurb',
        blockNumber: 2,
        fieldTitle: 'Блок 2. Готовый редакционный абзац (The 50-Word Magazine Blurb)',
        exactCabinetPath: 'Тело письма → Готовый абзац для вставки журналистом в статью без рерайта',
        maxChars: 420,
        validationRule: 'Журналисты охотно включают заведение в подборку, когда за них уже написан лаконичный абзац на 50 слов в редакционном стиле.',
        value: clampText(prBlurbRaw, 420),
        isFreePreview: false,
        fieldType: 'TEXT'
      },
      {
        id: 'pr-3-factbox',
        blockNumber: 3,
        fieldTitle: 'Блок 3. Факт-бокс для публикации (Editorial Fact Sheet)',
        exactCabinetPath: 'Нижняя часть письма → Справочная карточка заведения',
        validationRule: 'Стандартная карточка фактов, которую издания ставят внизу каждого обзора.',
        value: `• Venue Name: ${bName}\n• Category: ${bCategory}\n• Must-Try / Flagship: ${flagship}\n• Average Spend: From ${p2} – ${p3}\n• Insider Perks: ${rules}\n• Exact Location: ${bAddress} (GPS: ${lat}, ${lng})\n• Contact & Booking: ${bPhone} | ${bWebsite}`,
        isFreePreview: false,
        fieldType: 'CATALOG'
      }
    ]
  };

  return [appleBlueprint, twoGisBlueprint, tripBlueprint, timeoutBlueprint];
}
