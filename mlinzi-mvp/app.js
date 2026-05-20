/**
 * ==========================================================================
 * 🧠 MLINZI v3.0 WEB MVP APPLICATION CORE ENGINE
 * ==========================================================================
 */

// 1. DYNAMIC TRANSLATION DICTIONARIES
const TRANSLATIONS = {
  sw: {
    // Stepper & Headings
    "karibu-mlinzi": "Karibu Kwenye MLINZI",
    "shikilia-kitufe": "Shikilia kitufe kuanza...",
    "dharura-imewashwa": "🆘 DHARURA IMEWASHWA!",
    "nyumbani": "Nyumbani",
    "shuleni": "Shuleni",
    "eneo-la-nje": "Eneo la Nje",
    "salama": "SALAMA",
  },
  en: {
    "karibu-mlinzi": "Welcome to MLINZI",
    "shikilia-kitufe": "Hold button to start...",
    "dharura-imewashwa": "🆘 EMERGENCY SOS ACTIVE!",
    "nyumbani": "Home",
    "shuleni": "School",
    "eneo-la-nje": "Off-bounds Zone",
    "salama": "SECURE",
  }
};

// 2. STATE STORAGE & CONFIGURATION
let appState = {
  language: 'sw', // default
  onboarded: false,
  step: 1,
  parent: {
    name: 'Jane Doe',
    phone: '+254 720 860034',
    nationalId: 'HUDUMA-123456',
    relation: 'Mother',
    responder: 'police'
  },
  child: {
    name: 'Amara',
    ageRange: '7-10',
    bloodGroup: 'O+',
    medicalAlerts: 'Asthma — carries inhaler',
    wearableId: 'MLZ-WATCH-001'
  },
  n8n: {
    webhookUrl: 'https://n8n.hub31.xyz/webhook/mlinzi-attested-gateway',
    routeActive: true
  },
  privacy: {
    epsilon: 0.1,
    autoPurge: true
  },
  telemetry: {
    tpmStatus: '🟢 Verified',
    battery: 72,
    signal: 'Strong',
    currentZone: 'School',
    coords: 'Westlands, Nairobi',
    lastUpdated: '30s ago'
  },
  alerts: [],
  logs: []
};

// Simulated Nairobi coordinates for simulation paths
const GEOLOCATIONS = {
  home: { lat: -1.2682, lng: 36.8058, name: "Home (Westlands)" },
  school: { lat: -1.2625, lng: 36.8005, name: "Nairobi Primary School" },
  shop: { lat: -1.2550, lng: 36.7890, name: "Sarit Center Shopping Mall" }
};

// Simulation Paths
const PATHS = {
  walkToSchool: [
    [-1.2682, 36.8058], // Home
    [-1.2676, 36.8051],
    [-1.2668, 36.8043],
    [-1.2660, 36.8035],
    [-1.2651, 36.8028],
    [-1.2642, 36.8021],
    [-1.2633, 36.8013],
    [-1.2625, 36.8005]  // School
  ],
  escapeSchool: [
    [-1.2625, 36.8005], // School
    [-1.2618, 36.7990],
    [-1.2608, 36.7972],
    [-1.2595, 36.7950],
    [-1.2582, 36.7930],
    [-1.2568, 36.7910],
    [-1.2550, 36.7890]  // Off-bounds (Sarit Center)
  ]
};

// Global variables for maps and Leaflet elements
let dashMap, fullMap;
let dashMarker, fullMarker;
let dashHomeCircle, dashSchoolCircle;
let fullHomeCircle, fullSchoolCircle;
let simInterval = null;
let currentPathIndex = 0;
let currentPathArray = [];
let isSimulationActive = false;

// Audio context variables for Web Audio synthesis
let audioCtx = null;
let sirenOscillator1 = null;
let sirenOscillator2 = null;
let sirenGainNode = null;
let isSirenPlaying = false;

// SOS button press-and-hold variables
let sosHoldTimer = null;
let sosHoldProgress = 0;
const SOS_HOLD_DURATION = 3000; // 3 seconds
let isSosHoldActive = false;
const progressRingCircle = document.querySelector('.progress-ring__circle');
let ringRadius, ringCircumference;

if (progressRingCircle) {
  ringRadius = progressRingCircle.r.baseVal.value;
  ringCircumference = ringRadius * 2 * Math.PI;
  progressRingCircle.style.strokeDasharray = `${ringCircumference} ${ringCircumference}`;
  progressRingCircle.style.strokeDashoffset = ringCircumference;
}

// 3. APPLICATION INITIATION
document.addEventListener('DOMContentLoaded', () => {
  // Load saved state from LocalStorage if present
  loadStateFromStorage();
  
  // Set initial UI components
  applyLanguage(appState.language);
  initializeTabs();
  setupOnboardingWizard();
  setupSettingsHandlers();
  setupSOSHandlers();
  setupSimulationHandlers();
  
  // Render high-fidelity QR Code matrix immediately
  renderQRMatrix();

  // Initialize Maps after Splash Attestation complete
  runTPMAttestationSplash();

  // Register PWA Service Worker for offline support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('[Service Worker] Registered successfully:', reg.scope))
      .catch((err) => console.error('[Service Worker] Registration failed:', err));
  }

  // Handle Online/Offline Status Banners
  const offlineBanner = document.getElementById('offline-banner');
  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      offlineBanner.classList.add('hidden');
    } else {
      offlineBanner.classList.remove('hidden');
    }
  };
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  // Initial check
  updateOnlineStatus();
});

// Splash screen simulated hardware check
function runTPMAttestationSplash() {
  const progressElem = document.getElementById('splash-progress');
  const textElem = document.getElementById('splash-status-text');
  
  let progress = 0;
  const steps = [
    { threshold: 20, sw: "Kuhakiki Chipu ya Usalama ya TPM 2.0...", en: "Verifying TPM 2.0 Hardware Attestation..." },
    { threshold: 45, sw: "Inatengeneza Funguo za Quantum ML-DSA-65...", en: "Generating ML-DSA-65 Device Keypair..." },
    { threshold: 75, sw: "Thibitisho la Makubaliano la DPA (Sheria ya Kenya)...", en: "Validating Parent DPA Consent Token..." },
    { threshold: 100, sw: "Mlinzi amewashwa salama! 🛡️", en: "Mlinzi successfully initialized! 🛡️" }
  ];

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress > 100) progress = 100;
    
    progressElem.style.width = `${progress}%`;
    
    const step = steps.find(s => progress <= s.threshold);
    if (step) {
      textElem.textContent = appState.language === 'sw' ? step.sw : step.en;
    }
    
    if (progress === 100) {
      clearInterval(interval);
      playStartupChime();
      
      setTimeout(() => {
        document.getElementById('splash-screen').style.opacity = '0';
        setTimeout(() => {
          document.getElementById('splash-screen').classList.add('hidden');
          
          // Determine path based on onboarding state
          if (appState.onboarded) {
            document.getElementById('app-container').classList.remove('hidden');
            setTimeout(() => {
              document.getElementById('app-container').classList.remove('blur-content');
              initializeLeafletMaps();
              populateInitialData();
            }, 50);
          } else {
            document.getElementById('onboarding-overlay').classList.remove('hidden');
          }
        }, 800);
      }, 600);
    }
  }, 100);
}

// 4. MOCK DATA INITIALIZATION & LOCAL STORAGE
function loadStateFromStorage() {
  const saved = localStorage.getItem('mlinzi_v3_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      appState = { ...appState, ...parsed };
    } catch (e) {
      console.warn("Could not load stored state, resetting.", e);
    }
  }
}

function saveStateToStorage() {
  localStorage.setItem('mlinzi_v3_state', JSON.stringify(appState));
}

function populateInitialData() {
  // Global Header
  document.getElementById('tel-tpm').textContent = appState.telemetry.tpmStatus;
  document.getElementById('tel-battery').textContent = `${appState.telemetry.battery}%`;
  document.getElementById('tel-signal').textContent = appState.language === 'sw' ? 'Imara' : 'Strong';
  
  // Dashboard
  document.getElementById('dash-child-name').textContent = appState.child.name;
  document.getElementById('dash-child-age').textContent = `${appState.language === 'sw' ? 'Umri' : 'Age Range'}: ${appState.child.ageRange}`;
  document.getElementById('dash-avatar-initial').textContent = appState.child.name.charAt(0).toUpperCase();
  document.getElementById('dash-coords').textContent = appState.telemetry.coords;
  document.getElementById('dash-zone-name').innerHTML = getZoneDisplayLabel(appState.telemetry.currentZone);

  // Settings
  document.getElementById('set-parent-name').value = appState.parent.name;
  document.getElementById('set-parent-phone').value = appState.parent.phone;
  document.getElementById('set-parent-relation').value = appState.parent.relation;
  document.getElementById('set-responder').value = appState.parent.responder;
  document.getElementById('set-child-name').value = appState.child.name;
  document.getElementById('set-child-age').value = appState.child.ageRange;
  document.getElementById('set-child-blood').value = appState.child.bloodGroup;
  document.getElementById('set-child-medical').value = appState.child.medicalAlerts;
  document.getElementById('set-n8n-webhook-url').value = appState.n8n.webhookUrl;
  document.getElementById('set-n8n-active').checked = appState.n8n.routeActive;
  document.getElementById('dpa-epsilon-slider').value = appState.privacy.epsilon;
  document.getElementById('epsilon-value').textContent = Number(appState.privacy.epsilon).toFixed(2);
  document.getElementById('dpa-auto-purge').checked = appState.privacy.autoPurge;
  
  // Re-generate default mock logs if alerts are empty
  if (appState.alerts.length === 0) {
    appState.alerts = [
      {
        id: 'A-101',
        type: 'normal',
        title_sw: 'Uwasilishaji Shuleni',
        title_en: 'Arrived at School',
        desc_sw: `${appState.child.name} ameingia shuleni kwa kubofya NFC saa 07:45 EAT.`,
        desc_en: `${appState.child.name} safely arrived at school via NFC Gate Check at 07:45 EAT.`,
        time: '07:45 EAT',
        pqcSig: 'ML-DSA-SIG-84a1e9... (Verified)',
        blockchainTx: '0x3c2a8f... (Anchored to Polygon)'
      },
      {
        id: 'A-102',
        type: 'normal',
        title_sw: 'Ukaguzi wa Kifaa Salama',
        title_en: 'Hardware Health Attestation',
        desc_sw: `Udhibitisho wa TPM 2.0 umekamilika. Funguo za ML-KEM ni salama.`,
        desc_en: `Device secure hardware state verified. TPM cryptoprocessor OK.`,
        time: '08:00 EAT',
        pqcSig: 'ML-DSA-SIG-2c091a... (Verified)',
        blockchainTx: '0x9d11fa... (Anchored to Polygon)'
      }
    ];
    saveStateToStorage();
  }
  
  renderTimeline();
  renderAlertsFeed();
  updateAlertCounts();
}

function getZoneDisplayLabel(zone) {
  if (zone === 'School' || zone === 'Shule') {
    return appState.language === 'sw' ? '🟢 Shuleni' : '🟢 School';
  } else if (zone === 'Home' || zone === 'Nyumbani') {
    return appState.language === 'sw' ? '🟢 Nyumbani' : '🟢 Home';
  } else {
    return appState.language === 'sw' ? '🔴 Eneo la Nje' : '🔴 Off-bounds Zone';
  }
}

// 5. TRANSLATION ENGINE IMPLEMENTATION
function applyLanguage(lang) {
  appState.language = lang;
  document.documentElement.setAttribute('lang', lang);
  
  // Language button update
  const flag = lang === 'sw' ? '🇰🇪' : '🇬🇧';
  const label = lang === 'sw' ? 'Kiswahili' : 'English';
  document.getElementById('lang-label').textContent = label;
  document.getElementById('lang-toggle-btn').querySelector('.lang-flag').textContent = flag;

  // Translate all tags
  document.querySelectorAll('[data-sw]').forEach(elem => {
    const swText = elem.getAttribute('data-sw');
    const enText = elem.getAttribute('data-en');
    elem.textContent = lang === 'sw' ? swText : enText;
  });

  // Translate inputs placeholders
  document.querySelectorAll('input[data-sw-ph]').forEach(elem => {
    const swText = elem.getAttribute('data-sw-ph');
    const enText = elem.getAttribute('data-en-ph');
    elem.placeholder = lang === 'sw' ? swText : enText;
  });

  // Reload lists to render proper localized text
  if (appState.onboarded) {
    renderTimeline();
    renderAlertsFeed();
    updateAlertCounts();
  }
}

document.getElementById('lang-toggle-btn').addEventListener('click', () => {
  const newLang = appState.language === 'sw' ? 'en' : 'sw';
  applyLanguage(newLang);
  saveStateToStorage();
});

// 6. ONBOARDING STEP WIZARD LOGIC
function setupOnboardingWizard() {
  const overlay = document.getElementById('onboarding-overlay');
  
  // Step 1: Language Buttons
  document.querySelectorAll('.language-selection-grid .lang-big-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.language-selection-grid .lang-big-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const selectedLang = btn.getAttribute('data-lang');
      applyLanguage(selectedLang);
    });
  });

  // Forward Next Navigation buttons
  document.querySelectorAll('.next-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateOnboarding(1);
    });
  });

  // Back Navigation buttons
  document.querySelectorAll('.prev-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateOnboarding(-1);
    });
  });

  // Step 2: Parent Validation -> Simulated OTP
  document.getElementById('btn-ob-step2-next').addEventListener('click', () => {
    const parentName = document.getElementById('ob-parent-name').value.trim();
    const parentId = document.getElementById('ob-parent-id').value.trim();
    const parentPhone = document.getElementById('ob-parent-phone').value.trim();
    
    if (!parentName || !parentId || !parentPhone) {
      alert(appState.language === 'sw' ? "Tafadhali jaza sehemu zote kabla ya kuendelea." : "Please fill in all fields to verify identity.");
      return;
    }

    // Move to mock OTP Step
    document.getElementById('onboard-step-2').classList.add('hidden-step');
    document.getElementById('onboard-step-2').classList.remove('active-step');
    document.getElementById('onboard-step-2-otp').classList.remove('hidden-step');
    document.getElementById('onboard-step-2-otp').classList.add('active-step');
  });

  // OTP Back btn
  document.getElementById('btn-otp-back').addEventListener('click', () => {
    document.getElementById('onboard-step-2-otp').classList.add('hidden-step');
    document.getElementById('onboard-step-2-otp').classList.remove('active-step');
    document.getElementById('onboard-step-2').classList.remove('hidden-step');
    document.getElementById('onboard-step-2').classList.add('active-step');
  });

  // OTP Confirm Code Verify
  document.getElementById('btn-ob-otp-verify').addEventListener('click', () => {
    const o1 = document.getElementById('otp-1').value;
    const o2 = document.getElementById('otp-2').value;
    const o3 = document.getElementById('otp-3').value;
    const o4 = document.getElementById('otp-4').value;
    const inputOtp = `${o1}${o2}${o3}${o4}`;

    if (inputOtp !== "3100") {
      alert(appState.language === 'sw' ? "Nambari ya OTP sio sahihi! Simu haikuweza kuthibitishwa." : "Invalid OTP code entered. Please try again.");
      return;
    }

    // Save parent values
    appState.parent.name = document.getElementById('ob-parent-name').value;
    appState.parent.nationalId = document.getElementById('ob-parent-id').value;
    appState.parent.phone = document.getElementById('ob-parent-phone').value;
    appState.parent.relation = document.querySelector('input[name="ob-parent-rel"]:checked').value;

    // Shift to Step 3
    document.getElementById('onboard-step-2-otp').classList.remove('active-step');
    document.getElementById('onboard-step-2-otp').classList.add('hidden-step');
    document.getElementById('onboard-step-3').classList.add('active-step');
    document.getElementById('onboard-step-3').classList.remove('hidden-step');
    updateStepIndicator(3);
    appState.step = 3;
  });

  // Step 4: Pairing Simulation
  document.getElementById('btn-simulate-pair').addEventListener('click', () => {
    const handshakeBox = document.getElementById('pqc-handshake-status');
    const childName = document.getElementById('ob-child-name').value.trim() || 'Amara';
    
    handshakeBox.innerHTML = `
      <strong class="text-green">${appState.language === 'sw' ? 'Oanisho Imekamilika!' : 'Pairing Successful!'}</strong>
      <span class="font-space">PQC ML-DSA Public Key generated & TPM Attested.</span>
    `;
    
    document.getElementById('btn-simulate-pair').style.display = 'none';
    
    // Add success logic delay
    setTimeout(() => {
      navigateOnboarding(1);
    }, 1500);
  });

  // Step 5: Onboarding Launch Completion
  document.getElementById('btn-ob-complete').addEventListener('click', () => {
    appState.child.name = document.getElementById('ob-child-name').value.trim() || 'Amara';
    appState.child.ageRange = document.getElementById('ob-child-age').value;
    appState.child.bloodGroup = document.getElementById('ob-child-blood').value;
    appState.child.medicalAlerts = document.getElementById('ob-child-medical').value || 'Asthma — carries inhaler';
    appState.onboarded = true;
    
    saveStateToStorage();
    
    overlay.classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('app-container').classList.remove('blur-content');
      initializeLeafletMaps();
      populateInitialData();
    }, 100);
  });
}

function navigateOnboarding(dir) {
  let curStep = appState.step;
  const nextStep = curStep + dir;
  
  if (nextStep < 1 || nextStep > 5) return;
  
  document.getElementById(`onboard-step-${curStep}`).classList.remove('active-step');
  document.getElementById(`onboard-step-${curStep}`).classList.add('hidden-step');
  
  document.getElementById(`onboard-step-${nextStep}`).classList.add('active-step');
  document.getElementById(`onboard-step-${nextStep}`).classList.remove('hidden-step');
  
  updateStepIndicator(nextStep);
  appState.step = nextStep;
}

function updateStepIndicator(step) {
  document.querySelectorAll('.onboarding-stepper .step-dot').forEach(dot => {
    const s = parseInt(dot.getAttribute('data-step'));
    dot.classList.remove('active', 'completed');
    if (s === step) dot.classList.add('active');
    else if (s < step) dot.classList.add('completed');
  });

  // Stepper lines color updates
  document.querySelectorAll('.onboarding-stepper .step-line').forEach((line, index) => {
    line.classList.remove('completed');
    if (index < step - 1) line.classList.add('completed');
  });
}

// 7. MULTI-TAB PORTAL ROUTING
function initializeTabs() {
  document.querySelectorAll('.side-nav .nav-tab').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.side-nav .nav-tab').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');
      
      const tabId = tabBtn.getAttribute('data-tab');
      document.querySelectorAll('.workspace-area .tab-content').forEach(content => {
        content.classList.remove('active-tab');
      });
      document.getElementById(tabId).classList.add('active-tab');
      
      // Critical map adjustment call for Leaflet
      setTimeout(() => {
        if (tabId === 'tab-dashboard' && dashMap) {
          dashMap.invalidateSize();
        } else if (tabId === 'tab-livemap' && fullMap) {
          fullMap.invalidateSize();
        }
      }, 100);
    });
  });
}

// 8. HIGH-FIDELITY LEAFLET MAPS INTEGRATION
function initializeLeafletMaps() {
  // Center point
  const mapCenter = [GEOLOCATIONS.home.lat, GEOLOCATIONS.home.lng];
  
  // Custom Dark themed Map tiles utilizing CartoDB Voyager Dark
  const darkTilesURL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png';
  const attrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attestations">CARTO</a>';

  // 1. Dashboard Mini Map
  if (!dashMap) {
    dashMap = L.map('dash-leaflet-map', {
      zoomControl: false,
      attributionControl: false
    }).setView(mapCenter, 14);
    
    L.tileLayer(darkTilesURL, { attribution: attrib, maxZoom: 20 }).addTo(dashMap);
    
    // Geofences
    dashHomeCircle = L.circle([GEOLOCATIONS.home.lat, GEOLOCATIONS.home.lng], {
      color: '#00E676',
      fillColor: '#00E676',
      fillOpacity: 0.1,
      radius: 350
    }).addTo(dashMap);

    dashSchoolCircle = L.circle([GEOLOCATIONS.school.lat, GEOLOCATIONS.school.lng], {
      color: '#FFB703',
      fillColor: '#FFB703',
      fillOpacity: 0.1,
      radius: 400
    }).addTo(dashMap);

    // Initial Child tracking Marker (pulsing green dot element)
    const activeIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div class="marker-dot active-dot"></div><div class="marker-pulse"></div>`,
      iconSize: [20, 20]
    });
    
    dashMarker = L.marker([GEOLOCATIONS.school.lat, GEOLOCATIONS.school.lng], { icon: activeIcon }).addTo(dashMap);
  }

  // 2. Full Live Map View
  if (!fullMap) {
    fullMap = L.map('full-leaflet-map', {
      zoomControl: true,
      attributionControl: true
    }).setView(mapCenter, 14);
    
    L.tileLayer(darkTilesURL, { attribution: attrib, maxZoom: 20 }).addTo(fullMap);
    
    fullHomeCircle = L.circle([GEOLOCATIONS.home.lat, GEOLOCATIONS.home.lng], {
      color: '#00E676',
      fillColor: '#00E676',
      fillOpacity: 0.08,
      radius: 350
    }).addTo(fullMap);

    fullSchoolCircle = L.circle([GEOLOCATIONS.school.lat, GEOLOCATIONS.school.lng], {
      color: '#FFB703',
      fillColor: '#FFB703',
      fillOpacity: 0.08,
      radius: 400
    }).addTo(fullMap);

    const activeIcon2 = L.divIcon({
      className: 'custom-map-marker',
      html: `<div class="marker-dot active-dot"></div><div class="marker-pulse"></div>`,
      iconSize: [20, 20]
    });
    
    fullMarker = L.marker([GEOLOCATIONS.school.lat, GEOLOCATIONS.school.lng], { icon: activeIcon2 }).addTo(fullMap);
  }
}

// 9. WEB AUDIO API SYNTHESIZER SOUND ENGINE
function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playStartupChime() {
  try {
    initAudioContext();
    
    const now = audioCtx.currentTime;
    
    // Play E5 then G5
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.15); // G5
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    
    osc.start(now);
    osc.stop(now + 0.6);
  } catch (e) {
    console.warn("Audio Context blocked or unsupported.", e);
  }
}

function playSirenLoop() {
  if (isSirenPlaying) return;
  
  try {
    initAudioContext();
    isSirenPlaying = true;
    
    const now = audioCtx.currentTime;
    
    sirenOscillator1 = audioCtx.createOscillator();
    sirenOscillator2 = audioCtx.createOscillator();
    sirenGainNode = audioCtx.createGain();
    
    sirenOscillator1.type = 'sawtooth';
    sirenOscillator2.type = 'sine';
    
    sirenOscillator1.connect(sirenGainNode);
    sirenOscillator2.connect(sirenGainNode);
    sirenGainNode.connect(audioCtx.destination);
    
    // Alternating frequencies (880Hz to 1100Hz)
    sirenOscillator1.frequency.setValueAtTime(880, now);
    sirenOscillator2.frequency.setValueAtTime(2, now); // Low frequency modulator
    
    sirenGainNode.gain.setValueAtTime(0, now);
    sirenGainNode.gain.linearRampToValueAtTime(0.15, now + 0.1);
    
    // Siren LFO frequency modulation sweep
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.value = 2.5; // oscillation speed
    lfoGain.gain.value = 150; // pitch shift bounds
    
    lfo.connect(lfoGain);
    lfoGain.connect(sirenOscillator1.frequency);
    
    lfo.start(now);
    sirenOscillator1.start(now);
    
    // Keep reference to stop later
    sirenOscillator1.lfo = lfo;
  } catch (e) {
    console.warn("Emergency Audio Siren synthesis error.", e);
  }
}

function stopSirenLoop() {
  if (!isSirenPlaying) return;
  
  try {
    const now = audioCtx.currentTime;
    sirenGainNode.gain.cancelScheduledValues(now);
    sirenGainNode.gain.setValueAtTime(sirenGainNode.gain.value, now);
    sirenGainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    
    setTimeout(() => {
      if (sirenOscillator1) {
        sirenOscillator1.stop();
        if (sirenOscillator1.lfo) sirenOscillator1.lfo.stop();
      }
      isSirenPlaying = false;
    }, 350);
  } catch (e) {
    isSirenPlaying = false;
  }
}

// 10. PRESS AND HOLD SOS PANIC SYSTEM
function setupSOSHandlers() {
  const sosBtn = document.getElementById('sos-trigger-btn');
  const activeBanner = document.getElementById('sos-active-banner');
  const holdText = document.getElementById('hold-instruction-text');
  
  const triggerStart = (e) => {
    e.preventDefault();
    if (isSosHoldActive) return;
    
    initAudioContext();
    isSosHoldActive = true;
    sosHoldProgress = 0;
    
    holdText.textContent = appState.language === 'sw' ? "Inakagua Alama za Usalama..." : "Verifying PQC Cryptography...";
    holdText.style.color = 'var(--mlinzi-gold)';
    
    const startTime = Date.now();
    
    // Progress Ring Tick Interval
    sosHoldTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      sosHoldProgress = Math.min(elapsed / SOS_HOLD_DURATION, 1);
      
      // Update circle progress ring offset
      if (progressRingCircle) {
        const offset = ringCircumference - (sosHoldProgress * ringCircumference);
        progressRingCircle.style.strokeDashoffset = offset;
      }
      
      // Intermittent tiny tactile beep
      if (Math.floor(elapsed) % 600 < 30) {
        triggerTactileBeep();
      }
      
      if (sosHoldProgress >= 1) {
        clearInterval(sosHoldTimer);
        triggerCriticalSOS();
      }
    }, 30);
  };
  
  const triggerCancel = () => {
    if (!isSosHoldActive) return;
    clearInterval(sosHoldTimer);
    isSosHoldActive = false;
    sosHoldProgress = 0;
    
    if (progressRingCircle) {
      progressRingCircle.style.strokeDashoffset = ringCircumference;
    }
    
    holdText.textContent = appState.language === 'sw' ? "Bonyeza na ushikilie kwa sekunde 3" : "Press and hold for 3 seconds";
    holdText.style.color = '#8C8C9E';
  };
  
  // Desktop and Mobile events listening
  sosBtn.addEventListener('mousedown', triggerStart);
  sosBtn.addEventListener('mouseup', triggerCancel);
  sosBtn.addEventListener('mouseleave', triggerCancel);
  
  sosBtn.addEventListener('touchstart', triggerStart, { passive: false });
  sosBtn.addEventListener('touchend', triggerCancel);
  sosBtn.addEventListener('touchcancel', triggerCancel);
}

function triggerTactileBeep() {
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 1000;
    gain.gain.value = 0.05;
    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (e) {}
}

function triggerCriticalSOS() {
  // Update state and display SOS banner
  document.getElementById('sos-active-banner').classList.remove('hidden');
  document.getElementById('hold-instruction-text').textContent = appState.language === 'sw' ? "🆘 DHARURA IMEWASHWA!" : "🆘 EMERGENCY PANIC DEPLOYED!";
  document.getElementById('hold-instruction-text').style.color = 'var(--mlinzi-accent)';
  
  // Play Dual Tone Siren
  playSirenLoop();
  
  // Formulate custom event
  const sosEvent = {
    id: `A-${Date.now().toString().slice(-4)}`,
    type: 'critical',
    title_sw: 'Dharura ya SOS Imewashwa',
    title_en: 'Critical SOS Emergency Triggered',
    desc_sw: `SOS imebonyezwa kwenye saa ya ${appState.child.name}. Eneo halisi la GPS limepatikana Westlands.`,
    desc_en: `SOS button long-pressed on ${appState.child.name}'s device. Sharing exact location tracking metrics.`,
    time: new Date().toLocaleTimeString() + ' EAT',
    pqcSig: 'ML-DSA-SIG-' + Math.random().toString(36).slice(2, 8) + '... (Verified)',
    blockchainTx: '0x' + Math.random().toString(16).slice(2, 8) + '... (polygonscan)'
  };
  
  // Prepend to alerts
  appState.alerts.unshift(sosEvent);
  saveStateToStorage();
  
  // Trigger n8n payload dispatch
  dispatchN8NWebhook('SOS_EMERGENCY', {
    lat: -1.2682,
    lng: 36.8058,
    exactCoords: true,
    riskScore: 98
  });
  
  // Populate changes
  renderTimeline();
  renderAlertsFeed();
  updateAlertCounts();
}

// 11. DYNAMIC RISK SIMULATOR ENGINE (Geofence Breach & TPM Tamper)
function setupSimulationHandlers() {
  // Simulator Walk to School Action
  document.getElementById('sim-btn-walk-school').addEventListener('click', () => {
    triggerPathTracking(PATHS.walkToSchool, 'School', (finalCoords) => {
      // Create school arrived log
      const log = {
        id: `A-${Date.now().toString().slice(-4)}`,
        type: 'normal',
        title_sw: 'Amewasili Shule Salama',
        title_en: 'Safely Arrived at School',
        desc_sw: `${appState.child.name} ameingia ukanda wa Nairobi Primary School. GPS imehakikiwa.`,
        desc_en: `${appState.child.name} safely crossed geofence boundary of school zone.`,
        time: new Date().toLocaleTimeString() + ' EAT',
        pqcSig: 'ML-DSA-SIG-' + Math.random().toString(36).slice(2, 8) + '... (Verified)',
        blockchainTx: '0x' + Math.random().toString(16).slice(2, 8) + '...'
      };
      
      appState.alerts.unshift(log);
      appState.telemetry.currentZone = 'School';
      appState.telemetry.coords = 'Nairobi Primary School';
      saveStateToStorage();
      populateInitialData();
      
      dispatchN8NWebhook('ZONE_ARRIVED', {
        zone: 'School',
        coords: finalCoords
      });
    });
  });

  // Simulator Breach Geofence Action
  document.getElementById('sim-btn-escape-zone').addEventListener('click', () => {
    triggerPathTracking(PATHS.escapeSchool, 'Off-bounds', (finalCoords) => {
      // Create high alert breach log
      const alertLog = {
        id: `A-${Date.now().toString().slice(-4)}`,
        type: 'high',
        title_sw: 'Kutoroka Eneo la Shule',
        title_en: 'Geofence Breach Detected',
        desc_sw: `Onyo! ${appState.child.name} ametoka nje ya ukanda wa Shule saa za asubuhi bila idhini.`,
        desc_en: `Warning! ${appState.child.name} exited school zone early. Moving towards off-bounds sector.`,
        time: new Date().toLocaleTimeString() + ' EAT',
        pqcSig: 'ML-DSA-SIG-' + Math.random().toString(36).slice(2, 8) + '... (Verified)',
        blockchainTx: '0x' + Math.random().toString(16).slice(2, 8) + '...'
      };
      
      appState.alerts.unshift(alertLog);
      appState.telemetry.currentZone = 'Off-bounds';
      appState.telemetry.coords = 'Sarit Center Shopping Mall';
      saveStateToStorage();
      populateInitialData();
      
      dispatchN8NWebhook('GEOFENCE_BREACH', {
        zone: 'Off-bounds',
        coords: finalCoords,
        severity: 'HIGH'
      });
    });
  });

  // Simulator Device TPM Tamper Action
  document.getElementById('sim-btn-device-tamper').addEventListener('click', () => {
    // Generate immediate high alert log
    const tamperLog = {
      id: `A-${Date.now().toString().slice(-4)}`,
      type: 'high',
      title_sw: 'Jaribio la Kufungua Saa (TPM)',
      title_en: 'TPM Attestation Failure — Tamper Event',
      desc_sw: `Onyo Kuu! Udhibitisho wa chipu ya saa umefeli. Uharibifu wa maunzi unashukiwa!`,
      desc_en: `TPM hardware quote mismatch. Secure elements mismatch. Wire breakdown or shell breach!`,
      time: new Date().toLocaleTimeString() + ' EAT',
      pqcSig: 'ATTESTATION-FAILED-HASH-02x... (Signature Mismatch)',
      blockchainTx: '0x' + Math.random().toString(16).slice(2, 8) + '...'
    };
    
    appState.alerts.unshift(tamperLog);
    appState.telemetry.tpmStatus = '🔴 CORRUPT';
    saveStateToStorage();
    populateInitialData();
    
    dispatchN8NWebhook('TPM_TAMPER', {
      tpmState: 'BREACHED',
      pcrQuotes: [1, 0, 0, 1]
    });
  });

  // Reset Simulation Action
  document.getElementById('sim-btn-reset-map').addEventListener('click', () => {
    resetSimulationState();
  });
}

function resetSimulationState() {
  if (simInterval) clearInterval(simInterval);
  isSimulationActive = false;
  
  // Move markers back to home
  const homeCoords = [GEOLOCATIONS.home.lat, GEOLOCATIONS.home.lng];
  dashMarker.setLatLng(homeCoords);
  fullMarker.setLatLng(homeCoords);
  
  dashMap.setView(homeCoords, 14);
  fullMap.setView(homeCoords, 14);
  
  appState.telemetry.currentZone = 'Home';
  appState.telemetry.coords = 'Westlands, Nairobi';
  appState.telemetry.tpmStatus = '🟢 Verified';
  
  // Turn off active sirens and banners
  stopSirenLoop();
  document.getElementById('sos-active-banner').classList.add('hidden');
  document.getElementById('hold-instruction-text').textContent = appState.language === 'sw' ? "Bonyeza na ushikilie kwa sekunde 3" : "Press and hold for 3 seconds";
  document.getElementById('hold-instruction-text').style.color = '#8C8C9E';
  
  saveStateToStorage();
  populateInitialData();
}

function triggerPathTracking(pathArray, finalZoneLabel, onComplete) {
  if (isSimulationActive) {
    clearInterval(simInterval);
  }
  
  isSimulationActive = true;
  currentPathArray = pathArray;
  currentPathIndex = 0;
  
  // Set view to start of path
  const startPoint = pathArray[0];
  dashMap.setView(startPoint, 15);
  fullMap.setView(startPoint, 15);
  
  simInterval = setInterval(() => {
    if (currentPathIndex >= currentPathArray.length) {
      clearInterval(simInterval);
      isSimulationActive = false;
      if (onComplete) onComplete(currentPathArray[currentPathArray.length - 1]);
      return;
    }
    
    const nextCoords = currentPathArray[currentPathIndex];
    dashMarker.setLatLng(nextCoords);
    fullMarker.setLatLng(nextCoords);
    
    dashMap.panTo(nextCoords);
    fullMap.panTo(nextCoords);
    
    // Add real-time telemetry updates to page
    appState.telemetry.coords = `${Number(nextCoords[0]).toFixed(4)}, ${Number(nextCoords[1]).toFixed(4)}`;
    document.getElementById('dash-coords').textContent = appState.telemetry.coords;
    
    currentPathIndex++;
  }, 1000); // 1-second ticks
}

// 12. REAL OUTBOUND n8n WEBHOOK DISPATCHER
function dispatchN8NWebhook(eventType, payload) {
  if (!appState.n8n.routeActive || !appState.n8n.webhookUrl) {
    console.log("n8n telemetry dispatch skipped: inactive or missing URL.");
    return;
  }

  // Construct complete payload conforming to specs
  const dataPayload = {
    device_id: appState.child.wearableId,
    device_type: "smartwatch",
    child_name_encrypted: btoa(appState.child.name), // mock obfuscation
    parent_phone_hash: "sha3-256-mocked-hash-value-here",
    event_type: eventType,
    timestamp: new Date().toISOString(),
    battery_percent: appState.telemetry.battery,
    tpm_attestation: {
      status: appState.telemetry.tpmStatus,
      quoting_integrity: true
    },
    ...payload
  };

  console.log(`🚀 Dispatched Payload to n8n Webhook: ${appState.n8n.webhookUrl}`, dataPayload);

  // Send request using standard fetch API
  fetch(appState.n8n.webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Device-Signature': 'ML-DSA-SIG-MOCK-ENCRYPTED-HANDSHAKE'
    },
    body: JSON.stringify(dataPayload)
  })
  .then(res => {
    console.log("n8n node feedback successfully received:", res.status);
  })
  .catch(err => {
    // Elegant fallback warning
    console.warn("Outbound webhook target failed to respond (this is normal if endpoint is unconfigured offline):", err.message);
  });
}

// 13. RENDERERS: TIMELINE & AUDIT FEED
function renderTimeline() {
  const container = document.getElementById('dashboard-timeline');
  container.innerHTML = '';
  
  const displayAlerts = appState.alerts.slice(0, 4); // top 4 logs
  if (displayAlerts.length === 0) {
    container.innerHTML = `<p class="text-muted text-center">No logs generated today yet.</p>`;
    return;
  }

  displayAlerts.forEach(node => {
    const title = appState.language === 'sw' ? node.title_sw : node.title_en;
    const desc = appState.language === 'sw' ? node.desc_sw : node.desc_en;
    
    // Set class color
    let color = 'green';
    if (node.type === 'high') color = 'gold';
    else if (node.type === 'critical') color = 'red';
    
    const elem = document.createElement('div');
    elem.className = 'timeline-node';
    elem.innerHTML = `
      <div class="node-marker ${color}"></div>
      <div class="node-content">
        <div class="node-header">
          <strong>${title}</strong>
          <span class="node-time">${node.time}</span>
        </div>
        <p class="node-body">${desc}</p>
      </div>
    `;
    container.appendChild(elem);
  });
}

function renderAlertsFeed() {
  const container = document.getElementById('alerts-master-feed');
  container.innerHTML = '';
  
  if (appState.alerts.length === 0) {
    container.innerHTML = `<div class="text-center text-muted margin-top-1">No security logs recorded.</div>`;
    return;
  }

  // Check active filter
  const activeFilterBtn = document.querySelector('.btn-filter.active-filter');
  const filter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

  appState.alerts.forEach(item => {
    if (filter !== 'all' && item.type !== filter) return;

    const title = appState.language === 'sw' ? item.title_sw : item.title_en;
    const desc = appState.language === 'sw' ? item.desc_sw : item.desc_en;
    
    const elem = document.createElement('div');
    elem.className = `alert-box-item ${item.type}`;
    elem.innerHTML = `
      <div class="alert-box-item-header">
        <strong class="${item.type === 'critical' ? 'text-accent' : item.type === 'high' ? 'text-gold' : 'text-green'}">
          ${item.type === 'critical' ? '🆘' : item.type === 'high' ? '🟡' : '🟢'} ${title}
        </strong>
        <span class="time">${item.time}</span>
      </div>
      <div class="alert-box-desc">${desc}</div>
      <div class="alert-box-blockchain-trail">
        <div class="trail-row">
          <span>PQC Cryptographic Signature:</span>
          <span class="val font-space">${item.pqcSig}</span>
        </div>
        <div class="trail-row">
          <span>Polygon Blockchain Ledger Anchor:</span>
          <span class="val font-space">${item.blockchainTx}</span>
        </div>
      </div>
    `;
    container.appendChild(elem);
  });
}

function updateAlertCounts() {
  let critical = 0;
  let high = 0;
  let normal = 0;
  
  appState.alerts.forEach(i => {
    if (i.type === 'critical') critical++;
    else if (i.type === 'high') high++;
    else normal++;
  });

  document.getElementById('cnt-critical').textContent = critical;
  document.getElementById('cnt-high').textContent = high;
  document.getElementById('cnt-normal').textContent = normal;

  // Header alerts badge trigger count update
  const total = critical + high;
  const badge = document.getElementById('global-alert-badge');
  if (total > 0) {
    badge.textContent = total;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// Alert filter buttons clicking logic
document.querySelectorAll('.filter-buttons .btn-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-buttons .btn-filter').forEach(b => b.classList.remove('active-filter'));
    btn.classList.add('active-filter');
    renderAlertsFeed();
  });
});

// Clear logs button
document.getElementById('clear-all-alerts-btn').addEventListener('click', () => {
  appState.alerts = [];
  saveStateToStorage();
  populateInitialData();
});

// 14. OFFLINE-READY CANVAS EMERGENCY QR CARD
function renderQRMatrix() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const size = 150;
  canvas.width = size;
  canvas.height = size;
  
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);
  
  ctx.fillStyle = '#09091b';
  
  // Precise mathematical pseudo-random block filler drawing QR look
  const blockSize = 5;
  const blocks = size / blockSize;
  
  for (let r = 0; r < blocks; r++) {
    for (let c = 0; c < blocks; c++) {
      // Render standard 3 QR positioning grids at corners
      if (
        (r < 8 && c < 8) || // Top Left
        (r < 8 && c >= blocks - 8) || // Top Right
        (r >= blocks - 8 && c < 8) // Bottom Left
      ) {
        // Draw nested corner square lines
        const isBorder = (r === 0 || r === 7 || c === 0 || c === 7 ||
                          r === blocks - 8 || r === blocks - 1 || 
                          c === blocks - 8 || c === blocks - 1);
        const isInner = (r >= 2 && r <= 5 && c >= 2 && c <= 5) || 
                        (r >= 2 && r <= 5 && c >= blocks - 6 && c <= blocks - 3) ||
                        (r >= blocks - 6 && r <= blocks - 3 && c >= 2 && c <= 5);
                        
        if (isBorder || isInner) {
          ctx.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
        }
      } else {
        // Generate pseudo-random matrix blocks
        const seed = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
        const rand = seed - Math.floor(seed);
        if (rand > 0.45) {
          ctx.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
        }
      }
    }
  }
}

// 15. DPA DATA MANAGEMENT & RESET TRIGGERS
function setupSettingsHandlers() {
  // Slider display update
  const slider = document.getElementById('dpa-epsilon-slider');
  slider.addEventListener('input', (e) => {
    document.getElementById('epsilon-value').textContent = Number(e.target.value).toFixed(2);
  });

  // Save Settings button
  document.getElementById('btn-save-settings').addEventListener('click', () => {
    appState.parent.name = document.getElementById('set-parent-name').value;
    appState.parent.phone = document.getElementById('set-parent-phone').value;
    appState.parent.relation = document.getElementById('set-parent-relation').value;
    appState.parent.responder = document.getElementById('set-responder').value;
    
    appState.child.name = document.getElementById('set-child-name').value;
    appState.child.ageRange = document.getElementById('set-child-age').value;
    appState.child.bloodGroup = document.getElementById('set-child-blood').value;
    appState.child.medicalAlerts = document.getElementById('set-child-medical').value;
    
    appState.n8n.webhookUrl = document.getElementById('set-n8n-webhook-url').value;
    appState.n8n.routeActive = document.getElementById('set-n8n-active').checked;
    
    appState.privacy.epsilon = parseFloat(slider.value);
    appState.privacy.autoPurge = document.getElementById('dpa-auto-purge').checked;
    
    saveStateToStorage();
    populateInitialData();
    
    alert(appState.language === 'sw' ? "Mipangilio yote imehifadhiwa salama!" : "Configurations saved successfully!");
  });

  // Export JSON database utility
  document.getElementById('btn-export-dpa-data').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mlinzi_dpa_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  // Reset Portal entirely
  document.getElementById('btn-delete-account-dpa').addEventListener('click', () => {
    const confirmText = appState.language === 'sw' 
      ? "Je, una uhakika unataka kufuta akaunti yako na data zote? Kitendo hiki hakiwezi kubadilishwa!" 
      : "CAUTION: This will wipe entire LocalStorage state and reset wizard setup. Continue?";
      
    if (confirm(confirmText)) {
      localStorage.removeItem('mlinzi_v3_state');
      location.reload();
    }
  });

  // QR Samaritan simulator visual toggle
  document.getElementById('btn-simulate-qr-scan').addEventListener('click', () => {
    // Populate data for Samaritan screen
    document.getElementById('samaritan-child-name').textContent = appState.child.name.toUpperCase();
    document.getElementById('samaritan-child-blood').textContent = appState.child.bloodGroup;
    document.getElementById('samaritan-child-medical').textContent = appState.child.medicalAlerts;
    
    document.getElementById('samaritan-portal-view').classList.remove('hidden');
    document.getElementById('samaritan-portal-view').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('close-samaritan-btn').addEventListener('click', () => {
    document.getElementById('samaritan-portal-view').classList.add('hidden');
  });

  // Samaritan buttons simulated responses
  document.getElementById('samaritan-call-parent-btn').addEventListener('click', () => {
    const masked = appState.parent.phone.slice(0, 7) + "****" + appState.parent.phone.slice(-2);
    alert(appState.language === 'sw' 
      ? `Inapiga simu ya mzazi... ${masked} (Nambari imelindwa na Sheria ya Ufaragha)` 
      : `Initiating masked phone connection to: ${masked}`);
  });

  document.getElementById('samaritan-share-gps-btn').addEventListener('click', () => {
    alert(appState.language === 'sw' 
      ? "Mahali ulipo sasa hivi (-1.2682, 36.8058) pametumwa kwa wazazi kupitia n8n!" 
      : "Good Samaritan GPS coordinates successfully dispatched to parents!");
      
    dispatchN8NWebhook('QR_RESCUE_SCAN', {
      samaritanLat: -1.2682,
      samaritanLng: 36.8058,
      scanVerified: true
    });
  });
}
