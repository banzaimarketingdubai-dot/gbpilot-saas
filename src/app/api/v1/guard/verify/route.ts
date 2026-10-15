import { NextResponse } from 'next/server';
import { verifyAndAutoRevert, getDefenseLogs } from '@/lib/guard/sentinel';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { simulateAttack = false, liveProfile = {} } = body;

    const result = verifyAndAutoRevert(liveProfile, simulateAttack);

    return NextResponse.json({
      success: true,
      result,
      allLogs: getDefenseLogs()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Verification failed' }, { status: 500 });
  }
}
