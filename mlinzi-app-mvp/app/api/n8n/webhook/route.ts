import { NextRequest, NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';

/**
 * API Route Proxy for n8n Webhook
 * This solves CORS by routing client requests through Next.js server
 * The server-to-server call bypasses browser CORS restrictions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = ['device_id', 'event_type', 'timestamp', 'nonce'];
    const missing = required.filter((f) => !body[f]);
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Forward to n8n backend
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MLINZI-CLIENT': 'web-mvp-v3.0',
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || 'unknown',
      },
      body: JSON.stringify(body),
      // 30 second timeout for n8n processing
      signal: AbortSignal.timeout(30000),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('n8n webhook error:', n8nResponse.status, errorText);
      return NextResponse.json(
        { error: 'Mlinzi backend error', details: errorText },
        { status: n8nResponse.status }
      );
    }

    const data = await n8nResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-MLINZI-CLIENT',
      'Access-Control-Max-Age': '86400',
    },
  });
}
