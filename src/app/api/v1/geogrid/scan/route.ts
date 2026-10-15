import { NextResponse } from 'next/server';
import { runGeoGridScan } from '@/lib/geogrid/scanner';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      centerLat = 12.2718,
      centerLng = 109.2016,
      keyword = 'breakfast cafe',
      gridSize = 3,
      stepKm = 0.5
    } = body;

    const validatedGridSize: 3 | 5 | 7 = gridSize === 5 ? 5 : gridSize === 7 ? 7 : 3;

    const scanResult = runGeoGridScan(
      Number(centerLat),
      Number(centerLng),
      keyword,
      validatedGridSize,
      Number(stepKm)
    );

    return NextResponse.json({
      success: true,
      scanResult
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Geo-Grid scan failed' }, { status: 500 });
  }
}
