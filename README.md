# 🌱 Pflanzkalender PWA

Eine Progressive Web App (PWA) zur Verwaltung von Pflanzkalendern mit monatlicher Übersicht für Garten- und Pflanzenaktivitäten.

![License](https://img.shields.io/badge/license-MIT-green)
![React Native](https://img.shields.io/badge/React%20Native-0.76-blue)
![Expo](https://img.shields.io/badge/Expo-54.0-black)

## 🎯 Features

- 📅 **Pflanzkalender** mit halber Monatsauflösung (24 Halbmonate)
- 📱 **Responsive Design** - automatische Anpassung auf kleinen Displays (3 Monate mit Navigation)
- 📌 **Fixierte Pflanzennamen-Spalte** - bleibt beim horizontalen Scrollen sichtbar
- 🌿 **32 vordefinierte Pflanzen** in drei Kategorien (Nutzpflanzen, Blumen, Bäume)
- 🌱 **Pflanzen-Verwaltung** - Dedizierter Screen zum Hinzufügen und Löschen von Pflanzen
- 🗂️ **Kategorien-Filter** – Kalender und Agenda nach Nutzpflanzen / Blumen / Bäume filtern
- 📍 **Standortempfehlungen** – Sonne, Halbschatten, Schatten pro Pflanze
- 🌍 **Mehrsprachig** - Deutsch/Englisch Umschaltung
- 🎨 **Farbcodierte Aktivitäten** mit einheitlichem Farbschema:
  - 🌱 Aussäen/Pflanzen: Grüntöne
  - 🍅 Ernten: Rot/Pink
  - 🧪 Pflegen/Düngen/Schnitt: Gelb/Orange
  - ❄️ Winterschutz: Blau/Lila
- 💬 **Tooltips** - Hover über Aktivitäten zeigt Details (Web)
- 📊 **Agenda-Ansicht** mit horizontalem Scrolling und kompakten Spalten
- 🎯 **Kompaktes Layout** - Aktivitäten in derselben Zeile wenn keine Überlappung
- 📍 **Aktuelle Periode hervorgehoben** - grauer Hintergrund für aktuellen Halbmonat
- 🖱️ **Interaktive Aktivitäten** - Klick zum Bearbeiten und Löschen
- 💾 **Lokale Datenspeicherung** ohne Anmeldung
- 🌓 **Dark/Light Mode** mit System-Theme Option
- 📴 **Offline-fähig** - PWA mit Service Worker
- ☕ **Support-Link** in den Einstellungen

## 🚀 Live Demo

🔗 **[https://s540d.github.io/Pflanzkalender/](https://s540d.github.io/Pflanzkalender/)**

## 🛠️ Technologie-Stack

- **Framework:** React Native + Expo
- **Web:** React Native Web
- **Navigation:** React Navigation (Stack Navigator)
- **State Management:** React Context / Hooks
- **Storage:** AsyncStorage (lokal)
- **Deployment:** GitHub Pages mit automatischem Cache-Busting

## 📋 Installation

### Voraussetzungen

- Node.js 18+ und npm
- Expo CLI (optional, wird automatisch installiert)

### Lokale Entwicklung

```bash
# Repository klonen
git clone https://github.com/s540d/Pflanzkalender.git
cd Pflanzkalender

# Dependencies installieren
npm install

# Web-Version starten
npm run web

# iOS (nur auf macOS)
npm run ios

# Android
npm run android
```

Die App öffnet sich automatisch im Browser unter `http://localhost:8081`.

## 📦 PWA Deployment (GitHub Pages)

```bash
# Deploy auf GitHub Pages (baut automatisch)
npm run deploy
```

Das Deploy-Script:
- Erstellt einen Production-Build
- Passt Pfade für GitHub Pages an
- Deployed auf gh-pages Branch
- Aktiviert Cache-Busting für Updates

## 📖 Verwendung

### Kalender-Ansicht (📅)

- **Desktop:** Zeigt alle 24 Halbmonate auf einen Blick
- **Mobile:** Zeigt 3 Monate (6 Halbmonate) mit ← → Navigation
- **Sticky Header:** Tabellenkopf bleibt beim Scrollen sichtbar
- **Aktivitäten anklicken:** Öffnet Bearbeitungs-Dialog
- **Leere Zellen klicken:** Neue Aktivität für den Monat hinzufügen

### Agenda-Ansicht (📋)

Dreispaltige Übersicht mit horizontalem Scrolling:
- **Links:** Aktivitäten vom vorherigen Zeitraum
- **Mitte:** Aktuelle Aktivitäten (aktueller Halbmonat)
- **Rechts:** Kommende Aktivitäten (nächster Zeitraum)
- **Kompakte Spalten:** 160px Breite, horizontal scrollbar

### Pflanzen-Verwaltung (🌱)

Zentraler Screen zur Verwaltung aller Pflanzen:
- **Neue Pflanze hinzufügen:** Großer Button am oberen Rand
- **Pflanzenliste:** Übersicht mit Name, Notizen und Aktivitätsanzahl
- **Löschen:** Jede Pflanze kann einzeln gelöscht werden
- **Sortierung:** Alphabetisch nach Pflanzennamen

### Einstellungen (⋮)

- **Theme:** Umschalten zwischen Hell/Dunkel/System
- **Sprache:** Deutsch ⇄ English
- **Daten exportieren:** Als JSON-Datei
- **Support:** Ko-fi Link (https://ko-fi.com/devsven)
- **Feedback:** E-Mail an devsven@posteo.de
- **Info:** Version und Lizenz

## 🌿 Vordefinierte Pflanzen

Die App enthält 32 recherchierte Pflanzen mit typischen Aktivitäten, aufgeteilt in drei Kategorien:

**🥦 Nutzpflanzen (21):**
Tomaten, Gurken, Paprika, Zucchini, Salat, Karotten, Radieschen, Kartoffeln, Zwiebeln, Knoblauch, Spinat, Kürbis, Erdbeeren, Himbeeren, Basilikum, Petersilie, Schnittlauch

**🌸 Blumen (10):**
Rosen, Lavendel, Tulpen, Sonnenblumen, Dahlien, Geranien, Hortensien, Pfingstrosen, Chrysanthemen, Ringelblumen

**🌳 Bäume (5):**
Apfelbaum, Birnbaum, Kirschbaum, Pflaume, Haselnuss

Alle vordefinierten Pflanzen können bearbeitet und gelöscht werden.

## 🎨 Aktivitätstypen

- 🌱 **Aussäen** (Grün #4CAF50)
- 🌿 **Pflanzen** (Hellgrün #66BB6A)
- 💧 **Gießen** (Hellblau #42A5F5)
- 🌾 **Düngen** (Orange #FFA726)
- ✂️ **Zurückschneiden** (Gelb #FFEB3B)
- 🍅 **Ernten** (Rot #EF5350)
- 🛡️ **Winterschutz** (Lila #7E57C2)
- 🍂 **Mulchen** (Orange #FF9800)

## 📱 PWA Installation

Die App kann als PWA installiert werden:

1. Öffne die App im Browser (Chrome, Safari, Firefox)
2. Klicke auf "Zum Startbildschirm hinzufügen"
3. Die App erscheint als eigenständige App auf deinem Gerät

## 🤝 Contributing

Contributions sind willkommen! Bitte:

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push den Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Kommerzielle Nutzung ist ausgeschlossen.

## 💖 Support

Wenn dir diese App gefällt, kannst du mich gerne unterstützen:

☕ [Ko-fi](https://ko-fi.com/devsven)

## 🐛 Bug Reports

Bugs bitte als [GitHub Issue](https://github.com/s540d/Pflanzkalender/issues) melden.

## 📝 Changelog

### Version 1.2.0 (2025-10-26)

- ✨ **NEU:** Dedizierter Pflanzen-Verwaltungs-Screen (🌱)
  - Zentrale Ansicht zum Hinzufügen und Löschen von Pflanzen
  - Übersichtliche Liste mit Pflanzenname, Notizen und Aktivitätsanzahl
  - Navigation über neuen 🌱 Button im Header
- ✨ **NEU:** Mehrsprachigkeit (Deutsch/English)
  - Vollständige i18n-Unterstützung
  - Sprachumschalter in Einstellungen
  - Automatische Speicherung der Sprachpräferenz
- ✨ **NEU:** Optimierte Agenda-Ansicht
  - Kompakte Spalten (160px) für bessere Übersicht
  - Horizontales Scrolling für alle drei Zeiträume
  - Mehrsprachige Überschriften
- 🎨 **VERBESSERT:** UI-Optimierungen
  - Footer entfernt für mehr Platzgewinn
  - Support-Link in Einstellungen verschoben
  - Metrik-Feature entfernt für klarere UI
  - "Neue Pflanze" Button entfernt (jetzt über 🌱 Screen)
- 🐛 **FIX:** Navigation im 4-Tab-Layout (Kalender/Agenda/Pflanzen/Einstellungen)

### Version 1.1.0 (2025-10-06)

- ✨ **NEU:** Fixierte Pflanzennamen-Spalte beim horizontalen Scrollen
- ✨ **NEU:** Einheitliches Farbschema für Aktivitätstypen
- ✨ **NEU:** Tooltips für Aktivitätsbalken (Web) mit Zeitraum-Info
- ✨ **NEU:** Aktueller Halbmonat wird grau hervorgehoben
- ✨ **NEU:** Pflanzen-Verwaltung in Einstellungen mit Löschen-Funktion
- ✨ **NEU:** Einstellungen als Modal-Popup
- 🐛 **FIX:** Aktivitätsbalken-Klicks funktionieren jetzt konsistent
- 🐛 **FIX:** Doppelte Pflanzennamen-Anzeige entfernt
- 🐛 **FIX:** Scrolling auf Mobile und Desktop optimiert

### Version 1.0.0 (2025-10-06)

- ✅ Pflanzkalender-Grid mit 24 Halbmonaten
- ✅ Responsive Layout (Desktop: 24, Mobile: 6 Halbmonate)
- ✅ 20 vordefinierte, recherchierte Pflanzen
- ✅ Kompaktes Aktivitäten-Layout
- ✅ Interaktive Aktivitäten (Bearbeiten/Löschen)
- ✅ Agenda-Ansicht (3 Spalten)
- ✅ Dark/Light/System Theme
- ✅ Lokale Datenspeicherung
- ✅ Navigation im Header (Kalender/Agenda/Einstellungen)
- ✅ PWA mit Service Worker
- ✅ GitHub Pages Deployment mit Cache-Busting

## 👨‍💻 Autor

**Sven Strohkark**

- GitHub: [@s540d](https://github.com/s540d)
- E-Mail: devsven@posteo.de
- Ko-fi: [ko-fi.com/devsven](https://ko-fi.com/devsven)

---

🌱 **Made with ❤️ for gardeners and plant lovers**
