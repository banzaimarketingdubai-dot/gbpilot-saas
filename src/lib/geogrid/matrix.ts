export interface GridPoint {
  id: string;
  row: number;
  col: number;
  lat: number;
  lng: number;
  distanceKm: number;
}

/**
 * Generates an NxN coordinate matrix around a business centroid.
 *
 * @param centerLat Latitude of the business centroid
 * @param centerLng Longitude of the business centroid
 * @param gridSize Dimensions of the grid (3 for 3x3, 5 for 5x5, 7 for 7x7)
 * @param stepKm Distance step in kilometers between adjacent grid points (e.g. 0.5 km)
 */
export function generateGeoGridMatrix(
  centerLat: number,
  centerLng: number,
  gridSize: 3 | 5 | 7 = 3,
  stepKm = 0.5
): GridPoint[] {
  const points: GridPoint[] = [];
  const half = Math.floor(gridSize / 2);

  // 1 degree latitude ~ 111.32 km
  const latDegreeStep = stepKm / 111.32;

  // 1 degree longitude ~ 111.32 * cos(lat in radians)
  const radLat = (centerLat * Math.PI) / 180;
  const lngDegreeStep = stepKm / (111.32 * Math.cos(radLat));

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const rowOffset = (half - r) * latDegreeStep; // top rows are north (+lat)
      const colOffset = (c - half) * lngDegreeStep; // right cols are east (+lng)

      const lat = Number((centerLat + rowOffset).toFixed(6));
      const lng = Number((centerLng + colOffset).toFixed(6));

      // Calculate exact distance from center via Haversine
      const distanceKm = Number(haversineDistanceKm(centerLat, centerLng, lat, lng).toFixed(2));

      points.push({
        id: `node_${r}_${c}`,
        row: r,
        col: c,
        lat,
        lng,
        distanceKm
      });
    }
  }

  return points;
}

/**
 * Haversine formula for spherical distance in km.
 */
export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
