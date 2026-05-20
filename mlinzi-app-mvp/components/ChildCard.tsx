'use client';

import { Child } from '@/types';
import { cn, formatEAT, getRiskColor, getRiskIcon } from '@/lib/utils';
import { MapPin, Home, School, AlertTriangle } from 'lucide-react';

interface ChildCardProps {
  child: Child;
  onLocate: (childId: string) => void;
  onTalk: (childId: string) => void;
  className?: string;
}

export function ChildCard({ child, onLocate, onTalk, className }: ChildCardProps) {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    sos: 'bg-red-500 animate-pulse',
  };

  const statusLabels = {
    online: 'Mtandaoni',
    offline: 'Nje ya mtandao',
    sos: 'DHARURA',
  };

  return (
    <div className={cn('mlinzi-card relative overflow-hidden', className)}>
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className={cn('mlinzi-badge', getRiskColor(child.status === 'sos' ? 'CRITICAL' : 'MONITOR'))}>
          {getRiskIcon(child.status === 'sos' ? 'CRITICAL' : 'MONITOR')} {statusLabels[child.status]}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-mlinzi-primary/20 flex items-center justify-center text-xl font-bold text-mlinzi-primary">
            {child.name.charAt(0)}
          </div>
          <div className={cn('absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-mlinzi-secondary', statusColors[child.status])} />
        </div>
        <div>
          <h3 className="font-bold text-lg">{child.name}</h3>
          <p className="text-sm text-gray-400">{child.age} miaka | {child.deviceType}</p>
        </div>
      </div>

      {child.lastLocation && (
        <div className="mb-3 p-2 rounded-lg bg-mlinzi-dark/50">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MapPin className="w-4 h-4 text-mlinzi-primary" />
            <span>{child.lastLocation.address}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            {formatEAT(child.lastLocation.timestamp)} | {child.batteryPercent}% batri
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {child.zones.map((zone) => (
          <span
            key={zone.id}
            className={cn(
              'mlinzi-badge text-xs',
              zone.status === 'inside'
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : zone.status === 'near'
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            )}
          >
            {zone.type === 'home' ? <Home className="w-3 h-3 mr-1" /> : <School className="w-3 h-3 mr-1" />}
            {zone.name}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={() => onTalk(child.id)} className="flex-1 mlinzi-button text-xs py-1.5">
          Zungumza
        </button>
        <button onClick={() => onLocate(child.id)} className="flex-1 mlinzi-button text-xs py-1.5 bg-mlinzi-sky/20 text-mlinzi-sky hover:bg-mlinzi-sky/30">
          Mahali
        </button>
      </div>

      {child.medicalAlerts.length > 0 && (
        <div className="mt-3 p-2 rounded-lg bg-mlinzi-accent/10 border border-mlinzi-accent/20">
          <div className="flex items-center gap-2 text-xs text-mlinzi-accent">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{child.medicalAlerts.join(', ')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
