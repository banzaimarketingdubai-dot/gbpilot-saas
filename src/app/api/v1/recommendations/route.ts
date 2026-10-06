import { NextResponse } from 'next/server';
import { MOCK_RECOMMENDATIONS, INITIAL_BUSINESS_PROFILE } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    profile: INITIAL_BUSINESS_PROFILE,
    recommendations: MOCK_RECOMMENDATIONS,
    timestamp: new Date().toISOString()
  });
}
