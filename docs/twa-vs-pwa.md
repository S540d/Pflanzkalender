# Architekturentscheidung: PWA + TWA (nicht „TWA statt PWA“)

> Status: Dokumentiert · Stand 2026-06-25

## Zusammenfassung

Pflanzkalender ist **als Progressive Web App (PWA) entwickelt**. Die **Trusted Web
Activity (TWA)** ist kein eigenständiges App-Projekt, sondern lediglich die dünne
Android-Hülle, mit der genau diese PWA in den **Google Play Store** ausgeliefert
wird. „TWA statt PWA“ ist also eine falsche Gegenüberstellung – es ist beides,
auf einer einzigen Codebasis.

## Die App ist im Kern eine PWA

- Eine Codebasis (Expo / React Native Web), gebaut via `expo export --platform web`.
- Deploy als PWA auf GitHub Pages: <https://s540d.github.io/Pflanzkalender/>
- `public/service-worker.js` (network-first), `manifest.json`, Icons → offline-fähig
  und installierbar.
- Roadmap-Phase 2 (`CLAUDE.md`): „PWA vervollständigen: manifest.json, Icons,
  Service Worker, assetlinks.json“.

## TWA als Play-Store-Wrapper

Eine TWA zeigt im Android-Vollbild (ohne Browser-UI) **dieselbe gehostete PWA** an.
Sie wird nicht separat programmiert, sondern aus dem vorhandenen Web-Manifest
generiert. Belege im Repo:

- `twa-manifest.template.json` – von der Bubblewrap CLI erzeugt
  (`"generatorApp": "bubblewrap-cli"`) und zeigt direkt auf die gehostete PWA
  (`"webManifestUrl": "https://s540d.github.io/Pflanzkalender/manifest.json"`,
  `"startUrl": "/Pflanzkalender/"`).
- `.well-known/assetlinks.json` (Digital Asset Links) – beweist Google, dass App
  und Website demselben Eigentümer gehören, damit die Browser-Adressleiste
  verschwindet (`CHANGELOG.md`: „Web Asset Links … für Trusted Web Activity
  Verifizierung“).
- Roadmap-Phase 5 (`CLAUDE.md`): „Play Store via TWA: Bubblewrap CLI, Digital
  Asset Links, APK/AAB – ✅ Abgeschlossen“.

## Warum dieser Weg (TWA statt eigener nativer App)

1. **Play Store braucht ein APK/AAB.** Eine reine PWA lässt sich nicht in den Store
   einstellen. TWA ist Googles offizieller, schlankster Weg, eine vorhandene PWA in
   dieses Format zu bringen – ohne App-Code zu duplizieren.
2. **Eine Codebasis, ein Deploy.** Jede Änderung an der gehosteten PWA erscheint
   sofort auch in der Play-Store-App – kein separates Android-Release pro
   Inhalts-Update.
3. **Minimaler Build-Aufwand.** Bubblewrap erzeugt die Hülle automatisch aus dem
   Web-Manifest; kein paralleler nativer Stack.
4. **Konsistente Versionierung.** Versionsstellen (`package.json`, `app.json`,
   `twa-manifest.template.json`) werden synchron gehalten – die TWA spiegelt nur die
   Web-App.
5. **Kein Bedarf an „echtem“ Native.** Die App nutzt nur lokalen Speicher
   (AsyncStorage / PWA-Storage), keine tiefen nativen APIs, für die sich eine
   vollständige React-Native-Android-App lohnen würde.

## Fazit

Entwickelt wurde eine **PWA**. **TWA** ist nur die offizielle Brücke, um genau diese
PWA als installierbare App in den **Google Play Store** zu bringen – mit einer
einzigen Codebasis statt einer zweiten, nativ entwickelten Android-App.
