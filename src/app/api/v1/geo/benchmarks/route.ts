import { NextResponse } from 'next/server';
import { runGEOBenchmark } from '@/lib/geo/sovEngine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessName = searchParams.get('businessName') || '';

  const report = runGEOBenchmark(businessName);
  return NextResponse.json({
    success: true,
    benchmarkReport: report
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const businessName = body.businessName || '';
    const report = runGEOBenchmark(businessName);

    return NextResponse.json({
      success: true,
      benchmarkReport: report
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'GEO benchmark failed' }, { status: 500 });
  }
}
