# Architecture — Pflanzkalender

## Overview

Planting calendar for garden and balcony: when to sow, plant and tend 32
predefined crops, flowers and trees, at half-month resolution. Built with Expo
and React Native Web; the web build is deployed to GitHub Pages and wrapped as a
Trusted Web Activity (TWA) for the Play Store. Fully offline, no account.

```
Plant data (defaults + user plants)
        ↓
PlantContext        (in-memory state, CRUD)
        ↓
storageService      (AsyncStorage, JSON)
        ↓
Calendar / Agenda   (half-month grid, current & upcoming activities)
```

## Directory Structure

Routing is file-based via `expo-router`: each file in `app/` is a tab route and
delegates to the matching screen in `src/screens/`.

```
/                          # Repo root
├── app/                   # expo-router routes (thin wrappers)
│   ├── _layout.tsx        #   tab navigator, providers
│   ├── index.tsx          #   calendar
│   ├── agenda.tsx, plants.tsx, templates.tsx,
│   │   climate.tsx, settings.tsx
├── src/
│   ├── screens/           # The actual screen implementations
│   ├── components/        # Reusable UI
│   ├── contexts/
│   │   ├── PlantContext.tsx     #   plant state, the app's core store
│   │   └── LanguageContext.tsx  #   de/en switching
│   ├── services/
│   │   ├── storage.ts           #   AsyncStorage persistence
│   │   ├── templateService.ts   #   community templates
│   │   └── firebase.ts          #   UNUSED — see Key Decisions
│   ├── schemas/plant.ts   # Zod schemas, import validation
│   ├── constants/         # defaultPlants, plantMetadata, activityTypes,
│   │                      # climateRecommendations, designTokens, theme
│   ├── hooks/, i18n/, types/, utils/
├── public/                # PWA assets, privacy.html, .well-known
├── scripts/               # Build/deploy pipeline (see below)
├── android/ + *.gradle    # TWA wrapper
├── twa-manifest.json      # TWA config (packageId, host)
└── docs/                  # Project documentation
```

## Key Decisions

### Half-month resolution — `startMonth`/`endMonth` are 0–23, not months

`ActivitySchema` stores activity periods as `startMonth`/`endMonth` with
`min(0).max(23)`. Despite the field names these are **half-month indices**
(24 per year: January 1st half = 0, January 2nd half = 1, …), not month numbers.
Treating them as months is the single easiest mistake to make in this codebase.

### No backend — and Firebase is not wired up

Everything lives in `AsyncStorage` via `storageService`. `src/services/firebase.ts`
exists but is **dead code**: it still contains `YOUR_API_KEY` placeholders and is
imported nowhere. It is a leftover of an abandoned sync idea — do not treat it as
an available backend, and do not assume auth exists because `getAuth` appears in
the tree.

### Zod at the import boundary

User-supplied JSON (plant import) is validated with `PlantSchema` /
`ImportDataSchema` in `src/schemas/plant.ts` before it reaches state. Plant data
coming from outside the app should never bypass that validation.

### Defaults are data, not code

The 32 predefined plants live in `src/constants/defaultPlants.ts` with metadata
split across `plantMetadata.ts`, `plantNames.ts` and `plantEmojis.ts`. Adding a
plant means editing data files, not screens.

### TWA instead of a native build

The Play Store app is a Trusted Web Activity wrapping the GitHub Pages
deployment (`twa-manifest.json`: `packageId` `io.github.s540d.pflanzkalender`,
host `s540d.github.io`). Consequence: **shipping an app update means deploying
the web build** — the store binary only changes when the wrapper itself does.
`public/.well-known/assetlinks.json` must stay valid or the TWA falls back to a
browser chrome.

### Web head is assembled after the build

Expo/Metro emits a minimal `index.html`, so `scripts/add-pwa-meta-tags.js` injects
meta tags, canonical, Open Graph and the `lang` attribute into `dist/index.html`
post-build, idempotently. SEO changes belong in that script, not in a source
HTML file — there isn't one.

### Separate testing deployment

`TESTING=true` switches the base path to `/Pflanzkalender-testing` and sets
`robots: noindex, nofollow`, so the testing deployment is not indexed as
duplicate content.

## Data Flow

### Editing a plant

```
PlantManagementScreen
  → PlantContext.updatePlant()      → in-memory state
  → storageService.savePlants()     → AsyncStorage (JSON)
  → CalendarScreen / AgendaScreen re-render from context
```

### Import

```
JSON file → parseImportData() → Zod validation → PlantContext → storageService
```

## Environments

| Environment | URL / Target                                    | Build                |
| ----------- | ----------------------------------------------- | -------------------- |
| Production  | https://s540d.github.io/Pflanzkalender/         | deploy to `main`     |
| Testing     | https://s540d.github.io/Pflanzkalender-testing/ | `TESTING=true` build |
| Play Store  | `io.github.s540d.pflanzkalender` (TWA)          | Gradle wrapper build |
| Local       | Expo dev server (port printed on start)         | `npm start`          |

## Testing

Jest (`jest.config.js`) with tests in `__tests__/`. `scripts/validate-release.sh`
gates a release build; several `patch-twa-*.sh` scripts adjust the TWA wrapper
(edge-to-edge, target SDK) — see the open Play Store issues before changing them.
