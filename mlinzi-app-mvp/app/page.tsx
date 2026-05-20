'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { ChildCard } from '@/components/ChildCard';
import { SOSButton } from '@/components/SOSButton';
import { AlertCard } from '@/components/AlertCard';
import { Child, Alert, DashboardStats } from '@/types';
import { cn } from '@/lib/utils';
import { RefreshCw, Activity, Shield, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Demo data — replace with real API calls
const demoChildren: Child[] = [
  {
    id: 'child-001',
    name: 'Amara',
    age: 9,
    ageRange: '7-10',
    deviceId: 'MLZ-WATCH-001',
    deviceType: 'smartwatch',
    schoolName: 'Nairobi Primary School',
    schoolGateId: 'NPG-GATE-01',
    medicalAlerts: ['Asthma - carries inhaler'],
    bloodGroup: 'O+',
    status: 'online',
    batteryPercent: 72,
    lastLocation: {
      lat: -1.285,
      lng: 36.823,
      address: 'Westlands, Nairobi',
      timestamp: '2026-05-20T08:15:00+03:00',
    },
    zones: [
      { id: 'zone-home', name: 'Nyumbani', type: 'home', status: 'outside' },
      { id: 'zone-school', name: 'Shule', type: 'school', status: 'inside' },
      { id: 'zone-shop', name: 'Duka', type: 'custom', status: 'outside' },
    ],
  },
];

const demoAlerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'nfc_tap_in',
    riskLevel: 'MONITOR',
    severity: 5,
    childId: 'child-001',
    childName: 'Amara',
    message: 'Amara amefika shuleni salama. TPM imethibitishwa. Blockchain hash imewekwa.',
    messageEn: 'Amara has arrived at school safely. TPM verified. Blockchain hash recorded.',
    timestamp: '2026-05-20T07:45:00+03:00',
    eatTime: '20 Mei 2026, 07:45',
    location: { lat: -1.292, lng: 36.821, address: 'Nairobi Primary School' },
    blockchainHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa5d0...',
    thresholdStatus: '1/1 guardians',
    isRead: true,
    isResolved: true,
  },
  {
    id: 'alert-002',
    type: 'geofence_breach',
    riskLevel: 'HIGH',
    severity: 65,
    childId: 'child-001',
    childName: 'Amara',
    message: 'Amara amevuka mpaka wa shule! Muda wa kutoka ulikuwa 15:30. Tafadhali angalia.',
    messageEn: 'Amara has breached the school zone! Expected exit was 15:30. Please check.',
    timestamp: '2026-05-20T12:15:00+03:00',
    eatTime: '20 Mei 2026, 12:15',
    location: { lat: -1.285, lng: 36.823, address: 'Westlands, Nairobi' },
    mapUrl: 'https://www.google.com/maps?q=-1.285,36.823',
    blockchainHash: '0x3a2f8c4d9e1b7a6f5c3d2e8b1a4f7c6d9e3b2a1f...',
    thresholdStatus: '2/3 guardians',
    isRead: false,
    isResolved: false,
  },
];

const demoStats: DashboardStats = {
  totalAlerts: 2,
  criticalAlerts: 0,
  highAlerts: 1,
  resolvedAlerts: 1,
  childrenOnline: 1,
  childrenOffline: 0,
  lastSync: '2026-05-20T08:20:00+03:00',
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alerts' | 'map'>('dashboard');
  const [alerts, setAlerts] = useState<Alert[]>(demoAlerts);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    toast.loading('Inasasisha data...');
    await new Promise((r) => setTimeout(r, 1500));
    toast.success('Data imesasishwa');
    setIsRefreshing(false);
  }, []);

  const handleResolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isResolved: true } : a))
    );
    toast.success('Tukio limetatuliwa');
  }, []);

  const handleLocate = useCallback((childId: string) => {
    toast.success(`Inapata mahali pa ${childId}...`);
  }, []);

  const handleTalk = useCallback((childId: string) => {
    toast.success(`Inaanisha mawasiliano na ${childId}...`);
  }, []);

  const unreadCount = alerts.filter((a) => !a.isRead && !a.isResolved).length;

  return (
    <div className="min-h-screen bg-mlinzi-dark">
      <Header unreadCount={unreadCount} onSettingsClick={() => toast('Mipangilio inakuja hivi karibuni')} />

      <main className="max-w-lg mx-auto px-4 py-4 pb-24">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <StatCard icon={<Users className="w-4 h-4" />} label="Watoto" value={demoStats.childrenOnline} color="green" />
          <StatCard icon={<AlertTriangle className="w-4 h-4" />} label="Dharura" value={demoStats.highAlerts} color="red" />
          <StatCard icon={<CheckCircle className="w-4 h-4" />} label="Tatuliwa" value={demoStats.resolvedAlerts} color="blue" />
          <StatCard icon={<Shield className="w-4 h-4" />} label="TPM" value="OK" color="green" />
        </div>

        {/* Refresh button */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs text-gray-500">
            Mwisho wa usasisho: {new Date(demoStats.lastSync).toLocaleTimeString('sw-KE')}
          </p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 text-xs text-mlinzi-primary hover:text-mlinzi-primary/80 transition-colors"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin')} />
            Sasisha
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-4 p-1 bg-mlinzi-secondary/30 rounded-xl">
          {(['dashboard', 'alerts', 'map'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-2 rounded-lg text-xs font-medium transition-all',
                activeTab === tab
                  ? 'bg-mlinzi-primary text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-mlinzi-secondary/50'
              )}
            >
              {tab === 'dashboard' && 'Dashibodi'}
              {tab === 'alerts' && `Tukio (${alerts.length})`}
              {tab === 'map' && 'Ramani'}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {demoChildren.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                onLocate={handleLocate}
                onTalk={handleTalk}
              />
            ))}

            <SOSButton
              deviceId="MLZ-WATCH-001"
              childName="Amara"
              lat={-1.285}
              lng={36.823}
            />

            <div className="mlinzi-card">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-mlinzi-primary" />
                Shughuli za Leo
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span>07:45 — Amara amefika shuleni</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>12:15 — Amara ametoka shule mapema</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-gray-500" />
                  <span>15:30 — Muda wa kutoka shule (tarajiwa)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Hakuna tukio kwa sasa</p>
                <p className="text-xs mt-1">Mlinzi analinda vizuri</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onResolve={handleResolveAlert}
                  onViewDetails={(id) => toast(`Maelezo ya tukio ${id}`)}
                />
              ))
            )}
          </div>
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="mlinzi-card h-96 flex flex-col items-center justify-center text-center">
            <MapPin className="w-12 h-12 text-mlinzi-primary/30 mb-3" />
            <p className="text-gray-400 text-sm">Ramani ya Mubashara</p>
            <p className="text-xs text-gray-500 mt-1">
              Unganisha na Mapbox API kuona mahali pa mtoto wako
            </p>
            <button className="mlinzi-button mt-4 text-xs" onClick={() => toast('Mapbox integration coming soon')}>
              Weka Mapbox Token
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-mlinzi-dark/95 backdrop-blur-md border-t border-mlinzi-primary/10 py-2">
        <div className="max-w-lg mx-auto px-4 flex justify-between items-center text-[10px] text-gray-500">
          <span>Mlinzi v3.0 | Quantum Guardian</span>
          <span>ODPC Compliant | Kenya DPA 2019</span>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'green' | 'red' | 'blue' | 'yellow';
}) {
  const colorClasses = {
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  };

  return (
    <div className={cn('rounded-xl p-2 border text-center', colorClasses[color])}>
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[10px] opacity-80">{label}</div>
    </div>
  );
}

function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
