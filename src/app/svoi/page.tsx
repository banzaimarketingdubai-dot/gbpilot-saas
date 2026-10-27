'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Phone,
  Instagram,
  Send,
  Coffee,
  Heart,
  Wifi,
  Wind,
  Sparkles,
  Calendar,
  Utensils,
  ExternalLink,
  ChevronRight,
  Globe,
  Check,
  Star,
  Users,
  Compass,
  ArrowUpRight,
  X,
  Share2,
  ShoppingBag
} from 'lucide-react';

type Language = 'ru' | 'en';

export default function SvoiCafeLanding() {
  const [lang, setLang] = useState<Language>('ru');
  const [activeMenuTab, setActiveMenuTab] = useState<'breakfast' | 'comfort' | 'coffee' | 'tea'>('breakfast');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('svoi_lang') as Language;
    if (saved && (saved === 'ru' || saved === 'en')) {
      setLang(saved);
    }
  }, []);

  const switchLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('svoi_lang', newLang);
  };

  const t = {
    ru: {
      navAbout: 'О нас',
      navMenu: 'Меню',
      navEvents: 'События',
      navGallery: 'Галерея',
      navInsta: 'Instagram',
      navContacts: 'Контакты',
      navRoute: 'Как добраться',
      tagline: 'Там, где встречаются люди и смыслы',
      heroTitle: 'Кафе «СВОИ» в Нячанге',
      heroSubtitle: 'Уютное пространство спешелти кофе, домашней кухни, авторских десертов и теплых встреч. Место на севере Нячанга, куда хочется возвращаться.',
      ctaDirections: 'Построить маршрут в Google Maps',
      ctaMenu: 'Смотреть меню',
      quickAddress: '58 Cao Văn Bé, Bắc Nha Trang, 650000',
      quickHours: 'Ежедневно 08:00 – 21:00',
      features: {
        coffee: 'Спешелти кофе',
        coffeeDesc: 'Свежая обжарка, альтернативные методы заваривания и классика',
        food: 'Домашняя кухня',
        foodDesc: 'Пельмени ручной лепки, сырники, борщ и свежая выпечка каждый день',
        wifi: 'Коворкинг & Wi-Fi',
        wifiDesc: 'Высокоскоростной оптоволоконный интернет, розетки и кондиционер',
        community: 'Теплые события',
        communityDesc: 'Чайные церемонии, пельменные вечеринки, кинопоказы и разговорные клубы',
      },
      aboutTitle: 'Пространство для своих',
      aboutLead: 'Мы создали «СВОИ» не просто как кофейню, а как дом вдали от дома для жителей и гостей Нячанга.',
      aboutText1: 'Здесь аромат свежесваренного кофе и выпечки соединяется с живым общением. Мы варим спешелти кофе, готовим любимые с детства домашние блюда из натуральных продуктов и печем десерты по авторским рецептам.',
      aboutText2: 'В «Своих» одинаково комфортно поработать с ноутбуком в прохладном зале с быстрым Wi-Fi, провести неспешный вечер с книгой или собраться большой компанией на настольные игры и кино.',
      eventsTitle: 'События и встречи',
      eventsSubtitle: 'Каждую неделю мы собираемся вместе, чтобы делиться историями, учиться новому и наполнять вечера смыслом.',
      menuTitle: 'Наше меню',
      menuSubtitle: 'Готовим с любовью и вниманием к каждой детали. Только свежие ингредиенты и проверенные рецепты.',
      menuTabs: {
        breakfast: 'Завтраки & Десерты',
        comfort: 'Домашняя кухня',
        coffee: 'Спешелти кофе & Напитки',
        tea: 'Чайная карта',
      },
      instaTitle: 'Мы в Instagram',
      instaSubtitle: 'Следите за нашими анонсами, закулисьем кухни и теплыми моментами каждого дня',
      instaHandle: '@svoi_nhatrang',
      instaBio: 'СВОИ 🤍 Там, где встречаются люди и смыслы • Нячанг, Вьетнам',
      instaFollow: 'Подписаться в Instagram',
      galleryTitle: 'Атмосфера «СВОИХ»',
      gallerySubtitle: 'Кадры нашего кафе, гостей, десертов и уютных уголков',
      locationTitle: 'Как нас найти',
      locationSubtitle: 'Северный район Нячанга, 3 минуты от моря и набережной',
      addressLabel: 'Адрес заведения',
      hoursLabel: 'Часы работы',
      openEveryday: 'Понедельник – Воскресенье (без выходных)',
      amenitiesLabel: 'Удобства в кафе',
      amenitiesList: [
        'Бесплатный высокоскоростной Wi-Fi (150+ Мбит/с)',
        'Кондиционированный прохладный зал',
        'Уютная открытая терраса с зеленью',
        'Pet-friendly (всегда рады воспитанным питомцам)',
        'Парковка для байков прямо перед входом',
        'Безналичная оплата картами и переводами'
      ],
      footerNote: 'Официальный сайт Кафе «СВОИ» (Cafe SVOI Nha Trang). Подтвержденный профиль Google Карты.',
      rights: 'Все права защищены.',
      openInMaps: 'Открыть в приложении Google Карты',
      closeModal: 'Закрыть',
      orderFood: 'Заказать еду',
      orderOnline: 'Заказ онлайн',
      orderDelivery: 'Доставка еды',
      orderBannerTitle: 'Доставка любимых блюд прямо к вам',
      orderBannerSubtitle: 'Фермерские сырники, сочные пельмени ручной лепки, домашний борщ, свежая выпечка и кофе с быстрой доставкой по Нячангу через REVOO.',
      orderBannerCta: 'Заказать онлайн в REVOO',
    },
    en: {
      navAbout: 'About Us',
      navMenu: 'Menu',
      navEvents: 'Events',
      navGallery: 'Gallery',
      navInsta: 'Instagram',
      navContacts: 'Contacts',
      navRoute: 'Directions',
      tagline: 'Where people and meanings meet',
      heroTitle: 'SVOI Cafe in Nha Trang',
      heroSubtitle: 'A cozy haven for specialty coffee, homemade comfort food, artisan pastries, and heartfelt gatherings in North Nha Trang.',
      ctaDirections: 'Get Directions on Google Maps',
      ctaMenu: 'Explore Menu',
      quickAddress: '58 Cao Van Be, North Nha Trang, 650000',
      quickHours: 'Open Daily 08:00 AM – 09:00 PM',
      features: {
        coffee: 'Specialty Coffee',
        coffeeDesc: 'Locally & internationally sourced specialty beans, manual pour-overs & classics',
        food: 'Comfort Kitchen',
        foodDesc: 'Handcrafted dumplings, syrniki, hot soups, and fresh daily bakery',
        wifi: 'Coworking & Wi-Fi',
        wifiDesc: 'Ultra-fast fiber internet, convenient power outlets & AC cooling',
        community: 'Warm Gatherings',
        communityDesc: 'Traditional tea ceremonies, dumpling nights, movie screenings & speaking clubs',
      },
      aboutTitle: 'A Space to Feel at Home',
      aboutLead: 'We founded SVOI not just as a coffee shop, but as a genuine home away from home in Nha Trang.',
      aboutText1: 'Here, the aroma of specialty coffee and freshly baked goods blends with authentic conversations. We prepare beloved home-style dishes from wholesome ingredients and craft delicious desserts from scratch.',
      aboutText2: 'Whether you need a productive workspace with fast Wi-Fi and air conditioning, a quiet afternoon with a good book, or an evening with friends playing board games, SVOI is your place.',
      eventsTitle: 'Events & Community',
      eventsSubtitle: 'Every week we gather to share stories, taste rare teas, cook together, and enjoy meaningful moments.',
      menuTitle: 'Our Menu',
      menuSubtitle: 'Crafted with genuine love and attention to detail. Wholesome ingredients and time-honored recipes.',
      menuTabs: {
        breakfast: 'Breakfast & Bakery',
        comfort: 'Comfort Food',
        coffee: 'Specialty Coffee & Drinks',
        tea: 'Artisanal Tea',
      },
      instaTitle: 'Follow Us on Instagram',
      instaSubtitle: 'Stay updated with weekly schedules, behind-the-scenes stories, and cozy daily vibes',
      instaHandle: '@svoi_nhatrang',
      instaBio: 'SVOI 🤍 Where people and meanings meet • Nha Trang, Vietnam',
      instaFollow: 'Follow on Instagram',
      galleryTitle: 'Vibes of SVOI',
      gallerySubtitle: 'Snapshots of our interior, beloved guests, artisan drinks, and cozy corners',
      locationTitle: 'How to Find Us',
      locationSubtitle: 'North Nha Trang, just a 3-minute walk from the coastal promenade',
      addressLabel: 'Address',
      hoursLabel: 'Opening Hours',
      openEveryday: 'Monday – Sunday (7 days a week)',
      amenitiesLabel: 'Cafe Amenities',
      amenitiesList: [
        'Free high-speed fiber Wi-Fi (150+ Mbps)',
        'Full air conditioning inside',
        'Shaded lush green outdoor terrace',
        'Pet-friendly environment',
        'Free motorbike parking at the entrance',
        'Card and digital transfers accepted'
      ],
      footerNote: 'Official website of SVOI Cafe (Cafe SVOI Nha Trang). Verified Google Business Profile listing.',
      rights: 'All rights reserved.',
      openInMaps: 'Open in Google Maps App',
      closeModal: 'Close',
      orderFood: 'Order Food',
      orderOnline: 'Order Online',
      orderDelivery: 'Food Delivery',
      orderBannerTitle: 'Get Your Favorite Dishes Delivered',
      orderBannerSubtitle: 'Farm cottage cheese syrniki, juicy handmade dumplings, homemade soups, fresh pastries and specialty coffee delivered fast in Nha Trang via REVOO.',
      orderBannerCta: 'Order Online via REVOO',
    }
  };

  const current = t[lang];

  const menuItems = {
    breakfast: [
      {
        nameRu: 'Сырники из фермерского творога',
        nameEn: 'Farm Cottage Cheese Syrniki',
        descRu: 'Нежные домашние сырники со сметаной и ягодным кули из свежих ягод',
        descEn: 'Tender homemade cottage cheese pancakes served with sour cream & berry coulis',
        price: '95 000 ₫',
        badge: 'Top Choice'
      },
      {
        nameRu: 'Круассан классический с маслом',
        nameEn: 'Fresh Butter Croissant',
        descRu: 'Слоеный круассан свежей утренней выпечки с натуральным сливочным маслом и джемом',
        descEn: 'Freshly baked flaky butter croissant served with natural butter and fruit preserves',
        price: '45 000 ₫',
      },
      {
        nameRu: 'Тост с авокадо и яйцом пашот',
        nameEn: 'Avocado Toast & Poached Egg',
        descRu: 'Хрустящий ремесленный хлеб, спелое авокадо, яйцо пашот, микс семян и микрозелень',
        descEn: 'Artisan sourdough toast, crushed ripe avocado, poached egg, seed mix & microgreens',
        price: '110 000 ₫',
      },
      {
        nameRu: 'Овсяная каша на кокосовом молоке',
        nameEn: 'Creamy Coconut Oatmeal',
        descRu: 'С карамелизированным бананом, орехами кешью и каплей натурального меда',
        descEn: 'Cooked with rich coconut milk, topped with caramelized banana, cashews & wild honey',
        price: '75 000 ₫',
      },
      {
        nameRu: 'Фирменный чизкейк «СВОИ»',
        nameEn: 'Signature SVOI Cheesecake',
        descRu: 'Запеченный баскский чизкейк с нежной кремовой сердцевиной и ванилью',
        descEn: 'Baked Basque-style cheesecake with a silky creamy center and Madagascar vanilla',
        price: '85 000 ₫',
        badge: 'Specialty'
      }
    ],
    comfort: [
      {
        nameRu: 'Пельмени ручной лепки со сметаной',
        nameEn: 'Handmade Pelmeni (Dumplings)',
        descRu: 'Традиционные сочные пельмени с мясной начинкой, сливочным маслом, зеленью и сметаной',
        descEn: 'Classic juicy handmade dumplings stuffed with savory meat, butter, fresh dill & sour cream',
        price: '115 000 ₫',
        badge: 'House Special'
      },
      {
        nameRu: 'Борщ домашний с чесночной булочкой',
        nameEn: 'Traditional Comfort Borscht',
        descRu: 'Наваристый свекольный суп с нежной говядиной, свежей зеленью, густой сметаной и пампушкой',
        descEn: 'Rich ruby-red beet soup with slow-cooked beef, fresh herbs, sour cream and garlic bun',
        price: '120 000 ₫',
        badge: 'Guest Favorite'
      },
      {
        nameRu: 'Вареники с картофелем и грибами',
        nameEn: 'Vareniki with Potato & Mushrooms',
        descRu: 'Домашние вареники с начинкой из картофеля и лесных грибов, подаются с жареным луком',
        descEn: 'Hand-pinched dumplings with potato and mushroom filling, topped with caramelized onions',
        price: '95 000 ₫',
      },
      {
        nameRu: 'Паста Карбонара со сливками и пармезаном',
        nameEn: 'Pasta Carbonara',
        descRu: 'Паста аль денте, обжаренный бекон, сливочно-сырный соус и выдержанный пармезан',
        descEn: 'Al dente spaghetti, crispy bacon, creamy egg sauce and aged parmesan',
        price: '130 000 ₫',
      },
      {
        nameRu: 'Теплый салат с хрустящими баклажанами',
        nameEn: 'Warm Crispy Eggplant Salad',
        descRu: 'Хрустящие баклажаны в сладком чили соусе, спелые томаты, кинза и кунжут',
        descEn: 'Crunchy golden eggplants in sweet chili glaze, ripe sweet tomatoes, cilantro & sesame',
        price: '90 000 ₫',
      }
    ],
    coffee: [
      {
        nameRu: 'Капучино / Флэт Уайт (Спешелти)',
        nameEn: 'Specialty Cappuccino / Flat White',
        descRu: 'Двойной эспрессо из отборной арабики со шелковистой молочной пеной',
        descEn: 'Double espresso pulled from high-altitude Arabica with silky microfoam milk',
        price: '50 000 ₫',
      },
      {
        nameRu: 'Вьетнамский кофе с молоком (Cà Phê Sữa Đá)',
        nameEn: 'Traditional Vietnamese Iced Coffee',
        descRu: 'Традиционное заваривание через фин, плотный насыщенный вкус со сгущенным молоком и льдом',
        descEn: 'Classic phin drip brew, rich bold roast balanced with sweetened condensed milk and ice',
        price: '35 000 ₫',
        badge: 'Local Classic'
      },
      {
        nameRu: 'V60 Pour-Over / Фильтр кофе',
        nameEn: 'V60 Pour-Over Specialty Brew',
        descRu: 'Зерно моносорт светлой обжарки, раскрывающее цветочные и ягодные ноты',
        descEn: 'Single-origin light roast highlighting delicate floral and stone fruit notes',
        price: '60 000 ₫',
      },
      {
        nameRu: 'Кокосовый кофе фраппе (Cà Phê Cốt Dừa)',
        nameEn: 'Coconut Coffee Slushie',
        descRu: 'Холодный взбитый крем из кокосового молока со свежим шотом эспрессо',
        descEn: 'Whipped chilled coconut milk smoothie topped with a bold shot of dark roast espresso',
        price: '55 000 ₫',
        badge: 'Refreshing'
      },
      {
        nameRu: 'Матча Латте на кокосовом молоке',
        nameEn: 'Artisanal Coconut Matcha Latte',
        descRu: 'Церемониальная зеленая матча с нежным кокосовым молоком',
        descEn: 'Ceremonial grade Japanese green matcha whisked with velvety warm coconut milk',
        price: '65 000 ₫',
      }
    ],
    tea: [
      {
        nameRu: 'Чайная церемония (Чайник на компанию)',
        nameEn: 'Traditional Tea Ceremony Pot',
        descRu: 'Коллекционный улун Да Хун Пао, Те Гуань Инь или выдержанный пуэр в глиняной посуде',
        descEn: 'Collection Oolong (Da Hong Pao / Tie Guan Yin) or aged Pu-erh steeped in clay teaware',
        price: '70 000 ₫',
        badge: 'Signature'
      },
      {
        nameRu: 'Облепиховый чай с розмарином и апельсином',
        nameEn: 'Sea Buckthorn & Rosemary Tea',
        descRu: 'Натуральное пюре облепихи, свежий розмарин, слайсы апельсина и цветочный мед',
        descEn: 'Wild sea buckthorn berries, fresh rosemary sprig, orange slices and floral honey',
        price: '65 000 ₫',
      },
      {
        nameRu: 'Имбирно-лимонный согревающий сбор',
        nameEn: 'Fresh Ginger Lemon Warming Tea',
        descRu: 'Свежий корень имбиря, сок лайма, мята и бадьян',
        descEn: 'Fresh root ginger, freshly squeezed lime, crushed mint leaves and star anise',
        price: '55 000 ₫',
      },
      {
        nameRu: 'Вьетнамский горный зеленый чай Thái Nguyên',
        nameEn: 'Thai Nguyen Vietnamese Mountain Green Tea',
        descRu: 'Освежающий терпкий чай с высокогорных плантаций северного Вьетнама',
        descEn: 'Crisp, antioxidant-rich green tea from the misty highlands of Northern Vietnam',
        price: '40 000 ₫',
      }
    ]
  };

  const events = [
    {
      titleRu: 'Чайная церемония в «Своих»',
      titleEn: 'Tea Ceremony at SVOI',
      timeRu: 'Каждую неделю • Участие за донат',
      timeEn: 'Weekly • Donation based',
      descRu: 'Пробуем редкие сорта коллекционного чая, говорим об их тонкостях, делимся историями и проводим неспешный чайный день в теплой компании.',
      descEn: 'Tasting rare collection teas, discussing their origins, sharing meaningful stories, and enjoying an unhurried, mindful afternoon together.',
      tagRu: 'Чай & Беседы',
      tagEn: 'Tea & Mindfulness',
      image: '/images/svoi/post_tea.png'
    },
    {
      titleRu: 'Август в «Своих» / Расписание встреч',
      titleEn: 'Monthly Community Gatherings',
      timeRu: 'Понедельник, Среда, Суббота',
      timeEn: 'Monday, Wednesday, Saturday',
      descRu: 'Пельменные вечеринки с кинопоказами, трансформационные игры, музыкально-поэтические вечера и разговорный английский Cozy English.',
      descEn: 'Handmade dumpling making with movie night, psychological games, live acoustic poetry, and relaxed English speaking sessions.',
      tagRu: 'Комьюнити',
      tagEn: 'Community',
      image: '/images/svoi/post_august.png'
    },
    {
      titleRu: 'Пельменная вечеринка & Большой экран',
      titleEn: 'Dumpling Night & Movie',
      timeRu: 'Понедельник • 18:00',
      timeEn: 'Mondays • 06:00 PM',
      descRu: 'Лепим пельмени вместе по домашним рецептам, варим их, дружно ужинаем и смотрим доброе кино на большом проекторе.',
      descEn: 'We fold fresh dumplings together from scratch, boil them fresh, have dinner together, and watch classic cinema on our big screen.',
      tagRu: 'Кулинарный вечер',
      tagEn: 'Culinary Evening',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80'
    },
    {
      titleRu: 'Музыкально-поэтический вечер',
      titleEn: 'Live Acoustic & Poetry Night',
      timeRu: 'Суббота • 19:00 • Вход свободный',
      timeEn: 'Saturday • 07:00 PM • Free entry',
      descRu: 'Живая акустическая музыка, стихи, творчество, мерцание свечей и неповторимая душевная атмосфера Нячанга.',
      descEn: 'Acoustic live guitars, heartfelt poetry, candlelit ambiance, and the authentic warmth of our local community.',
      tagRu: 'Живая музыка',
      tagEn: 'Live Music',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const galleryImages = [
    {
      src: '/images/svoi/post_tea.png',
      titleRu: 'Чайная церемония и керамика ручной работы',
      titleEn: 'Tea ceremony with handmade artisan ceramics',
      category: 'tea'
    },
    {
      src: '/images/svoi/post_august.png',
      titleRu: 'Афиша мероприятий и теплая атмосфера',
      titleEn: 'Events schedule & cozy vibes',
      category: 'events'
    },
    {
      src: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      titleRu: 'Спешелти капучино в керамической чашке',
      titleEn: 'Specialty cappuccino in rustic ceramic cup',
      category: 'coffee'
    },
    {
      src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
      titleRu: 'Уютный светлый интерьер и зеленые растения',
      titleEn: 'Cozy pastel interior with lush houseplants',
      category: 'interior'
    },
    {
      src: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
      titleRu: 'Свежая утренняя выпечка и круассаны',
      titleEn: 'Fresh morning bakery & flaky croissants',
      category: 'food'
    },
    {
      src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
      titleRu: 'Альтернативное заваривание V60 pour-over',
      titleEn: 'V60 manual pour-over specialty coffee',
      category: 'coffee'
    },
    {
      src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
      titleRu: 'Авторские домашние десерты и тарты',
      titleEn: 'Artisan desserts and fresh fruit tarts',
      category: 'food'
    },
    {
      src: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80',
      titleRu: 'Японская церемониальная матча',
      titleEn: 'Ceremonial Japanese matcha blend',
      category: 'tea'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2C221E] font-sans selection:bg-[#EAE1D3] selection:text-[#2C221E]">
      {/* Schema.org Microdata for Google Business Profile verification */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['CafeOrCoffeeShop', 'Restaurant'],
            name: 'Кафе СВОИ | Cafe SVOI Nha Trang',
            alternateName: 'SVOI Cafe',
            image: 'https://svoi.gbpilot.top/images/svoi/post_tea.png',
            telephone: '+84 90 000 0000',
            url: 'https://svoi.gbpilot.top',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '58 Cao Văn Bé',
              addressLocality: 'Nha Trang',
              addressRegion: 'Khánh Hòa',
              postalCode: '650000',
              addressCountry: 'VN'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 12.2748,
              longitude: 109.2012
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday'
                ],
                opens: '08:00',
                closes: '21:00'
              }
            ],
            servesCuisine: ['European', 'Russian', 'Coffee', 'Bakery', 'Specialty Tea'],
            priceRange: '$$',
            paymentAccepted: 'Cash, Credit Card, Bank Transfer',
            sameAs: [
              'https://www.instagram.com/svoi_nhatrang',
              'https://maps.google.com/?q=58+Cao+Van+Be,+Nha+Trang'
            ]
          })
        }}
      />

      {/* Top Banner / Announcements */}
      <div className="bg-[#F3ECE2] border-b border-[#E8DFD5] px-4 py-2 text-xs text-[#5F554E] text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#B8684A]" />
        <span>
          {lang === 'ru'
            ? 'Ждем вас в гости в Нячанге: ул. Cao Văn Bé, 58 • Ежедневно с 08:00 до 21:00'
            : 'Welcome to SVOI in Nha Trang: 58 Cao Van Be • Open daily from 08:00 AM to 09:00 PM'}
        </span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#ECE3D8] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#EFE8DC] border border-[#DDD3C4] flex items-center justify-center text-[#2C221E] shadow-sm group-hover:bg-[#EAE1D3] transition-colors">
              <span className="font-serif font-black text-lg tracking-wider">СВ</span>
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-[#2C221E] flex items-center gap-1.5">
                СВОИ
                <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-[#EAE1D3] text-[#5F554E] uppercase tracking-wider">
                  Nha Trang
                </span>
              </div>
              <p className="text-[11px] text-[#7E7268] font-sans tracking-wide">
                {lang === 'ru' ? 'Кафе & Пространство смыслов' : 'Cafe & Community Hub'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5F554E]">
            <a href="#about" className="hover:text-[#2C221E] transition-colors">{current.navAbout}</a>
            <a href="#menu" className="hover:text-[#2C221E] transition-colors">{current.navMenu}</a>
            <a href="#events" className="hover:text-[#2C221E] transition-colors">{current.navEvents}</a>
            <a href="#gallery" className="hover:text-[#2C221E] transition-colors">{current.navGallery}</a>
            <a href="#instagram" className="hover:text-[#2C221E] transition-colors">{current.navInsta}</a>
            <a href="#location" className="hover:text-[#2C221E] transition-colors">{current.navContacts}</a>
          </nav>

          {/* Right Actions: Lang Switcher & Map CTA */}
          <div className="flex items-center gap-3">
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-[#EFE8DC] p-1 rounded-full border border-[#DDD3C4] text-xs font-semibold">
              <button
                onClick={() => switchLang('ru')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  lang === 'ru'
                    ? 'bg-white text-[#2C221E] shadow-sm'
                    : 'text-[#7E7268] hover:text-[#2C221E]'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => switchLang('en')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  lang === 'en'
                    ? 'bg-white text-[#2C221E] shadow-sm'
                    : 'text-[#7E7268] hover:text-[#2C221E]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Order Food CTA Button */}
            <a
              href="https://revoo.win/?v=deCg3Rq1oTawHoOImnoj&source=google_maps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#B8684A] text-white text-xs font-semibold hover:bg-[#A3593D] transition-all shadow-sm hover:shadow"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{current.orderOnline}</span>
            </a>

            {/* Directions Button */}
            <a
              href="https://maps.google.com/?q=58+Cao+Van+Be,+Nha+Trang,+Vietnam"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2C221E] text-[#FBF9F5] text-xs font-semibold hover:bg-[#43342D] transition-colors shadow-sm"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{current.navRoute}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#ECE3D8]">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#F3ECE2] blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-[#EAE1D3] blur-3xl opacity-40 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE8DC] border border-[#DDD3C4] text-xs font-medium text-[#5F554E]">
                <Heart className="w-3.5 h-3.5 text-[#B8684A] fill-[#B8684A]" />
                <span>{current.tagline}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2C221E] leading-[1.15]">
                {current.heroTitle}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#5F554E] leading-relaxed max-w-xl">
                {current.heroSubtitle}
              </p>

              {/* Quick Info Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#5F554E] pt-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8DFD5] shadow-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#B8684A]" />
                  <span>{current.quickAddress}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8DFD5] shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-[#61745E]" />
                  <span>{current.quickHours}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3">
                <a
                  href="https://revoo.win/?v=deCg3Rq1oTawHoOImnoj&source=google_maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#B8684A] text-white text-sm font-semibold hover:bg-[#A3593D] transition-all shadow-md hover:shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4 text-[#FBF9F5]" />
                  <span>{current.orderFood}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-80" />
                </a>

                <a
                  href="https://maps.google.com/?q=58+Cao+Van+Be,+Nha+Trang,+Vietnam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#2C221E] text-white text-sm font-medium hover:bg-[#43342D] transition-all shadow-md hover:shadow-lg"
                >
                  <MapPin className="w-4 h-4 text-[#EAE1D3]" />
                  <span>{current.ctaDirections}</span>
                </a>

                <a
                  href="#menu"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white border border-[#DCD1C2] text-[#2C221E] text-sm font-medium hover:bg-[#F5EFEB] transition-colors"
                >
                  <Utensils className="w-4 h-4 text-[#B8684A]" />
                  <span>{current.ctaMenu}</span>
                </a>
              </div>
            </div>

            {/* Right Visual Grid */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Main Card with real Instagram post image */}
                <div className="rounded-3xl overflow-hidden bg-white p-3 shadow-xl border border-[#ECE3D8] transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#EFE8DC]">
                    <img
                      src="/images/svoi/post_tea.png"
                      alt="Кафе СВОИ Чайная церемония Нячанг"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                      <span className="text-[11px] uppercase tracking-wider text-[#EAE1D3] font-semibold">
                        {lang === 'ru' ? 'Атмосфера Своих' : 'Svoi Atmosphere'}
                      </span>
                      <h4 className="font-serif text-lg font-bold">
                        {lang === 'ru' ? 'Чайная церемония и душевные разговоры' : 'Tea ceremony & warm conversations'}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Floating mini card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-[#E8DFD5] max-w-[210px] transform -rotate-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#2C221E]">
                    <Coffee className="w-4 h-4 text-[#B8684A]" />
                    <span>Specialty Coffee &amp; Tea</span>
                  </div>
                  <p className="text-[11px] text-[#7E7268] mt-1">
                    {lang === 'ru' ? '100% арабика, авторские чаи и свежая выпечка' : '100% Arabica, artisan teas & daily bakery'}
                  </p>
                </div>

                {/* Floating round badge */}
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-[#61745E] text-[#FBF9F5] flex flex-col items-center justify-center p-2 text-center shadow-lg border-2 border-white transform rotate-6">
                  <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">Cafe</span>
                  <span className="font-serif font-black text-xs">СВОИ</span>
                  <span className="text-[9px] opacity-80">Nha Trang</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights / Features Row */}
      <section className="py-14 bg-white border-b border-[#ECE3D8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#EAE1D3] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#EFE8DC] flex items-center justify-center text-[#B8684A]">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#2C221E]">{current.features.coffee}</h3>
              <p className="text-xs text-[#5F554E] leading-relaxed">{current.features.coffeeDesc}</p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#EAE1D3] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#EFE8DC] flex items-center justify-center text-[#B8684A]">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#2C221E]">{current.features.food}</h3>
              <p className="text-xs text-[#5F554E] leading-relaxed">{current.features.foodDesc}</p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#EAE1D3] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#EFE8DC] flex items-center justify-center text-[#61745E]">
                <Wifi className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#2C221E]">{current.features.wifi}</h3>
              <p className="text-xs text-[#5F554E] leading-relaxed">{current.features.wifiDesc}</p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#EAE1D3] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#EFE8DC] flex items-center justify-center text-[#61745E]">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#2C221E]">{current.features.community}</h3>
              <p className="text-xs text-[#5F554E] leading-relaxed">{current.features.communityDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 border-b border-[#ECE3D8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual with Schedule Card */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden bg-white p-3 shadow-xl border border-[#ECE3D8]">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#EFE8DC]">
                    <img
                      src="/images/svoi/post_august.png"
                      alt="Август в СВОИХ Мероприятия и встречи Нячанг"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-[#61745E] text-white p-4 rounded-2xl shadow-lg text-xs space-y-1 max-w-[200px]">
                  <div className="font-serif font-bold text-sm">
                    {lang === 'ru' ? 'Место встреч' : 'Meeting Place'}
                  </div>
                  <p className="opacity-90 leading-relaxed text-[11px]">
                    {lang === 'ru' ? 'Кино, музыка, настолки и уютные вечера' : 'Movies, music, board games & cozy evenings'}
                  </p>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B8684A]">
                <Heart className="w-3.5 h-3.5 fill-[#B8684A]" />
                <span>{lang === 'ru' ? 'О нашем пространстве' : 'About Our Space'}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C221E] leading-tight">
                {current.aboutTitle}
              </h2>

              <p className="text-lg text-[#2C221E] font-medium leading-relaxed">
                {current.aboutLead}
              </p>

              <div className="space-y-4 text-sm text-[#5F554E] leading-relaxed">
                <p>{current.aboutText1}</p>
                <p>{current.aboutText2}</p>
              </div>

              {/* Quote pill */}
              <div className="p-4 rounded-2xl bg-[#EFE8DC]/60 border-l-4 border-[#B8684A] text-xs text-[#4A3D34] italic">
                {lang === 'ru'
                  ? '«СВОИ — это не просто выпить кофе, это почувствовать заботу, найти друзей и остаться подольше.»'
                  : '"SVOI is not just about grabbing coffee — it is about feeling cared for, making friends, and wanting to stay a little longer."'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-white border-b border-[#ECE3D8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B8684A]">
              <Utensils className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Кухня & Кофе' : 'Kitchen & Coffee'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C221E]">
              {current.menuTitle}
            </h2>
            <p className="text-sm text-[#5F554E]">
              {current.menuSubtitle}
            </p>
          </div>

          {/* Menu Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {(['breakfast', 'comfort', 'coffee', 'tea'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveMenuTab(tab)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activeMenuTab === tab
                    ? 'bg-[#2C221E] text-white shadow-md'
                    : 'bg-[#FBF9F5] text-[#5F554E] hover:bg-[#EFE8DC] border border-[#E8DFD5]'
                }`}
              >
                {current.menuTabs[tab]}
              </button>
            ))}
          </div>

          {/* Menu Items List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {menuItems[activeMenuTab].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#EAE1D3] hover:border-[#DCD1C2] transition-colors flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif font-bold text-base text-[#2C221E]">
                      {lang === 'ru' ? item.nameRu : item.nameEn}
                    </h3>
                    <span className="font-mono font-bold text-sm text-[#B8684A] whitespace-nowrap">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-xs text-[#5F554E] leading-relaxed">
                    {lang === 'ru' ? item.descRu : item.descEn}
                  </p>
                </div>

                {item.badge && (
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFE8DC] text-[#4A3D34] border border-[#DDD3C4]">
                      {item.badge}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Online Delivery CTA Banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#F5EFEB] border border-[#E3DACD] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B8684A]">
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'ru' ? 'Онлайн-заказ & Доставка' : 'Online Order & Delivery'}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2C221E]">
                {current.orderBannerTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#5F554E] max-w-xl leading-relaxed">
                {current.orderBannerSubtitle}
              </p>
            </div>
            <a
              href="https://revoo.win/?v=deCg3Rq1oTawHoOImnoj&source=google_maps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-[#B8684A] text-white text-xs sm:text-sm font-bold hover:bg-[#A3593D] transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{current.orderBannerCta}</span>
              <ArrowUpRight className="w-4 h-4 opacity-80" />
            </a>
          </div>

          {/* Menu footer hint */}
          <div className="text-center mt-10 text-xs text-[#7E7268]">
            {lang === 'ru'
              ? '* Полное меню с напитками, десертами и сезонными новинками доступно в кафе. Спросите бариста о десертах дня!'
              : '* Full daily menu with seasonal drinks and fresh daily pastries is available in the cafe. Ask our barista for today’s specials!'}
          </div>
        </div>
      </section>

      {/* Events & Community Section */}
      <section id="events" className="py-20 border-b border-[#ECE3D8] bg-[#FAF6F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#61745E]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Жизнь сообщества' : 'Community Life'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C221E]">
              {current.eventsTitle}
            </h2>
            <p className="text-sm text-[#5F554E]">
              {current.eventsSubtitle}
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((ev, idx) => (
              <div
                key={idx}
                className="rounded-2xl overflow-hidden bg-white border border-[#E8DFD5] shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-[#EFE8DC] overflow-hidden">
                  <img
                    src={ev.image}
                    alt={ev.titleRu}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#2C221E]/80 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    {lang === 'ru' ? ev.tagRu : ev.tagEn}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-[#B8684A] block">
                      {lang === 'ru' ? ev.timeRu : ev.timeEn}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#2C221E] leading-snug">
                      {lang === 'ru' ? ev.titleRu : ev.titleEn}
                    </h3>
                    <p className="text-xs text-[#5F554E] leading-relaxed line-clamp-3">
                      {lang === 'ru' ? ev.descRu : ev.descEn}
                    </p>
                  </div>

                  <a
                    href="https://www.instagram.com/svoi_nhatrang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2C221E] hover:text-[#B8684A] pt-2 transition-colors"
                  >
                    <span>{lang === 'ru' ? 'Анонс в Instagram' : 'View on Instagram'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Widget / Feed Block */}
      <section id="instagram" className="py-20 bg-white border-b border-[#ECE3D8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Instagram Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FBF9F5] border border-[#EAE1D3] mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#B8684A] p-0.5 bg-white shadow-sm">
                  <img
                    src="/images/svoi/avatar.png"
                    alt="svoi_nhatrang"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#61745E] text-white p-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="font-bold text-base sm:text-lg text-[#2C221E]">{current.instaHandle}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFE8DC] text-[#5F554E]">
                    Nha Trang
                  </span>
                </div>
                <p className="text-xs text-[#5F554E]">{current.instaBio}</p>
                <div className="flex items-center gap-4 text-xs text-[#7E7268] pt-1 justify-center sm:justify-start">
                  <span><strong>150+</strong> {lang === 'ru' ? 'публикаций' : 'posts'}</span>
                  <span><strong>Встречи &amp; Кофе</strong></span>
                </div>
              </div>
            </div>

            <a
              href="https://www.instagram.com/svoi_nhatrang"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2C221E] text-white text-xs font-bold hover:bg-[#43342D] transition-colors shadow-sm"
            >
              <Instagram className="w-4 h-4 text-[#EAE1D3]" />
              <span>{current.instaFollow}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>

          {/* Instagram Posts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.slice(0, 8).map((img, idx) => (
              <a
                key={idx}
                href="https://www.instagram.com/svoi_nhatrang"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden bg-[#EFE8DC] border border-[#E8DFD5] block"
              >
                <img
                  src={img.src}
                  alt={img.titleRu}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-white text-center">
                  <Instagram className="w-6 h-6 mb-2 text-[#EAE1D3]" />
                  <span className="text-[11px] font-semibold leading-tight line-clamp-2">
                    {lang === 'ru' ? img.titleRu : img.titleEn}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Lightbox Section */}
      <section id="gallery" className="py-20 border-b border-[#ECE3D8] bg-[#FBF9F5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B8684A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Фотогалерея' : 'Gallery'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C221E]">
              {current.galleryTitle}
            </h2>
            <p className="text-sm text-[#5F554E]">
              {current.gallerySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPhoto(photo.src)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#E8DFD5] shadow-xs hover:shadow-md transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE8DC]">
                  <img
                    src={photo.src}
                    alt={photo.titleRu}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-medium">
                      {lang === 'ru' ? photo.titleRu : photo.titleEn}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden bg-black shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhoto}
              alt="Fullscreen view"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Location, Map & Directions Section */}
      <section id="location" className="py-20 bg-white border-b border-[#ECE3D8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Contact Info & Address Card */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B8684A]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{lang === 'ru' ? 'Локация' : 'Location'}</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C221E] mt-2">
                  {current.locationTitle}
                </h2>
                <p className="text-sm text-[#5F554E] mt-1">
                  {current.locationSubtitle}
                </p>
              </div>

              {/* Exact Address Box */}
              <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#EAE1D3] space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7E7268] block">
                    {current.addressLabel}
                  </span>
                  <p className="font-serif font-bold text-lg text-[#2C221E] mt-1">
                    58 Cao Văn Bé, Vĩnh Phước, Nha Trang, Khánh Hòa 650000, Vietnam
                  </p>
                  <p className="text-xs text-[#5F554E] mt-1">
                    {lang === 'ru'
                      ? 'Северный район города (Bắc Nha Trang), 300 метров от набережной и пляжа.'
                      : 'North district of Nha Trang (Bac Nha Trang), 300 meters from the coast and beach.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8DFD5]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7E7268] block">
                    {current.hoursLabel}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-[#61745E]" />
                    <span className="font-semibold text-sm text-[#2C221E]">
                      08:00 – 21:00
                    </span>
                    <span className="text-xs text-[#5F554E]">({current.openEveryday})</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8DFD5] flex flex-wrap gap-2">
                  <a
                    href="https://maps.google.com/?q=58+Cao+Van+Be,+Nha+Trang,+Vietnam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2C221E] text-white text-xs font-semibold hover:bg-[#43342D] transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{current.openInMaps}</span>
                  </a>

                  <a
                    href="https://www.instagram.com/svoi_nhatrang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#DCD1C2] text-[#2C221E] text-xs font-semibold hover:bg-[#F5EFEB] transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5 text-[#B8684A]" />
                    <span>@svoi_nhatrang</span>
                  </a>
                </div>
              </div>

              {/* Amenities Checklist */}
              <div className="p-5 rounded-2xl bg-white border border-[#ECE3D8] space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#2C221E]">
                  {current.amenitiesLabel}
                </h4>
                <ul className="space-y-2 text-xs text-[#5F554E]">
                  {current.amenitiesList.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#EAE1D3] flex items-center justify-center text-[#61745E] flex-shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Interactive Map Card */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl overflow-hidden border border-[#ECE3D8] shadow-md bg-[#FBF9F5]">
                {/* Map Header */}
                <div className="p-4 bg-white border-b border-[#ECE3D8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#B8684A]" />
                    <span className="font-serif font-bold text-sm text-[#2C221E]">
                      Кафе «СВОИ» на Google Maps
                    </span>
                  </div>
                  <span className="text-[11px] text-[#7E7268] font-mono">
                    ID: 15286059258947661772
                  </span>
                </div>

                {/* Google Maps Embed iframe */}
                <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full bg-[#EFE8DC]">
                  <iframe
                    title="Google Maps Location 58 Cao Van Be Nha Trang"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://maps.google.com/maps?q=58+Cao+Van+Be,+Vinh+Phuoc,+Nha+Trang,+Khanh+Hoa,+Vietnam&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  />
                </div>

                {/* Map Bottom Bar */}
                <div className="p-4 bg-white border-t border-[#ECE3D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#5F554E]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#B8684A]" />
                    <span>58 Cao Văn Bé, Vĩnh Phước, Nha Trang, Khánh Hòa 650000</span>
                  </div>
                  <a
                    href="https://maps.google.com/?q=58+Cao+Van+Be,+Nha+Trang,+Vietnam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#2C221E] hover:text-[#B8684A] transition-colors"
                  >
                    <span>{lang === 'ru' ? 'Открыть маршрут' : 'Get route'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#241C18] text-[#D8CEBE] py-14 border-t border-[#3A2F29]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#3A2F29]">
            {/* Col 1: Brand */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3A2F29] border border-[#52443C] flex items-center justify-center text-[#FBF9F5] font-serif font-black">
                  СВ
                </div>
                <span className="font-serif text-2xl font-bold tracking-wide text-white">
                  СВОИ <span className="text-sm font-sans font-normal opacity-70">Nha Trang</span>
                </span>
              </div>
              <p className="text-xs text-[#A99D8F] max-w-sm leading-relaxed">
                {lang === 'ru'
                  ? 'Кафе спешелти кофе, домашней кухни, свежей выпечки и теплых встреч. Пространство, где встречаются люди и смыслы.'
                  : 'A cozy home for specialty coffee, hearty comfort food, fresh pastries, and meaningful community gatherings in Nha Trang.'}
              </p>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#3A2F29] text-[10px] text-[#C4B7A6] border border-[#52443C]">
                  Google Business Verified • ID #15286059258947661772
                </span>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {lang === 'ru' ? 'Навигация' : 'Navigation'}
              </h4>
              <ul className="space-y-2 text-xs text-[#A99D8F]">
                <li><a href="#about" className="hover:text-white transition-colors">{current.navAbout}</a></li>
                <li><a href="#menu" className="hover:text-white transition-colors">{current.navMenu}</a></li>
                <li><a href="#events" className="hover:text-white transition-colors">{current.navEvents}</a></li>
                <li><a href="#gallery" className="hover:text-white transition-colors">{current.navGallery}</a></li>
                <li><a href="#location" className="hover:text-white transition-colors">{current.navRoute}</a></li>
              </ul>
            </div>

            {/* Col 3: Contacts */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {lang === 'ru' ? 'Контакты & Режим' : 'Contact & Hours'}
              </h4>
              <div className="space-y-2 text-xs text-[#A99D8F]">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B8684A]" />
                  <span>58 Cao Văn Bé, Bắc Nha Trang, Vietnam</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#61745E]" />
                  <span>08:00 – 21:00 (Ежедневно / Daily)</span>
                </p>
                <p className="flex items-center gap-2">
                  <Instagram className="w-3.5 h-3.5 text-[#B8684A]" />
                  <a
                    href="https://www.instagram.com/svoi_nhatrang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white underline underline-offset-2 transition-colors"
                  >
                    @svoi_nhatrang
                  </a>
                </p>
                <p className="flex items-center gap-2 pt-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#B8684A]" />
                  <a
                    href="https://revoo.win/?v=deCg3Rq1oTawHoOImnoj&source=google_maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EAE1D3] font-semibold hover:text-white underline underline-offset-2 transition-colors flex items-center gap-1"
                  >
                    <span>{current.orderFood} (REVOO)</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8C8072]">
            <p>© {new Date().getFullYear()} Cafe SVOI Nha Trang. {current.rights}</p>
            <p className="text-center sm:text-right">{current.footerNote}</p>
          </div>
        </div>
      </footer>

      {/* Floating Quick Order Pill */}
      <div className="fixed bottom-5 right-5 z-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <a
          href="https://revoo.win/?v=deCg3Rq1oTawHoOImnoj&source=google_maps"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#B8684A] text-white shadow-xl hover:shadow-2xl hover:bg-[#A3593D] transition-all transform hover:-translate-y-0.5 border border-[#C97B5D]"
        >
          <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span className="text-xs sm:text-sm font-bold tracking-wide">{current.orderFood}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>
    </div>
  );
}
