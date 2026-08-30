#!/usr/bin/env bash
#
# patch-twa-r8-optimization.sh — Play-Console-Empfehlung "R8-Optimierung"
#
# Der Play-Store-Build ist ein von Bubblewrap generiertes TWA-Projekt. Die
# generierten Gradle-Dateien (app/build.gradle, ...) sind gitignored und
# werden bei jeder Neugenerierung überschrieben. Bubblewrap setzt im
# release-buildType standardmäßig `minifyEnabled false` / `shrinkResources
# false` – Play Console empfiehlt, R8 (Code-Shrinking/Obfuscation) und
# Resource-Shrinking zu aktivieren, um Arbeitsspeicher und Leistung der App
# zu verbessern.
#
# Dieses Skript nach jeder Bubblewrap-(Re)Generierung ausführen, VOR
# `./gradlew bundleRelease` (zusätzlich zu patch-twa-edge-to-edge.sh und
# patch-twa-target-sdk36.sh). Idempotent – mehrfaches Ausführen ist
# unschädlich.
#
# Verwendung:  bash scripts/patch-twa-r8-optimization.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_GRADLE="$ROOT/app/build.gradle"

if [ ! -f "$APP_GRADLE" ]; then
  echo "FEHLER: $APP_GRADLE nicht gefunden. Zuerst das TWA-Projekt generieren/bauen." >&2
  exit 1
fi

# 1) minifyEnabled im release-buildType auf true setzen
if grep -qE 'minifyEnabled true' "$APP_GRADLE"; then
  echo "minifyEnabled bereits true."
else
  sed -i '' -E 's/minifyEnabled false/minifyEnabled true/' "$APP_GRADLE"
  echo "minifyEnabled false → true gesetzt (app/build.gradle)."
fi

# 2) shrinkResources im release-buildType auf true setzen (nur sinnvoll mit
#    minifyEnabled true, sonst lehnt Gradle den Build ab)
if grep -qE 'shrinkResources true' "$APP_GRADLE"; then
  echo "shrinkResources bereits true."
elif grep -qE 'shrinkResources false' "$APP_GRADLE"; then
  sed -i '' -E 's/shrinkResources false/shrinkResources true/' "$APP_GRADLE"
  echo "shrinkResources false → true gesetzt (app/build.gradle)."
else
  # Bubblewrap setzt shrinkResources nicht in jeder Version explizit –
  # dann direkt nach minifyEnabled im release-Block ergänzen.
  sed -i '' -E 's/(minifyEnabled true)/\1\n            shrinkResources true/' "$APP_GRADLE"
  echo "shrinkResources true ergänzt (app/build.gradle)."
fi

echo "Fertig. R8-Optimierungs-Patch (Play-Console-Empfehlung 'Arbeitsspeichernutzung') angewendet."
echo "Hinweis: Nach diesem Patch einen vollständigen Release-Build (./gradlew bundleRelease) lokal"
echo "installieren und die App durchklicken – R8 kann bei fehlenden Proguard-Keep-Regeln zur"
echo "Laufzeit crashen, auch wenn der Build selbst fehlerfrei durchläuft."
