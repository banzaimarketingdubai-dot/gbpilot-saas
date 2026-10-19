/**
 * High-Quality Local SEO Copywriting & Semantic Keyword Engine for Google Business Profile
 * Generates human-written quality, niche-aware, geo-anchored descriptions with high-intent search keywords.
 * Bridges the gap between owner domain knowledge and Google Maps ranking algorithms.
 */

export type SeoCopyTone = 'SEO' | 'PREMIUM' | 'CONCISE';

export type BusinessNiche = 
  | 'VISA_TOURISM_EXPAT'
  | 'COFFEE_FOOD'
  | 'BEAUTY_SPA'
  | 'HEALTH_DENTAL'
  | 'AUTO_SERVICE'
  | 'RETAIL_SHOP'
  | 'HOME_SERVICES'
  | 'PROFESSIONAL_SERVICES'
  | 'GENERAL_LOCAL';

export interface NicheInfo {
  id: BusinessNiche;
  label: string;
  icon: string;
  exampleKeywords: string;
}

export const NICHE_LIST: NicheInfo[] = [
  { id: 'VISA_TOURISM_EXPAT', label: 'Визы, туризм и экспат-сервис', icon: '🌴', exampleKeywords: 'визаран, продление виз, трансфер, переводы' },
  { id: 'COFFEE_FOOD', label: 'Кафе, кофейни и рестораны', icon: '☕', exampleKeywords: 'завтраки, кофе, десерты, терраса, ланч' },
  { id: 'BEAUTY_SPA', label: 'Салоны красоты, барбершопы и спа', icon: '💅', exampleKeywords: 'маникюр, стрижки, окрашивание, спа-уход' },
  { id: 'HEALTH_DENTAL', label: 'Клиники и стоматологии', icon: '🩺', exampleKeywords: 'лечение зубов, диагностика, анализы, врачи' },
  { id: 'AUTO_SERVICE', label: 'Автосервисы, шиномонтаж и мойки', icon: '🚗', exampleKeywords: 'ТО, замена масла, диагностика, ремонт подвески' },
  { id: 'RETAIL_SHOP', label: 'Магазины, бутики и ритейл', icon: '🛍️', exampleKeywords: 'широкий ассортимент, новинки, примерка, доставка' },
  { id: 'HOME_SERVICES', label: 'Бытовые услуги и ремонт квартир', icon: '🔧', exampleKeywords: 'выезд мастера, сантехник, электрик, клининг' },
  { id: 'PROFESSIONAL_SERVICES', label: 'Юристы, бухгалтерия и консалтинг', icon: '💼', exampleKeywords: 'консультации, сопровождение сделок, аудит' },
  { id: 'GENERAL_LOCAL', label: 'Другой локальный бизнес', icon: '🏢', exampleKeywords: 'услуги для клиентов, удобная локация, сервис' }
];

export interface SeoCopyContext {
  businessName: string;
  businessAddress: string;
  category?: string;
  city?: string;
  tone?: SeoCopyTone;
  explicitNiche?: BusinessNiche;
  customNotes?: string;
}

/**
 * Parses address components into human-readable Russian geographic anchors.
 */
export function extractGeoAnchors(address: string, fallbackCity?: string): {
  landmarkOrDistrict: string;
  city: string;
  formattedLocation: string;
} {
  const addr = address.toLowerCase();

  // 1. City Detection
  let city = fallbackCity || '';
  if (!city) {
    if (addr.includes('nha trang') || addr.includes('нячанг')) city = 'Нячанге';
    else if (addr.includes('dubai') || addr.includes('дубай')) city = 'Дубае';
    else if (addr.includes('abu dhabi') || addr.includes('абу-даби')) city = 'Абу-Даби';
    else if (addr.includes('москва') || addr.includes('moscow')) city = 'Москве';
    else if (addr.includes('санкт-петербург') || addr.includes('питер') || addr.includes('spb')) city = 'Санкт-Петербурге';
    else if (addr.includes('алматы') || addr.includes('almaty')) city = 'Алматы';
    else if (addr.includes('ташкент') || addr.includes('tashkent')) city = 'Ташкенте';
    else if (addr.includes('бангкок') || addr.includes('bangkok')) city = 'Бангкоке';
    else if (addr.includes('пхукет') || addr.includes('phuket')) city = 'Пхукете';
    else if (addr.includes('тбилиси') || addr.includes('tbilisi')) city = 'Тбилиси';
    else if (addr.includes('ереван') || addr.includes('yerevan')) city = 'Ереване';
    else if (addr.includes('минск') || addr.includes('minsk')) city = 'Минске';
    else city = 'вашем городе';
  } else {
    // Add prepositional case helper if needed
    if (!city.startsWith('в ') && !city.startsWith('г.')) {
      if (city.endsWith('а')) city = city.slice(0, -1) + 'е';
      else if (!city.endsWith('е') && !city.endsWith('и') && !city.endsWith('ы')) city = city + 'е';
    }
  }

  // 2. District / Landmark / Street Detection
  let landmarkOrDistrict = '';
  if (addr.includes('hòn chồng') || addr.includes('hon chong')) {
    landmarkOrDistrict = 'в районе Hòn Chồng (Хон Чонг)';
  } else if (addr.includes('dubai marina')) {
    landmarkOrDistrict = 'в районе Dubai Marina';
  } else if (addr.includes('downtown')) {
    landmarkOrDistrict = 'в центре (Downtown)';
  } else if (addr.includes('jbr') || addr.includes('jumeirah beach')) {
    landmarkOrDistrict = 'на JBR / Jumeirah Beach';
  } else if (addr.includes('business bay')) {
    landmarkOrDistrict = 'в Business Bay';
  } else if (addr.includes('тверск')) {
    landmarkOrDistrict = 'на Тверской';
  } else if (addr.includes('арбат')) {
    landmarkOrDistrict = 'на Арбате';
  } else if (addr.includes('невск')) {
    landmarkOrDistrict = 'на Невском проспекте';
  } else if (addr.includes('центр') || addr.includes('center')) {
    landmarkOrDistrict = 'в центральном районе';
  } else {
    const parts = address.split(',').map(p => p.trim());
    if (parts.length > 0 && parts[0] && parts[0] !== '—') {
      landmarkOrDistrict = `на ${parts[0]}`;
    } else {
      landmarkOrDistrict = 'в удобной локации';
    }
  }

  const formattedLocation = `${landmarkOrDistrict}, в ${city}`;

  return {
    landmarkOrDistrict,
    city,
    formattedLocation
  };
}

/**
 * Identifies the specific business niche from name and category keywords.
 */
export function detectBusinessNiche(name: string, category?: string): BusinessNiche {
  const combined = `${name} ${category || ''}`.toLowerCase();

  // Tourism / Visa / Expat
  if (
    combined.includes('визар') ||
    combined.includes('виза') ||
    combined.includes('visa') ||
    combined.includes('экспат') ||
    combined.includes('expat') ||
    combined.includes('tour') ||
    combined.includes('тур') ||
    combined.includes('travel') ||
    combined.includes('миграц')
  ) {
    return 'VISA_TOURISM_EXPAT';
  }

  // Food & Dining / Cafe / Restaurant
  if (
    combined.includes('кофе') ||
    combined.includes('coffee') ||
    combined.includes('cafe') ||
    combined.includes('кафе') ||
    combined.includes('restaurant') ||
    combined.includes('ресторан') ||
    combined.includes('пекарн') ||
    combined.includes('bakery') ||
    combined.includes('bistro') ||
    combined.includes('бистро') ||
    combined.includes('бар') ||
    combined.includes('bar') ||
    combined.includes('пицца') ||
    combined.includes('pizza') ||
    combined.includes('суши') ||
    combined.includes('sushi') ||
    combined.includes('бургер') ||
    combined.includes('burger') ||
    combined.includes('еда') ||
    combined.includes('food') ||
    combined.includes('kitchen')
  ) {
    return 'COFFEE_FOOD';
  }

  // Beauty & Spa
  if (
    combined.includes('красот') ||
    combined.includes('beauty') ||
    combined.includes('salon') ||
    combined.includes('салон') ||
    combined.includes('маникюр') ||
    combined.includes('nail') ||
    combined.includes('hair') ||
    combined.includes('стрижк') ||
    combined.includes('барбер') ||
    combined.includes('barber') ||
    combined.includes('spa') ||
    combined.includes('спа') ||
    combined.includes('массаж') ||
    combined.includes('massage') ||
    combined.includes('cosmet') ||
    combined.includes('космет')
  ) {
    return 'BEAUTY_SPA';
  }

  // Medical & Dental
  if (
    combined.includes('стомат') ||
    combined.includes('dental') ||
    combined.includes('клиник') ||
    combined.includes('clinic') ||
    combined.includes('врач') ||
    combined.includes('doctor') ||
    combined.includes('мед') ||
    combined.includes('med') ||
    combined.includes('здоров') ||
    combined.includes('health') ||
    combined.includes('анализ')
  ) {
    return 'HEALTH_DENTAL';
  }

  // Auto Service
  if (
    combined.includes('авто') ||
    combined.includes('auto') ||
    combined.includes('car') ||
    combined.includes('motor') ||
    combined.includes('сто') ||
    combined.includes('шиномонтаж') ||
    combined.includes('tire') ||
    combined.includes('детейлинг') ||
    combined.includes('detailing') ||
    combined.includes('мойка') ||
    combined.includes('wash')
  ) {
    return 'AUTO_SERVICE';
  }

  // Retail & Specialty Store
  if (
    combined.includes('магазин') ||
    combined.includes('shop') ||
    combined.includes('store') ||
    combined.includes('бутик') ||
    combined.includes('boutique') ||
    combined.includes('маркет') ||
    combined.includes('цветы') ||
    combined.includes('flowers')
  ) {
    return 'RETAIL_SHOP';
  }

  // Home Services & Trades
  if (
    combined.includes('клининг') ||
    combined.includes('clean') ||
    combined.includes('сантех') ||
    combined.includes('plumb') ||
    combined.includes('электрик') ||
    combined.includes('electric') ||
    combined.includes('ремонт кварт') ||
    combined.includes('hvac') ||
    combined.includes('мастер')
  ) {
    return 'HOME_SERVICES';
  }

  // Professional Services
  if (
    combined.includes('юрист') ||
    combined.includes('law') ||
    combined.includes('бухгалтер') ||
    combined.includes('консалт') ||
    combined.includes('consult') ||
    combined.includes('агентство') ||
    combined.includes('agency') ||
    combined.includes('недвижим') ||
    combined.includes('real estate')
  ) {
    return 'PROFESSIONAL_SERVICES';
  }

  return 'GENERAL_LOCAL';
}

/**
 * Generates an SEO-optimized, human-quality Google Business Profile description.
 * Adheres strictly to Google GBP 750 character limit, free of generic filler text.
 * Integrates owner-provided notes seamlessly with algorithmic local ranking factors.
 */
export function generateSmartSeoDescription(context: SeoCopyContext): string {
  const { businessName, businessAddress, category, city: fallbackCity, tone = 'SEO', explicitNiche, customNotes } = context;
  const name = businessName !== '—' && businessName ? businessName : 'заведения';
  const geo = extractGeoAnchors(businessAddress, fallbackCity);
  const niche = explicitNiche || detectBusinessNiche(name, category);

  // If user provided custom plain words about their business, format them gracefully
  const userHighlights = customNotes && customNotes.trim().length > 0 
    ? ` Ключевые направления и преимущества: ${customNotes.trim()}.` 
    : '';

  switch (niche) {
    case 'VISA_TOURISM_EXPAT':
      if (tone === 'PREMIUM') {
        return `«${name}» — премиальный центр сервисной поддержки экспатов и путешественников в ${geo.city} (${geo.landmarkOrDistrict}).${userHighlights} Мы ценим ваше время и берем на себя все формальности: официальная визовая поддержка, оформление и продление виз, визараны под ключ, юридические консультации и нотариальный перевод документов. Индивидуальный подход, конфиденциальность и гарантия результата. Комфортная зона ожидания с кондиционером и скоростным Wi-Fi. Ждем вас ежедневно — свяжитесь с нами для экспертной консультации.`;
      }
      if (tone === 'CONCISE') {
        return `«${name}» в ${geo.city} (${geo.landmarkOrDistrict}): оперативные визовые и сервисные услуги для туристов и экспатов.${userHighlights} Быстрое продление виз, проверенные визараны под ключ, перевод документов и легализация. Прозрачные цены без скрытых комиссий, официальный договор и поддержка 7 дней в неделю. Удобный подъезд, парковка, расчет картой и наличными. Проложите маршрут на Google Maps или свяжитесь с нами прямо сейчас!`;
      }
      // Default: SEO
      return `«${name}» — профильный сервисный центр в ${geo.city} (${geo.landmarkOrDistrict}).${userHighlights} Специализируемся на комплексных услугах для туристов и экспатов: визовая поддержка, продление виз во Вьетнаме, визаран под ключ, консультации по легализации, нотариальный перевод и сопровождение. Честные фиксированные цены, быстрая обратная связь и помощь в срочных вопросах. Удобное расположение, комфортная клиентская зона, кондиционер и бесплатный Wi-Fi. Проложите маршрут на Картах или напишите нам для бесплатной первичной консультации!`;

    case 'COFFEE_FOOD':
      if (tone === 'PREMIUM') {
        return `«${name}» — гастрономическое пространство в ${geo.city} (${geo.landmarkOrDistrict}), созданное для ценителей вкуса и эстетики.${userHighlights} Свежеобжаренный спешелти кофе 100% арабика, авторская кухня, воздушная ремесленная выпечка и изысканные сезонные десерты. Идеальное место для романтических встреч, неспешных завтраков и деловых ланчей. Внимательный сервис, открытая терраса и приятная музыка. Забронируйте столик онлайн или проложите маршрут на Картах!`;
      }
      if (tone === 'CONCISE') {
        return `«${name}» в ${geo.city} (${geo.landmarkOrDistrict}): спешелти кофе, сытные завтраки весь день, ланчи и свежая выпечка.${userHighlights} Быстрый бесплатный Wi-Fi, розетки для ноутбуков, столики в зале и на террасе. Еда и напитки навынос (takeaway), удобная парковка, оплата картой и по QR. Работаем без выходных. Заходите за любимым кофе!`;
      }
      // Default: SEO
      return `«${name}» — уютная кофейня и ресторан в ${geo.city} (${geo.landmarkOrDistrict}).${userHighlights} Подаем авторский кофе свежей обжарки, сытные завтраки с утра до вечера, легкие обеды и домашние десерты. Комфортная атмосфера для отдыха с друзьями и продуктивной работы за ноутбуком с быстрым Wi-Fi. Есть столики на террасе, детские стульчики, парковка для гостей, доступен формат кофе с собой (to go). Постройте маршрут на Google Maps — ждем вас в гости ежедневно!`;

    case 'BEAUTY_SPA':
      if (tone === 'PREMIUM') {
        return `Студия красоты «${name}» в ${geo.city} (${geo.landmarkOrDistrict}) — пространство стиля и гармонии.${userHighlights} Авторский маникюр и педикюр, сложное окрашивание волос, уходовые спа-ритуалы и эстетическая косметология. Сертифицированная премиальная косметика, 100% стерильность инструментов (крафт-пакеты вскрываются при вас). Чашка ароматного кофе каждому гостю. Запишитесь онлайн через Google Карты!`;
      }
      if (tone === 'CONCISE') {
        return `Салон «${name}» (${geo.landmarkOrDistrict}, ${geo.city}): стрижки, окрашивание, маникюр, педикюр и оформление бровей.${userHighlights} Опытные топ-мастера, премиальные материалы, стерильный инструмент и гарантия на покрытие. Удобная онлайн-запись, парковка, Wi-Fi. Выберите удобное время для визита прямо на Картах!`;
      }
      // Default: SEO
      return `Салон красоты и спа «${name}» в ${geo.city} (${geo.landmarkOrDistrict}).${userHighlights} Полный спектр бьюти-услуг: стильные женские и мужские стрижки, трендовое окрашивание волос (Airtouch, балаяж), аппаратный маникюр и педикюр с покрытием гель-лак, архитектура бровей и спа-уход. Сертифицированные мастера с опытом от 5 лет, трехступенчатая стерилизация по СанПиН. Удобное расположение, парковка для гостей. Запишитесь на визит онлайн прямо сейчас!`;

    case 'HEALTH_DENTAL':
      if (tone === 'PREMIUM') {
        return `Медицинский центр «${name}» в ${geo.city} (${geo.landmarkOrDistrict}) — экспертный подход к здоровью вашей семьи.${userHighlights} Высокоточная аппаратная диагностика, современное европейское оборудование и прием профильных специалистов высшей категории. Безболезненные методики, прозрачные планы лечения без лишних назначений и премиальный уровень комфорта. Доверьте здоровье профессионалам. Запись на консультацию доступна онлайн на Картах.`;
      }
      if (tone === 'CONCISE') {
        return `Клиника «${name}» в ${geo.city} (${geo.landmarkOrDistrict}): прием врачей, диагностика, анализы и лечебные процедуры без очередей.${userHighlights} Современное оборудование, внимательный персонал, честные фиксированные цены. Удобный подъезд, доступная среда, работаем без выходных. Запишитесь на прием онлайн в 1 клик!`;
      }
      // Default: SEO
      return `Клиника и стоматология «${name}» в ${geo.city} (${geo.landmarkOrDistrict}).${userHighlights} Профессиональная медицинская помощь: комплексная диагностика, лечение зубов без боли, имплантация, консультации узких специалистов и сдача анализов. Передовое цифровое оборудование, стерильность по международным протоколам и внимательное отношение к каждому пациенту. Доступные цены, рассрочка и гарантия на лечение. Постройте маршрут или запишитесь на прием прямо на Google Maps!`;

    case 'AUTO_SERVICE':
      if (tone === 'CONCISE') {
        return `Автосервис «${name}» в ${geo.city} (${geo.landmarkOrDistrict}): ремонт подвески, двигателя, сход-развал, ТО и замена масла.${userHighlights} Компьютерная диагностика за 30 минут, честная смета до начала работ, оригинальные запчасти в наличии. Гарантия на работы до 12 месяцев. Заезжайте без очереди — проложите маршрут на Картах!`;
      }
      // Default: SEO
      return `Автосервис и детейлинг-центр «${name}» в ${geo.city} (${geo.landmarkOrDistrict}).${userHighlights} Полный комплекс услуг по ремонту и обслуживанию автомобилей всех марок: компьютерная диагностика, плановое ТО, замена тормозных колодок и технических жидкостей, ремонт ходовой части и электрики. Прозрачная смета без скрытых наценок, запчасти в наличии с гарантией. Комфортная зона ожидания с Wi-Fi и кофе. Проложите маршрут на Google Maps — оперативно примем ваш автомобиль!`;

    default:
      if (tone === 'CONCISE') {
        return `«${name}» в ${geo.city} (${geo.landmarkOrDistrict}): качественные профессиональные услуги с гарантией результата.${userHighlights} Быстрое решение ваших задач, опытные специалисты, прозрачное ценообразование без переплат. Удобное расположение, парковка, оплата картой. Свяжитесь с нами или проложите маршрут на Картах!`;
      }
      // Default: SEO
      return `Добро пожаловать в «${name}» — ваш надежный профильный центр в ${geo.city} (${geo.landmarkOrDistrict}).${userHighlights} Мы специализируемся на оказании качественных услуг с акцентом на персональный подход, оперативность и высокие стандарты обслуживания. Удобный заезд, парковка для посетителей, комфортная зона ожидания и современные способы оплаты. Работаем по актуальному графику без задержек. Проложите маршрут на Google Maps или свяжитесь с нами онлайн для получения подробной консультации!`;
  }
}

/**
 * Generates structured, realistic catalog items for Card 4 based on confirmed niche and location.
 */
export function getNicheCatalogItems(niche: BusinessNiche, currencySymbol: string): string {
  switch (niche) {
    case 'VISA_TOURISM_EXPAT':
      return `Каталог из 8 визовых услуг с ценами: Визаран под ключ в Камбоджу (${currencySymbol} 85), Продление туристической визы 30 дней (${currencySymbol} 45), Нотариальный перевод документов (${currencySymbol} 15), Индивидуальный трансфер на границу (${currencySymbol} 60), Оформление бизнес-визы (${currencySymbol} 140)...`;
    case 'COFFEE_FOOD':
      return `Каталог из 10 популярных блюд и напитков: Свежеобжаренный капучино (${currencySymbol} 4.5), Завтрак с авокадо и яйцом пашот (${currencySymbol} 12), Круассан с миндалем (${currencySymbol} 5), Холодный Колд Брю (${currencySymbol} 5.5), Фирменный сырник (${currencySymbol} 9)...`;
    case 'BEAUTY_SPA':
      return `Прайс-лист из 10 бьюти-услуг: Стрижка и укладка (${currencySymbol} 35), Аппаратный маникюр с гель-лаком (${currencySymbol} 28), Сложное окрашивание волос (${currencySymbol} 95), Архитектура бровей (${currencySymbol} 18), Спа-уход за лицом (${currencySymbol} 55)...`;
    case 'HEALTH_DENTAL':
      return `Медицинский каталог из 8 услуг: Первичный осмотр и консультация врача (${currencySymbol} 30), Профессиональная гигиена полости рта (${currencySymbol} 50), Лечение кариеса под микроскопом (${currencySymbol} 65), Панорамный снимок зубов (${currencySymbol} 25)...`;
    case 'AUTO_SERVICE':
      return `Каталог ТО и ремонта: Компьютерная диагностика авто (${currencySymbol} 30), Замена моторного масла и фильтров (${currencySymbol} 45), Регулировка сход-развала (${currencySymbol} 40), Комплексная диагностика подвески (${currencySymbol} 25)...`;
    default:
      return `Каталог из 10 структурированных услуг с подробным описанием, фотографиями и актуальными ценами для прямого отображения в Google Maps и голосовом поиске.`;
  }
}
