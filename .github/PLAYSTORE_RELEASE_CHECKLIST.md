# Pflanzkalender - Google Play Store Release Checklist

**Status:** Recht weit, aber noch nicht production ready
**Timeline:** 8-10 Wochen bis Registrierung
**Type:** React Native / Expo App
**Target:** Production readiness zuerst, dann Play Store

---

## 📅 8-10 Wochen Production Readiness + Launch Plan

### Phase 1: Production Readiness (Wochen 1-3)

**Ziel:** App ist stabil, getestet, und erfüllt alle Qualitätsstandards für Play Store

#### Woche 1: Code Quality & Cleanup

**TypeScript & Linting:**
- [ ] Keine TypeScript Errors (strict mode überprüfen)
- [ ] ESLint Warnings: Alle behoben oder geright-justified
- [ ] Prettier: Code formatiert
- [ ] Unused Code entfernt (dead code cleanup)
- [ ] Imports: Alle notwendig
- [ ] Keine console.log() in Production

**Dependency Management:**
- [ ] Alle Dependencies aktuell (keine Security Vulnerabilities)
  ```bash
  npm audit
  ```
- [ ] Keine unnecessary Dependencies
- [ ] Tree-shaking konfiguriert (Code splitting)

**Build Process:**
- [ ] Production Build erstellt erfolgreich
  ```bash
  eas build --platform android --auto-submit
  ```
- [ ] Build size angemessen (< 100MB ideal)
- [ ] Keine Source Maps in Production
- [ ] Release/Production Mode Settings korrekt

#### Woche 2: Feature Completeness & Error Handling

**Features Implementation:**
- [ ] Alle geplanten Features sind implementiert
- [ ] Keine "TODO" Comments mit kritischen Items
- [ ] Feature Flags (falls vorhanden): Alle configured für Production

**Error Handling:**
- [ ] Error Boundaries implementiert (catches crashes)
- [ ] Try-catch um kritische Operationen
- [ ] Network Errors: Benutzerfreundliche Messages
- [ ] Timeout Handling (API Calls, etc.)
- [ ] Offline Mode (falls applicable): Funktioniert
- [ ] Loading States: Überall implementiert
- [ ] Empty States: Überall implementiert (z.B. "No plants yet")
- [ ] Permission Denied Handling (falls Kameras, etc.)

**User Feedback:**
- [ ] Success Messages (z.B. "Plant added!")
- [ ] Error Messages (klar, actionable)
- [ ] Warning Messages (z.B. "Are you sure?")
- [ ] All Messages sind grammatikalisch korrekt & hilfreicher

#### Woche 3: Testing & Performance

**Testing Setup:**
- [ ] Jest/Vitest Setup konfiguriert
- [ ] Tests für kritische Features (min. 60% coverage)
  - Plant CRUD operations
  - Watering/Care scheduling
  - Data persistence
  - Error scenarios
- [ ] Keine Skipped (xit, describe.skip) Tests in Production
- [ ] Alle Tests passen

```bash
npm test
npm test -- --coverage
```

**Performance:**
- [ ] Lighthouse Score >= 80 (mindestens)
- [ ] App startet schnell (< 3 Sekunden ideal)
- [ ] Keine Memory Leaks
  - Test mit: DevTools → Memory Profiler
  - Öffne/schließe Screens mehrfach
  - Überprüfe auf wachsender Speichernutzung
- [ ] Smooth Animations (60 FPS)
- [ ] No janky Scrolls

**Accessibility Testing:**
- [ ] Lighthouse Accessibility Score >= 90
- [ ] Manual axe Audit:
  ```bash
  npm install -D @axe-core/react
  # oder verwende Accessibility Inspector im DevTools
  ```
- [ ] Screen Reader Test (TalkBack auf Android)
- [ ] Color Contrast: Alle Text >= 4.5:1
- [ ] Focus Indicators: Sichtbar auf allen Interactive Elements
- [ ] Touch Targets: >= 44x44px
- [ ] No Color-Only Information (z.B. auch Text/Icon für Status)

---

### Phase 2: Store Listing Preparation (Wochen 4-6)

#### Woche 4: Design & Assets

**Screenshots (5-8 Stück):**
- [ ] Format: 1080x1920px (21:9 ratio) oder 1440x2560px
- [ ] Zeige Key Features:
  - [ ] Plant List/Overview
  - [ ] Add Plant Screen
  - [ ] Care Schedule/Watering
  - [ ] Settings Screen
  - [ ] Plant Details
- [ ] Hochwertige Bilder (nicht einfache Screenshots)
- [ ] Mit Text Overlays wenn sinnvoll ("Add plants", "Track care", etc.)
- [ ] Consistent Styling/Branding

**Feature Graphic (1024x500px):**
- [ ] Design: App Name + Key Visual
- [ ] Beispiel: "Pflanzkalender - Track Your Plants"
- [ ] Professionelles Design
- [ ] Readable bei kleine Größen

**App Icon (512x512px PNG):**
- [ ] Überprüfe: Kein transparenter Saum
- [ ] Design: Plant-themed, Klar & Erkennbar
- [ ] Works auf verschiedenen Backgrounds

**Design Assets:**
- [ ] Alle Icons im App sind designt
- [ ] Dark Mode Icons funktionieren
- [ ] Icons sind erkennbar auf verschiedenen Backgrounds

#### Woche 5: Text & Legal

**Store Listing Text:**
- [ ] **App Name:** "Pflanzkalender" oder "Plant Calendar" (< 50 Zeichen)
- [ ] **Short Description** (< 80 Zeichen)
  - Beispiel: "Track your plants - watering, care, and growth"
- [ ] **Full Description** (< 4000 Zeichen)
  - Was ist die App
  - Features (Bullet Points)
    - Add and manage multiple plants
    - Track watering schedule
    - Reminders for care
    - Plant care tips
    - Offline support
  - Benefits: Save time, keep plants healthy
  - No misleading claims
  - Language: Grammatically correct
  - Tone: Professional, user-friendly

**Legal Documents:**
- [ ] **Privacy Policy**
  - [ ] Online unter HTTPS
  - [ ] Abdeckt:
    - What data is collected (minimal)
    - How it's used (locally stored)
    - Third-party services (if any)
    - User rights
    - Contact info
  - [ ] Deutsch & Englisch (optional)
  - [ ] Updated & Current

- [ ] **Terms of Service** (optional aber empfohlen)

**Contact & Support:**
- [ ] Support Email hinterlegen
- [ ] Support Link vorbereiten (z.B. "Buy Me a Coffee")
- [ ] Website/Portfolio Link (falls vorhanden)

#### Woche 6: Compliance & Rating

**Data Safety Form (wird später in Play Console ausgefüllt):**
- [ ] Bestimme: Welche Daten werden gesammelt?
  - Personal Information: Wahrscheinlich NEIN
  - Location: NEIN (oder JA wenn Plant-Standort benötigt)
  - Calendar/Contacts: NEIN (oder optional für Reminders)
  - Photos: JA (für Plant-Fotos von User)
  - Sensitive Info: NEIN
- [ ] Sicherheit: Lokal stored, HTTPS wenn APIs
- [ ] Ads: NEIN
- [ ] In-App Purchases: NEIN (außer optional)

**Content Rating:**
- [ ] Überprüfe: App hat keine:
  - Violence, Sexual Content, etc.
- [ ] Rating wird wahrscheinlich: Everyone (3+)

**Permissions Review:**
- [ ] Überprüfe: AndroidManifest.xml
- [ ] Nur notwendige Permissions:
  - INTERNET (falls APIs)
  - CAMERA (wenn Photo-Feature)
  - READ_CALENDAR (falls Calendar Reminders)
  - SCHEDULE_EXACT_ALARM (falls Push Notifications)
  - Others: Dokumentiere warum benötigt

---

### Phase 3: Final Testing (Woche 7)

**Hardware Testing:**
- [ ] Test auf min. 3 echten Android Devices:
  - [ ] Android 8.0+ (API 26+)
  - [ ] Android 10+ (API 29+)
  - [ ] Android 12+ (API 31+)
- [ ] Test auf verschiedenen Screen Sizes:
  - [ ] Small Phone (4.5")
  - [ ] Medium Phone (5.5")
  - [ ] Large Phone (6.5"+)
  - [ ] Tablet (wenn möglich)

**Test Scenarios:**
- [ ] **Happy Path**: Normale User Journey
  - Add plant → set reminders → check watering → mark done
- [ ] **Edge Cases**:
  - 100 plants (stress test)
  - Delete plant & undo
  - Offline → Online transition
  - Orientation change (portrait ↔ landscape)
  - Background/Resume (open other app, come back)
- [ ] **Error Cases**:
  - No internet (if APIs)
  - Permission denied
  - Storage full
  - App crash (shouldn't happen, aber test recovery)

**Regression Testing:**
- [ ] Überprüfe: Alte Features still funktionieren
- [ ] Neue Features nicht brechen alte

**Performance Testing (wiederholung):**
- [ ] Lighthouse: >= 80
- [ ] App Start Time: <= 3 Sekunden
- [ ] Smooth Scrolling (60 FPS)
- [ ] No Jank on Heavy Operations
- [ ] Battery draining test (1 hour usage)

---

### Phase 4: Play Console Setup (Woche 8)

#### Play Console Registration

**Developer Account:**
- [ ] Google Account (falls nicht vorhanden)
- [ ] Play Developer Account aktivieren
- [ ] Developer Agreement akzeptieren
- [ ] $25 USD Zahlungsmethode hinterlegen

**Create New App:**
1. Go to Play Console → Create new app
2. Eingabe:
   - App Name: Pflanzkalender
   - Default Language: Deutsch (optional)
   - App category: Lifestyle oder Productivity
   - Type: App (nicht Game)

#### Store Listing Ausfüllen

**App Information:**
- [ ] App Name (50 Zeichen max)
- [ ] Short Description (80 Zeichen max)
- [ ] Full Description (4000 Zeichen max)
- [ ] Alle URLs (Privacy Policy, Support, Website)

**Graphics:**
- [ ] Upload Screenshots (5-8 Stück)
- [ ] Upload Feature Graphic
- [ ] Upload Icon
- [ ] Überprüfe alle Previews

**Content Rating:**
- [ ] Füllen Sie Questionnaire aus
- [ ] Überprüfe Auto-generated Rating

**Additional Information:**
- [ ] Support Email
- [ ] Privacy Policy URL
- [ ] Website (optional)

---

### Phase 5: Build & Upload (Woche 9)

**Create Production Build:**
```bash
eas build --platform android
```

**Upload zu Play Console:**
1. Go to Release → Production
2. Click "Create new release"
3. Upload APK/AAB
4. Überprüfe Details:
   - [ ] Version Code
   - [ ] Version Name
   - [ ] Release Notes
5. Review & Roll Out

**Pre-Launch Report:**
- Warte auf Google Tests (24-48 Stunden)
- Überprüfe für:
  - [ ] Crashes
  - [ ] Performance Issues
  - [ ] Security Issues
  - [ ] Compatibility Issues

**Falls Probleme:**
- [ ] Download Error Logs
- [ ] Bugfix erstellen
- [ ] Neuer Build → Upload

---

### Phase 6: Launch (Woche 10)

**Rollout Strategy:**
- [ ] Start with 10% Rollout (small user segment)
- [ ] Monitor für 24 Stunden:
  - Crash Reports
  - Ratings
  - Install Count
  - Uninstall Rate

**If OK after 24h:**
- [ ] Increase to 50%
- [ ] Monitor weitere 24h

**If still OK:**
- [ ] Rollout auf 100%

**If Issues Found:**
- [ ] Pause Rollout
- [ ] Bugfix
- [ ] New Build
- [ ] Re-upload & Start Over

---

## 🧪 Complete Testing Checklist

### Unit Tests
- [ ] Plant CRUD (Create, Read, Update, Delete)
- [ ] Watering Schedule Logic
- [ ] Notification Calculation
- [ ] Data Validation
- [ ] Date/Time Handling
- [ ] Edge Cases (null values, empty lists, etc.)

### Integration Tests
- [ ] Plant + Schedule Integration
- [ ] Data Persistence (localStorage/database)
- [ ] API Calls (if any)
- [ ] Navigation Flow

### E2E Tests (minimal)
- [ ] Add Plant → Complete Setup → Mark Watered
- [ ] Edit Plant Details
- [ ] Delete Plant (with confirmation)
- [ ] App Settings

### Manual Testing
- [ ] Functional: Alles funktioniert
- [ ] Visual: Design konsistent
- [ ] Usability: Intuitiv bedienbar
- [ ] Performance: Schnell & smooth
- [ ] Accessibility: Screenreader-ready

---

## 📋 Pre-Launch Sign-Off

Vor Launch muss Folgendes erfüllt sein:

- [ ] Code Quality: TypeScript strict, ESLint clean
- [ ] Features: Alle implementiert & funktioniert
- [ ] Testing: 60%+ coverage, Alle Tests passen
- [ ] Performance: Lighthouse >= 80
- [ ] Accessibility: Lighthouse >= 90, Axe clean
- [ ] Store Listing: Vollständig & hochwertig
- [ ] Privacy Policy: Online & aktuell
- [ ] Legal: Komplett & korrekt
- [ ] Hardware Testing: 3+ Devices tested
- [ ] Error Handling: Robust
- [ ] Offline: Funktioniert (falls applicable)

**✅ Ready for Launch!**

---

## 📊 Post-Launch (First Month)

### Erste 24 Stunden:
- [ ] Monitor Crash Reports (check hourly)
- [ ] Überprüfe User Ratings
- [ ] Watch Install Count
- [ ] Respond zu Reviews

### Erste Woche:
- [ ] Daily monitoring Crash Reports
- [ ] Analytics überprüfen
- [ ] User Feedback sammeln
- [ ] Bug fixes vorbereiten (falls nötig)

### Monatlich:
- [ ] Release Minor Updates mit Bugfixes
- [ ] Implementiere User Feedback
- [ ] Update Dependencies
- [ ] Performance Monitoring

---

## 🔗 Resources & Referenzen

- [GOOGLE_PLAY_STORE_ROADMAP.md](../../project-templates/GOOGLE_PLAY_STORE_ROADMAP.md)
- [React Native Testing Best Practices](https://reactnative.dev/docs/testing-overview)
- [Expo Build Documentation](https://docs.expo.dev/build/)
- [Android Publishing Guide](https://developer.android.com/studio/publish)
- [Accessibility Testing Tools](https://developer.android.com/guide/topics/ui/accessibility/testing)

---

**Status:** Ready for Production Readiness Phase! 🚀
