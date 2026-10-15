import { generateGeoGridMatrix, GridPoint } from './matrix';

export interface CompetitorItem {
  name: string;
  rank: number;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  photoUrl?: string;
  moat: string;
  weakness: string;
}

export interface ScannedGridNode extends GridPoint {
  rank: number;
  statusColor: 'GREEN' | 'YELLOW' | 'RED';
  topCompetitor: string;
  topCompetitors: CompetitorItem[];
  overtakeAdvice: string;
}

export interface GeoGridScanResult {
  keyword: string;
  centerLat: number;
  centerLng: number;
  gridSize: number;
  stepKm: number;
  averageRank: number;
  top3PackSharePercent: number;
  nodes: ScannedGridNode[];
  competitorsAggregated: Array<{
    name: string;
    nodesDominating: number;
    avgRank: number;
    overtakeStrategy: string;
  }>;
}

const MOCK_COMPETITORS: CompetitorItem[] = [
  {
    name: 'Cafe Luna & Roastery',
    rank: 1,
    rating: 4.8,
    reviewsCount: 412,
    distanceKm: 0.3,
    photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=120',
    moat: 'High photo count (180+ photos) and strong local citations.',
    weakness: 'Slow review reply velocity (> 48 hrs) and zero holiday hour declarations.'
  },
  {
    name: 'Espresso Lab Marina',
    rank: 2,
    rating: 4.7,
    reviewsCount: 289,
    distanceKm: 0.6,
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=120',
    moat: 'High review velocity (+8/week).',
    weakness: 'Lacks breakfast menu catalog in Google Knowledge Panel.'
  },
  {
    name: 'The Daily Grind Cafe',
    rank: 3,
    rating: 4.6,
    reviewsCount: 198,
    distanceKm: 0.9,
    photoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120',
    moat: 'Close to transit station.',
    weakness: 'Lower overall rating (4.6) and missing outdoor seating attribute.'
  }
];

/**
 * Runs spatial scan across the grid matrix for a specific ranking keyword.
 */
export function runGeoGridScan(
  centerLat: number,
  centerLng: number,
  keyword = 'breakfast cafe',
  gridSize: 3 | 5 | 7 = 3,
  stepKm = 0.5
): GeoGridScanResult {
  const points = generateGeoGridMatrix(centerLat, centerLng, gridSize, stepKm);

  let totalRank = 0;
  let top3Count = 0;

  const nodes: ScannedGridNode[] = points.map((p) => {
    // Spatial rank calculation: central nodes rank higher (#1-#3), edge nodes face distance decay
    let calculatedRank = 1;

    if (p.distanceKm === 0) {
      calculatedRank = 1;
    } else if (p.distanceKm <= 0.6) {
      calculatedRank = Math.min(3, 1 + Math.round(p.distanceKm * 2));
    } else if (p.distanceKm <= 1.2) {
      calculatedRank = Math.min(6, 3 + Math.round(p.distanceKm * 2));
    } else {
      calculatedRank = Math.min(14, 5 + Math.round(p.distanceKm * 4));
    }

    totalRank += calculatedRank;
    if (calculatedRank <= 3) top3Count++;

    const statusColor: 'GREEN' | 'YELLOW' | 'RED' =
      calculatedRank <= 3 ? 'GREEN' : calculatedRank <= 8 ? 'YELLOW' : 'RED';

    const topComp = calculatedRank === 1 ? 'Your Business (#1)' : MOCK_COMPETITORS[0].name;

    let overtakeAdvice = 'You hold top Local 3-Pack placement here! Maintain photo & review frequency.';
    if (calculatedRank === 2 || calculatedRank === 3) {
      overtakeAdvice = `Publish 1 geotagged post targeting "${keyword}" to overtake #1 placement from ${MOCK_COMPETITORS[0].name}.`;
    } else if (calculatedRank > 3) {
      overtakeAdvice = `Inject area LSI keywords into upcoming review replies to bridge the spatial distance gap.`;
    }

    return {
      ...p,
      rank: calculatedRank,
      statusColor,
      topCompetitor: topComp,
      topCompetitors: MOCK_COMPETITORS,
      overtakeAdvice
    };
  });

  const averageRank = Number((totalRank / nodes.length).toFixed(1));
  const top3PackSharePercent = Math.round((top3Count / nodes.length) * 100);

  return {
    keyword,
    centerLat,
    centerLng,
    gridSize,
    stepKm,
    averageRank,
    top3PackSharePercent,
    nodes,
    competitorsAggregated: [
      {
        name: 'Cafe Luna & Roastery',
        nodesDominating: Math.max(1, nodes.length - top3Count),
        avgRank: 1.8,
        overtakeStrategy: 'Deploy 2 weekly geotagged posts with exact coordinates and answer pending reviews within 15 mins.'
      },
      {
        name: 'Espresso Lab Marina',
        nodesDominating: 1,
        avgRank: 2.5,
        overtakeStrategy: 'Highlight breakfast menu items and specialty single-origin attributes.'
      }
    ]
  };
}
