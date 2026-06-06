# Claude Commands – Pflanzkalender

Verfügbare Slash-Commands für dieses Projekt:

| Command              | Beschreibung                                                                 |
| -------------------- | ---------------------------------------------------------------------------- |
| `/aufräumen`         | Tagesabschluss: Branches aufräumen, Sync prüfen, CI-Status, Issues-Übersicht |
| `/pr-review`         | PR gründlich prüfen, Copilot-Suggestions umsetzen, mergen                    |
| `/dependency-update` | Dependencies sicher aktualisieren, Security Audit, PR erstellen              |
| `/release-prepare`   | Release vorbereiten: Versions-Sync, Validierung, Tag, Deploy                 |
| `/test-coverage`     | Coverage-Report erstellen, fehlende Tests identifizieren                     |

## Wichtige Projekt-Regeln

- **Branch-Reihenfolge:** Feature-Branches IMMER von `main` erstellen (`git checkout main && git pull`)
- **PR-Ziel:** Immer gegen `main`, nie gegen `testing`
- **Versions-Konsistenz:** `package.json` + `app.json` + `SettingsScreen.tsx` müssen identisch sein
- **npm install:** Immer mit `--legacy-peer-deps` (React 19 / react-test-renderer Konflikt)

## URLs

- Production: https://s540d.github.io/Pflanzkalender/
- Testing: https://s540d.github.io/Pflanzkalender-testing/
- Roadmap: https://github.com/S540d/Pflanzkalender/issues/47
