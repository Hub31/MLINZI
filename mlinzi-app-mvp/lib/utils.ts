import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format phone number to Kenyan format
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('0')) {
    return `+254${cleaned.slice(1)}`;
  }
  return `+${cleaned}`;
}

// Format timestamp to EAT (East Africa Time)
export function formatEAT(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('sw-KE', {
    timeZone: 'Africa/Nairobi',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

// Get risk level color
export function getRiskColor(level: string): string {
  const colors: Record<string, string> = {
    CRITICAL: 'text-red-500 bg-red-500/20 border-red-500/30',
    HIGH: 'text-orange-500 bg-orange-500/20 border-orange-500/30',
    MEDIUM: 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30',
    LOW: 'text-green-500 bg-green-500/20 border-green-500/30',
    MONITOR: 'text-blue-500 bg-blue-500/20 border-blue-500/30',
  };
  return colors[level] || colors.MONITOR;
}

// Get risk icon
export function getRiskIcon(level: string): string {
  const icons: Record<string, string> = {
    CRITICAL: '🔴',
    HIGH: '🟠',
    MEDIUM: '🟡',
    LOW: '🟢',
    MONITOR: '🔵',
  };
  return icons[level] || '⚪';
}

// Generate tamper-evident hash (client-side placeholder)
export function generateClientHash(data: Record<string, unknown>): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `0x${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
