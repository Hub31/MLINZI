'use client';

import { Shield, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  unreadCount: number;
  onSettingsClick: () => void;
  className?: string;
}

export function Header({ unreadCount, onSettingsClick, className }: HeaderProps) {
  return (
    <header className={cn('sticky top-0 z-50 bg-mlinzi-dark/90 backdrop-blur-md border-b border-mlinzi-primary/20', className)}>
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-mlinzi-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-mlinzi-primary" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">Mlinzi</h1>
            <p className="text-[10px] text-gray-400">v3.0 Quantum Guardian</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-mlinzi-secondary/50 transition-colors">
            <Bell className="w-5 h-5 text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-mlinzi-accent text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button onClick={onSettingsClick} className="p-2 rounded-lg hover:bg-mlinzi-secondary/50 transition-colors">
            <Settings className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
