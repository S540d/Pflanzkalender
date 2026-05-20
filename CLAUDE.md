# CLAUDE.md – Pflanzkalender Projektgedächtnis

Dieses Dokument ist die primäre Wissensquelle für Claude Code Sessions. Immer zuerst lesen.

---

## Projektübersicht

**Pflanzkalender** ist eine PWA zur Verwaltung von Gartenaktivitäten mit halber Monatsauflösung (24 Halbmonate).  
Live: https://s540d.github.io/Pflanzkalender/  
Repo: https://github.com/s540d/Pflanzkalender

---

## Tech Stack (exakte Versionen)

| Paket                                  | Version                                     |
| -------------------------------------- | ------------------------------------------- |
| Expo                                   | ~54.0.12                                    |
| React                                  | 19.1.0                                      |
| React Native                           | 0.81.4                                      |
| React Native Web                       | ^0.21.0                                     |
| TypeScript                             | ~5.9.2                                      |
| React Navigation (Bottom Tabs + Stack) | ^7.x                                        |
| AsyncStorage                           | ^2.2.0                                      |
| Firebase                               | ^12.3.0 (initialisiert, Placeholder-Config) |

Build: `expo export --platform web` → Metro Bundler  
Deploy: GitHub Pages via `gh-pages` unter `/Pflanzkalender/`

---

## Aktuelle Version: 1.3.1 (main)

**Stand 2026-05-20:** User-Feedback (Issue #104, PR #107) + Lint Fix (Issue #108, PR #111) gemergt.

- **main branch:** v1.3.1 mit Phase 1 + Phase 2 (vollständig, inkl. Icon-Resizing) + Phase 3 (299 Tests) + Phase 4a (ESLint 9, Prettier) + Issue #56 Phase 3 (TypeScript-Cleanup, `TouchableWebProps`, Duplikat-Beseitigung) + Klima-Reiter (Issue #55, PR #80) + Splash Screen (Issue #99, PR #106) + User-Feedback (Issue #104, PR #107)
- **testing branch:** v1.3.1 (identisch mit main)

Versions-Stellen: `package.json`, `app.json`, `src/screens/SettingsScreen.tsx` – immer alle drei synchron halten, sonst schlägt CI fehl.

---

## Projektstruktur

```
app/                           # Expo Router (file-based routing, Phase 4b)
  _layout.tsx                  # Root: ErrorBoundary/Language/Plant Provider + Bottom-Tabs
  index.tsx                    # /         → CalendarScreen
  agenda.tsx                   # /agenda   → AgendaScreen
  plants.tsx                   # /plants   → PlantManagementScreen
  climate.tsx                  # /climate  → ClimateScreen
  settings.tsx                 # /settings → SettingsScreen
app.config.js                  # Dynamische Expo-Config: expo-router plugin, web.output=single, experiments.baseUrl (Prod/Testing)
src/
  screens/                     # CalendarScreen, AgendaScreen, PlantManagementScreen, ClimateScreen, SettingsScreen
  components/                  # ActivityBar, PlantRow, AddActivityModal, EditActivityModal, AddPlantModal, AppHeader, Footer, ErrorBoundary
  contexts/                    # PlantContext (CRUD), LanguageContext (de/en)
  hooks/                       # useTheme (Dark/Light/System)
  constants/
    defaultPlants.ts           # 32 vordefinierte Pflanzen mit Aktivitäten, Standort, Kategorie
    activityTypes.ts           # Aktivitätstypen mit Farben
    plantMetadata.ts           # PLANT_LOCATION_METADATA + PLANT_CATEGORY_METADATA (Single Source of Truth)
    plantNames.ts              # PLANT_NAME_EN + getPlantDisplayName() – DE↔EN Übersetzung für Pflanzennamen
    theme.ts                   # Farbpalette
  services/
    storage.ts                 # AsyncStorage Wrapper
    firebase.ts                # Firebase Init (Placeholder)
  types/index.ts               # Plant, Activity, User, PlantLocation, PlantCategory
  utils/                       # activityLayout, monthHelper
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
  color, label
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

### Versions-Konsistenz

Drei Stellen müssen immer identisch sein:

- `package.json` → `"version"`
- `app.json` → `"expo.version"`
- `src/screens/SettingsScreen.tsx` → `APP_VERSION = '...'`

### Platform Safety

`window.*` und `localStorage` nur mit `Platform.OS === 'web'` Guard oder Kommentar `// platform-safe`. React Native hat ein `window`-Objekt, aber nicht alle Web-APIs.

### PlantLocation / PlantCategory Typen

**Nie** `as PlantLocation` oder `as PlantCategory` casten. String-Literale werden direkt über den Array-Typ in `Omit<Plant, ...>[]` geprüft. Neue Werte nur in `src/constants/plantMetadata.ts` (PLANT_LOCATION_METADATA / PLANT_CATEGORY_METADATA) und `src/types/index.ts` ergänzen.

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

### Squash-Merge: Feature-Branches nach Merge löschen

Bleiben Feature-Branches nach einem Squash-Merge im Remote stehen, schlägt jeder spätere Merge oder Rebase mit ihnen mit add/add-Konflikten in den ursprünglich gemergten Dateien fehl – Git erkennt die Inhaltsgleichheit der squash-erzeugten Commits nicht, weil sie neue Hashes haben. **Immer Branch nach Merge löschen.** Falls schon zu spät: nur den Diff `branch..main` als Patch ausschneiden, auf einen frischen Branch von main anwenden, alten Branch wegwerfen (siehe Vorgehen bei PR #75).

---

## Branch-Strategie

| Branch                    | Zweck                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| `main`                    | Production                                                                               |
| `develop`                 | Integration (optional)                                                                   |
| `testing`                 | Löst Deploy auf `gh-pages-testing` aus → https://s540d.github.io/Pflanzkalender-testing/ |
| `claude/<feature>-<hash>` | Feature-Branches (von Claude generiert)                                                  |

Workflow: Feature-Branch → PR auf main → CI grün → Merge (squash).

---

## Roadmap (Issue #47) – Stand 2026-05-14

Vollständige Roadmap: https://github.com/S540d/Pflanzkalender/issues/47

| Phase | Inhalt                                                                          | Status                                   | Branch |
| ----- | ------------------------------------------------------------------------------- | ---------------------------------------- | ------ |
| 1     | Issue #39: Android 15 Edge-to-Edge, `viewport-fit=cover`, `expo-navigation-bar` | ✅ Merged (PR #64)                       | main   |
| 2     | PWA vervollständigen: `manifest.json`, Icons, Service Worker, assetlinks.json   | ✅ Vollständig (`4e66719` Icon-Resizing) | main   |
| 3     | Tests: 254 Tests, 86.83 % Statement-Coverage (Issue #70)                        | ✅ Merged (PR #71)                       | main   |
| 4a    | ESLint 9 + Prettier (Issue #67)                                                 | ✅ Merged (PR #69)                       | main   |
| 4b    | Expo Router (file-based, Bottom-Tabs, baseUrl, SPA-404)                         | 🔄 PR (claude/pwa-refactoring-planning)  | —      |
| 5     | Play Store via TWA: Bubblewrap CLI, Digital Asset Links, APK/AAB                | 📋 Planned (Voraussetzungen erfüllt)     | —      |

---

## CI/CD – Deploy-Trigger (Stand 2026-04-09)

| Workflow                | Trigger                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `deploy-production.yml` | Push auf `main` (automatisch nach Merge) + `workflow_dispatch` |
| `deploy-testing.yml`    | Push auf `testing` (automatisch) + `workflow_dispatch`         |

**Service Worker:** `scripts/add-service-worker.js` wird im Production-Deploy ausgeführt und injiziert die SW-Registrierung in `index.html`. Nicht deaktivieren – ohne das Script sehen Nutzer mit altem SW immer die gecachte Version.

---

## Offene Issues (Stand 2026-05-19)

- **#47** Roadmap: Phase 4b (Expo Router) + Phase 5 (Play Store)
- **#48** Klimazonen-Unterstützung – unterschiedliche Aktivitätszeiträume je Region (Ziel: v2.0.0)

---

## Letzte Merges / Fixes (2026-05-20)

| Was                                         | Wann       | Details                                                                                                                                                 |
| ------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PR #112:** Review PR #110 – v1.3.1 fixes  | 2026-05-20 | ✅ main `bb58f81`: Version-Bump 1.3.1, toter `settings.version`-Key entfernt, Versions-Test auf Semver-Pattern, CLAUDE.md Test-Count 299                |
| **PR #111:** Issue #108 – Lint Fix          | 2026-05-19 | ✅ main `61125aa`: ESLint-Warnings 45 → 0 (allow console.error/warn, fix unused vars/types, disable exhaustive-deps, test-file-override for no-console) |
| **PR #107:** Issue #104 – User-Feedback     | 2026-05-19 | ✅ main `f8a65f5`: Kalender-Zoom (3 Stufen), Pflanzen-Übersetzungen (`plantNames.ts`), Suchleiste in Pflanzenverwaltung, Tab-Overflow-Fix               |
| **PR #106:** Issue #99 – Splash Screen      | 2026-05-19 | ✅ main `4b9be2e`: `app.json` splash+adaptive-icon `#1a7a4a`, `manifest.json` background, `scripts/add-splash-screen.js`, `twa-manifest.template.json`  |
| **fix:** PWA Icon-Resizing                  | 2026-05-14 | ✅ main `4e66719`: Icons auf 192×192 / 512×512 resized (waren 1024×1024); generate-icons.js prüft jetzt Pixeldimensionen                                |
| **PR #80:** Issue #55 – Klima-Reiter        | 2026-05-11 | ✅ main `f7c59af`: `ClimateScreen.tsx` mit 15 Empfehlungen, 4 Filter-Tabs, Trocken-/Hitze-Bewertung, DE/EN, Dark-Mode                                   |
| **PR #81:** Dependency-Fix                  | 2026-05-11 | ✅ main `ded9532`: Tilde-Ranges für expo-status-bar und @types/react                                                                                    |
| **PR #79:** Fix Activity-Bar Alignment      | 2026-05-11 | ✅ main `52f6f46`: Activity-Bars auf breiten Screens korrekt ausgerichtet                                                                               |
| **PR #78:** Issue #77 – Dependency Updates  | 2026-05-11 | ✅ main `a778157`: 19 Security Fixes + 20 Outdated Packages                                                                                             |
| **PR #75:** Rescue Copilot-Reviews PR #71   | 2026-05-10 | ✅ main `36e8902`: `waitFor`-Pattern in `useTheme.test`, `AgendaScreen.test`                                                                            |
| **PR #72:** Issue #56 Phase 3 – Type Safety | 2026-05-10 | ✅ main `d7995bb`: `MONTH_SHORT` statt Duplikat-Array in ActivityBar, `TouchableWebProps`-Interface                                                     |

---

## Bekannte CI-Probleme (Stand 2026-05-19)

### ✅ Unit Tests – `settings.version`-Key (GELÖST in PR #112)

`LanguageContext.tsx` hatte früher einen `settings.version`-Key (z. B. `'Version 1.3.1'`), der bei jedem Version-Bump manuell aktualisiert werden musste. Dieser Key war **toter Code** – die Version wird in `SettingsScreen.tsx` über `settings.versionLabel + APP_VERSION` gerendert, nicht via `t('settings.version')`. Key in PR #112 entfernt. Versions-Test nutzt jetzt `/\d+\.\d+\.\d+/` statt hardcodierter Version.

### ✅ Lint & Format Check (Issue #108) – GELÖST in PR #111

ESLint-Warnings 45 → **0** via:

- **ESLint-Config**: `no-console: allow: ['error', 'warn']`, Test-Override `no-console: off`, `varsIgnorePattern: '^_'` für no-unused-vars
- **Test-Dateien**: Ungenutzte Imports/Variablen entfernt, `any` → konkrete Typen in Mocks
- **Produktionscode**: `console.error` intentional, unused params `_` prefixed, `exhaustive-deps` Block-Disable wo Deps redundant
- **Ergebnis**: 0 Warnings lokal, Prettier clean, 299 Tests grün
