import { NextResponse } from 'next/server';
import { getGoldenSnapshot, saveGoldenSnapshot } from '@/lib/guard/sentinel';

export async function GET() {
  const snapshot = getGoldenSnapshot();
  return NextResponse.json({
    success: true,
    goldenSnapshot: snapshot
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = saveGoldenSnapshot(body);
    return NextResponse.json({
      success: true,
      message: 'Golden snapshot saved. Profile integrity locked 24/7.',
      goldenSnapshot: updated
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to save snapshot' }, { status: 500 });
  }
}
