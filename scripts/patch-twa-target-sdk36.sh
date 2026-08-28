#!/usr/bin/env bash
#
# patch-twa-target-sdk36.sh — Issue #210 (+ #202 resizeableActivity)
#
# Der Play-Store-Build ist ein von Bubblewrap generiertes TWA-Projekt. Die
# generierten Gradle-/Manifest-Dateien (app/build.gradle,
# app/src/main/AndroidManifest.xml, ...) sind gitignored und werden bei
# jeder Neugenerierung überschrieben. Solange die installierte Bubblewrap-
# Version API Level 36 (Android 16) noch nicht selbst als Default setzt,
# muss compileSdkVersion/targetSdkVersion manuell angehoben werden – siehe
# CLAUDE.md, Abschnitt "Android Target API Level (Play Store)".
#
# Zusätzlich stellt dieses Skript sicher, dass die App als resizierbar
# markiert ist (android:resizeableActivity="true"), damit die
# Large-Screen-Warnung aus Issue #202 verschwindet — die Quelle
# (twa-manifest.template.json → "orientation": "default") ist bereits
# korrekt, nur das generierte Manifest hinkt hinterher.
#
# Dieses Skript nach jeder Bubblewrap-(Re)Generierung ausführen, VOR
# `./gradlew bundleRelease` (zusätzlich zu patch-twa-edge-to-edge.sh).
# Idempotent – mehrfaches Ausführen ist unschädlich.
#
# Verwendung:  bash scripts/patch-twa-target-sdk36.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_GRADLE="$ROOT/app/build.gradle"
MANIFEST="$ROOT/app/src/main/AndroidManifest.xml"

# Ziel-API-Level (Play Console verlangt targetSdkVersion 36 ab 31.08.2026)
TARGET_SDK="36"

if [ ! -f "$APP_GRADLE" ]; then
  echo "FEHLER: $APP_GRADLE nicht gefunden. Zuerst das TWA-Projekt generieren/bauen." >&2
  exit 1
fi

# 1) compileSdkVersion auf TARGET_SDK anheben
if grep -qE "compileSdkVersion $TARGET_SDK\b" "$APP_GRADLE"; then
  echo "compileSdkVersion bereits $TARGET_SDK."
else
  sed -i '' -E "s/compileSdkVersion [0-9]+/compileSdkVersion $TARGET_SDK/" "$APP_GRADLE"
  echo "compileSdkVersion → $TARGET_SDK angehoben (app/build.gradle)."
fi

# 2) targetSdkVersion auf TARGET_SDK anheben
if grep -qE "targetSdkVersion $TARGET_SDK\b" "$APP_GRADLE"; then
  echo "targetSdkVersion bereits $TARGET_SDK."
else
  sed -i '' -E "s/targetSdkVersion [0-9]+/targetSdkVersion $TARGET_SDK/" "$APP_GRADLE"
  echo "targetSdkVersion → $TARGET_SDK angehoben (app/build.gradle)."
fi

# 3) android:resizeableActivity="true" im <application>-Tag sicherstellen
#    (Issue #202 – Large-Screen-Warnung). twa-manifest.template.json setzt
#    "orientation": "default" bereits korrekt; das generierte Manifest muss
#    zusätzlich explizit als resizierbar markiert sein.
if [ ! -f "$MANIFEST" ]; then
  echo "WARN: $MANIFEST nicht gefunden – resizeableActivity-Patch übersprungen." >&2
elif grep -q 'android:resizeableActivity="true"' "$MANIFEST"; then
  echo "android:resizeableActivity bereits auf true (AndroidManifest.xml)."
elif grep -q 'android:resizeableActivity="false"' "$MANIFEST"; then
  sed -i '' -E 's/android:resizeableActivity="false"/android:resizeableActivity="true"/' "$MANIFEST"
  echo "android:resizeableActivity false → true gesetzt (AndroidManifest.xml)."
else
  sed -i '' -E 's/(<application)/\1\n        android:resizeableActivity="true"/' "$MANIFEST"
  echo "android:resizeableActivity=\"true\" zum <application>-Tag ergänzt (AndroidManifest.xml)."
fi

echo "Fertig. Target-SDK-36- und Large-Screen-Patch (Issue #210/#202) angewendet."
