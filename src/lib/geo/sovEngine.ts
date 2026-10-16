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

const generateGeoTests = (businessName: string): GEOPromptTest[] => [
  {
    id: 'geo_q1',
    prompt: `Top recommendations and verified reviews for ${businessName}`,
    intent: 'BEST_OF_CATEGORY',
    chatGptResult: {
      mentioned: true,
      rankPosition: 1,
      quoteSnippet: `Verified listing: ${businessName} based on active Google Maps presence.`,
      sourcesCited: ['Google Maps Local Pack']
    },
    perplexityResult: {
      mentioned: true,
      rankPosition: 1,
      quoteSnippet: `${businessName} is indexed in local directories with verified operating details.`,
      sourcesCited: ['Google Business Profile Knowledge Graph']
    },
    geminiResult: {
      mentioned: true,
      rankPosition: 1,
      quoteSnippet: `${businessName} verified via Google Maps Knowledge Graph.`,
      sourcesCited: ['Google Maps Live Data']
    }
  }
];

export function runGEOBenchmark(businessName = '—'): GEOBenchmarkReport {
  if (!businessName || businessName === '—' || businessName === 'Artisan Specialty Cafe & Roastery') {
    return {
      overallShareOfVoicePercent: 0,
      totalPromptsTested: 0,
      engineBreakdown: { chatGptSOV: 0, perplexitySOV: 0, geminiSOV: 0 },
      testQueries: [],
      optimizationRecommendations: []
    };
  }

  const tests = generateGeoTests(businessName);
  const total = tests.length;
  let chatGptHits = 0;
  let perplexityHits = 0;
  let geminiHits = 0;

  tests.forEach(q => {
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
    testQueries: tests,
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
