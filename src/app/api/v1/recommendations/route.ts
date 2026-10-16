import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    profile: null,
    recommendations: [],
    timestamp: new Date().toISOString()
  });
}
