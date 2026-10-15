export interface GEOPromptTest {
  id: string;
  prompt: string;
  intent: 'LOCAL_RECOMMENDATION' | 'PRICE_COMPARISON' | 'BEST_OF_CATEGORY';
  chatGptResult: {
    mentioned: boolean;
    rankPosition?: number;
    quoteSnippet: string;
    sourcesCited: string[];
  };
  perplexityResult: {
    mentioned: boolean;
    rankPosition?: number;
    quoteSnippet: string;
    sourcesCited: string[];
  };
  geminiResult: {
    mentioned: boolean;
    rankPosition?: number;
    quoteSnippet: string;
    sourcesCited: string[];
  };
}

export interface GEOBenchmarkReport {
  overallShareOfVoicePercent: number;
  totalPromptsTested: number;
  engineBreakdown: {
    chatGptSOV: number;
    perplexitySOV: number;
    geminiSOV: number;
  };
  testQueries: GEOPromptTest[];
  optimizationRecommendations: Array<{
    targetEngine: 'ChatGPT' | 'Perplexity' | 'Gemini' | 'ALL';
    priority: 'HIGH' | 'MEDIUM';
    title: string;
    actionableFix: string;
  }>;
}

const MOCK_GEO_TESTS: GEOPromptTest[] = [
  {
    id: 'geo_q1',
    prompt: 'Where is the best specialty coffee and breakfast in Marina Promenade?',
    intent: 'BEST_OF_CATEGORY',
    chatGptResult: {
      mentioned: true,
      rankPosition: 1,
      quoteSnippet: 'Top recommendation: Artisan Specialty Cafe & Roastery for single-origin pour-overs and fresh breakfast sourdough.',
      sourcesCited: ['Google Maps Local Pack', 'TripAdvisor']
    },
    perplexityResult: {
      mentioned: true,
      rankPosition: 1,
      quoteSnippet: 'Artisan Specialty Cafe & Roastery is frequently cited for exceptional flat whites and outdoor seating.',
      sourcesCited: ['Google Business Profile Knowledge Graph', 'Local Food Guide']
    },
    geminiResult: {
      mentioned: true,
      rankPosition: 2,
      quoteSnippet: 'Artisan Specialty Cafe & Roastery (4.8★) offers specialty roasted beans and morning breakfast menus.',
      sourcesCited: ['Google Maps API', 'Yelp']
    }
  },
  {
    id: 'geo_q2',
    prompt: 'Top cafes with outdoor seating and reliable WiFi for laptop work nearby',
    intent: 'LOCAL_RECOMMENDATION',
    chatGptResult: {
      mentioned: true,
      rankPosition: 2,
      quoteSnippet: 'Artisan Specialty Cafe features high-speed fiber WiFi and covered patio seating.',
      sourcesCited: ['Google Business Attributes']
    },
    perplexityResult: {
      mentioned: false,
      quoteSnippet: 'Competitor Cafe Luna and Waterfront Espresso are currently ranked ahead.',
      sourcesCited: ['Timeout Dubai', 'Google Maps']
    },
    geminiResult: {
      mentioned: true,
      rankPosition: 1,
      quoteSnippet: 'Artisan Specialty Cafe is verified for fast WiFi and spacious work tables.',
      sourcesCited: ['Google Maps Live Data']
    }
  }
];

export function runGEOBenchmark(businessName = 'Artisan Specialty Cafe & Roastery'): GEOBenchmarkReport {
  const total = MOCK_GEO_TESTS.length;
  let chatGptHits = 0;
  let perplexityHits = 0;
  let geminiHits = 0;

  MOCK_GEO_TESTS.forEach(q => {
    if (q.chatGptResult.mentioned) chatGptHits++;
    if (q.perplexityResult.mentioned) perplexityHits++;
    if (q.geminiResult.mentioned) geminiHits++;
  });

  const chatGptSOV = Math.round((chatGptHits / total) * 100);
  const perplexitySOV = Math.round((perplexityHits / total) * 100);
  const geminiSOV = Math.round((geminiHits / total) * 100);
  const overallSOV = Math.round((chatGptSOV + perplexitySOV + geminiSOV) / 3);

  return {
    overallShareOfVoicePercent: overallSOV,
    totalPromptsTested: total,
    engineBreakdown: {
      chatGptSOV,
      perplexitySOV,
      geminiSOV
    },
    testQueries: MOCK_GEO_TESTS,
    optimizationRecommendations: [
      {
        targetEngine: 'Perplexity',
        priority: 'HIGH',
        title: 'Inject Schema.org Restaurant Entity on Website Homepage',
        actionableFix: 'Add JSON-LD markup with exact GPS centroid coordinates, opening hours, and menu links to feed Perplexity live web index.'
      },
      {
        targetEngine: 'ChatGPT',
        priority: 'MEDIUM',
        title: 'Syndicate Weekly Google Posts with Signature Dish Keywords',
        actionableFix: 'ChatGPT Search extracts entity context from Google Business Profile post updates published within the last 14 days.'
      },
      {
        targetEngine: 'Gemini',
        priority: 'HIGH',
        title: 'Maintain 100% Attribute Verification in GBP Knowledge Graph',
        actionableFix: 'Gemini relies directly on Google Maps knowledge panel attributes (outdoor seating, wheelchair access, payment methods).'
      }
    ]
  };
}
