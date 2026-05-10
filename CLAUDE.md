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

## Aktuelle Version: 1.3.0 (main)

**Stand 2026-05-10:** Phase 1–4a ✅ auf main gemergt

- **main branch:** v1.3.0 mit Phase 1 + Phase 2 + Phase 3 (254 Tests, 86.83 % Coverage) + Phase 4a (ESLint 9, Prettier)
- **testing branch:** v1.3.0 (identisch mit main)

Versions-Stellen: `package.json`, `app.json`, `src/screens/SettingsScreen.tsx` – immer alle drei synchron halten, sonst schlägt CI fehl.

---

## Projektstruktur

```
App.tsx                        # Haupt-App, manuelle React Navigation Konfiguration
index.ts                       # Expo Entry Point
src/
  screens/                     # CalendarScreen, AgendaScreen, PlantManagementScreen, SettingsScreen
  components/                  # ActivityBar, PlantRow, AddActivityModal, EditActivityModal, AddPlantModal, AppHeader, Footer, ErrorBoundary
  contexts/                    # PlantContext (CRUD), LanguageContext (de/en)
  hooks/                       # useTheme (Dark/Light/System)
  constants/
    defaultPlants.ts           # 32 vordefinierte Pflanzen mit Aktivitäten, Standort, Kategorie
    activityTypes.ts           # Aktivitätstypen mit Farben
    plantMetadata.ts           # PLANT_LOCATION_METADATA + PLANT_CATEGORY_METADATA (Single Source of Truth)
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

## Roadmap (Issue #47) – Stand 2026-05-10

Vollständige Roadmap: https://github.com/S540d/Pflanzkalender/issues/47

| Phase | Inhalt                                                                          | Status             | Branch |
| ----- | ------------------------------------------------------------------------------- | ------------------ | ------ |
| 1     | Issue #39: Android 15 Edge-to-Edge, `viewport-fit=cover`, `expo-navigation-bar` | ✅ Merged (PR #64) | main   |
| 2     | PWA vervollständigen: `manifest.json`, Icons, Service Worker, assetlinks.json   | ✅ Merged (PR #65) | main   |
| 3     | Tests: 254 Tests, 86.83 % Statement-Coverage (Issue #70)                        | ✅ Merged (PR #71) | main   |
| 4a    | ESLint 9 + Prettier (Issue #67)                                                 | ✅ Merged (PR #69) | main   |
| 4b    | Expo Router statt manueller React Navigation                                    | ⏳ Pending         | —      |
| 5     | Play Store via TWA: Bubblewrap CLI, Digital Asset Links, APK/AAB                | 📋 Planned         | —      |

---

## CI/CD – Deploy-Trigger (Stand 2026-04-09)

| Workflow                | Trigger                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `deploy-production.yml` | Push auf `main` (automatisch nach Merge) + `workflow_dispatch` |
| `deploy-testing.yml`    | Push auf `testing` (automatisch) + `workflow_dispatch`         |

**Service Worker:** `scripts/add-service-worker.js` wird im Production-Deploy ausgeführt und injiziert die SW-Registrierung in `index.html`. Nicht deaktivieren – ohne das Script sehen Nutzer mit altem SW immer die gecachte Version.

---

## Offene Issues (Stand 2026-05-10)

- **#47** Roadmap: Phase 4b (Expo Router) + Phase 5 (Play Store)
- **#48** Klimazonen-Unterstützung – unterschiedliche Aktivitätszeiträume je Region (Ziel: v2.0.0)

---

## Letzte Merges / Fixes (2026-05-10)

| Was                                           | Wann       | Details                                                          |
| --------------------------------------------- | ---------- | ---------------------------------------------------------------- |
| **PR #71:** Issue #70 – Coverage ≥85 %        | 2026-05-10 | ✅ main: 254 Tests, 86.83 % Statements (vorher 55.6 %)           |
| **PR #69:** Phase 4a – ESLint 9 + Prettier    | 2026-05-09 | ✅ main: eslint.config.js, .prettierrc, erste Test-Erweiterungen |
| fix: remove duplicate HALF_MONTH_NAMES export | 2026-05-09 | ✅ main: monthHelper.ts bereinigt                                |
| PR #64: Issue #39 – Android 15 Edge-to-Edge   | 2026-05-03 | ✅ main: expo-navigation-bar, viewport-fit:cover                 |
| **PR #65:** Phase 2 PWA + Phase 3 Tests       | 2026-05-03 | ✅ main: manifest.json, Icons, SW, 134 Tests (Basis)             |
