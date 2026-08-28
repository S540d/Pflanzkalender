# CLAUDE.md – Pflanzkalender Projektgedächtnis

Dieses Dokument ist die primäre Wissensquelle für Claude Code Sessions. Immer zuerst lesen.

---

## Projektübersicht

**Pflanzkalender** ist eine PWA zur Verwaltung von Gartenaktivitäten mit halber Monatsauflösung (24 Halbmonate).  
Live: https://s540d.github.io/Pflanzkalender/  
Repo: https://github.com/s540d/Pflanzkalender

---

## Tech Stack (exakte Versionen)

Stand main = testing (SDK 56, seit PR #194 synchron) – siehe „Aktuelle Version".

| Paket                | Version                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| Expo                 | ^56.0.12                                                                        |
| React                | 19.2.3                                                                          |
| React Native         | 0.85.3                                                                          |
| React Native Web     | ^0.21.2                                                                         |
| TypeScript           | ~6.0.3                                                                          |
| expo-router          | ~56.2.11                                                                        |
| @expo/vector-icons   | ^15.0.2 (seit Redesign PR #193)                                                 |
| expo-linear-gradient | ~56.0.4 (seit PR #193 installiert, seit PR #195 genutzt: CategoryTabBar/Button) |
| expo-haptics         | ~56.0.3 (seit PR #195 – Impact-Feedback bei Button-Press/Drag&Drop)             |
| AsyncStorage         | ^3.1.1                                                                          |
| Firebase             | ^12.15.0 (initialisiert, Placeholder-Config)                                    |

Build: `expo export --platform web` → Metro Bundler  
Deploy: GitHub Pages via `gh-pages` unter `/Pflanzkalender/`

---

## Aktuelle Version: 1.6.1 (appVersionCode 17)

**Stand 2026-08-25:** main = **v1.6.1** (Play-Store-Build vc17). testing ist main inzwischen wieder um mehrere Commits voraus (PR #209 CI-Trigger-Fix, #211 targetSdk-36-Patch-Skript, #212 TWA-Launch-URL-Fix, #214 Issue-#213-User-Feedback-Fixes) – noch nicht per `testing → main`-PR zurückgeführt.

**Stand 2026-08-24:** main = testing = **v1.6.1**. Play-Store-Build **vc17** gebaut, signiert und hochgeladen – enthält den Fix für die TWA-Launch-URL (Doppel-Domain, siehe „TWA-Build" unten), `minSdkVersion 23`, `targetSdkVersion 36` und `androidbrowserhelper 2.7.2`. Der Semver-String bleibt `1.6.1` (kein Code-Change gegenüber Tag `v1.6.1`, nur Build-Konfiguration) – nur `appVersionCode` zählt hoch. Git-Tag `v1.6.1` existiert bereits und bleibt die Release-Baseline.

**Offen nach vc17:** `android:resizeableActivity="true"` (Issue #202) fehlte im vc17-Artefakt, weil `patch-twa-target-sdk36.sh` beim Build nicht mitlief – die Large-Screen-Warnung im Play Console bleibt daher bestehen und ist beim nächsten Build (vc18) mitzunehmen.

### Frühere Stände

**Stand 2026-07-03 (v1.5.3):** main und testing sind seit PR #194 (2026-06-27) wieder synchron – beide auf v1.5.3, Expo **SDK 56** + UI-Redesign. Die frühere „main hängt 2 Commits hinterher"-Situation (SDK 54 vs. SDK 56) ist aufgelöst.

- **PR #192 (#189):** Expo SDK 54 → 56 Upgrade (RN 0.85, TS 6, eslint-hooks 7) – in main
- **PR #193:** Optisches Modern-Redesign – Vektor-Icons (`@expo/vector-icons`/Ionicons), Design-Token-System (`src/constants/designTokens.ts`), UI-Primitive (`src/components/ui/`: Icon, Button, Card, Badge, AppText), neue Farbpalette (Primär `#3C9D5A`) – in main
- **PR #195 (in Arbeit):** `appVersionCode` 10 → 11 (nächster Play-Store-Build) + UI-Politur auf Basis des Redesigns: `expo-linear-gradient` (bis dahin installiert, aber ungenutzt) jetzt in `CategoryTabBar` (aktiver Chip, Cross-Fade) und `ui/Button` (primary/danger) eingesetzt; `ActivityBar` bekommt eine Fade/Scale-Entrance-Animation über die vorhandenen `duration`-Tokens; `expo-haptics` (`~56.0.3`) für Impact-Feedback bei Button-Press und Drag&Drop ergänzt; Empty-State in `PlantRowsContainer` nutzt jetzt Icon + den vorhandenen i18n-Key `plants.empty` statt hartcodiertem Text.
- **Issue #152** (Import-/Export-Konsolidierung) ist **geschlossen** (2026-06-05) – war in älteren CLAUDE.md-Ständen fälschlich noch als offen gelistet, siehe „Offene Issues" unten für den aktuellen Stand.

**SDK-56-Fallstrick (aus PR #193 gelernt):** Unter SDK 56 / RN 0.85 nötig, was unter SDK 54 noch ging: `StyleSheet.absoluteFillObject` → `absoluteFill` (RN-0.85-Rename); `tabBarIcon`-Callback von expo-router 56 liefert `ColorValue` statt `string`; `@expo/vector-icons` muss explizit deklariert sein (war nur transitiv).

Versions-Stellen: `package.json`, `app.json`, `twa-manifest.template.json` – immer alle drei synchron halten, sonst schlägt CI fehl. `SettingsScreen.tsx` liest Version jetzt dynamisch aus `package.json` (seit PR #124), kein manuelles Sync mehr nötig. `twa-manifest.template.json` trägt zusätzlich `appVersionCode` (reiner Android-Build-Zähler für den Play Store, unabhängig vom Semver-`version`-String) – bei jedem neuen Play-Store-Upload hochzählen, auch ohne Feature-Release (siehe PR #195).

---

## Projektstruktur

```
app/                           # Expo Router (file-based routing, Phase 4b)
  _layout.tsx                  # Root: ErrorBoundary/Language/Plant Provider + Bottom-Tabs (6 Tabs)
  index.tsx                    # /           → CalendarScreen
  agenda.tsx                   # /agenda     → AgendaScreen
  plants.tsx                   # /plants     → PlantManagementScreen
  climate.tsx                  # /climate    → ClimateScreen
  templates.tsx                # /templates  → TemplateScreen (Issue #8, seit PR #147)
  settings.tsx                 # /settings   → SettingsScreen
app.config.js                  # Dynamische Expo-Config: expo-router plugin, web.output=single, experiments.baseUrl (Prod/Testing)
src/
  screens/                     # CalendarScreen, AgendaScreen, PlantManagementScreen, ClimateScreen, SettingsScreen, TemplateScreen
  components/                  # ActivityBar, PlantRow, CategoryTabBar, TableHeader, AddActivityModal, EditActivityModal, AddPlantModal, EditPlantModal, ErrorBoundary, SettingsModal
    ui/                        # UI-Primitive (PR #193): Icon (Ionicons-Wrapper + ICONS-Mapping), Button, Card, Badge, AppText, index (Barrel)
  contexts/                    # PlantContext (CRUD + replacePlants), LanguageContext (de/en/fr/es/it/pl/nl/pt)
  hooks/                       # useTheme (Dark/Light/System)
  constants/
    defaultPlants.ts           # 32 vordefinierte Pflanzen mit Aktivitäten, Standort, Kategorie
    activityTypes.ts           # Aktivitätstypen mit Farben + icon (IconName, seit PR #193)
    categoryTabs.ts            # Kategorie-Tabs + iconName (IconName, seit PR #193)
    designTokens.ts            # Spacing, Radius, Typografie-Skala, shadow(level)-Helper (seit PR #193)
    climateRecommendations.ts  # ClimateRecommendation interface + RECOMMENDATIONS (15 Einträge)
    plantMetadata.ts           # PLANT_LOCATION_METADATA + PLANT_CATEGORY_METADATA (Single Source of Truth)
    plantNames.ts              # PLANT_NAME_EN + getPlantDisplayName() – DE↔EN Übersetzung für Pflanzennamen
    communityTemplates.ts      # 3 Community-Templates (Balkon-Starter, Gemüsegarten, Kräutergarten) – seit PR #147
    theme.ts                   # Farbpalette
  services/
    storage.ts                 # AsyncStorage Wrapper (inkl. exportPlants/importPlants mit Zod-Validierung)
    templateService.ts         # Export/Import Logik: buildExportJson, triggerWebDownload, sharePlants, importFromJson – seit PR #147
    firebase.ts                # Firebase Init (Placeholder)
  types/index.ts               # Plant, Activity, User, PlantLocation, PlantCategory
  utils/
    activityLayout.ts          # Layout-Berechnung für Aktivitätsbars
    monthHelper.ts             # Halbmonats-Hilfsfunktionen
    storageError.ts            # withStorageError() – unified AsyncStorage-Fehlerbehandlung
public/
  service-worker.js            # Custom SW (network-first)
assets/                        # Icons, Splash
scripts/                       # deploy.sh, fix-paths.js, validate-release.sh
.github/workflows/
  ci-cd.yml                    # CI: Code Quality, Build Web, Platform Checks, Security
  deploy-production.yml        # Manueller Production Deploy
  deploy-testing.yml           # Deploy auf gh-pages-testing
```

---

## Datenmodell

```typescript
Plant {
  id, name, isDefault, userId?,
  location?: 'sun' | 'partial-shade' | 'shade',   // seit v1.3.0
  category?: 'vegetable' | 'flower' | 'tree',      // seit v1.3.0
  activities: Activity[],
  notes?: string
}

Activity {
  id, type, startMonth, endMonth,  // 0-23 (Halbmonate: 0 = Jan 1. Hälfte, 23 = Dez 2. Hälfte)
  color, label,
  isCustomized?: boolean            // true = vom Nutzer verändert; schützt vor künftigen Default-Updates
                                    // addActivity() + updateActivity() setzen es automatisch auf true
                                    // Default-Aktivitäten beim ersten Start haben undefined (kein Flag)
}
```

---

## CI/CD

**GitHub Actions** (`ci-cd.yml`) läuft bei Push/PR auf `main` und `develop`:

| Job                      | Was wird geprüft                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| Code Quality & Linting   | `npm ci`, console.log in App.tsx, window.\* ohne Platform-Check, `tsc --noEmit \|\| true` |
| Build Web                | `expo export --platform web`                                                              |
| Platform Compatibility   | Versions-Konsistenz (package.json/app.json/SettingsScreen), UX Guidelines                 |
| Security Audit           | `npm audit`, Secret-Scan                                                                  |
| Release Readiness Report | Nur bei Push auf main                                                                     |

**Wichtig:** `Build Web` und `Release Readiness Report` hängen von `Code Quality` ab (`needs: code-quality`). Schlägt Code Quality fehl → beide werden übersprungen (skipped).

**Pre-Commit Hooks** (Husky): console.log, window.\*, localStorage, Versions-Inkonsistenz.

---

## Bekannte Stolperfallen

### package-lock.json

`npm ci` in CI ist streng – der Lockfile muss exakt mit package.json übereinstimmen. **Nie manuell bearbeiten.** Nach Dependency-Änderungen immer `npm install --package-lock-only --ignore-scripts` laufen lassen und den resultierenden Lockfile committen.

**Wichtig – `--legacy-peer-deps`:** Der bestehende Dependency-Baum hat einen ungelösten Peer-Konflikt (expo-router / @react-navigation). Jeder `npm install <pkg>` schlägt daher mit `ERESOLVE` fehl, **außer** mit `--legacy-peer-deps`. CI nutzt durchgängig `npm ci --legacy-peer-deps` (siehe `ci-cd.yml`, Deploy-Workflows). Neue Pakete also immer `npm install <pkg> --save --legacy-peer-deps` installieren – der so erzeugte Lockfile ist mit `npm ci --legacy-peer-deps` konsistent.

### Lint & Format Check – `eslint` reicht nicht, `prettier --check` separat prüfen

Der CI-Job „Lint & Format Check" prüft **beides**: `npm run lint` (ESLint) **und** `npm run format:check` (`prettier --check .`). Lokal nur `eslint .` laufen zu lassen reicht nicht – Prettier hat eigene Regeln (Zeilenumbrüche, Einrückung bei mehrzeiligen JSX-Props etc.), die ESLint nicht meldet. Vor jedem Commit mit Formatierungsrelevanz beides laufen lassen: `npx eslint <geänderte Dateien>` **und** `npx prettier --check <geänderte Dateien>` (bzw. bei Abweichungen `npx prettier --write`). Erlebt in PR #195: CI-Job rot trotz sauberem `tsc`/`eslint`, weil zwei JSX-Dateien nicht Prettier-formatiert waren.

### Versions-Konsistenz

Drei Stellen müssen immer identisch sein:

- `package.json` → `"version"`
- `app.json` → `"expo.version"`
- `src/screens/SettingsScreen.tsx` → `APP_VERSION = '...'`

### Platform Safety

`window.*`, `document.*`, `localStorage`, `Blob`, `FileReader` nur mit `Platform.OS === 'web'` Guard oder Kommentar `// platform-safe`. React Native hat ein `window`-Objekt, aber nicht alle Web-APIs.

Die ESLint-Globals in `eslint.config.js` enthalten Browser-APIs (`Blob`, `FileReader`, `document`, `alert` u. a.) – diese werden ausschließlich innerhalb von `Platform.OS === 'web'`-Guards verwendet.

Für `document.*` zusätzlich `typeof document !== 'undefined'` prüfen – auch wenn `Platform.OS === 'web'` gesetzt ist, kann `document` in SSR/Test-Umgebungen undefined sein.

DOM-Typen (`Event`, `HTMLInputElement` etc.) müssen explizit in `eslint.config.js` unter `src/**/*.{ts,tsx}` globals eingetragen sein – TypeScript kennt sie, ESLint's `no-undef` aber nicht.

### PlantLocation / PlantCategory Typen

**Nie** `as PlantLocation` oder `as PlantCategory` casten. String-Literale werden direkt über den Array-Typ in `Omit<Plant, ...>[]` geprüft. Neue Werte nur in `src/constants/plantMetadata.ts` (PLANT_LOCATION_METADATA / PLANT_CATEGORY_METADATA) und `src/types/index.ts` ergänzen.

### withStorageError – Fehlerbehandlung für AsyncStorage

Alle AsyncStorage-Operationen in `useTheme`, `LanguageContext` und `PlantContext` laufen über `withStorageError(label, op)` aus `src/utils/storageError.ts`. Neue Storage-Operationen ebenfalls damit wrappen, statt try-catch zu duplizieren.

`PlantContext.replacePlants(plants)` ersetzt den gesamten Pflanzenbestand und persistiert via `savePlants`. Im Storage-Mock für Tests immer `savePlants: jest.fn().mockResolvedValue(undefined)` mit angeben, da `PlantProvider` es beim Initialisieren aufrufen kann.

### Tests – AsyncStorage-Mocking

Mehrere Contexts (LanguageContext, PlantContext, useTheme) rufen `AsyncStorage.getItem` auf. Bei Tests, die beide Provider (`LanguageProvider` + `PlantProvider`) wrappen, **nie `mockResolvedValueOnce`** verwenden – der erste Aufruf gehört `LanguageContext`. Stattdessen key-basiertes `mockImplementation` nutzen:

```typescript
AsyncStorage.getItem.mockImplementation((key: string) =>
  key === '@Pflanzkalender:plants'
    ? Promise.resolve(JSON.stringify(testPlants))
    : Promise.resolve(null)
);
```

### Tests – PlantSchema Pflichtfelder

Jedes Test-Pflanzenobjekt muss **alle** Pflichtfelder aus `PlantSchema` enthalten: `id`, `name`, `isDefault`, `userId` (null erlaubt), `activities`, `notes` (leerer String `''` reicht), `createdAt`, `updatedAt`. Fehlt `notes`, schlägt die Zod-Validierung in `storageService.loadPlants()` lautlos fehl und die Pflanze erscheint nicht.

### Tests – Async State nach addPlant

`addPlant()` ruft intern `savePlants()` auf (async, nicht awaited). Daher **kein** direktes `expect()` nach `await act(async () => { addPlant(...) })`. Stattdessen `waitFor` verwenden:

```typescript
act(() => { result.current.addPlant(...); });
await waitFor(() => { expect(result.current.plants.length).toBe(before + 1); });
```

### AppHeader – Settings-Button testID

Der Settings-Button in `src/components/AppHeader.tsx` hat `testID="settings-button"`. Tests verwenden `getByTestId('settings-button')` statt positionsabhängigem `UNSAFE_getAllByType`.

### Tests – `waitFor` statt `act + setTimeout`

Tests, die auf einen async Effekt warten (z. B. AsyncStorage-Load in `useTheme`), **nie** mit `act(async () => { await new Promise(r => setTimeout(r, 50)) })` einleiten. Stattdessen direkt auf den observable State wartet:

```typescript
await waitFor(() => expect(result.current.themeMode).toBe('light'));
```

Gleicher Pattern bei React Native Testing Library: `waitFor(() => queryAllByText(...))` ist robuster als `waitFor(async () => await findAllByText(...))` (doppeltes Polling).

### Expo Router + GitHub Pages

- Entry-Point ist `expo-router/entry` (in `package.json` → `main`). **Kein** `App.tsx`/`index.ts` mehr; Routen sind Dateien in `app/`.
- Der GitHub-Pages-Subpfad wird **nicht** mehr von `scripts/fix-paths.js` gesetzt, sondern von `experiments.baseUrl` in `app.config.js` (Prod: `/Pflanzkalender`, Testing via `TESTING=true`: `/Pflanzkalender-testing`). Expo emittiert dadurch bereits korrekte Asset-/Script-Pfade – die Regex-Rewrites in `fix-paths.js`/`prepare-testing-deployment.js` laufen leer (no-op), die Cache-Busting-Injektion bleibt aktiv. Nicht „reparieren“.
- `metro.config.js` setzt **kein** `transformer.publicPath` mehr (würde mit `baseUrl` doppeln).
- `web.output: 'single'` (SPA). Deep-Links (`/Pflanzkalender/agenda`) funktionieren auf GitHub Pages nur, weil im Deploy `dist/index.html` nach `dist/404.html` kopiert wird. **Diesen Copy-Schritt nie entfernen** (in `deploy.sh`, `deploy-production.yml`, `deploy-testing.yml`).
- `app.json` behält `expo.version` (CI liest `require('./app.json').expo.version`). `app.config.js` ergänzt nur dynamisch – Version weiter dreifach synchron halten.
- Settings-Tab-Icon ist `⋮` (U+22EE), **nicht** das Zahnrad-Emoji – CI (`grep -rq "⚙" app/`) bricht sonst ab (UX-Guideline).

### Tests – expo-router globaler Mock (`__mocks__/expo-router.js`)

`useFocusEffect` (und weitere expo-router-Hooks wie `useRouter`) erwarten intern einen `NavigationContainer`. In Unit-Tests existiert dieser nicht → Hook crasht ohne Mock.

**Lösung (seit Issue #122):** `__mocks__/expo-router.js` neben `node_modules/` liefert no-op-Implementierungen für häufig verwendete expo-router-Exports (useFocusEffect, useRouter, useLocalSearchParams, useSegments, Tabs, Link). Jest lädt diese Datei automatisch – **kein** `jest.mock('expo-router', ...)` in einzelnen Test-Dateien mehr nötig.

**Wichtig:** `Tabs` ist eine Komponente mit statischer Property `Tabs.Screen` – diese Struktur wird in `app/_layout.tsx` für `<Tabs.Screen ... />` benötigt.

Per-Datei-Overrides bleiben weiterhin möglich via `jest.mock('expo-router', () => ...)` und haben Vorrang vor dem globalen Mock.

### Android Target API Level (Play Store) – `android/` ist generiert, nicht im Repo

Das native Android-Projekt (`android/app/build.gradle` mit `compileSdkVersion`/`targetSdkVersion`) wird **nicht** in diesem Repo geführt – `android/` und `app/build.gradle` stehen in `.gitignore` („generated native folders"). Es entsteht lokal durch die **Bubblewrap CLI** aus `twa-manifest.template.json` (siehe `docs/twa-vs-pwa.md`). Ein API-Level-Bump lässt sich daher **nicht** über einen Commit in diesem Repo erledigen, sondern nur im lokalen Build-Schritt:

1. `npm i -g @bubblewrap/cli@latest` (bzw. `npx @bubblewrap/cli`) – aktuellste Version installieren, die den geforderten API-Level bereits als Default in ihren Templates trägt.
2. `bubblewrap update` im Projektverzeichnis mit dem gepflegten `twa-manifest.template.json` als Basis ausführen, um `android/` neu zu generieren.
3. Fall die installierte Bubblewrap-Version das neue API-Level noch nicht selbst setzt: in `android/app/build.gradle` manuell `compileSdkVersion`/`targetSdkVersion` (und ggf. Android Gradle Plugin/Gradle-Wrapper-Version, `androidx.browser`/`androidbrowserhelper`-Version) auf das geforderte Level anheben.
4. AAB neu bauen und signieren, dabei `appVersionCode` in `twa-manifest.template.json` hochzählen (jeder Play-Store-Upload braucht einen höheren Code, siehe PR #195) und im Play Console hochladen.

Play Console verlangt ab 31.08.2026 `targetSdkVersion 36` (Android 16) für neue Uploads bestehender Apps (Stand Google-Play-Anforderungen, Google gewährt auf Anfrage Fristverlängerung bis 01.11.2026).

### Android 15 Edge-to-Edge / deprecated Status-/Navbar-APIs (Issue #206) – `scripts/patch-twa-edge-to-edge.sh`

Play Console meldet für die TWA die Nutzung unter Android 15 nicht mehr unterstützter APIs (`Window.setStatusBarColor`/`getStatusBarColor`/`setNavigationBarColor`, `LAYOUT_IN_DISPLAY_CUTOUT_MODE_*`). **Kein eigener App-Code** ist betroffen – die Aufrufe stammen aus `androidbrowserhelper:2.6.2`, der von Bubblewrap gepinnten Version. `androidbrowserhelper 2.7.0` (PR GoogleChrome/android-browser-helper#525) ersetzt diese durch `WindowInsetsController`-basierte Edge-to-Edge-Behandlung. Bubblewrap (`@bubblewrap/core` bis 1.24.1) zieht 2.7.x aber **nicht** automatisch als Stable.

Da das generierte `android/`-Projekt gitignored ist, wird der Fix nach jeder Bubblewrap-(Re)Generierung über ein **tracked Skript** re-appliziert – **vor** `./gradlew bundleRelease` ausführen:

```bash
bash scripts/patch-twa-edge-to-edge.sh
```

Das Skript ist idempotent und setzt in den generierten Gradle-Dateien: `androidbrowserhelper` → `2.7.2`; `jcenter()` → `mavenCentral()` (jcenter ist EOL und war das einzige Nicht-`google()`-Repo, über das u. a. die Buildscript-Classpath-Artefakte aufgelöst werden – ersatzloses Löschen bricht den Build); `minSdkVersion` → `23` (ABH 2.7.x fordert minSdk 23, Bubblewrap defaultet auf 21 → sonst Manifest-Merge-Fehler).

### Play Store API-Level 36 + Large-Screen-Warnung (Issue #210 / #202) – `scripts/patch-twa-target-sdk36.sh`

Zwei weitere Play-Console-Warnungen betreffen ebenfalls nur das generierte, gitignorete `android/`-Projekt (nicht den App-Code):

- **#210:** `targetSdkVersion`/`compileSdkVersion` müssen auf **36** (Android 16) angehoben sein (Play-Store-Pflicht ab 31.08.2026, siehe oben).
- **#202:** Die Large-Screen-Warnung verlangt `android:resizeableActivity="true"` im generierten `AndroidManifest.xml`. Die Quelle ist bereits korrekt (`twa-manifest.template.json` → `"orientation": "default"`), nur die generierten Artefakte (`app/build.gradle`, `AndroidManifest.xml`) hinken nach einer Bubblewrap-Regenerierung hinterher.

Wie beim Edge-to-Edge-Fix (#206) gibt es dafür ein **tracked Skript**, das nach jeder Bubblewrap-(Re)Generierung – zusätzlich zu `patch-twa-edge-to-edge.sh` – **vor** `./gradlew bundleRelease` läuft:

```bash
bash scripts/patch-twa-target-sdk36.sh
```

Das Skript ist idempotent und setzt: `compileSdkVersion`/`targetSdkVersion` → `36` (`app/build.gradle`); `android:resizeableActivity="true"` im `<application>`-Tag (`app/src/main/AndroidManifest.xml`). Ob die installierte Bubblewrap-Version 36 inzwischen selbst als Default setzt, vor jedem Lauf kurz prüfen (`grep compileSdkVersion app/build.gradle`) – das Skript ist dann ein No-op. Falls AGP-/Gradle-Wrapper-Version oder `androidx.browser` für API 36 ebenfalls angehoben werden müssen, ist das (Stand dieses Issues) noch nicht automatisiert und manuell zu prüfen.

**Wichtig:** Beide Issues können nicht durch einen reinen Repo-Commit „gelöst" werden – das Akzeptanzkriterium ist jeweils der tatsächliche Play-Console-Zustand nach einem neuen Upload. Die hier committeten Skripte automatisieren den lokalen Build-Schritt; Bubblewrap-Regenerierung, `gradlew bundleRelease`, Signierung und Play-Store-Upload bleiben manuelle Schritte (siehe Abschnitt „Android Target API Level" oben, Schritte 1–6), die lokale Android-Tooling/Keystore-Zugriff voraussetzen.

### TWA-Build: verbindliche Reihenfolge + Bubblewrap-Fallen (erlebt beim vc17-Build, 2026-08-24)

**`bubblewrap build` nach dem Patchen NICHT mehr verwenden.** Der Ein-Schritt-Befehl regeneriert das Android-Projekt und verwirft dabei _alle_ Patches (ABH fällt auf 2.6.2 zurück, `minSdkVersion` auf 21, `launchUrl` wird neu abgeleitet). Der Build läuft dann fehlerfrei durch und erzeugt ein Artefakt, das die Issues #206/#210/#202 wieder enthält – der Fehler fällt erst im Play Console auf.

Verbindliche Reihenfolge für jeden Play-Store-Build:

```bash
# 1. Projekt generieren (nur wenn nötig – regeneriert und verwirft Patches!)
ANDROID_SDK_ROOT= npx @bubblewrap/cli build   # oder: bubblewrap update

# 2. git status prüfen (siehe app/-Falle unten) und alle Patches anwenden
git status --short
bash scripts/patch-twa-edge-to-edge.sh
bash scripts/patch-twa-target-sdk36.sh

# 3. Werte verifizieren – erst wenn ALLE stimmen, weiterbauen
grep -nE "minSdkVersion|targetSdkVersion|androidbrowserhelper:|launchUrl:" app/build.gradle
grep -n "resizeableActivity" app/src/main/AndroidManifest.xml

# 4. Bauen OHNE Regenerierung
./gradlew bundleRelease assembleRelease

# 5. Signieren (Artefakte aus 4. sind unsigniert), dann im Artefakt verifizieren
```

**Falle 1 – Bubblewrap überschreibt `app/`.** Bubblewrap legt sein Android-Projekt in `app/` an (daher `app/build.gradle`) und löscht dabei das gleichnamige **expo-router-Verzeichnis** – alle Routen (`_layout.tsx`, `index.tsx`, `agenda.tsx`, `climate.tsx`, `plants.tsx`, `settings.tsx`, `templates.tsx`) verschwinden aus dem Arbeitsbaum. Der Store-Build merkt davon nichts (die TWA lädt nur die deployte Website), aber der Quellcode ist weg. **Nach jedem Bubblewrap-Lauf `git status` prüfen** und ggf. `git checkout -- app/*.tsx app/_layout.tsx` – anschließend `npx tsc --noEmit` und `npm test` zur Kontrolle.

**Falle 2 – `startUrl` muss relativ sein.** In `twa-manifest.template.json` steht korrekt `"startUrl": "/Pflanzkalender/"`. Wird daraus (durch Bubblewrap-Prompts) die **volle URL** `https://s540d.github.io/Pflanzkalender/`, erzeugt `app/build.gradle` mit `def launchUrl = "https://" + twaManifest.hostName + twaManifest.launchUrl` die Doppel-URL `https://s540d.github.iohttps://s540d.github.io/...`. Die App zeigt dann im TWA den Netzwerkfehler „prüfe ob 's540d.github.iohttps' einen Tippfehler enthält". Nach jedem Bubblewrap-Lauf prüfen: `grep launchUrl: app/build.gradle` muss `'/Pflanzkalender/'` zeigen.

**Falle 3 – BSD-sed kennt `\b` nicht.** In den Patch-Skripten niemals `\b` (Wortgrenze) in `sed -E`-Regexes verwenden: macOS-`sed` ersetzt dann lautlos nichts, während `grep -E` die Wortgrenze kennt und der if-Zweig trotzdem „erfolgreich" meldet. Stattdessen `([^0-9]|$)` + Rückreferenz. Nach jedem Skript-Lauf die Werte per `grep` gegenprüfen statt der Erfolgsmeldung zu vertrauen.

**Verifikation am fertigen Artefakt** (Erfolgsmeldungen der Skripte reichen nicht):

```bash
AAPT=$(ls ~/Library/Android/sdk/build-tools/*/aapt2 | tail -1)
"$AAPT" dump badging app-release-signed.apk | grep -i "sdkVersion\|package:"
"$AAPT" dump strings app-release-signed.apk | grep -oi "https://s540d.github.io[^ \"]*" | sort -u
"$AAPT" dump xmltree app-release-signed.apk --file AndroidManifest.xml | grep -i resizeableActivity
./gradlew -q app:dependencies --configuration releaseRuntimeClasspath | grep -i browserhelper
```

### Squash-Merge: Feature-Branches nach Merge löschen

Bleiben Feature-Branches nach einem Squash-Merge im Remote stehen, schlägt jeder spätere Merge oder Rebase mit ihnen mit add/add-Konflikten in den ursprünglich gemergten Dateien fehl – Git erkennt die Inhaltsgleichheit der squash-erzeugten Commits nicht, weil sie neue Hashes haben. **Immer Branch nach Merge löschen.** Falls schon zu spät: nur den Diff `branch..main` als Patch ausschneiden, auf einen frischen Branch von main anwenden, alten Branch wegwerfen (siehe Vorgehen bei PR #75).

---

## Branch-Strategie

```
main (production) ← testing ← feature/issue-XXX
```

`staging` wurde entfernt (2026-06-03, Issue #7).

| Branch              | Zweck                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `main`              | Production                                                                                    |
| `testing`           | Integration + Deploy auf `gh-pages-testing` → https://s540d.github.io/Pflanzkalender-testing/ |
| `feature/issue-XXX` | Feature-Branches (kurzlebig, nach Merge löschen)                                              |

Workflow: `feature/issue-XXX` → PR auf `testing` → CI grün → Merge (squash + delete-branch) → PR `testing → main`.

---

## Roadmap (Issue #47) – Stand 2026-05-14

Vollständige Roadmap: https://github.com/S540d/Pflanzkalender/issues/47

| Phase | Inhalt                                                                          | Status                                   | Branch |
| ----- | ------------------------------------------------------------------------------- | ---------------------------------------- | ------ |
| 1     | Issue #39: Android 15 Edge-to-Edge, `viewport-fit=cover`, `expo-navigation-bar` | ✅ Merged (PR #64)                       | main   |
| 2     | PWA vervollständigen: `manifest.json`, Icons, Service Worker, assetlinks.json   | ✅ Vollständig (`4e66719` Icon-Resizing) | main   |
| 3     | Tests: 254 Tests, 86.83 % Statement-Coverage (Issue #70)                        | ✅ Merged (PR #71)                       | main   |
| 4a    | ESLint 9 + Prettier (Issue #67)                                                 | ✅ Merged (PR #69)                       | main   |
| 4b    | Expo Router (file-based, Bottom-Tabs, baseUrl, SPA-404)                         | ✅ Merged (PR #82)                       | main   |
| 5     | Play Store via TWA: Bubblewrap CLI, Digital Asset Links, APK/AAB                | ✅ Abgeschlossen                         | main   |

---

## CI/CD – Deploy-Trigger (Stand 2026-04-09)

| Workflow                | Trigger                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `deploy-production.yml` | Push auf `main` (automatisch nach Merge) + `workflow_dispatch` |
| `deploy-testing.yml`    | Push auf `testing` (automatisch) + `workflow_dispatch`         |

**Service Worker:** `scripts/add-service-worker.js` wird im Production-Deploy ausgeführt und injiziert die SW-Registrierung in `index.html`. Nicht deaktivieren – ohne das Script sehen Nutzer mit altem SW immer die gecachte Version.

---

## Offene Issues (Stand 2026-08-28)

**Status (2026-08-28): main = v1.6.1, testing liegt mehrere Commits voraus (u. a. PR #214, siehe „Aktuelle Version"). 384 Tests grün. Offen: `resizeableActivity` (#202) fehlt in vc17 → beim nächsten Build (vc18) mitnehmen.**

**Aktuell offen:** #210 (targetSdkVersion 36, Deadline 31.08.2026 – **nur lokal umsetzbar**, s. u.), #202 (Large-Screen-Fix vc18 – **nur lokal umsetzbar**, Patch-Skripte bereits vorhanden). Vier Feature-Issues (#94 Statistik/Dashboard, #48 Klimazonen, #9 Fruchtfolge/Mischkultur, #4 Push) wurden am 2026-08-28 mit Label `maybe later` versehen – bewusst zurückgestellt, kein aktiver Scope.
**Zuletzt geschlossen:** #91 (Agenda-Vorschau) und #171 (Store-Eintrag überarbeiten) am 2026-08-28 als bereits erledigt identifiziert und geschlossen – beide waren in PR #121 bzw. PR #172 längst umgesetzt, nur nie geschlossen worden (siehe Issue-Kommentare für Details). Davor: #213 (User Feedback: unübersetzte Default-Aktivitäten/Notizen + Menüleiste, PR #214, 2026-08-25), #152 (Import-/Export-Konsolidierung, 2026-06-05), #161 (Emojis, PR #172/#174) und #8 (Template-System, PR #147/#151, 2026-06-27).

**#210/#202 – warum „nur lokal umsetzbar":** Beide erfordern native Android-Build-Schritte (Bubblewrap-Regenerierung, Gradle-Patches, AAB signieren, Play-Console-Upload). `android/` ist gitignored und wird nie im Repo geführt – eine Remote-Coding-Session ohne Android SDK/Signing-Keystore/Play-Console-Zugriff kann hier nichts beitragen. Repo-seitig ist bereits alles vorbereitet: `scripts/patch-twa-target-sdk36.sh` (hebt compileSdkVersion/targetSdkVersion auf 36, setzt `resizeableActivity="true"`) und `scripts/patch-twa-edge-to-edge.sh` (androidbrowserhelper 2.7.2). Runbook: `bubblewrap update` → beide Patch-Skripte → `appVersionCode` in `twa-manifest.template.json` hochzählen → `./gradlew bundleRelease` → Play-Console-Upload → Git-Tag.

### v1.4.0 – abgeschlossen / Play Store

- **#126** ✅ Geschlossen (PR #144 gemergt)
- **#122** ✅ Geschlossen (PR #145 gemergt)
- **#123** ✅ Geschlossen (PR #148 gemergt) – Code-Audit: ClimateRecommendations extrahiert, withStorageError-Utility, Navigation-Integrationstests
- **#88** ✅ Geschlossen (PR #146 gemergt) – Bug Data-Export: Blob-Download auf Web via `<a>`-Element
- **#87** ✅ Geschlossen (PR #149 gemergt) – Import-UI: JSON-Datei-Import im SettingsModal (Web), replacePlants in PlantContext, 9 i18n-Keys in 8 Sprachen, 341 Tests

### v1.5.0 – Content & Personalisierung

- **#91** ✅ **Geschlossen** (2026-08-28) – Agenda-Vorschau über aktuelle Woche hinaus – war bereits seit PR #121 (2026-05-20) umgesetzt (7-Spalten-Ansicht), nur nie geschlossen
- **#94** `maybe later` (2026-08-28) – Statistiken / Dashboard – saisonale Übersicht, bewusst zurückgestellt
- **#4** `maybe later` (2026-08-28) – Push-Benachrichtigungen, bewusst zurückgestellt

### v2.0.0 – Klimazonen & Community

- **#48** `maybe later` (2026-08-28) – Klimazonen-Unterstützung – unterschiedliche Aktivitätszeiträume je Region, bewusst zurückgestellt
- **#142** ✅ Drag & Drop für Aktivitäten im Kalender – **in main** (PR #172 → testing, via PR #174 nach main): Balken per Maus (Web) / PanResponder (Native) verschiebbar, Delta → `clampActivityShift` → `updateActivity`
- **#8** ✅ **Geschlossen** – Template-System: Pflanzpläne teilen und importieren – **in main** (PR #147, via #151); QR-Code-Teilen ergänzt (`qrcode-generator` + `react-native-svg`)
- **#9** `maybe later` (2026-08-28) – Intelligente Vorschläge: Fruchtfolge & Mischkultur, bewusst zurückgestellt

### Wartbarkeit / Tech-Debt

- **#152** ✅ **Geschlossen** (2026-06-05) – Konsolidierung der zwei parallelen Import-/Export-Pfade (SettingsModal-Import #149 vs. TemplateScreen #8), inkl. der in PR #151 vertagten Bugs (`addPlant`-Schleife Stale-State/ID-Kollision, `isDefault:true`-Importe nicht-editierbar)

## Abgeschlossene Roadmap-Issues

- **#47** Roadmap: ✅ Alle Phasen 1–5 abgeschlossen (Phase 4b PR #82, Phase 5 TWA-Manifest PR #106)

---

## Letzte Merges / Fixes (2026-08-25)

| Was                                                                | Wann       | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PR #214:** Issue #213 – User Feedback (Menüleiste + Übersetzung) | 2026-08-25 | ✅ testing `bd8f5cb`: Ursache der deutschen Wörter im englischen UI gefunden – die 32 Standardpflanzen (`defaultPlants.ts`) haben Aktivitäts-Labels (`Aussäen`, `Düngen`, …) und Notizen fest deutsch einprogrammiert; Pflanzennamen wurden schon übersetzt, Labels/Notizen nicht. Neue Helper `getActivityDisplayLabel()` (`src/utils/activityLabel.ts`) und `getPlantDisplayNotes()` (`src/constants/plantNames.ts`) leiten die Anzeige für unveränderte Defaults live aus `activity.type`/Pflanzenname per i18n ab; vom Nutzer angepasste Labels/Notizen (`isCustomized`) bleiben unangetastet. Eingesetzt in `ActivityBar`, `AgendaScreen`, `EditActivityModal`, `PlantRow`, `PlantManagementScreen`. Dazu: fest deutscher Platzhalter „Notizen hinzufügen..." in `PlantRow` durch neuen i18n-Key `plants.notesPlaceholder` (alle 8 Sprachen) ersetzt; `CategoryTabBar`-Chips nutzten `flex: 1` und quetschten längere Labels auf schmalen Geräten – Leiste ist jetzt horizontal scrollbar, Chips behalten ihre natürliche Breite. 384 Tests grün (2 Test-Fixtures angepasst: `ActivityBar.test.tsx` mockt `LanguageContext`, `AgendaScreen.test.tsx` setzt `isCustomized: true` für ihr absichtlich abweichendes Test-Label). Nur `review-gate`/Mergeability-Check lief (CI-Workflows triggern seit PR #209 nur noch gegen main, nicht gegen testing). |
| **vc17-Build:** TWA-Launch-URL-Fix + Build-Patches                 | 2026-08-24 | ✅ Play-Store-Build `v1.6.1 / vc17` gebaut, signiert (v1+v2+v3, `CN=S540d`), hochgeladen. **Ursache der App-Fehlermeldung „prüfe ob 's540d.github.iohttps' einen Tippfehler enthält" gefunden:** in der generierten `twa-manifest.json` stand `startUrl` als Volldomain statt als relativer Pfad – `app/build.gradle` setzt `"https://" + hostName + launchUrl` davor und erzeugte die Doppel-URL. Korrigiert auf `/Pflanzkalender/` und im Artefakt verifiziert. Dazu Bug in `scripts/patch-twa-edge-to-edge.sh` behoben: `\b` in der `sed -E`-Regex greift unter BSD-sed nie, der `minSdkVersion`-Patch wurde seit Einführung nur gemeldet, nie ausgeführt. Zwei Fehlbuilds unterwegs: `bubblewrap build` regeneriert das Projekt und verwirft alle Patches (ABH fiel auf 2.6.2, minSdk auf 21 zurück) → Build-Reihenfolge jetzt verbindlich dokumentiert (Patches, dann `./gradlew bundleRelease`, nie `bubblewrap build`). Außerdem hatte Bubblewrap den kompletten expo-router-Ordner `app/` (7 Dateien) überschrieben – aus git wiederhergestellt, `tsc` 0 / 384 Tests grün. `resizeableActivity` (#202) fehlt in vc17, da `patch-twa-target-sdk36.sh` nicht mitlief → offen für vc18.                                                                                                                                                                |
| **PR #195:** appVersionCode-Bump + UI-Politur → testing → main     | 2026-07-03 | ✅ `appVersionCode` 10 → 11 (`twa-manifest.template.json`, kein Feature-Release, nur neuer Play-Store-Build). Dazu UI-Politur auf Basis des ungenutzten Redesign-Potenzials: `expo-linear-gradient` erstmals eingesetzt (`CategoryTabBar` aktiver Chip mit Cross-Fade, `ui/Button` primary/danger), `ActivityBar`-Entrance-Animation (Fade/Scale über `duration`-Tokens), `expo-haptics` (`~56.0.3`) für Impact-Feedback, Empty-State in `PlantRowsContainer` mit Icon + vorhandenem i18n-Key `plants.empty` statt hartcodiertem Text. Unterwegs Bug im eigenen Gradient-Code gefunden (Icon/Label doppelt gerendert, brach 2 Tests) und vor dem Commit behoben. `Lint & Format Check` schlug initial fehl, da nur `eslint` (nicht `prettier --check`) lokal geprüft wurde – nachgezogen. 384 Tests grün.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **PR #194:** testing → main (Sync SDK 56 + Redesign)               | 2026-06-27 | ✅ main `189cb1c`: PR #192 (SDK 56) + PR #193 (Redesign) nach main gemergt – main und testing seitdem wieder inhaltsgleich.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **PR #193:** UI-Modern-Redesign → testing                          | 2026-06-27 | ✅ testing `6cd4013`: Vektor-Icons (`@expo/vector-icons`/Ionicons), Design-Tokens (`designTokens.ts`), UI-Primitive (`src/components/ui/`), neue Farbpalette (Primär `#3C9D5A`). Branch lag vor SDK-56-Upgrade → Konflikte aufgelöst (SDK-56-Deps übernommen, `expo-linear-gradient ~56.0.4`) + 3 SDK-56-Kompat-Fixes (`absoluteFill`, `ColorValue`, `@expo/vector-icons` deklariert). #161/#8 nachträglich geschlossen. 384 Tests grün.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **PR #192 (#189):** Expo SDK 54 → 56 → testing                     | 2026-06-27 | ✅ testing `1cdfe98`: Expo SDK 54 → 56, RN 0.85, TS 6, eslint-hooks 7. Details siehe Memory `project_dependencies.md`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **PR #174:** testing → main (Sync v1.5.0)                          | 2026-06-08 | ✅ main: #142 Drag&Drop, #161 Emojis, #171 Store-Listings, #8 QR-Teilen nach main. Version-Bump 1.4.1 → 1.5.0 (versionCode 5), `twa-manifest`-Sync-Fix (war auf 1.4.0 → Platform-Compatibility-CI rot). pr-review-Findings geprüft: Bug-Findings waren False Positives (abgeschnittener 40k-Diff) – PanResponder in `useRef`, `onPanResponderTerminate` vorhanden, `clampActivityShift` korrekt, `testID="qr-code-svg"` gesetzt. Future-Tickets: Store-Listing-CI-Check, `--legacy-peer-deps`-Konflikt tracken, QR-Import-Validierung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **PR #172:** Drag&Drop + Emojis + Store + QR → testing             | 2026-06-08 | ✅ testing `538ade5`: #161 Pflanzen-Emojis (`plantEmojis.ts`, sprachunabhängig) in Pflanzenliste/Kalender/Agenda; #171 mehrsprachige Store-Listings (`fastlane/metadata/android/{de-DE,en-US,es-ES}`); #8 QR-Teilen (`qrcode-generator`, SVG-Render, `buildShareString`); #142 Drag&Drop (Maus/PanResponder, `clampActivityShift`). 384 Tests grün, Web-Build ok                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **PR #157:** CI Standards Audit Listener                           | 2026-06-03 | ✅ main `eb14beb`: `standards-audit.yml` (reusable-security-scan, reusable-gitignore-audit, reusable-dev-standards-audit @v1); `.gitignore` um `.env.local` + `credentials.json` ergänzt (gitignore-audit Pflichteinträge, project-templates#7)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **PR #151:** testing → main (Merge)                                | 2026-05-31 | ✅ main `833a7f3`: alle testing-Commits (#8 Template-System, #88 Export-Fix) nach main; i18n-Konflikte (beide Key-Sätze) + CLAUDE.md aufgelöst; 4 Review-Robustheit-Fixes (document-Guards, URL-Revoke-Defer, Test-Timer); 2 Import-Bugs → #152; 364 Tests                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **PR #149:** Issue #87 – Import-UI                                 | 2026-05-30 | ✅ gemergt: JSON-Import im SettingsModal (Web file picker, Confirm-Dialog, replacePlants), 9 i18n-Keys × 8 Sprachen, ESLint-Globals (Event/HTMLInputElement), 341 Tests                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **PR #148:** Issue #123 – Code-Audit                               | 2026-05-30 | ✅ gemergt: `climateRecommendations.ts` extrahiert, `withStorageError`-Utility, Navigation-Integrationstests (`tabNavigation.test.tsx`), 338 Tests                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **PR #147:** Issue #8 – Template-System                            | 2026-05-29 | ✅ testing `ad4c9fb` (jetzt in main): TemplateScreen (3 Sections), 3 Community-Templates, templateService (Web-Download + Share), 348 Tests grün                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **PR #146:** Issue #88 – Export-Fix                                | 2026-05-29 | ✅ testing `f9e9e1b` (jetzt in main): Blob-Download auf Web für Daten-Export via `<a>`-Element                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **v1.4.0 Bump + APK/AAB**                                          | 2026-05-24 | ✅ main `b4627eb`: Version 1.4.0 / versionCode 5; APK + AAB gebaut & signiert; APK auf Testgerät installiert                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **PR #145:** Issue #122 – expo-router Mock                         | 2026-05-24 | ✅ gemergt: `__mocks__/expo-router.js` globaler Mock, per-file Boilerplate entfernt, 326 Tests grün                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **PR #144:** Issue #126 – TS-Fehler                                | 2026-05-24 | ✅ gemergt: `App_BACKUP.tsx` entfernt, `tsc --noEmit` sauber (Exit 0)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Sync:** testing ↔ main                                           | 2026-05-24 | ✅ Beide Branches identisch (Stand nach PR #141/CLAUDE.md-Updates)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **PR #141:** testing → main (Issue #3)                             | 2026-05-23 | ✅ main `61b12ba`: isCustomized-Flag + Shift-Buttons; Copilot-Fixes (Bound-Prüfung, Typ-Einschränkung); APK v1.3.2 gebaut + installiert                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **PR #137:** Issue #3 – isCustomized + Shift                       | 2026-05-23 | ✅ testing `e0f722e`: `Activity.isCustomized?`, Shift-Buttons im EditActivityModal (← Früher / Später →), 326 Tests (vorher 299)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **PR #116:** AgendaScreen i18n + Roadmap                           | 2026-05-20 | ✅ main `438abdf`: EN-Regressionstest in AgendaScreen.test, Phase 4b/5 ✅ in Roadmap, #47 abgeschlossen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **PR #115:** AgendaScreen-Lokalisierung                            | 2026-05-20 | ✅ main `cefc434`: `getPlantDisplayName(plant.name, language)` für Anzeige+Sortierung; `language` als `useCallback`-Dep                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **PR #112:** Review PR #110 – v1.3.1 fixes                         | 2026-05-20 | ✅ main `bb58f81`: Version-Bump 1.3.1, toter `settings.version`-Key entfernt, Versions-Test auf Semver-Pattern, CLAUDE.md Test-Count 299                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **PR #111:** Issue #108 – Lint Fix                                 | 2026-05-19 | ✅ main `61125aa`: ESLint-Warnings 45 → 0 (allow console.error/warn, fix unused vars/types, disable exhaustive-deps, test-file-override for no-console)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **PR #107:** Issue #104 – User-Feedback                            | 2026-05-19 | ✅ main `f8a65f5`: Kalender-Zoom (3 Stufen), Pflanzen-Übersetzungen (`plantNames.ts`), Suchleiste in Pflanzenverwaltung, Tab-Overflow-Fix                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **PR #106:** Issue #99 – Splash Screen                             | 2026-05-19 | ✅ main `4b9be2e`: `app.json` splash+adaptive-icon `#1a7a4a`, `manifest.json` background, `scripts/add-splash-screen.js`, `twa-manifest.template.json`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **fix:** PWA Icon-Resizing                                         | 2026-05-14 | ✅ main `4e66719`: Icons auf 192×192 / 512×512 resized (waren 1024×1024); generate-icons.js prüft jetzt Pixeldimensionen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **PR #80:** Issue #55 – Klima-Reiter                               | 2026-05-11 | ✅ main `f7c59af`: `ClimateScreen.tsx` mit 15 Empfehlungen, 4 Filter-Tabs, Trocken-/Hitze-Bewertung, DE/EN, Dark-Mode                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **PR #81:** Dependency-Fix                                         | 2026-05-11 | ✅ main `ded9532`: Tilde-Ranges für expo-status-bar und @types/react                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **PR #79:** Fix Activity-Bar Alignment                             | 2026-05-11 | ✅ main `52f6f46`: Activity-Bars auf breiten Screens korrekt ausgerichtet                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **PR #78:** Issue #77 – Dependency Updates                         | 2026-05-11 | ✅ main `a778157`: 19 Security Fixes + 20 Outdated Packages                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **PR #75:** Rescue Copilot-Reviews PR #71                          | 2026-05-10 | ✅ main `36e8902`: `waitFor`-Pattern in `useTheme.test`, `AgendaScreen.test`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **PR #72:** Issue #56 Phase 3 – Type Safety                        | 2026-05-10 | ✅ main `d7995bb`: `MONTH_SHORT` statt Duplikat-Array in ActivityBar, `TouchableWebProps`-Interface                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

---

## Bekannte CI-Probleme (Stand 2026-05-19)

### ✅ Unit Tests – `settings.version`-Key (GELÖST in PR #112)

`LanguageContext.tsx` hatte früher einen `settings.version`-Key (z. B. `'Version 1.3.1'`), der bei jedem Version-Bump manuell aktualisiert werden musste. Dieser Key war **toter Code** – die Version wird in `SettingsScreen.tsx` über `settings.versionLabel + APP_VERSION` gerendert, nicht via `t('settings.version')`. Key in PR #112 entfernt. Versions-Test nutzt jetzt `/\d+\.\d+\.\d+/` statt hardcodierter Version.

### ✅ Lint & Format Check (Issue #108) – GELÖST in PR #111

ESLint-Warnings 45 → **0** via:

- **ESLint-Config**: `no-console: allow: ['error', 'warn']`, Test-Override `no-console: off`, `varsIgnorePattern: '^_'` für no-unused-vars
- **Test-Dateien**: Ungenutzte Imports/Variablen entfernt, `any` → konkrete Typen in Mocks
- **Produktionscode**: `console.error` intentional, unused params `_` prefixed, `exhaustive-deps` Block-Disable wo Deps redundant
- **Ergebnis**: 0 Warnings lokal, Prettier clean, 299 Tests grün (Stand 2026-05-29: 348)

<!-- GLOBAL POLICY:START -->

## [GLOBAL POLICY]

> Automatisch synchronisiert aus project-templates (Issue #7). Nicht manuell editieren –
> Änderungen hier werden beim nächsten Sync überschrieben. Quelle anpassen statt lokal.

- PRs immer gegen `testing`, nie direkt gegen `staging` oder `main`
- Merge auf `main` nur mit expliziter schriftlicher Freigabe
- `--delete-branch` nur für Feature-Branches (nie staging/testing)
- **Lokales Branch-Cleanup:** `main` und `testing` NIE löschen — auch nicht beim Bulk-Delete verwaister `[gone]`-Branches. Ein fehlender `origin/main`/`origin/testing` ist ein **wiederherzustellender Defekt** (lokal behalten, nach origin zurückpushen), kein Aufräum-Signal.
- `--no-verify` nur auf explizite Bitte
- **Vor jedem Push: lokale Tests ausführen** (`npm test` bzw. projektspezifischer Test-Befehl) – kein Push ohne grüne lokale Tests
- **Kein Merge bei CI-Fail** – Branch Protection erzwingt das technisch; nie mit `--admin` umgehen außer auf explizite Bitte

## [ANDROID BUILD – PFLICHTREGELN]

- **Git-Tag** nach jedem Play-Store-Upload setzen: `git tag vX.Y.Z && git push origin vX.Y.Z` – der Tag markiert den tatsächlich veröffentlichten Stand und dient als Changelog-Baseline für den nächsten Build
- **EAS Local Build (DrawFromMemory):** Workingdir vor jedem Build leeren: `rm -rf ~/tmp/eas-build && mkdir -p ~/tmp/eas-build` – ein nicht-leeres Verzeichnis bricht den Build sofort ab
- **Disk-Check vor EAS Build:** Skia-Libraries benötigen ~5–8 GB. Bei < 5 GB frei: `npm cache clean --force && rm -rf ~/.npm/_npx` (~13 GB, sicher löschbar)
- **JAVA_HOME** für EAS/Expo-Builds explizit auf Android Studio JBR setzen: `export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"`
- **Gradle-Lock nach Absturz:** Bei "Cannot lock file hash cache"-Fehler Daemons stoppen: `pkill -f GradleDaemon`, dann Workingdir leeren und neu starten
- **AAB-Archiv:** Gebaute Release-AABs in einem **gitignored** `aab-archive/`-Verzeichnis im Repo-Root ablegen (in `.gitignore` aufnehmen – AABs sind 3–110 MB und gehören nie in die Git-History). Benennung: `<Projekt>-vX.Y.Z-vc<versionCode>-YYYY-MM-DD.aab`. **Retention: max. 2 Dateien** (aktuelles Release + ein Vorgänger für schnelles Rollback); ältere AABs löschen. Der Git-Tag `vX.Y.Z` ist die eigentliche Release-Baseline – ältere AABs lassen sich daraus jederzeit neu bauen.

## [CI – CACHE-CLEANUP]

- **Cache-Cleanup-Workflow** (`.github/workflows/cache-cleanup.yml`) in jedem Repo mit GitHub-Actions-Caches: löscht wöchentlich (So 03:00 UTC) bzw. on-demand alle Action-Caches älter als der jeweils letzte Lauf. GitHub-Limit ist 10 GB pro Repo – ohne Cleanup laufen Build-Caches (node_modules, Gradle, Expo) voll und verdrängen frische Einträge. Vorlage: `cache-cleanup.yml` in project-templates.
<!-- GLOBAL POLICY:END -->
