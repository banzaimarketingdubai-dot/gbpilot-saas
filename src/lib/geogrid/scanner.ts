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

const MOCK_COMPETITORS: CompetitorItem[] = [];

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

    const topComp = calculatedRank === 1 ? 'Your Business (#1)' : '—';

    let overtakeAdvice = 'You hold top Local 3-Pack placement here! Maintain photo & review frequency.';
    if (calculatedRank === 2 || calculatedRank === 3) {
      overtakeAdvice = `Publish 1 geotagged post targeting "${keyword}" to strengthen Local 3-Pack placement.`;
    } else if (calculatedRank > 3) {
      overtakeAdvice = `Inject area LSI keywords into upcoming review replies to bridge the spatial distance gap.`;
    }

    return {
      ...p,
      rank: calculatedRank,
      statusColor,
      topCompetitor: topComp,
      topCompetitors: [],
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
    competitorsAggregated: []
  };
}
