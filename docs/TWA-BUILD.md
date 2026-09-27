# TWA-Build: Play-Store-Runbook

Ausführliches Runbook zu den Kernregeln in [`../CLAUDE.md`](../CLAUDE.md)
Abschnitt „Android: `android/` ist generiert" / „TWA-Build".

## Verbindliche Reihenfolge

**`bubblewrap build` nach dem Patchen NICHT mehr verwenden** – regeneriert
das Android-Projekt und verwirft dabei alle Patches (siehe
`docs/private/INCIDENTS.md` für den vc17-Vorfall, der das aufdeckte).

```bash
# 1. Projekt generieren (nur wenn nötig – regeneriert und verwirft Patches!)
ANDROID_SDK_ROOT= npx @bubblewrap/cli build   # oder: bubblewrap update

# 2. git status prüfen (Bubblewrap überschreibt app/, s. u.) und alle Patches anwenden
git status --short
bash scripts/patch-twa-edge-to-edge.sh
bash scripts/patch-twa-target-sdk36.sh
bash scripts/patch-twa-r8-optimization.sh

# 3. Werte verifizieren – erst wenn ALLE stimmen, weiterbauen
grep -nE "minSdkVersion|targetSdkVersion|androidbrowserhelper:|launchUrl:|minifyEnabled|shrinkResources" app/build.gradle
grep -n "resizeableActivity" app/src/main/AndroidManifest.xml

# 4. Bauen OHNE Regenerierung
./gradlew bundleRelease assembleRelease

# 5. Signieren (Artefakte aus 4. sind unsigniert), dann im Artefakt verifizieren
```

## Drei Fallstricke

1. **Bubblewrap überschreibt `app/`** – legt sein Android-Projekt dort an und
   löscht dabei das gleichnamige expo-router-Verzeichnis (alle Routen
   verschwinden aus dem Arbeitsbaum). Nach jedem Bubblewrap-Lauf `git status`
   prüfen, ggf. `git checkout -- app/*.tsx app/_layout.tsx`, dann
   `npx tsc --noEmit` + `npm test`.
2. **`startUrl` muss relativ sein** (`/Pflanzkalender/`, nicht die volle
   Domain) – sonst baut `app/build.gradle` eine Doppel-URL. Nach jedem
   Bubblewrap-Lauf: `grep launchUrl: app/build.gradle` muss
   `'/Pflanzkalender/'` zeigen.
3. **BSD-sed kennt `\b` nicht** – in Patch-Skripten niemals
   Wortgrenzen-`\b` in `sed -E` verwenden (macOS-sed ersetzt lautlos
   nichts). Stattdessen `([^0-9]|$)` + Rückreferenz, und nach jedem
   Skript-Lauf per `grep` gegenprüfen.

## Verifikation am fertigen Artefakt

Erfolgsmeldungen der Skripte reichen nicht:

```bash
AAPT=$(ls ~/Library/Android/sdk/build-tools/*/aapt2 | tail -1)
"$AAPT" dump badging app-release-signed.apk | grep -i "sdkVersion\|package:"
"$AAPT" dump strings app-release-signed.apk | grep -oi "https://s540d.github.io[^ \"]*" | sort -u
"$AAPT" dump xmltree app-release-signed.apk --file AndroidManifest.xml | grep -i resizeableActivity
./gradlew -q app:dependencies --configuration releaseRuntimeClasspath | grep -i browserhelper
```

`aapt2` arbeitet auf APK-Struktur; ein AAB hat ein anderes (Protobuf-)Layout
und lässt sich damit nicht direkt dumpen. Praktikabler Ersatz: Werte **vor**
dem Build in den Quelldateien verifizieren (Schritt 3 oben), am fertigen AAB
nur noch Package-Name/Struktur per `unzip -l`/`strings` stichprobenartig
gegenchecken sowie die Signatur per `jarsigner -verify` + SHA256-Abgleich.

## Standard-Ablauf für einen reinen Play-Store-Build (kein neues Feature)

Wenn `app/build.gradle` aus einem vorherigen Build **bereits existiert**
(Regelfall zwischen zwei Uploads – Bubblewrap-Regenerierung ist dann NICHT
nötig, siehe Fallstricke 1/2 oben):

```bash
# 0. Git-Sessionstart (siehe globale CLAUDE.md)
git fetch --all --prune
git checkout testing && git pull origin testing
git checkout main    && git pull origin main

# 1. Prüfen, ob app/ existiert – falls nicht: erst Bubblewrap-Abschnitt oben abarbeiten
ls app/build.gradle

# 2. Alle drei Patch-Skripte laufen lassen (idempotent)
bash scripts/patch-twa-edge-to-edge.sh
bash scripts/patch-twa-target-sdk36.sh
bash scripts/patch-twa-r8-optimization.sh

# 3. Werte in den Quelldateien verifizieren (nicht nur Skript-Output vertrauen)
grep -nE "minSdkVersion|targetSdkVersion|compileSdkVersion|androidbrowserhelper:|versionCode|launchUrl:|minifyEnabled|shrinkResources" app/build.gradle
grep -n "resizeableActivity" app/src/main/AndroidManifest.xml

# 4. appVersionCode bumpen – app/build.gradle + twa-manifest.json (beide gitignored) manuell nachziehen:
sed -i '' "s/versionCode <ALT>/versionCode <NEU>/" app/build.gradle
node -e "const f='twa-manifest.json',p=JSON.parse(require('fs').readFileSync(f));p.appVersionCode=<NEU>;require('fs').writeFileSync(f,JSON.stringify(p,null,2)+'\n')"

# 5. Sicherheitscheck vor dem Build
npx tsc --noEmit
npm test -- --silent

# 6. Bauen (erzeugt bereits ein *unsigniertes* AAB)
./gradlew bundleRelease --no-daemon --console=plain
ls -lh app/build/outputs/bundle/release/app-release.aab

# 7. Ins Archiv kopieren, DORT signieren (jarsigner überschreibt in-place), Retention 2 Dateien
mkdir -p aab-archive
cp app/build/outputs/bundle/release/app-release.aab "aab-archive/Pflanzkalender-v<VERSION>-vc<NEU>-$(date +%Y-%m-%d).aab"
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore "/Users/svenstrohkark/Documents/Programmierung/Projects/Keystore/Keystore_Pflanzkalender/pflanzkalender.keystore" \
  -storepass "$PW" -keypass "$PW" \
  "aab-archive/Pflanzkalender-v<VERSION>-vc<NEU>-<DATUM>.aab" "pflanzkalender"
jarsigner -verify -verbose -certs "aab-archive/Pflanzkalender-v<VERSION>-vc<NEU>-<DATUM>.aab" | tail -8
ls -t aab-archive/*.aab | tail -n +3 | xargs -r rm -f

# 8. Nach dem Play-Console-Upload: Tag setzen
git tag v<VERSION>-vc<NEU> && git push origin v<VERSION>-vc<NEU>
```

Play Console verlangt `targetSdkVersion 36` (Android 16) für neue Uploads
bestehender Apps.
