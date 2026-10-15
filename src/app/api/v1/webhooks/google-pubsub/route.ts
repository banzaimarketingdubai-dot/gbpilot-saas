import { NextResponse } from 'next/server';
import { verifyAndAutoRevert } from '@/lib/guard/sentinel';

/**
 * Google Cloud Pub/Sub Push Webhook
 * Receives real-time push events from Google Business Profile API.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Google Cloud Pub/Sub payload format
    if (!body.message || !body.message.data) {
      return NextResponse.json({ success: false, error: 'Invalid Pub/Sub message format' }, { status: 400 });
    }

    // Decode base64 Pub/Sub payload
    const decodedString = Buffer.from(body.message.data, 'base64').toString('utf8');
    let eventPayload: any = {};
    try {
      eventPayload = JSON.parse(decodedString);
    } catch {
      eventPayload = { raw: decodedString };
    }

    console.log('[Pub/Sub Webhook Received]:', eventPayload);

    // If event corresponds to Google updates or suggested edits
    if (eventPayload.eventType === 'GOOGLE_UPDATE' || eventPayload.eventType === 'UPDATED' || eventPayload.locationName) {
      // Run auto-revert sentinel check
      const verification = verifyAndAutoRevert(eventPayload.updatedLocation || {}, false);
      
      return NextResponse.json({
        success: true,
        acknowledged: true,
        actionTaken: verification.isTampered ? 'AUTO_REVERTED' : 'VERIFIED_CLEAN',
        verification
      });
    }

    // Acknowledge receipt
    return NextResponse.json({
      success: true,
      acknowledged: true,
      messageId: body.message.messageId
    });
  } catch (error: any) {
    console.error('Pub/Sub webhook processing failed:', error);
    // Return 200 to prevent Pub/Sub infinite retry storm while logging error
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}
