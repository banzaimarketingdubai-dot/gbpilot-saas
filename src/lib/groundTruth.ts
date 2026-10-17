export interface OwnerGroundTruth {
  profileKey: string;
  flagshipOffering: string;
  guestPersona: string;
  venueRulesAndPerks: string;
  updatedAt: string;
  isCompleted: boolean;
  skipped?: boolean;
}

export interface GroundTruthPresets {
  nicheLabel: string;
  flagshipChips: string[];
  personaChips: string[];
  rulesChips: string[];
  placeholders: {
    flagship: string;
    persona: string;
    rules: string;
  };
}

export function getGroundTruthKey(profile?: { id?: string; name?: string } | null): string {
  const raw = profile?.id || profile?.name || 'default';
  return `gbpilot_ground_truth_${raw.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
}

export function loadOwnerGroundTruth(profile?: { id?: string; name?: string } | null): OwnerGroundTruth {
  const key = getGroundTruthKey(profile);
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key) || localStorage.getItem('gbpilot_owner_ground_truth_latest');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            profileKey: key,
            flagshipOffering: parsed.flagshipOffering || '',
            guestPersona: parsed.guestPersona || '',
            venueRulesAndPerks: parsed.venueRulesAndPerks || '',
            updatedAt: parsed.updatedAt || new Date().toISOString(),
            isCompleted: Boolean(
              (parsed.flagshipOffering && parsed.flagshipOffering.trim()) ||
              (parsed.guestPersona && parsed.guestPersona.trim()) ||
              (parsed.venueRulesAndPerks && parsed.venueRulesAndPerks.trim())
            ),
            skipped: Boolean(parsed.skipped)
          };
        }
      } catch (e) {
        console.error('Failed to parse OwnerGroundTruth:', e);
      }
    }
  }
  return {
    profileKey: key,
    flagshipOffering: '',
    guestPersona: '',
    venueRulesAndPerks: '',
    updatedAt: '',
    isCompleted: false,
    skipped: false
  };
}

export function saveOwnerGroundTruth(
  profile: { id?: string; name?: string } | null | undefined,
  data: {
    flagshipOffering: string;
    guestPersona: string;
    venueRulesAndPerks: string;
    skipped?: boolean;
  }
): OwnerGroundTruth {
  const key = getGroundTruthKey(profile);
  const payload: OwnerGroundTruth = {
    profileKey: key,
    flagshipOffering: data.flagshipOffering.trim(),
    guestPersona: data.guestPersona.trim(),
    venueRulesAndPerks: data.venueRulesAndPerks.trim(),
    updatedAt: new Date().toISOString(),
    isCompleted: Boolean(
      data.flagshipOffering.trim() ||
      data.guestPersona.trim() ||
      data.venueRulesAndPerks.trim()
    ),
    skipped: Boolean(data.skipped)
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(payload));
    localStorage.setItem('gbpilot_owner_ground_truth_latest', JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('gbpilot_ground_truth_updated', { detail: payload }));
  }

  return payload;
}

export function getGroundTruthPresets(profile?: { name?: string; category?: string; address?: string } | null): GroundTruthPresets {
  const text = `${profile?.name || ''} ${profile?.category || ''} ${profile?.address || ''}`.toLowerCase();

  if (text.includes('clinic') || text.includes('dental') || text.includes('med') || text.includes('клиник') || text.includes('стомат') || text.includes('aesthetic')) {
    return {
      nicheLabel: 'Медицина / Эстетическая клиника',
      flagshipChips: [
        'Голливудские виниры и имплантация за 1 день',
        'Безоперационный лифтинг и инъекционная косметология',
        'Лазерная эпиляция и уход HydraFacial',
        'Бесплатная 3D-диагностика при первом визите'
      ],
      personaChips: [
        'Экспаты и резиденты с высоким чеком',
        'Семейные пациенты, ценящие лечение без боли',
        'Русско- и англоговорящие клиенты района',
        'VIP-пациенты, которым важна конфиденциальность'
      ],
      rulesChips: [
        'Бесплатный Valet-паркинг у входа в башню',
        'Прием строго по записи + срочные окна день в день',
        'Прямое покрытие страховкой (Direct Billing)',
        'Рассрочка 0% (Tabby / Tamara / Карты)'
      ],
      placeholders: {
        flagship: 'Например: Дентальная имплантация под ключ и виниры E-Max (маржинальность 70%)',
        persona: 'Например: Резиденты и экспаты 28–55 лет, которым важен сервис без ожидания и врачи с международным опытом',
        rules: 'Например: Бесплатный Valet-паркинг, 1-й этаж башни, говорим на EN/RU/AR, работаем со страховками'
      }
    };
  }

  if (text.includes('visa') || text.includes('виза') || text.includes('legal') || text.includes('setup') || text.includes('real estate') || text.includes('недвиж')) {
    return {
      nicheLabel: 'Визовый центр / Консалтинг / B2B услуги',
      flagshipChips: [
        'Срочное продление визы и Fast-Track без очередей',
        'VIP Бордер-ран под ключ на комфортном минивэне',
        'Открытие компании и резидентской визы (Golden Visa)',
        'Оформление ВНЖ / TRC и разрешения на работу'
      ],
      personaChips: [
        'Экспаты, фрилансеры и цифровые кочевники',
        'Предприниматели и релоканты с семьями',
        'Туристы, которым нужно срочное решение за 24 часа'
      ],
      rulesChips: [
        '100% гарантия по договору без скрытых доплат',
        'Личный менеджер в WhatsApp/Telegram 24/7',
        'Курьер забирает документы из дома/отеля',
        'Оплата наличными, картой или в AED/USD/USDT'
      ],
      placeholders: {
        flagship: 'Например: Срочное продление виз, VIP бордер-раны и оформление Golden Visa под ключ',
        persona: 'Например: Экспаты и туристы, которым нужна надежность без риска отказа и бюрократии',
        rules: 'Например: Офис в центре с удобной парковкой, курьер за документами, поддержка на русском и английском'
      }
    };
  }

  if (text.includes('salon') || text.includes('barber') || text.includes('spa') || text.includes('beauty') || text.includes('салон') || text.includes('барбер') || text.includes('спа')) {
    return {
      nicheLabel: 'Салон красоты / Барбершоп / SPA',
      flagshipChips: [
        'Сложное окрашивание Airtouch и восстановление волос',
        'Маникюр и педикюр в 4 руки за 60 минут',
        'Королевское бритье и мужские стрижки',
        'Авторский балийский и лимфодренажный массаж'
      ],
      personaChips: [
        'Жители соседних башен и бизнес-кластера',
        'Девушки, ценящие стерильность и топ-мастеров',
        'Деловые клиенты, экономящие время'
      ],
      rulesChips: [
        'Бесплатная парковка для гостей на 2 часа',
        'Премиум-кофе, матча и игристое бесплатно',
        'Можно с детьми и небольшими собаками (Pet-friendly)',
        'Запись через WhatsApp в 1 клик или Walk-in'
      ],
      placeholders: {
        flagship: 'Например: Окрашивание Airtouch, уход Tokio Inkarami и маникюр в 4 руки',
        persona: 'Например: Экспаты и резиденты района, ищущие высокое качество и сервис уровня 5★',
        rules: 'Например: Бесплатный паркинг в здании, авторский кофе включен, скидка 15% на первый визит'
      }
    };
  }

  // Default: Cafe / Restaurant / Hospitality / Local Venue
  return {
    nicheLabel: 'Ресторан / Кафе / Пекарня / Локальный бизнес',
    flagshipChips: [
      'Авторские завтраки весь день и сырники из фермерского творога',
      'Спешелти-кофе собственной обжарки и фисташковый круассан',
      'Стейки сухого вызревания и авторские вечерние сеты',
      'Бизнес-ланчи за 45 мин и свежая ремесленная выпечка'
    ],
    personaChips: [
      'Удаленщики и предприниматели с ноутбуками (быстрый Wi-Fi)',
      'Семьи с детьми и компании друзей на бранч',
      'Туристы и жители соседних ЖК/башен',
      'Ценители спешелти-кофе и здорового меню без сахара'
    ],
    rulesChips: [
      'Pet-friendly (можно с собаками, миски с водой)',
      'Бесплатный паркинг / Valet у входа',
      'Мощный кондиционер в зале + уютная терраса',
      'Без предварительной брони утром, бронь столов на вечер'
    ],
    placeholders: {
      flagship: 'Например: Фирменные сырники, круассаны на французском масле и спешелти-кофе собственной обжарки',
      persona: 'Например: Экспаты, семьи на утренний завтрак и фрилансеры, которым важен быстрый Wi-Fi и розетки',
      rules: 'Например: Pet-friendly, бесплатная парковка за углом, веганское меню, доставка и навынос за 10 минут'
    }
  };
}
