#!/usr/bin/env bash
#
# patch-twa-edge-to-edge.sh — Issue #206
#
# Der Play-Store-Build ist ein von Bubblewrap generiertes TWA-Projekt. Die
# generierten Gradle-Dateien (build.gradle, app/build.gradle, ...) sind
# gitignored und werden bei jeder Neugenerierung überschrieben. Sie pinnen
# androidbrowserhelper auf 2.6.2 – diese Version ruft intern die unter
# Android 15 nicht mehr unterstützten APIs
#   Window.setStatusBarColor / getStatusBarColor / setNavigationBarColor
#   + LAYOUT_IN_DISPLAY_CUTOUT_MODE_*
# auf. Google Play meldet das als "Nicht mehr unterstützte Edge-to-Edge-APIs".
#
# androidbrowserhelper 2.7.0 (PR GoogleChrome/android-browser-helper#525,
# "limit deprecated apis to android 14") ersetzt diese Aufrufe durch die
# WindowInsetsController-basierte Edge-to-Edge-Behandlung. Bubblewrap picked
# diese Version aber (Stand @bubblewrap/core 1.24.1) noch NICHT automatisch
# als Stable – daher patchen wir den generierten Build hier nachträglich.
#
# Dieses Skript nach jeder Bubblewrap-(Re)Generierung ausführen, VOR
# `./gradlew bundleRelease`. Idempotent – mehrfaches Ausführen ist unschädlich.
#
# Verwendung:  bash scripts/patch-twa-edge-to-edge.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_GRADLE="$ROOT/app/build.gradle"
ROOT_GRADLE="$ROOT/build.gradle"

# Ziel-Version von androidbrowserhelper (erste Stable mit Android-15-Edge-to-Edge-Fix)
ABH_TARGET="2.7.2"

if [ ! -f "$APP_GRADLE" ]; then
  echo "FEHLER: $APP_GRADLE nicht gefunden. Zuerst das TWA-Projekt generieren/bauen." >&2
  exit 1
fi

# 1) androidbrowserhelper auf die Edge-to-Edge-fähige Version pinnen
if grep -q "androidbrowserhelper:androidbrowserhelper:$ABH_TARGET" "$APP_GRADLE"; then
  echo "androidbrowserhelper bereits auf $ABH_TARGET gepinnt."
else
  sed -i '' -E \
    "s/androidbrowserhelper:androidbrowserhelper:[0-9]+\.[0-9]+\.[0-9]+/androidbrowserhelper:androidbrowserhelper:$ABH_TARGET/" \
    "$APP_GRADLE"
  echo "androidbrowserhelper → $ABH_TARGET gepinnt (app/build.gradle)."
fi

# 2) jcenter() → mavenCentral() ersetzen. jcenter ist read-only/EOL; ABH 2.7.0
#    hat jcenter aus den eigenen Repos entfernt (PR #546). jcenter NICHT
#    ersatzlos löschen – es ist im generierten Projekt das einzige Nicht-google()-
#    Repo, über das u. a. die Buildscript-Classpath-Artefakte (kotlin-stdlib,
#    commons-io, asm ...) aufgelöst werden. Ohne mavenCentral() schlägt der Build fehl.
# Nur die Repo-Deklarationen in der Root-build.gradle (buildscript + allprojects)
# betreffen die Auflösung. app/build.gradle hat bewusst einen leeren
# repositories{}-Block und erbt die Repos – daher hier nicht behandeln.
if grep -q "jcenter()" "$ROOT_GRADLE"; then
  sed -i '' -E 's/([[:space:]]*)jcenter\(\)/\1mavenCentral()/' "$ROOT_GRADLE"
  echo "jcenter() → mavenCentral() ersetzt in build.gradle."
elif grep -q "mavenCentral()" "$ROOT_GRADLE"; then
  echo "mavenCentral() bereits vorhanden (build.gradle)."
else
  echo "WARN: weder jcenter() noch mavenCentral() in build.gradle – Repos prüfen." >&2
fi

# 3) minSdkVersion auf 23 anheben. androidbrowserhelper 2.7.x setzt minSdk 23
#    voraus (Bubblewrap/twa-manifest defaulten auf 21) – ohne Anhebung schlägt
#    der Manifest-Merge fehl. API 23 (Android 6.0, 2015) deckt praktisch alle
#    aktiven Geräte ab.
# Hinweis: KEIN \b in der sed-Regex verwenden – BSD-sed (macOS) kennt die
# Wortgrenze nicht und ersetzt dann lautlos nichts, während grep -E sie kennt.
# Das Skript meldete dadurch fälschlich Erfolg (erlebt beim vc16-Build).
if grep -qE "minSdkVersion 2[0-2]([^0-9]|$)" "$APP_GRADLE"; then
  sed -i '' -E "s/minSdkVersion 2[0-2]([^0-9]|$)/minSdkVersion 23\1/" "$APP_GRADLE"
  echo "minSdkVersion → 23 angehoben (app/build.gradle)."
else
  echo "minSdkVersion bereits ≥ 23."
fi

echo "Fertig. Edge-to-Edge-Patch (Issue #206) angewendet."
