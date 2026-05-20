export interface Child {
  id: string;
  name: string;
  age: number;
  ageRange: string;
  deviceId: string;
  deviceType: 'smartwatch' | 'bracelet' | 'ring' | 'nfc_card';
  schoolName: string;
  schoolGateId: string;
  medicalAlerts: string[];
  bloodGroup: string;
  photoUrl?: string;
  status: 'online' | 'offline' | 'sos';
  batteryPercent: number;
  lastLocation?: {
    lat: number;
    lng: number;
    address: string;
    timestamp: string;
  };
  zones: {
    id: string;
    name: string;
    type: 'home' | 'school' | 'custom';
    status: 'inside' | 'outside' | 'near';
  }[];
}

export interface Alert {
  id: string;
  type: 'sos' | 'geofence_breach' | 'nfc_tap_in' | 'nfc_tap_out' | 'qr_rescue_scan' | 'low_battery';
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MONITOR';
  severity: number;
  childId: string;
  childName: string;
  message: string;
  messageEn: string;
  timestamp: string;
  eatTime: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  mapUrl?: string;
  blockchainHash: string;
  thresholdStatus: string;
  isRead: boolean;
  isResolved: boolean;
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email?: string;
  locale: 'sw' | 'en' | 'fr' | 'de' | 'es' | 'ki' | 'luo' | 'kam' | 'ar';
  children: Child[];
  settings: {
    notifications: {
      critical: 'sound+vibrate' | 'sound' | 'silent';
      high: 'sound' | 'silent';
      normal: 'silent' | 'off';
    };
    biometricLogin: boolean;
    autoPurge: boolean;
    dataRetention: number;
  };
}

export interface DashboardStats {
  totalAlerts: number;
  criticalAlerts: number;
  highAlerts: number;
  resolvedAlerts: number;
  childrenOnline: number;
  childrenOffline: number;
  lastSync: string;
}
