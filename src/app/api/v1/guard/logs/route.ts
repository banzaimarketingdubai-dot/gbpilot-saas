import { NextResponse } from 'next/server';
import { getDefenseLogs } from '@/lib/guard/sentinel';

export async function GET() {
  const logs = getDefenseLogs();
  return NextResponse.json({
    success: true,
    totalIncidentsAverted: logs.length,
    totalDamageAvertedDollars: logs.reduce((sum, item) => sum + item.avertedLossDollars, 0),
    logs
  });
}
