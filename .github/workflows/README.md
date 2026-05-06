# GitHub Actions Workflows

## Deploy to Testing Environment

### Workflow: `deploy-testing.yml`

Dieser Workflow deployed die App auf die Testing-Umgebung für Partner-Reviews.

#### ⚙️ Features:

- ✅ Manuell startbar über GitHub Actions UI
- ✅ Wählbarer Branch für Deployment
- ✅ Deployed auf `gh-pages-testing` Branch
- ✅ Verfügbar unter: https://s540d.github.io/Pflanzkalender-testing/
- ✅ Testing-Banner (orange) zur Unterscheidung
- ✅ Automatische Testing-Marker

#### 🚀 Verwendung:

1. Gehe zu **Actions** → **Deploy to Testing Environment**
2. Klicke auf **Run workflow**
3. Optional: Wähle einen Branch (Standard: aktueller Branch)
4. Klicke auf **Run workflow** (grüner Button)

#### 📋 Was passiert:

1. Code wird ausgecheckt
2. Dependencies werden installiert
3. App wird gebaut (`expo export --platform web`)
4. Pfade werden für Testing angepasst (`/Pflanzkalender-testing/`)
5. Testing-Banner wird hinzugefügt
6. Deploy auf `gh-pages-testing` Branch
7. Verfügbar unter Testing-URL

#### 🎯 Wann verwenden:

- Vor einem PR-Merge zum Testen
- Nach größeren Features für Partner-Review
- Zum Testen von Bugfixes

#### 💡 Tipp:

Nach dem Deploy kannst du die Testing-URL an deinen Partner senden:

```
https://s540d.github.io/Pflanzkalender-testing/
```

---

## Zukünftige Workflows

Weitere Workflows können hier hinzugefügt werden:

- `deploy-production.yml` - Automatischer Production Deploy nach Merge
- `test.yml` - Automatische Tests
- `lint.yml` - Code-Qualität Checks
