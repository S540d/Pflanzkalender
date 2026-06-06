# Release vorbereiten

Einen neuen Release auf `main` vorbereiten und deployen.

## Ziel

Sicherstellen dass alle Features stabil, getestet und dokumentiert sind, bevor sie in Production gehen.

## Workflow

### 1. Branch-Status prüfen

- Prüfe ob `main` mit `origin/main` aktuell ist
- Liste alle Commits seit letztem Release-Tag

### 2. Versions-Konsistenz prüfen

Alle drei Stellen müssen identisch sein:

```
package.json   → "version": "X.Y.Z"
app.json       → "expo": { "version": "X.Y.Z" }
src/screens/SettingsScreen.tsx → APP_VERSION = 'X.Y.Z'
```

Falls abweichend: CI schlägt fehl!

### 3. Version bumpen (falls nötig)

Semantic Versioning:

- **Patch** (1.2.0 → 1.2.1): Bugfixes only
- **Minor** (1.2.0 → 1.3.0): Neue Features, backwards-compatible
- **Major** (1.0.0 → 2.0.0): Breaking Changes

Alle drei Stellen gleichzeitig aktualisieren!

### 4. Validierung ausführen

```bash
npx tsc --noEmit
npm test
npx expo export --platform web
npm audit
```

Alle Checks müssen grün sein.

### 5. Roadmap Issue #47 aktualisieren

- Zeige https://github.com/S540d/Pflanzkalender/issues/47
- Markiere abgeschlossene Phasen als ✅
- Aktualisiere aktuellen Branch-Status

### 6. Commit & Tag

```bash
git add package.json app.json src/screens/SettingsScreen.tsx
git commit -m "chore: bump version to X.Y.Z"
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin main --tags
```

### 7. Nach Production-Deploy

- Deploy wird automatisch durch Push auf `main` ausgelöst
- Prüfe https://s540d.github.io/Pflanzkalender/
- Prüfe GitHub Actions Status für `deploy-production.yml`
- GitHub Release erstellen (optional):
  ```bash
  gh release create vX.Y.Z --notes "[Release Notes]"
  ```

## Sicherheitschecks

- ❌ Nie ohne grüne CI auf main mergen
- ❌ Nie mit Versions-Inkonsistenz deployen
- ❌ Nie `testing` Branch direkt nach `main` mergen (immer via PR)
