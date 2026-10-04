# CLAUDE.md – Pflanzkalender Projektgedächtnis

Dieses Dokument ist die primäre Wissensquelle für Claude Code Sessions. Immer zuerst lesen.

**Weiterführende Dokumente:**

- [Architecture](docs/ARCHITECTURE.md) – Verzeichnisstruktur, Kernentscheidungen, Datenfluss
- [Changelog](CHANGELOG.md) – Nutzer-relevante Änderungen (Keep-a-Changelog-Format)
- [Vorfallsarchiv & Session-Historie](docs/private/INCIDENTS.md) – Diagnose-Verläufe, PR-für-PR-Historie (gitignored, lokal)
- [TWA vs. PWA](docs/twa-vs-pwa.md) – Entscheidung für Trusted Web Activity

---

## Projektübersicht

**Pflanzkalender** ist eine PWA zur Verwaltung von Gartenaktivitäten mit halber Monatsauflösung (24 Halbmonate).
Live: https://s540d.github.io/Pflanzkalender/
Repo: https://github.com/s540d/Pflanzkalender

---

## Tech Stack

Expo `^57.0.18`, React `19.2.3`, React Native `0.86.3`, React Native Web `~0.21.0`,
TypeScript `~6.0.3`, expo-router `~57.0.17`, AsyncStorage `^3.1.1`.
Build: `expo export --platform web` → Metro Bundler. Deploy: GitHub Pages via
`gh-pages` unter `/Pflanzkalender/`.

Versions-Stellen (immer alle drei synchron halten, sonst schlägt CI fehl):
`package.json`, `app.json`, `twa-manifest.template.json`. `SettingsScreen.tsx`
liest die Version dynamisch aus `package.json`, kein manuelles Sync nötig.
`twa-manifest.template.json` trägt zusätzlich `appVersionCode` (reiner
Android-Build-Zähler, unabhängig vom Semver-`version`-String) – bei jedem
neuen Play-Store-Upload hochzählen, auch ohne Feature-Release.

---

## Datenmodell

```typescript
Plant {
  id, name, isDefault, userId?,
  location?: 'sun' | 'partial-shade' | 'shade',
  category?: 'vegetable' | 'flower' | 'tree',
  activities: Activity[],
  notes?: string
}

Activity {
  id, type, startMonth, endMonth,  // 0-23 (Halbmonate: 0 = Jan 1. Hälfte, 23 = Dez 2. Hälfte)
  color, label,
  isCustomized?: boolean            // true = vom Nutzer verändert; schützt vor künftigen Default-Updates
}
```

---

## CI/CD

**GitHub Actions** (`ci-cd.yml`) läuft bei Push/PR auf `main` und `testing`:

| Job                      | Was wird geprüft                                                                |
| ------------------------ | ------------------------------------------------------------------------------- |
| Code Quality & Linting   | `npm ci`, console.log in App.tsx, window.\* ohne Platform-Check, `tsc --noEmit` |
| Build Web                | `expo export --platform web`                                                    |
| Platform Compatibility   | Versions-Konsistenz (package.json/app.json/SettingsScreen), UX Guidelines       |
| Security Audit           | `npm audit`, Secret-Scan                                                        |
| Release Readiness Report | Nur bei Push auf main                                                           |

`Build Web` und `Release Readiness Report` hängen von `Code Quality` ab
(`needs: code-quality`). **Lint & Format Check prüft beides:** `npm run lint`
(ESLint) **und** `npm run format:check` (`prettier --check .`) – lokal nur
`eslint .` laufen zu lassen reicht nicht, Prettier hat eigene Regeln.

**Pre-Commit Hooks** (Husky): console.log, window.\*, localStorage, Versions-Inkonsistenz.

---

## Bekannte Stolperfallen

### package-lock.json

`npm ci` in CI ist streng – der Lockfile muss exakt mit package.json übereinstimmen. **Nie manuell bearbeiten.** Nach Dependency-Änderungen immer `npm install --package-lock-only --ignore-scripts` laufen lassen und den resultierenden Lockfile committen.

**`--legacy-peer-deps` nötig:** Der bestehende Dependency-Baum hat einen ungelösten Peer-Konflikt (expo-router / @react-navigation). Jeder `npm install <pkg>` schlägt mit `ERESOLVE` fehl, **außer** mit `--legacy-peer-deps`. CI nutzt durchgängig `npm ci --legacy-peer-deps`. Neue Pakete immer `npm install <pkg> --save --legacy-peer-deps` installieren.

### Platform Safety

`window.*`, `document.*`, `localStorage`, `Blob`, `FileReader` nur mit `Platform.OS === 'web'` Guard oder Kommentar `// platform-safe`. Für `document.*` zusätzlich `typeof document !== 'undefined'` prüfen – auch mit `Platform.OS === 'web'` kann `document` in SSR/Test-Umgebungen undefined sein. DOM-Typen (`Event`, `HTMLInputElement` etc.) müssen explizit in `eslint.config.js` unter `src/**/*.{ts,tsx}` globals eingetragen sein.

### PlantLocation / PlantCategory Typen

**Nie** `as PlantLocation` oder `as PlantCategory` casten. Neue Werte nur in `src/constants/plantMetadata.ts` (PLANT_LOCATION_METADATA / PLANT_CATEGORY_METADATA) und `src/types/index.ts` ergänzen.

### withStorageError – Fehlerbehandlung für AsyncStorage

Alle AsyncStorage-Operationen in `useTheme`, `LanguageContext` und `PlantContext` laufen über `withStorageError(label, op)` aus `src/utils/storageError.ts`. Neue Storage-Operationen ebenfalls damit wrappen, statt try-catch zu duplizieren.

`PlantContext.replacePlants(plants)` ersetzt den gesamten Pflanzenbestand. Im Storage-Mock für Tests immer `savePlants: jest.fn().mockResolvedValue(undefined)` mit angeben.

### Tests – AsyncStorage-Mocking

Mehrere Contexts rufen `AsyncStorage.getItem` auf. Bei Tests mit beiden Providern (`LanguageProvider` + `PlantProvider`), **nie `mockResolvedValueOnce`** – stattdessen key-basiertes `mockImplementation`:

```typescript
AsyncStorage.getItem.mockImplementation((key: string) =>
  key === '@Pflanzkalender:plants'
    ? Promise.resolve(JSON.stringify(testPlants))
    : Promise.resolve(null)
);
```

Jedes Test-Pflanzenobjekt braucht **alle** Pflichtfelder aus `PlantSchema` (inkl. `notes: ''`), sonst schlägt die Zod-Validierung lautlos fehl. `addPlant()` ruft `savePlants()` async auf – nach `act()` mit `waitFor` statt direktem `expect()` prüfen. Tests, die auf async Effekte warten, nutzen `waitFor` statt `act + setTimeout`.

### Expo Router + GitHub Pages

- Entry-Point ist `expo-router/entry`. Kein `App.tsx`/`index.ts`; Routen sind Dateien in `app/`.
- GitHub-Pages-Subpfad kommt von `experiments.baseUrl` in `app.config.js` (Prod: `/Pflanzkalender`, Testing via `TESTING=true`: `/Pflanzkalender-testing`) – **nicht** von `scripts/fix-paths.js` (dessen Regex-Rewrites laufen leer, nicht „reparieren").
- `web.output: 'single'` (SPA). Deep-Links funktionieren auf GitHub Pages nur, weil `dist/index.html` im Deploy nach `dist/404.html` kopiert wird – diesen Copy-Schritt nie entfernen.
- Settings-Tab-Icon ist `⋮` (U+22EE), nicht das Zahnrad-Emoji – CI bricht sonst ab.

### Tests – expo-router globaler Mock

`__mocks__/expo-router.js` liefert no-op-Implementierungen für expo-router-Hooks/-Komponenten (useFocusEffect, useRouter, Tabs, …). Jest lädt das automatisch – kein `jest.mock('expo-router', ...)` in einzelnen Test-Dateien nötig. Per-Datei-Overrides bleiben möglich und haben Vorrang.

### Android: `android/` ist generiert, nicht im Repo (Bubblewrap/TWA)

Das native Android-Projekt wird **nicht** im Repo geführt (gitignored,
„generated native folders"). Es entsteht lokal aus
`twa-manifest.template.json` via **Bubblewrap CLI** (siehe
`docs/twa-vs-pwa.md`). Play-Store-relevante Änderungen (API-Level,
Edge-to-Edge, R8) lassen sich daher **nicht** über einen Commit erledigen,
nur im lokalen Build-Schritt.

**`bubblewrap build` nach dem Patchen NICHT mehr verwenden** – regeneriert
das Android-Projekt und verwirft dabei alle Patches. Drei Fallstricke dabei
gelernt: Bubblewrap überschreibt das gleichnamige expo-router-Verzeichnis
`app/` (Routen verschwinden aus dem Arbeitsbaum), `startUrl` muss relativ
sein (sonst baut `app/build.gradle` eine Doppel-URL), BSD-sed kennt kein `\b`
in Patch-Skripten (macOS-sed ersetzt sonst lautlos nichts). Vollständige
Reihenfolge, Verifikationsbefehle und Standard-Runbook für einen reinen
Play-Store-Build: [`docs/TWA-BUILD.md`](docs/TWA-BUILD.md).

### Squash-Merge: Feature-Branches nach Merge löschen

Bleiben Feature-Branches nach einem Squash-Merge im Remote stehen, schlägt jeder spätere Merge oder Rebase mit ihnen mit add/add-Konflikten fehl – Git erkennt die Inhaltsgleichheit der squash-erzeugten Commits nicht. **Immer Branch nach Merge löschen.** Falls schon zu spät: Diff `branch..main` als Patch ausschneiden, auf einen frischen Branch von main anwenden, alten Branch wegwerfen. Dieselbe Falle betrifft auch Release-PRs `testing → main` – siehe [`docs/private/INCIDENTS.md`](docs/private/INCIDENTS.md) für zwei konkrete Fälle und die Standard-Lösung.

---

## Branch-Strategie

```
main (production) ← testing ← feature/issue-XXX
```

| Branch              | Zweck                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `main`              | Production                                                                                    |
| `testing`           | Integration + Deploy auf `gh-pages-testing` → https://s540d.github.io/Pflanzkalender-testing/ |
| `feature/issue-XXX` | Feature-Branches (kurzlebig, nach Merge löschen)                                              |

Workflow: `feature/issue-XXX` → PR auf `testing` → CI grün → Merge (squash + delete-branch) → PR `testing → main`.

**Deploy-Trigger:** `deploy-production.yml` bei Push auf `main` (+ `workflow_dispatch`), `deploy-testing.yml` bei Push auf `testing` (+ `workflow_dispatch`). `scripts/add-service-worker.js` injiziert die SW-Registrierung im Production-Deploy – nicht deaktivieren, sonst sehen Nutzer mit altem SW immer die gecachte Version.

---

## Roadmap & offene Issues

Vollständige Roadmap: https://github.com/S540d/Pflanzkalender/issues/47
(Phasen 1–5 abgeschlossen). Aktueller Stand offener/zurückgestellter Issues:
im GitHub-Issue-Tracker nachsehen (Label `maybe later` für bewusst
zurückgestellte Features), nicht hier pflegen – der Tracker ist die
Quelle der Wahrheit, ein manuell gepflegter Duplikat-Stand veraltet
zuverlässig.

---

## Bekannte CI-Probleme

Keine aktuell offenen. Historische, bereits gelöste CI-Probleme (toter
`settings.version`-Key, ESLint-Warnings-Bereinigung) stehen in
[`docs/private/INCIDENTS.md`](docs/private/INCIDENTS.md).

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
- **Zugehöriges Issue beim Merge schließen** (Issue #111): `Closes #X` im PR-Body greift nur beim Merge in den Default-Branch (`main`) — bei PRs nach `testing` also **nie**. Das Issue nach dem Merge manuell schließen (`gh issue close <N> -c "Umgesetzt in #<PR>, gemergt nach \`testing\`."`), sonst bleiben erledigte Issues offen liegen. Ausnahme: Sammel-/Meta-Issues, die ein Teil-PR nur anteilig abarbeitet — die bleiben offen. `Closes #X` trotzdem im PR-Body lassen: es erzeugt die sichtbare Verknüpfung.

## [ANDROID BUILD – PFLICHTREGELN]

- **Git-Tag** nach jedem Play-Store-Upload setzen: `git tag vX.Y.Z && git push origin vX.Y.Z` – der Tag markiert den tatsächlich veröffentlichten Stand und dient als Changelog-Baseline für den nächsten Build
- **EAS Local Build (DrawFromMemory):** Workingdir vor jedem Build leeren: `rm -rf ~/tmp/eas-build && mkdir -p ~/tmp/eas-build` – ein nicht-leeres Verzeichnis bricht den Build sofort ab
- **Disk-Check vor EAS Build:** Skia-Libraries benötigen ~5–8 GB. Bei < 5 GB frei: `npm cache clean --force && rm -rf ~/.npm/_npx` (~13 GB, sicher löschbar)
- **JAVA_HOME** für EAS/Expo-Builds explizit auf Android Studio JBR setzen: `export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"`
- **Gradle-Lock nach Absturz:** Bei "Cannot lock file hash cache"-Fehler Daemons stoppen: `pkill -f GradleDaemon`, dann Workingdir leeren und neu starten
- **AAB-Archiv:** Gebaute Release-AABs in einem **gitignored** `aab-archive/`-Verzeichnis im Repo-Root ablegen (in `.gitignore` aufnehmen – AABs sind 3–110 MB und gehören nie in die Git-History). Benennung: `<Projekt>-vX.Y.Z-vc<versionCode>-YYYY-MM-DD.aab`. **Retention: max. 2 Dateien** (aktuelles Release + ein Vorgänger für schnelles Rollback); ältere AABs löschen. Der Git-Tag `vX.Y.Z` ist die eigentliche Release-Baseline – ältere AABs lassen sich daraus jederzeit neu bauen.

## [CLAUDE.MD-WARTUNG]

- **CLAUDE.md bleibt bei maximal 300 Zeilen** (Issue #160): Sie wird bei jeder Session vollständig in den Kontext geladen. Beschreibt ein Abschnitt einen konkreten Vorfall, gehören maximal 2-3 Zeilen (Kernregel + kurzer Auslöser-Kontext) + ein Link auf `docs/private/INCIDENTS.md` hinein; aktuell gültiges Architektur-/Prozesswissen, das kein Vorfall ist, aber zu ausführlich für CLAUDE.md, gehört in versionierte `docs/*.md`-Dateien (z. B. `docs/ARCHITECTURE.md`). Die Schwelle ist ein Prüf-Auslöser, kein Zwang, bewusst dort gehaltenes, aktuelles Architekturwissen aus CLAUDE.md zu verdrängen. Aktiv gekürzt wird erst ab 500 Zeilen; Dateien zwischen 300 und 500 Zeilen werden im Turnus nicht angefasst. Ausführlicher Prozess, Checkliste und Stand pro Projekt: https://github.com/S540d/project-templates/blob/main/dev-standards/claude-md-maintenance.md
- **`docs/private/INCIDENTS.md` ist bewusst gitignored** — reine lokale Gedächtnisstütze wie Memory, kein Teil des geteilten Repo-Zustands. In jedem Projekt mit dieser Datei muss `.gitignore` einen Eintrag `docs/private/` enthalten; existiert die Datei bereits versioniert (z. B. als `docs/INCIDENTS.md`), gehört sie nach `docs/private/` verschoben und per `git rm --cached` aus dem Tracking genommen.
- **Regelmäßig `/simplify` auf CLAUDE.md ausführen**, nicht nur einmalig beim Überschreiten der Schwelle — Ziel ist dauerhaft niedriger Token-Verbrauch pro Session statt zyklischem Anwachsen und Zurückkürzen in großen Sprüngen.

## [CODE HEALTH AUDIT]

- **Wiederkehrendes Code-Health-Audit** (Ballast/Architektur: God Components, Boilerplate-Duplikation, toter Code, Dependency-Bloat, Test-Integrität, Design-Konsistenz, Bundle-Größe) alle ~3 Monate oder ~15 gemergte Feature-PRs (je nachdem was zuerst eintritt). Checkliste + Ablauf: https://github.com/S540d/project-templates/blob/main/dev-standards/code-health-audit.md — Ergebnis ist immer ein Issue im jeweiligen Projekt-Repo, nie in project-templates.

## [SIMPLIFY-AUDIT]

- **Wiederkehrender `/simplify`-Durchlauf auf den Quellcode** (Reuse, Simplification, Efficiency, Altitude) alle ~3 Monate oder ~15 gemergte Feature-PRs (je nachdem was zuerst eintritt), gleiche Kadenz wie das Code-Health-Audit. Anders als dieses wendet er die Fixes direkt an: Ergebnis ist ein PR gegen den projektüblichen Ziel-Branch, nur kleine, verhaltensneutrale Refactorings (bei Unsicherheit Finding auslassen). Ablauf: https://github.com/S540d/project-templates/blob/main/dev-standards/simplify-audit.md

## [ÜBER-ABSCHNITT]

- **Einheitlicher „Über"-Abschnitt im Settingsmenü** (Issue #150): Jedes Web-Projekt zeigt „Über" als Eintrag in einem `⋮`-Settingsmenü (kein Footer — wird bei Bedarf neu angelegt, auch für aktuell menülose Projekte). Fester Vollausbau: App-Name, Version, Impressum, Datenschutz, Quellcode, Play Store, Feedback — nicht zutreffende Felder werden weggelassen, nie umsortiert. Spezifikation: https://github.com/S540d/project-templates/blob/main/dev-standards/about-section.md — Umsetzung ist immer ein Issue im jeweiligen Projekt-Repo, nie in project-templates.

## [CI – CACHE-CLEANUP]

- **Cache-Cleanup-Workflow** (`.github/workflows/cache-cleanup.yml`) in jedem Repo mit GitHub-Actions-Caches: löscht wöchentlich (So 03:00 UTC) bzw. on-demand alle Action-Caches älter als der jeweils letzte Lauf. GitHub-Limit ist 10 GB pro Repo – ohne Cleanup laufen Build-Caches (node_modules, Gradle, Expo) voll und verdrängen frische Einträge. Vorlage: `cache-cleanup.yml` in project-templates.
<!-- GLOBAL POLICY:END -->
