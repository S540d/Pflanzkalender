# 🌱 Pflanzkalender PWA

Eine Progressive Web App (PWA) zur Verwaltung von Pflanzkalendern mit monatlicher Übersicht für Garten- und Pflanzenaktivitäten.

![License](https://img.shields.io/badge/license-MIT-green)
![React Native](https://img.shields.io/badge/React%20Native-0.76-blue)
![Expo](https://img.shields.io/badge/Expo-54.0-black)

## 🎯 Features

- 📅 **Pflanzkalender** mit halber Monatsauflösung (24 Halbmonate)
- 📱 **Responsive Design** - automatische Anpassung auf kleinen Displays (3 Monate mit Navigation)
- 🌿 **20 vordefinierte Pflanzen** mit recherchierten, typischen Aktivitäten
- ✏️ **Eigene Pflanzen** hinzufügen und verwalten
- 🎨 **Farbcodierte Aktivitäten** (Aussäen, Pflanzen, Ernten, etc.)
- 📊 **Agenda-Ansicht** mit 3-Spalten-Layout (Vorher | Aktuell | Demnächst)
- 🎯 **Kompaktes Layout** - Aktivitäten in derselben Zeile wenn keine Überlappung
- 🖱️ **Interaktive Aktivitäten** - Klick zum Bearbeiten und Löschen
- 💾 **Lokale Datenspeicherung** ohne Anmeldung
- 🌓 **Dark/Light Mode** mit System-Theme Option
- 📴 **Offline-fähig** - PWA mit Service Worker
- ☕ **Support-Link** für Entwickler-Unterstützung

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

### Kalender-Ansicht

- **Desktop:** Zeigt alle 24 Halbmonate auf einen Blick
- **Mobile:** Zeigt 3 Monate (6 Halbmonate) mit ← → Navigation
- **Sticky Header:** Tabellenkopf bleibt beim Scrollen sichtbar
- **Aktivitäten anklicken:** Öffnet Bearbeitungs-Dialog
- **Leere Zellen klicken:** Neue Aktivität für den Monat hinzufügen
- **+ Pflanze:** Neue Pflanze in leerer Zeile unter letzter Pflanze

### Agenda-Ansicht

Dreispaltige Übersicht:
- **Links:** Aktivitäten vom vorherigen Zeitraum
- **Mitte:** Aktuelle Aktivitäten (aktueller Halbmonat)
- **Rechts:** Kommende Aktivitäten (nächster Zeitraum)

### Einstellungen

- **Dark Mode:** Umschalten zwischen Hell/Dunkel/System
- **Daten zurücksetzen:** Auf Standard-Pflanzen zurücksetzen
- **Feedback:** Direkte E-Mail an devsven@posteo.de
- **Lizenzen:** Open Source unter MIT Lizenz

## 🌿 Vordefinierte Pflanzen

Die App enthält 20 recherchierte Pflanzen mit typischen Aktivitäten:

**Gemüse:** Tomaten, Gurken, Paprika, Zucchini, Salat, Karotten, Radieschen, Kartoffeln, Zwiebeln, Knoblauch, Spinat

**Kräuter:** Basilikum, Petersilie, Schnittlauch, Lavendel

**Obst:** Erdbeeren, Himbeeren, Apfelbaum, Kürbis

**Zierpflanzen:** Rosen

Alle vordefinierten Pflanzen können bearbeitet und gelöscht werden.

## 🎨 Aktivitätstypen

- 🌱 **Aussäen** (Braun #8B4513)
- 🌿 **Pflanzen** (Grün #228B22)
- 💧 **Gießen** (Blau #4682B4)
- 🌾 **Düngen** (Gold #FFD700)
- ✂️ **Zurückschneiden** (Orange #FF8C00)
- 🍅 **Ernten** (Rot #DC143C)
- 🛡️ **Winterschutz** (Lila #9370DB)
- 🍂 **Mulchen** (Braun #8B4513)

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

☕ [Buy Me a Coffee](https://buymeacoffee.com/sven4321)

## 🐛 Bug Reports

Bugs bitte als [GitHub Issue](https://github.com/s540d/Pflanzkalender/issues) melden.

## 📝 Changelog

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
- Buy Me a Coffee: [@sven4321](https://buymeacoffee.com/sven4321)

---

🌱 **Made with ❤️ for gardeners and plant lovers**
