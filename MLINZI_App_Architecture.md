# 📱 MLINZI MOBILE APP v3.0
## Complete Frontend Architecture for n8n Backend Integration
### Hub31 iSense · Kenya-First Child Safety Platform

---

## 🎯 APP OVERVIEW

| Property | Specification |
|----------|-------------|
| **Platform** | React Native 0.74 (iOS/Android) + Next.js 14 PWA (Web fallback) |
| **Target Markets** | Kenya (primary), Tanzania, Uganda, Rwanda (secondary) |
| **Minimum OS** | Android 8.0 (API 26) / iOS 14 |
| **Bundle Size** | <15MB (core), <25MB (with offline maps) |
| **Offline Support** | Full SOS + NFC + QR functionality without internet |
| **Languages** | Swahili (default), English, Kikuyu, Dholuo, Kamba, Arabic |
| **Accessibility** | WCAG 2.1 AA, VoiceOver/TalkBack, high contrast mode |

---

## 🏗️ APP ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRESENTATION LAYER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   SCREENS   │ │  COMPONENTS │ │    HOOKS    │ │   CONTEXT   │           │
│  │             │ │             │ │             │ │   PROVIDERS │           │
│  │ • Splash    │ │ • ChildCard │ │ • useSafety │ │ • Auth      │           │
│  │ • Onboard   │ │ • AlertBar  │ │ • useLocation│ │ • Child     │           │
│  │ • Dashboard │ │ • MapView   │ │ • useNFC    │ │ • Emergency │           │
│  │ • Map       │ │ • SOSButton │ │ • useQR     │ │ • Privacy   │           │
│  │ • Alerts    │ │ • ChatBubble│ │ • useCrypto │ │ • Theme     │           │
│  │ • Settings  │ │ • StatusDot │ │ • useAudio  │ │ • Locale    │           │
│  │ • QRRescue  │ │ • ProofBadge│ │ • useMesh   │ │ • Network   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────────────────────┤
│                              BUSINESS LOGIC LAYER                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   SERVICES  │ │   MANAGERS  │ │   WORKERS   │ │   UTILS     │           │
│  │             │ │             │ │             │ │             │           │
│  │ • n8nAPI    │ │ • SafetyMgr │ │ • bgSync    │ │ • Crypto    │           │
│  │ • WebSocket │ │ • AlertMgr  │ │ • bgLocation│ │ • ZKLP      │           │
│  │ • NFCManager│ │ • ChildMgr  │ │ • bgAudio   │ │ • DPNoise   │           │
│  │ • GPSManager│ │ • SchoolMgr │ │ • meshRelay │ │ • Merkle    │           │
│  │ • AudioMgr  │ │ • ParentMgr │ │ • deadMan   │ │ • DPA       │           │
│  │ • MeshMgr   │ │ • DeviceMgr │ │ • autoPurge │ │ • i18n      │           │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────────────────────┤
│                              INFRASTRUCTURE LAYER                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   STORAGE   │ │   NETWORK   │ │  HARDWARE   │ │   SECURITY  │           │
│  │             │ │             │ │             │ │             │           │
│  │ • AsyncStore│ │ • Axios     │ │ • GPS       │ │ • Keychain  │           │
│  │ • SQLite    │ │ • WebSocket │ │ • NFC       │ │ • Biometric │           │
│  │ • MMKV      │ │ • mTLS      │ │ • BLE       │ │ • TPMBridge │           │
│  │ • Encrypted │ │ • Retry     │ │ • Camera    │ │ • ML-KEM    │           │
│  │ • MapCache  │ │ • OfflineQ  │ │ • Speaker   │ │ • ML-DSA    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📲 SCREEN-BY-SCREEN SPECIFICATION

### 1. SPLASH SCREEN
```
Duration: 2.5 seconds (minimum for TPM attestation init)
Visual: Animated Mlinzi shield logo with quantum particle effect
Audio: Subtle Swahili chime "Mlinzi ameamka" (Guardian is awake)
Actions:
  • Initialize Secure Element connection
  • Check TPM attestation status
  • Verify ML-DSA device keypair
  • Load cached parent session
  • If no session → Navigate to Onboarding
  • If session exists → Navigate to Dashboard
```

### 2. ONBOARDING FLOW (5 Steps)

#### Step 1: Language Selection
```
Options: [🇰🇪 Kiswahili] [🇬🇧 English] [🇫🇷 Français] [🇩🇪 Deutsch] [🇪🇸 Español]
         [🌍 Kikuyu] [🌍 Dholuo] [🌍 Kamba] [🇸🇦 العربية]
Default: Auto-detect from device locale (sw_KE → Swahili)
Storage: Persist in MMKV with encryption
```

#### Step 2: Parent Identity Verification
```
Fields:
  • Full Name (text, Swahili/English regex validation)
  • National ID / Passport (Kenyan HUDUMA number format validation)
  • Phone Number (+254 format, SMS OTP verification)
  • Email (optional, for backup notifications)
  • Relationship to Child (Mother/Father/Guardian/Other)

Security:
  • Phone verified via AfricasTalking OTP API
  • Identity hash generated (SHA3-256 + MLINZI_SALT)
  • Consent token created and blockchain-anchored
  • Kenya DPA Section 33 parental consent recorded
```

#### Step 3: Child Registration
```
Fields:
  • Child's First Name (max 30 chars, no special chars)
  • Child's Age (slider 3-18, stored as age_range for privacy)
  • Child's Photo (optional, encrypted with ML-KEM, never on blockchain)
  • Medical Alerts (multi-select: Asthma, Allergies, Diabetes, Epilepsy, Other)
  • Blood Group (A+/A-/B+/B-/AB+/AB-/O+/O-/Unknown)
  • School Name (searchable database of Kenyan schools)
  • School NFC Gate ID (auto-populated from school selection)
  • Geofence Zones (home, school, after-school, custom)

Privacy:
  • Photo encrypted at rest (AES-256-GCM with ML-KEM derived key)
  • Medical data encrypted, only hash stored on blockchain
  • Age stored as range (e.g., "7-10") not exact birthday
  • Kenya DPA Section 41 privacy-by-design enforced
```

#### Step 4: Device Pairing
```
Process:
  1. Scan QR code on wearable OR tap NFC to initiate pairing
  2. Device sends TPM EK public key + AIK certificate chain
  3. App verifies certificate chain against Mlinzi Root CA
  4. App generates ephemeral ML-KEM keypair
  5. Key encapsulation sent to device (encrypted config)
  6. Device acknowledges with ML-DSA signature
  7. Pairing recorded on blockchain (device_hash + parent_hash)

Supported Devices:
  • Mlinzi Smartwatch (GPS+NFC+SOS+Audio, IP68)
  • Mlinzi Bracelet (NFC+BLE, IP68)
  • Mlinzi Ring (NFC+micro-GPS)
  • Mlinzi School Card (NFC tap-in/out)
```

#### Step 5: Emergency Contacts & Permissions
```
Fields:
  • Secondary Parent/Guardian Phone
  • Trusted Neighbor Phone (optional)
  • School Admin Phone (auto-populated)
  • Authority Preference (Police 999 / DCI / Local Chief)

Permissions:
  • Location: Always Allow (required for geofence)
  • Notifications: Critical Alerts (bypass Do Not Disturb)
  • Camera: For QR rescue scanning
  • NFC: For school tap-in/out
  • Bluetooth: For mesh relay and wearable sync
  • Microphone: For SOS two-way audio

Consent Record:
  • Blockchain-verified consent token generated
  • ODPC-compliant consent PDF generated and emailed
  • 72-hour cooling-off period with full data deletion option
```

### 3. DASHBOARD (Home Screen)

```
┌─────────────────────────────────────────┐
│  🔐 Mlinzi v3.0    🔔 3    ⚙️           │
├─────────────────────────────────────────┤
│                                         │
│  👧 AMARA                    [ONLINE]   │
│  ┌─────────────────────────────────┐    │
│  │  🗺️  [Live Map Preview]         │    │
│  │     Westlands, Nairobi          │    │
│  │     Last update: 30s ago        │    │
│  └─────────────────────────────────┘    │
│                                         │
│  📍 Zones:  🟢 Home  🟢 School  🔴 Shop │
│                                         │
│  🔋 72%  📶 Strong  🛡️ TPM OK          │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │  🗣️     │ │  📍     │ │  📋     │  │
│  │  Talk   │ │  Locate │ │ History │  │
│  └─────────┘ └─────────┘ └─────────┘  │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │      🆘 EMERGENCY SOS             │  │
│  │    Press and hold for 3 seconds   │  │
│  └─────────────────────────────────┘  │
│                                         │
│  📅 Today: ✅ Arrived school 07:45     │
│            ⏳ Expected home 15:30       │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- **Child Status Card**: Real-time location, battery, connectivity, TPM status
- **Zone Status**: Color-coded geofence indicators (🟢 inside, 🟡 near edge, 🔴 outside)
- **Quick Actions**: Talk (push-to-talk), Locate (force GPS refresh), History (timeline)
- **SOS Button**: Large, always visible, requires 3-second press-and-hold to prevent accidental trigger
- **Daily Timeline**: NFC tap-in/out, geofence events, AI-verified activities
- **Security Badge**: Green shield = all systems secure, Yellow = minor issue, Red = action needed

### 4. LIVE MAP SCREEN

```
┌─────────────────────────────────────────┐
│  ← Back    🗺️ Amara's Location    🔒   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │      [Google Maps / Mapbox]     │    │
│  │                                 │    │
│  │         📍 Amara                │    │
│  │         🏫 School Zone          │    │
│  │         🏠 Home Zone            │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  📍 Westlands, Nairobi                 │
│  ⏰ Updated: 14:32 EAT (30s ago)        │
│  🛡️ ZKLP: Location verified privately   │
│                                         │
│  [📍 Refresh]  [🗺️ Directions]  [📤]   │
│                                         │
│  Privacy: Exact coords hidden.           │
│  Showing 500m radius for safety.        │
│                                         │
└─────────────────────────────────────────┘
```

**Privacy Controls:**
- **Parent View**: Exact coordinates for CRITICAL/HIGH events only
- **Standard View**: 500m radius blur with ZKLP verification badge
- **Share Location**: Generate time-limited secure link (ML-KEM encrypted)
- **History Trail**: 24-hour breadcrumb with differential privacy applied

### 5. ALERTS & NOTIFICATIONS SCREEN

```
┌─────────────────────────────────────────┐
│  ← Back    🚨 Alerts & History          │
├─────────────────────────────────────────┤
│                                         │
│  🔴 CRITICAL — SOS Triggered            │
│  👧 Amara | 14:32 EAT                   │
│  "SOS button pressed. Location shared." │
│  [View Details] [Mark Resolved]         │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  🟡 HIGH — Unexpected Exit              │
│  👧 Amara | 12:15 EAT                   │
│  "Left school at 12:15 (expected 15:30)"│
│  [View Details] [Contact School]        │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  🟢 NORMAL — Arrived School             │
│  👧 Amara | 07:45 EAT                   │
│  "Safely arrived at Nairobi Primary"    │
│  [View Details]                         │
│                                         │
│  Filter: [All] [Critical] [High] [Normal]│
│                                         │
└─────────────────────────────────────────┘
```

**Alert Details View:**
- Full event timeline with TPM verification status
- AI risk assessment with confidence score
- Blockchain transaction hash (link to Polygonscan)
- Threshold signature verification
- Kenya DPA compliance metadata
- Evidence download (for authorities if needed)

### 6. SETTINGS SCREEN

```
┌─────────────────────────────────────────┐
│  ← Back    ⚙️ Settings                  │
├─────────────────────────────────────────┤
│                                         │
│  👤 PARENT PROFILE                      │
│  Name: Jane Doe                         │
│  Phone: +254 720 860034                 │
│  [Edit Profile] [Change PIN]            │
│                                         │
│  👧 CHILD PROFILES                      │
│  ├─ Amara (9) — Smartwatch MLZ-001     │
│  │   [Edit] [Replace Device] [Remove]   │
│  └─ [+ Add Child]                      │
│                                         │
│  🔔 NOTIFICATIONS                       │
│  ├─ Critical Alerts: 🔊 Loud + Vibrate │
│  ├─ High Priority: 🔊 Sound            │
│  ├─ Normal: 🔕 Silent (badge only)       │
│  └─ Do Not Disturb Override: ✅ ON     │
│                                         │
│  🛡️ SECURITY                            │
│  ├─ Biometric Login: ✅ Fingerprint    │
│  ├─ App PIN: ****                      │
│  ├─ TPM Status: 🟢 Verified            │
│  ├─ PQC Keys: 🟢 ML-KEM + ML-DSA       │
│  └─ Blockchain Anchor: [View on Chain] │
│                                         │
│  🌍 LANGUAGE & REGION                   │
│  ├─ Language: Kiswahili                │
│  ├─ Region: Nairobi, Kenya             │
│  └─ Time Zone: Africa/Nairobi (EAT)   │
│                                         │
│  🔒 PRIVACY                             │
│  ├─ Data Retention: 30 days (HIGH)     │
│  ├─ Auto-Purge: ✅ Enabled              │
│  ├─ ZKLP Proofs: ✅ Enabled             │
│  ├─ Differential Privacy: ε=0.1         │
│  ├─ Export My Data: [Request]          │
│  └─ Delete Account: [Request]          │
│                                         │
│  📜 LEGAL                               │
│  ├─ Terms of Service                   │
│  ├─ Privacy Policy (Kenya DPA 2019)    │
│  ├─ ODPC Registration: #MLZ-2025-XXXX  │
│  └─ Consent History: [View Blockchain] │
│                                         │
└─────────────────────────────────────────┘
```

### 7. QR RESCUE SCREEN (Finder View)

```
┌─────────────────────────────────────────┐
│  🆘 MLINZI RESCUE — Emergency Help      │
├─────────────────────────────────────────┤
│                                         │
│  This child may need help.              │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  👧 FIRST NAME: AMARA           │    │
│  │  🩺 MEDICAL: Asthma — carries   │    │
│  │     inhaler (verify with child) │    │
│  │  🩸 BLOOD GROUP: O+             │    │
│  │                                 │    │
│  │  📞 PARENT: +254 72****34     │    │
│  │  📞 MLINZI HOTLINE:             │    │
│  │     +254 720 860034             │    │
│  │                                 │    │
│  │  ⚠️ NO ADDRESS OR SCHOOL NAME   │    │
│  │     SHOWN FOR PRIVACY           │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [📞 Call Parent]  [📞 Call Mlinzi]     │
│                                         │
│  Language: [🇰🇪 Swahili] [🇬🇧 English]   │
│                                         │
│  Location shared with parent only.     │
│  This page is blockchain-verified.      │
│                                         │
│  _Mlinzi v3.0 | Hub31 iSense_           │
│  _Kenya DPA 2019 Compliant_             │
│                                         │
└─────────────────────────────────────────┘
```

**Security Features:**
- **No Surname**: Only first name displayed
- **No Address**: Location shared only with parent via secure channel
- **No School Name**: Educational institution protected
- **Masked Phone**: Partial number with click-to-reveal (rate-limited)
- **Medical Alerts**: Only critical life-saving info (allergies, blood group)
- **Blockchain Verification**: Page hash verifiable on Polygon
- **Finder Language**: Auto-detected from browser locale

---

## 🔌 API CONTRACTS (n8n Integration)

### 1. Device → n8n Webhook (L0 Gateway)

```http
POST https://n8n.hub31.xyz/webhook/mlinzi-attested-gateway
Content-Type: application/json
X-Device-Signature: ML-DSA-SIG-...
X-ML-KEM-Ciphertext: ...
X-TPM-Attestation: ...

{
  "device_id": "MLZ-WATCH-001",
  "device_type": "smartwatch",
  "child_name_encrypted": "ML-KEM-BASE64...",
  "child_age_range": "7-10",
  "parent_phone_hash": "sha3-256...",
  "parent_locale": "sw",
  "event_type": "geofence_breach",
  "lat": -1.2850,
  "lng": 36.8230,
  "accuracy_meters": 8,
  "speed_kmh": 18,
  "timestamp": "2026-05-19T14:32:00+03:00",
  "nonce": "uuid-v4",
  "nonce_expiry": "2026-05-19T14:37:00+03:00",
  "battery_percent": 72,
  "firmware_version": "3.0.2",
  "tpm_attestation": {
    "pcr_values": [...],
    "aik_signature": "...",
    "aik_cert_chain": ["MLZ-ROOT-CA-v3", "MLZ-DEVICE-CA", "MLZ-AIK-001"],
    "quote_nonce": "uuid-v4"
  },
  "device_signature": "ML-DSA-...",
  "zklp_proof": "ZK-SNARK-...",
  "medical_alerts_hash": "sha3-256...",
  "data_classification": "HIGH",
  "device_hash": "0x..."
}
```

### 2. n8n → App (WebSocket Push)

```javascript
// WebSocket: wss://realtime.mlinzi.app/ws?token=JWT&device=MLZ-WATCH-001

{
  "type": "ALERT",
  "priority": "CRITICAL",
  "timestamp": "2026-05-19T14:32:05+03:00",
  "payload": {
    "notification_type": "SOS_EMERGENCY",
    "child_id_hash": "0x...",
    "child_name": "Amara", // Decrypted in-app with parent's ML-KEM key
    "risk_level": "CRITICAL",
    "severity_score": 95,
    "message": "🆘 DHARURA — HATUA ZA HARAKA...",
    "message_en": "🆘 SOS EMERGENCY — IMMEDIATE ACTION...",
    "location_zone_hash": "sha3-256...",
    "google_maps_url": "https://maps.google.com/?q=...", // Only for CRITICAL
    "tamper_evident_hash": "sha3-256...",
    "threshold_status": "3/3 guardians signed",
    "blockchain_tx": "0x...",
    "kenya_dpa": {
      "dpia_required": true,
      "lawful_basis": "Vital Interests + Parental Consent"
    }
  },
  "signature": "ML-DSA-SIG-...", // App verifies against n8n public key
  "expires_at": "2026-05-19T14:37:05+03:00"
}
```

### 3. App → n8n (Parent Approval Response)

```http
POST https://n8n.hub31.xyz/webhook/mlinzi-approval-gate
Authorization: Bearer PARENT_JWT

{
  "approval_id": "MLZ-APPROVAL-...",
  "parent_phone_hash": "sha3-256...",
  "child_id_hash": "0x...",
  "event_hash": "sha3-256...",
  "decision": "APPROVE_ESCALATION", // or "DISMISS" or "REQUEST_CALLBACK"
  "parent_pin": "****", // Verified against Keychain
  "biometric_verified": true,
  "timestamp": "2026-05-19T14:33:00+03:00",
  "device_signature": "ML-DSA-..." // Signed with parent's device key
}
```

### 4. App → n8n (Location Refresh Request)

```http
POST https://n8n.hub31.xyz/webhook/mlinzi-location-refresh
Authorization: Bearer PARENT_JWT

{
  "device_id": "MLZ-WATCH-001",
  "parent_phone_hash": "sha3-256...",
  "request_type": "FORCE_GPS_REFRESH",
  "reason": "PARENT_INITIATED",
  "timestamp": "2026-05-19T14:30:00+03:00",
  "signature": "ML-DSA-..."
}

// Response (privacy-preserving)
{
  "status": "success",
  "zone_hash": "sha3-256...",
  "zklp_proof": "ZK-SNARK-...",
  "accuracy_meters": 500, // Blurred for non-critical
  "last_update": "2026-05-19T14:32:00+03:00",
  "battery_percent": 72,
  "tamper_evident_hash": "sha3-256..."
}
```

---

## 🔐 SECURITY IMPLEMENTATION

### Mobile App Cryptography

```typescript
// src/crypto/MlinziCrypto.ts

class MlinziCrypto {
  // ML-KEM-1024 Key Encapsulation
  async encapsulateSecret(publicKey: Uint8Array): Promise<{
    ciphertext: Uint8Array;
    sharedSecret: Uint8Array;
  }> {
    // Uses liboqs or wasm module for PQC operations
    return mlKem1024.encapsulate(publicKey);
  }

  // ML-DSA-65 Signature Generation
  async signMessage(message: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array> {
    return mlDsa65.sign(message, privateKey);
  }

  // ZKLP Proof Generation (for geofence verification)
  async generateZKLPProof(
    exactLat: number,
    exactLng: number,
    geofencePolygon: GeoPolygon
  ): Promise<ZKLPProof> {
    // Uses gnark WASM for mobile-friendly ZK-SNARK generation
    const circuit = new GeofenceCircuit();
    circuit.assign({ exactLat, exactLng, polygon: geofencePolygon });
    return await groth16Prove(circuit);
  }

  // Differential Privacy Noise
  addDifferentialPrivacyNoise(value: number, epsilon: number = 0.1): number {
    const u = Math.random() - 0.5;
    const sensitivity = 0.1;
    const noise = -(sensitivity / epsilon) * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
    return value + noise;
  }
}
```

### Secure Storage

```typescript
// src/storage/SecureStorage.ts

class SecureStorage {
  // iOS: Keychain, Android: Keystore + EncryptedSharedPreferences

  async storeParentKeys(keypair: MLKEMKeypair) {
    await Keychain.setGenericPassword(
      'mlinzi_parent_mlkem',
      Buffer.from(keypair.privateKey).toString('base64'),
      { service: 'com.hub31.mlinzi.pqc', accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED }
    );
  }

  async storeChildData(childId: string, data: EncryptedChildData) {
    // AES-256-GCM with key derived from ML-KEM shared secret
    const encrypted = await aesGcmEncrypt(data, await this.getDerivedKey());
    await MMKV.setString(`child_${childId}`, encrypted);
  }

  async getTPMAttestation(): Promise<TPMAttestation> {
    // Bridge to native TPM module
    return await NativeModules.TPMBridge.getAttestationQuote();
  }
}
```

---

## 📡 OFFLINE & MESH CAPABILITIES

### Offline Mode
```
When internet unavailable:
  1. Device stores events in local SQLite queue
  2. BLE beacon broadcasts SOS to nearby Mlinzi devices
  3. NFC tap-in/out stored locally, synced when online
  4. QR rescue page works from cached HTML (no server needed)
  5. Audio SOS recorded locally, uploaded when connection restored
```

### Mesh Relay Protocol
```
Device A (offline) → BLE broadcast → Device B (online) → Internet → n8n
  • Packet signed with FN-DSA (Falcon) for low power
  • Hop limit: 3 devices max to prevent flooding
  • Priority: SOS > Geofence > NFC > GPS update
  • Reward: Mesh relay earns Mlinzi loyalty points
```

---

## 🎨 DESIGN SYSTEM

### Colors (Kenya-Inspired)
```css
:root {
  --mlinzi-primary: #00A86B;      /* Kenyan green — safety, growth */
  --mlinzi-secondary: #000000;    /* Black — strength, resilience */
  --mlinzi-accent: #FF0000;       /* Red — emergency, urgency */
  --mlinzi-gold: #FFD700;         /* Gold — premium, trusted */
  --mlinzi-sky: #87CEEB;          /* Sky blue — calm, clarity */
  --mlinzi-dark: #1a1a2e;         /* Dark mode background */
  --mlinzi-light: #f0f0f5;        /* Light mode background */
}
```

### Typography
```
Primary: Inter (Latin scripts), Noto Sans (Arabic), system fonts (African scripts)
Headings: 24-32px, Bold
Body: 16px, Regular
Captions: 12px, Medium
SOS Button: 48px, Extra Bold, ALL CAPS
```

### Accessibility
```
• Minimum touch target: 48x48dp
• Color contrast ratio: 4.5:1 minimum
• Screen reader labels on all interactive elements
• Haptic feedback on SOS button (3 pulses = 3-second hold)
• Voice commands: "Mlinzi, where is Amara?"
• High contrast mode for outdoor visibility
```

---

## 🚀 DEPLOYMENT CONFIGURATION

### Environment Variables
```bash
# .env.production
N8N_WEBHOOK_URL=https://n8n.hub31.xyz/webhook/mlinzi-attested-gateway
N8N_WS_URL=wss://realtime.mlinzi.app/ws
MLINZI_API_KEY=production_key_from_vault
MAPBOX_TOKEN=pk.eyJ1... # For offline map tiles
AFRICASTALKING_API_KEY=atk_...
AFRICASTALKING_USERNAME=mlinzi_hub31
FIREBASE_PROJECT_ID=mlinzi-hub31
PQC_WASM_PATH=./assets/liboqs.wasm
TPM_BRIDGE_NATIVE=true
ODPC_REGISTRATION=MLZ-2025-XXXX
KENYA_DPA_MODE=strict
```

### Build Commands
```bash
# Android
npx react-native run-android --variant=release
# iOS
npx react-native run-ios --configuration=Release
# Web PWA
next build && next export
```

---

## 📊 APP METRICS & ANALYTICS

| Metric | Target | Privacy |
|--------|--------|---------|
| App Launch Time | <2s | Local only |
| GPS Accuracy | ±8m (critical), ±500m (standard) | DP applied |
| WebSocket Latency | <200ms | Aggregated |
| Offline Sync Time | <5s when online | No PII logged |
| Crash Rate | <0.1% | Firebase Crashlytics |
| Battery Impact | <5%/hour background | Optimized |
| APK Size | <15MB | Stripped |

---

*Document Version: 3.0.0*
*Author: Hub31 iSense Frontend Architecture Team*
*Date: 2026-05-19*
