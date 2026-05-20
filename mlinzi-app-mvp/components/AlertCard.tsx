'use client';

import { Alert } from '@/types';
import { cn, formatEAT, getRiskColor, getRiskIcon } from '@/lib/utils';
import { MapPin, ExternalLink, Shield } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onResolve: (alertId: string) => void;
  onViewDetails: (alertId: string) => void;
  className?: string;
}

export function AlertCard({ alert, onResolve, onViewDetails, className }: AlertCardProps) {
  const typeLabels: Record<string, string> = {
    sos: 'DHARURA SOS',
    geofence_breach: 'Kuvuka Mpaka',
    nfc_tap_in: 'Kufika Shule',
    nfc_tap_out: 'Kutoka Shule',
    qr_rescue_scan: 'QR Rescue',
    low_battery: 'Battery Chini',
  };

  return (
    <div
      className={cn(
        'mlinzi-card border-l-4',
        alert.riskLevel === 'CRITICAL' ? 'border-l-mlinzi-accent' : alert.riskLevel === 'HIGH' ? 'border-l-mlinzi-warning' : 'border-l-mlinzi-primary',
        alert.isResolved && 'opacity-60',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getRiskIcon(alert.riskLevel)}</span>
          <div>
            <span className={cn('mlinzi-badge text-xs', getRiskColor(alert.riskLevel))}>
              {alert.riskLevel}
            </span>
            <span className="ml-2 text-xs text-gray-400">{typeLabels[alert.type] || alert.type}</span>
          </div>
        </div>
        <span className="text-xs text-gray-500">{alert.eatTime}</span>
      </div>

      <h4 className="font-semibold text-white mb-2">{alert.childName}</h4>
      <p className="text-sm text-gray-300 mb-3 leading-relaxed">{alert.message}</p>

      {alert.location && (
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <MapPin className="w-3.5 h-3.5 text-mlinzi-primary" />
          <span>{alert.location.address}</span>
          {alert.mapUrl && (
            <a href={alert.mapUrl} target="_blank" rel="noopener noreferrer" className="text-mlinzi-primary hover:underline flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Ramani
            </a>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <Shield className="w-3.5 h-3.5 text-mlinzi-primary" />
        <span className="font-mono">{alert.blockchainHash.substring(0, 20)}...</span>
        <span className="text-mlinzi-primary">Blockchain verified</span>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onViewDetails(alert.id)} className="flex-1 mlinzi-button text-xs py-1.5 bg-mlinzi-secondary/50 hover:bg-mlinzi-secondary">
          Maelezo Zaidi
        </button>
        {!alert.isResolved && (
          <button onClick={() => onResolve(alert.id)} className="flex-1 mlinzi-button text-xs py-1.5">
            Tatua
          </button>
        )}
      </div>
    </div>
  );
}
