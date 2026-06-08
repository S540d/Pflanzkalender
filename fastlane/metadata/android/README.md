# Play Store Listing (Issue #171)

Überarbeitete Store-Einträge für den Google Play Store, abgelegt im
[Fastlane-Supply-Format](https://docs.fastlane.tools/actions/supply/) – so
können die Texte versioniert und (optional) automatisiert hochgeladen werden.

## Struktur

```
fastlane/metadata/android/<locale>/
  title.txt              # App-Titel        (max. 30 Zeichen)
  short_description.txt   # Kurzbeschreibung (max. 80 Zeichen)
  full_description.txt    # Beschreibung     (max. 4000 Zeichen)
```

## Sprachen

| Locale | Sprache  |
| ------ | -------- |
| de-DE  | Deutsch  |
| en-US  | Englisch |
| es-ES  | Spanisch |

Spanisch wurde bewusst ergänzt: Das Play-Store-Feedback aus **Issue #161**
kam von einem spanischsprachigen Nutzer. Die Listings betonen daher die
sprachunabhängigen **Pflanzen-Symbole** ("erkennbar ohne Lesen"), die in der
App seit Issue #161 angezeigt werden.

## Zeichenlimits prüfen

```bash
for l in de-DE en-US es-ES; do
  python3 -c "import sys; t=open('$l/title.txt').read().strip(); s=open('$l/short_description.txt').read().strip(); print('$l', len(t), len(s))"
done
```

> Hinweis: Google Play zählt **Zeichen (Code-Points)**, nicht Bytes. `wc -m`
> kann je nach Locale Bytes zählen und Umlaute/Emojis überbewerten – daher die
> Prüfung mit `len()` in Python.

## Screenshots / Feature-Graphic

Bildmaterial (Screenshots 1080×1920, Feature-Graphic 1024×500) gehört nach
`fastlane/metadata/android/<locale>/images/` und wird hier nicht eingecheckt
(Binärdateien). Vorgaben dazu siehe `.github/PLAYSTORE_RELEASE_CHECKLIST.md`.
