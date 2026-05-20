'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { triggerSOS } from '@/lib/n8n-client';
import { AlertTriangle } from 'lucide-react';

interface SOSButtonProps {
  deviceId: string;
  childName: string;
  lat: number;
  lng: number;
  className?: string;
}

export function SOSButton({ deviceId, childName, lat, lng, className }: SOSButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const handlePressStart = useCallback(() => {
    setIsPressed(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 3.33;
      });
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsSending(true);
      triggerSOS(deviceId, childName, lat, lng).finally(() => {
        setIsSending(false);
        setIsPressed(false);
        setProgress(0);
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [deviceId, childName, lat, lng]);

  const handlePressEnd = useCallback(() => {
    if (!isSending) {
      setIsPressed(false);
      setProgress(0);
    }
  }, [isSending]);

  return (
    <div className={cn('relative', className)}>
      <button
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        disabled={isSending}
        className={cn(
          'relative w-full py-6 rounded-2xl font-bold text-xl tracking-wider transition-all duration-200 select-none',
          'bg-gradient-to-b from-mlinzi-accent to-red-700 text-white shadow-lg',
          'active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed',
          isPressed && 'animate-pulse-sos shadow-red-500/50 shadow-2xl'
        )}
      >
        {isPressed && (
          <div
            className="absolute inset-0 rounded-2xl border-4 border-white/30"
            style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
          />
        )}
        <div className="flex flex-col items-center gap-2">
          <AlertTriangle className={cn('w-8 h-8', isPressed && 'animate-bounce')} />
          <span>
            {isSending ? 'Inatuma DHARURA...' : isPressed ? 'HOLD...' : 'SOS — DHARURA'}
          </span>
          {!isPressed && !isSending && (
            <span className="text-xs font-normal opacity-80">Bonyeza na shikilia kwa sekunde 3</span>
          )}
        </div>
      </button>
      {isPressed && <div className="absolute inset-0 rounded-2xl animate-shield pointer-events-none" />}
    </div>
  );
}
