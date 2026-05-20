'use client';

import toast from 'react-hot-toast';

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';
const CORS_PROXY = process.env.NEXT_PUBLIC_CORS_PROXY_URL || '';

interface N8NPayload {
  device_id: string;
  device_type: string;
  event_type: string;
  lat?: number;
  lng?: number;
  timestamp: string;
  nonce: string;
  nonce_expiry: string;
  battery_percent?: number;
  firmware_version?: string;
  [key: string]: unknown;
}

interface N8NResponse {
  status: string;
  system: string;
  device_id: string;
  risk_level: string;
  tamper_evident_hash: string;
  threshold_status: boolean;
  pqc_secured: boolean;
  message: string;
  timestamp: string;
  kenya_dpa_compliant: boolean;
}

/**
 * Send event to n8n backend via API route proxy
 * This avoids CORS issues by routing through Next.js API
 */
export async function sendToN8N(payload: N8NPayload): Promise<N8NResponse | null> {
  try {
    const response = await fetch('/api/n8n/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MLINZI-CLIENT': 'web-mvp-v3.0',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`n8n error: ${response.status} — ${error}`);
    }

    const data = await response.json();
    toast.success('Alert sent to Mlinzi Guardian');
    return data;
  } catch (error) {
    console.error('Failed to send to n8n:', error);
    toast.error('Failed to send alert. Retrying...');
    return null;
  }
}

/**
 * Trigger SOS emergency
 */
export async function triggerSOS(
  deviceId: string,
  childName: string,
  lat: number,
  lng: number
): Promise<N8NResponse | null> {
  const nonce = crypto.randomUUID();
  const nonceExpiry = new Date(Date.now() + 300000).toISOString();

  return sendToN8N({
    device_id: deviceId,
    device_type: 'smartwatch',
    event_type: 'sos_triggered',
    child_name: childName,
    lat,
    lng,
    timestamp: new Date().toISOString(),
    nonce,
    nonce_expiry: nonceExpiry,
    battery_percent: 72,
    firmware_version: '3.0.2',
    data_classification: 'CRITICAL',
  });
}

/**
 * Refresh child location
 */
export async function refreshLocation(deviceId: string): Promise<N8NResponse | null> {
  const nonce = crypto.randomUUID();
  const nonceExpiry = new Date(Date.now() + 300000).toISOString();

  return sendToN8N({
    device_id: deviceId,
    device_type: 'smartwatch',
    event_type: 'gps_update',
    timestamp: new Date().toISOString(),
    nonce,
    nonce_expiry: nonceExpiry,
    data_classification: 'NORMAL',
  });
}

/**
 * Simulate NFC tap-in
 */
export async function simulateNFCTapIn(
  deviceId: string,
  schoolName: string,
  gateId: string
): Promise<N8NResponse | null> {
  const nonce = crypto.randomUUID();
  const nonceExpiry = new Date(Date.now() + 300000).toISOString();

  return sendToN8N({
    device_id: deviceId,
    device_type: 'nfc_card',
    event_type: 'nfc_tap_in',
    school_name: schoolName,
    school_nfc_gate_id: gateId,
    timestamp: new Date().toISOString(),
    nonce,
    nonce_expiry: nonceExpiry,
    data_classification: 'NORMAL',
  });
}
