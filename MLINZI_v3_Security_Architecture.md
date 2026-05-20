# 🔐 MLINZI v3.0 — THE QUANTUM GUARDIAN
## Comprehensive Security Architecture & Threat Model
### Hub31 iSense · Post-Quantum Child Safety Infrastructure

---

## 📋 EXECUTIVE SUMMARY

Mlinzi v3.0 represents a fundamental redesign of the child safety workflow, transforming it from a standard IoT notification system into a **post-quantum, tamper-proof, zero-knowledge, legally-compliant** child protection infrastructure. This architecture addresses five critical security dimensions:

| Dimension | v2.0 Status | v3.0 Enhancement | Standard |
|-----------|-------------|------------------|----------|
| **Post-Quantum Crypto** | None (AES-256 only) | ML-KEM + ML-DSA + SLH-DSA + FN-DSA | NIST FIPS 203/204/205/206 |
| **Tamper-Proof Hardware** | None | TPM 2.0 + Secure Element + Remote Attestation | TCG 2.0 / ISO/IEC 11889 |
| **Zero-Knowledge Privacy** | None | ZKLP + Differential Privacy + k-Anonymity | IEEE 754 ZK-SNARKs |
| **Legal Compliance** | Basic | ODPC-Registered + DPIA-Tracked + Best Interests | Kenya DPA 2019 / Constitution Art 53(2) |
| **Byzantine Fault Tolerance** | None | 3-of-5 Threshold Signatures + Multi-Channel | Shamir Secret Sharing |

---

## 🏗️ 6-LAYER DEFENSE ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 6: FINAL AUDIT & COMPLIANCE                                          │
│  • Merkle-chained tamper-evident logs                                        │
│  • ODPC-ready audit exports                                                  │
│  • Auto-purge scheduling (DPA Section 39)                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▲
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 5: BLOCKCHAIN EVIDENCE LEDGER                                        │
│  • Threshold-signed Polygon transactions (ML-DSA Dilithium-5)               │
│  • Zero-knowledge child identifiers (SHA3-256 + salt)                       │
│  • Immutable chain-of-custody for legal evidence                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▲
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 4: THRESHOLD ESCALATION & MULTI-CHANNEL DISPATCH                     │
│  • 3-of-5 Byzantine Fault Tolerant consensus                                │
│  • WhatsApp + SMS + Push + Email + Satellite (Iridium/Starlink)             │
│  • mTLS with certificate pinning on all channels                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▲
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 3: AI SAFETY AUDITOR (PQC-Hardened)                                  │
│  • Gemini 2.0 Flash with PQC-encrypted prompt interface                     │
│  • iSense KB with ML-KEM tunnel encryption                                  │
│  • Kenya-specific cultural and legal reasoning                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▲
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 2: ZERO-KNOWLEDGE PRIVACY PROCESSOR                                  │
│  • Differential Privacy: Laplace noise ε=0.1 on GPS                         │
│  • ZKLP: Prove geofence without exact coordinates                           │
│  • k-Anonymity: 500m radius blur for non-critical events                    │
│  • Kenya DPA 2019 compliance metadata (Section 41 Privacy by Design)        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▲
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 1: PERIMETER SECURITY FORTRESS                                       │
│  • Anti-replay: Nonce + timestamp ±60s window                               │
│  • Schema validation: Strict typing + regex enforcement                     │
│  • Rate limiting: Token bucket per device (30 RPM)                          │
│  • Firmware validation: Approved version allowlist                          │
│  • GeoIP verification for school NFC gates                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▲
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 0: HARDWARE ATTESTATION GATEWAY                                      │
│  • TPM 2.0 PCR0-PCR7 verification on every boot                             │
│  • AIK-signed attestation quotes with nonce binding                         │
│  • ML-DSA (Dilithium-5) or FN-DSA (Falcon) device signatures                │
│  • mTLS with PQC-hybrid handshake (ML-KEM + ECDH)                           │
│  • Secure Element: Infineon SLE 78 / Microchip ATECC608A                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔑 POST-QUANTUM CRYPTOGRAPHY SPECIFICATION

### Algorithm Selection (NIST-Approved)

| Use Case | Algorithm | NIST Standard | Key Size | Security Level |
|----------|-----------|---------------|----------|----------------|
| **Key Encapsulation** | ML-KEM-1024 | FIPS 203 | ~1.5 KB | NIST Level 5 |
| **Digital Signatures** | ML-DSA-65 (Dilithium-5) | FIPS 204 | ~4 KB sig | NIST Level 3 |
| **Backup Signatures** | SLH-DSA-128s (SPHINCS+) | FIPS 205 | ~8 KB sig | NIST Level 1 |
| **Wearable Signatures** | FN-DSA-1024 (Falcon) | FIPS 206 | ~1.3 KB sig | NIST Level 5 |
| **Hash Functions** | SHA3-256 / SHA3-512 | FIPS 202 | — | 256-bit |

### Hybrid Cryptography (Transition Period)

During the 2026-2035 transition period, Mlinzi v3.0 implements **hybrid cryptography**:
- **TLS Handshakes**: ML-KEM-1024 + ECDH P-384 (dual encapsulation)
- **Device Signatures**: ML-DSA-65 + ECDSA P-384 (dual signature)
- **Rationale**: If a vulnerability is discovered in PQC algorithms, classical crypto provides defense-in-depth

### Key Management (HSM-Backed)

```
┌─────────────────────────────────────────────────────────────────┐
│                    AWS CLOUDHSM CLUSTER                          │
│                     (af-south-1 / eu-west-1)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  ML-KEM PRIV │  │  ML-DSA SIGN │  │  MLINZI SALT │          │
│  │  (sealed)    │  │  (threshold) │  │  (auto-rot)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  THRESHOLD SIGNATURE SCHEME (Shamir 3-of-5)          │      │
│  │  • Guardian Node 1: af-south-1a (Cape Town)          │      │
│  │  • Guardian Node 2: af-south-1b (Cape Town)          │      │
│  │  • Guardian Node 3: eu-west-1a (Dublin)              │      │
│  │  • Guardian Node 4: eu-west-1b (Dublin)              │      │
│  │  • Guardian Node 5: us-east-1a (Virginia)            │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ TAMPER-PROOF HARDWARE ARCHITECTURE

### Device Security Stack

```
┌─────────────────────────────────────────────────────────────────┐
│  APPLICATION LAYER                                              │
│  • Mlinzi Safety App (signed with ML-DSA, verified at runtime)  │
│  • Encrypted medical data storage (AES-256-GCM with ML-KEM key) │
├─────────────────────────────────────────────────────────────────┤
│  TRUSTED EXECUTION ENVIRONMENT (ARM TrustZone / fTPM)           │
│  • Secure World: Key derivation, attestation quote generation   │
│  • Normal World: GPS, NFC, BLE, SOS UI                          │
├─────────────────────────────────────────────────────────────────┤
│  SECURE ELEMENT (Infineon SLE 78 / Microchip ATECC608A)         │
│  • Endorsement Key (EK): Burned at manufacture, non-exportable  │
│  • Attestation Identity Key (AIK): CA-certified, for quotes     │
│  • Device Private Key: ML-DSA-65 shard, never leaves SE         │
│  • ML-KEM Keypair: Ephemeral, rotated per session               │
├─────────────────────────────────────────────────────────────────┤
│  BOOT ROM (Write-Protected)                                     │
│  • Unique Device Secret (UDS): DICE specification compliant     │
│  • Bootloader hash verification chain                           │
│  • Anti-rollback: Firmware version monotonic counter            │
└─────────────────────────────────────────────────────────────────┘
```

### Remote Attestation Protocol

```
1. DEVICE BOOT
   ├── Measure BIOS/UEFI → PCR0
   ├── Measure Bootloader → PCR1  
   ├── Measure Kernel → PCR2
   └── Measure Security Policy → PCR7

2. ATTESTATION REQUEST (from Mlinzi Gateway)
   ├── Generate random nonce (UUIDv4)
   ├── Send nonce + expected PCR values to device

3. DEVICE RESPONSE
   ├── TPM generates quote: sign(PCR0..PCR7 || nonce) with AIK
   ├── Include AIK certificate chain
   └── Return quote + device ML-DSA signature of payload

4. GATEWAY VERIFICATION
   ├── Verify AIK certificate chain against Mlinzi Root CA
   ├── Verify quote signature with AIK public key
   ├── Verify nonce matches (anti-replay)
   ├── Compare PCR values against manufacturer golden values
   └── Verify device ML-DSA signature with device public key

5. DECISION
   ├── ALL PASS → Accept payload, proceed to Layer 1
   └── ANY FAIL → Reject payload, log security incident, alert SOC
```

---

## 🔒 ZERO-KNOWLEDGE PRIVACY ARCHITECTURE

### Differential Privacy Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Epsilon (ε)** | 0.1 | Strict privacy budget (Kenya DPA "adequate safeguards") |
| **Delta (δ)** | 1×10⁻⁶ | Negligible failure probability |
| **Sensitivity** | 0.05-0.1 | GPS coordinate sensitivity |
| **k-Anonymity Radius** | 500m | Minimum location blur for non-critical |
| **Retention (CRITICAL)** | 1 year | Legal evidence preservation |
| **Retention (HIGH)** | 30 days | Extended monitoring |
| **Retention (NORMAL)** | 3 days | Standard operational need |
| **Retention (LOW)** | 1 day | Minimal data principle |

### Zero-Knowledge Location Proof (ZKLP)

**Problem**: How does Mlinzi prove a child is inside a geofence without revealing exact coordinates?

**Solution**: ZK-SNARKs with IEEE 754 floating-point compliance

```
PROVER (Wearable / Server):
  Secret Witness: [exact_lat, exact_lng]
  Public Input: [geofence_polygon_hash, zone_id]

  Circuit Constraints:
    1. exact_lat, exact_lng ∈ ℝ (IEEE 754 FP64)
    2. point_in_polygon(exact_lat, exact_lng, geofence_polygon) == true
    3. H(zone_id || geofence_polygon) == public_zone_hash

  Output: zk_proof (≈200 bytes), public_zone_hash

VERIFIER (Parent App / Blockchain):
  Input: [zk_proof, public_zone_hash, zone_id]
  Verification: verify(zk_proof, public_zone_hash) → true/false (in <1ms)
```

**Performance** (based on Ernstberger et al. 2024):
- Proof generation: ~0.26s on mobile device
- Proof verification: ~470 peers/second per verifier
- Proof size: ~200 bytes (Groth16)

---

## ⚖️ KENYA DATA PROTECTION ACT 2019 COMPLIANCE MATRIX

### Legal Requirements vs. Mlinzi v3.0 Implementation

| DPA 2019 Section | Requirement | Mlinzi v3.0 Implementation |
|------------------|-------------|---------------------------|
| **Section 25** | Principles of data protection | Privacy by design, data minimization, accuracy, storage limitation |
| **Section 31** | DPIA for high-risk processing | Auto-triggered DPIA logging for all CRITICAL/HIGH events |
| **Section 33** | Parental/guardian consent | Blockchain-verified consent tokens with revocation capability |
| **Section 35** | Automated decision-making | AI verdicts include human-in-the-loop for HIGH/CRITICAL; parent approval gate |
| **Section 39** | Limitation of retention | Auto-purge scheduling: 1d (LOW) → 3d (NORMAL) → 30d (HIGH) → 1yr (CRITICAL) |
| **Section 41** | Data protection by design/default | ZKLP, differential privacy, k-anonymity implemented at architecture level |
| **Section 43** | Breach notification | 72-hour auto-alert to ODPC for any unauthorized access attempt |
| **Article 53(2)** | Best interests of the child | Paramount consideration in all AI reasoning; overrides data minimization in emergencies |

### ODPC Registration Requirements

```
DATA CONTROLLER: Hub31 iSense Ltd
REGISTRATION TYPE: Data Controller (mandatory under DPA Regs 2021)
PROCESSING ACTIVITIES:
  1. Location tracking of minors (sensitive personal data)
  2. Biometric data (if NFC/QR includes photo)
  3. Health data (medical alerts)
  4. Automated decision-making (AI risk assessment)

DPIA CATEGORIES:
  • High-risk child tracking (geofence breach, SOS)
  • Emergency vital interests (SOS, QR rescue)
  • Standard monitoring (NFC tap-in/out)

CONTACT DPO: dpo@hub31.xyz
ODPC PORTAL: https://www.odpc.go.ke/registration
```

---

## 🚨 THREAT MODEL & COUNTERMEASURES

### STRIDE Analysis

| Threat | Component | Impact | Likelihood | Countermeasure |
|--------|-----------|--------|------------|----------------|
| **Spoofing** | Device identity | Critical | Medium | TPM AIK + ML-DSA signatures + certificate pinning |
| **Tampering** | Payload data | Critical | Medium | HMAC-SHA3 + ML-DSA signatures + Merkle chaining |
| **Repudiation** | Event logging | High | Low | Blockchain immutable ledger + threshold signatures |
| **Information Disclosure** | Child location | Critical | High | ZKLP + differential privacy + k-anonymity + auto-purge |
| **Denial of Service** | Notification system | High | Medium | Multi-channel dispatch + satellite fallback + mesh relay |
| **Elevation of Privilege** | Authority escalation | Critical | Low | 3-of-5 threshold signatures + human approval gates |

### Advanced Threat Scenarios

#### Scenario 1: Quantum Computer Attack ("Harvest Now, Decrypt Later")
**Threat**: Adversary records encrypted traffic today, decrypts with quantum computer in 2035.
**Countermeasure**: 
- All device-server communication uses ML-KEM-1024 (quantum-resistant)
- All signatures use ML-DSA-65 (quantum-resistant)
- Historical data encrypted with classical algorithms is auto-purged per retention policy

#### Scenario 2: Supply Chain Attack (Compromised Firmware)
**Threat**: Attacker injects malicious firmware during manufacturing.
**Countermeasure**:
- Secure Boot with PCR measurement chain
- Anti-rollback counters in Secure Element
- Remote attestation verifies firmware hash against manufacturer golden values
- Firmware updates signed with ML-DSA and verified before installation

#### Scenario 3: Insider Threat (Rogue Administrator)
**Threat**: Employee with database access extracts child location history.
**Countermeasure**:
- Raw GPS coordinates purged after 5 minutes; only zone hashes retained
- Database encrypted with ML-KEM (admin cannot decrypt without HSM)
- All queries logged to blockchain with admin identity hash
- Separation of duties: no single admin can access both data and keys

#### Scenario 4: Nation-State Surveillance
**Threat**: State actor demands access to all child location data.
**Countermeasure**:
- Zero-knowledge design: server never sees exact coordinates
- Threshold cryptography: no single jurisdiction holds all key shards
- Legal compliance: Kenya DPA requires judicial warrant for data access
- Transparency reports: published quarterly on hub31.xyz/transparency

#### Scenario 5: DDoS Attack on Notification Channels
**Threat**: Attacker floods Evolution API, preventing SOS delivery.
**Countermeasure**:
- Multi-channel redundancy: WhatsApp → SMS → Push → Satellite
- Rate limiting: Token bucket per device prevents amplification
- Satellite fallback: Iridium/Starlink pager for critical events
- Mesh relay: Nearby Mlinzi devices form ad-hoc network

---

## 📡 MULTI-CHANNEL COMMUNICATION MATRIX

| Channel | Priority | Encryption | Fallback | Cost/Event |
|---------|----------|------------|----------|------------|
| **WhatsApp (Evolution API)** | 1 | mTLS + ML-KEM | SMS | KES 0.50 |
| **SMS (AfricasTalking)** | 2 | TLS 1.3 | Push | KES 1.00 |
| **Push (Firebase)** | 3 | TLS 1.3 | Email | KES 0.10 |
| **Email (SendGrid)** | 4 | TLS 1.3 | — | KES 0.20 |
| **Satellite (Iridium)** | 0 (emergency) | ML-KEM burst | Mesh | KES 50.00 |
| **Mesh Relay (BLE)** | 0 (offline) | AES-128 + FN-DSA | — | KES 0.00 |

---

## 🔄 DEAD MAN'S SWITCH PROTOCOL

**Activation Conditions** (ANY of the following):
1. Device heartbeat loss > 5 minutes
2. Webhook processing timeout > 30 seconds
3. AI Auditor non-response > 45 seconds
4. Blockchain write failure > 2 minutes
5. Threshold signature collection timeout > 90 seconds

**Emergency Actions** (executed in parallel):
1. **Device**: Switch to satellite beacon mode (Iridium SBD)
2. **Parent**: Direct SMS via AfricasTalking (bypasses AI)
3. **Authorities**: DCI Kenya notified via secure hotline
4. **Blockchain**: Evidence written to Arbitrum L2 (Polygon backup)
5. **Mesh**: Ad-hoc relay to nearest internet gateway

---

## 📊 SECURITY METRICS & MONITORING

### Key Performance Indicators (KPIs)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Attestation Success Rate** | >99.9% | TPM quote validations / total requests |
| **PQC Handshake Time** | <500ms | ML-KEM encapsulation + decapsulation |
| **ZKLP Proof Generation** | <1s | Mobile device proof creation time |
| **End-to-End Latency (SOS)** | <3s | Device trigger → parent notification |
| **False Positive Rate** | <0.1% | Non-emergency events flagged as CRITICAL |
| **Data Retention Compliance** | 100% | Auto-purge executions / scheduled purges |
| **Blockchain Finality** | <2min | Transaction submission → Polygon confirmation |
| **Threshold Signature Time** | <5s | 3-of-5 guardian consensus time |

### Security Incident Response

```
SEVERITY 1 (CRITICAL): Child in imminent danger
  → Immediate authority escalation
  → All channels activated
  → SOC team paged
  → ODPC notified within 1 hour

SEVERITY 2 (HIGH): Potential safety risk
  → Parent + school notified
  → AI auditor review required
  → Logged to blockchain

SEVERITY 3 (MEDIUM): Anomalous but not dangerous
  → Parent notified via app
  → Logged for pattern analysis

SEVERITY 4 (LOW): Informational
  → In-app notification only
  → Aggregated in daily digest
```

---

## 🛠️ DEPLOYMENT CHECKLIST

### Pre-Production Security Hardening

- [ ] **HSM Provisioning**: AWS CloudHSM cluster deployed in af-south-1
- [ ] **PQC Key Generation**: ML-KEM-1024 + ML-DSA-65 keys generated in HSM
- [ ] **TPM Integration**: Device manufacturer integrates Infineon SLE 78
- [ ] **Root CA Setup**: Mlinzi PQC Root CA with hybrid X.509v3 chain
- [ ] **ODPC Registration**: Submit data controller application
- [ ] **DPIA Submission**: File Data Protection Impact Assessment
- [ ] **Penetration Testing**: Third-party PQC-focused security audit
- [ ] **Incident Response Plan**: Documented and tested quarterly
- [ ] **Staff Training**: All engineers trained on Kenya DPA + PQC basics
- [ ] **Legal Review**: Terms of service and privacy policy vetted by counsel
- [ ] **Insurance**: Cyber liability coverage including child data breach
- [ ] **Bug Bounty**: Launch responsible disclosure program

---

## 📚 REFERENCES

1. NIST. (2024). *FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard*. https://csrc.nist.gov/pubs/fips/203/final
2. NIST. (2024). *FIPS 204: Module-Lattice-Based Digital Signature Algorithm Standard*. https://csrc.nist.gov/pubs/fips/204/final
3. NIST. (2024). *FIPS 205: Stateless Hash-Based Digital Signature Standard*. https://csrc.nist.gov/pubs/fips/205/final
4. Ernstberger, J. et al. (2024). *Zero-Knowledge Location Privacy via Accurate Floating-Point SNARKs*. arXiv:2404.14983
5. Republic of Kenya. (2019). *Data Protection Act, No. 24 of 2019*. Kenya Gazette Supplement No. 125
6. Office of the Data Protection Commissioner. (2023). *Guidance Notes for Processing Children's Data*. ODPC, Nairobi
7. Trusted Computing Group. (2024). *TPM 2.0 Library Specification*. https://trustedcomputinggroup.org/
8. Kenya Law. (2010). *Constitution of Kenya, 2010*. Article 31 (Privacy), Article 53 (Children's Rights)

---

*Document Version: 3.0.0*
*Classification: CONFIDENTIAL — Child Protection Infrastructure*
*Author: Hub31 iSense Security Architecture Team*
*Date: 2026-05-19*
*Review Cycle: Quarterly*
