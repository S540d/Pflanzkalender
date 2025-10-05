# 🌱 Pflanzkalender PWA

Eine Progressive Web App (PWA) zur Verwaltung von Pflanzkalendern mit monatlicher Übersicht für Garten- und Pflanzenaktivitäten.

![License](https://img.shields.io/badge/license-MIT-green)
![React Native](https://img.shields.io/badge/React%20Native-0.76-blue)
![Expo](https://img.shields.io/badge/Expo-54.0-black)

## 🎯 Features

- 📅 **Pflanzkalender** mit monatlicher Übersicht (halbe Monate)
- 🌿 **20 vordefinierte Pflanzen** mit typischen Aktivitäten
- ✏️ **Eigene Pflanzen** hinzufügen und verwalten
- 🎨 **Farbcodierte Aktivitäten** (Aussäen, Pflanzen, Ernten, etc.)
- 💾 **Lokaler Testzugang** ohne Anmeldung
- 🔐 **Google Sign-In** für Cloud-Synchronisation (geplant)
- 🌓 **Dark/Light Mode** - folgt Systemeinstellung
- 📱 **Responsive Design** - funktioniert auf Desktop und Mobile
- 📴 **Offline-fähig** - PWA mit Service Worker

## 🚀 Live Demo

🔗 **[https://s540d.github.io/Pflanzkalender/](https://s540d.github.io/Pflanzkalender/)** _(noch nicht deployed)_

## 📸 Screenshots

_Coming soon..._

## 🛠️ Technologie-Stack

- **Framework:** React Native + Expo
- **Web:** React Native Web
- **Navigation:** React Navigation
- **State Management:** React Context / Hooks
- **Storage:** AsyncStorage (lokal) + Firebase Firestore (Cloud)
- **Authentifizierung:** Firebase Authentication (Google)
- **Deployment:** GitHub Pages

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

## 🔧 Firebase Setup (Optional)

Für Cloud-Synchronisation:

1. Firebase-Projekt erstellen auf [firebase.google.com](https://firebase.google.com)
2. Web-App hinzufügen und Config kopieren
3. Datei `src/services/firebase.ts` anpassen:

```typescript
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_AUTH_DOMAIN",
  projectId: "DEIN_PROJECT_ID",
  storageBucket: "DEIN_STORAGE_BUCKET",
  messagingSenderId: "DEIN_MESSAGING_SENDER_ID",
  appId: "DEIN_APP_ID"
};
```

4. Firebase Authentication aktivieren (Google Sign-In)
5. Firestore Database erstellen

## 📦 PWA Deployment (GitHub Pages)

```bash
# Build für Production
npm run build

# Deploy auf GitHub Pages
npm run deploy
```

## 📖 Verwendung

### Testzugang

- Beim ersten Start startet die App im **Testzugang**
- Daten werden **nur lokal** auf deinem Gerät gespeichert
- 20 vordefinierte Pflanzen sind bereits vorhanden
- Du kannst eigene Pflanzen hinzufügen und bearbeiten

### Google Anmeldung _(geplant)_

- Melde dich mit deinem Google-Konto an
- Deine Daten werden in der Cloud gespeichert
- Synchronisation über alle Geräte

## 🌿 Vordefinierte Pflanzen

Die App enthält 20 häufige Pflanzen:

- Gemüse: Tomaten, Gurken, Paprika, Zucchini, Salat, Karotten, Radieschen, Kartoffeln, Zwiebeln, Knoblauch, Spinat
- Kräuter: Basilikum, Petersilie, Schnittlauch, Lavendel
- Obst: Erdbeeren, Himbeeren, Apfelbaum, Kürbis
- Zierpflanzen: Rosen

Alle vordefinierten Pflanzen können:
- ✏️ Bearbeitet werden
- 🗑️ Gelöscht werden
- 📋 Als Vorlage für eigene Pflanzen dienen

## 🎨 Aktivitätstypen

- 🌱 **Aussäen** (Braun)
- 🌿 **Pflanzen** (Grün)
- 💧 **Gießen** (Blau)
- 🌾 **Düngen** (Gold)
- ✂️ **Zurückschneiden** (Orange)
- 🍅 **Ernten** (Rot)
- 🛡️ **Winterschutz** (Lila)
- 🍂 **Mulchen** (Braun)

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

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei.

## 💖 Support

Wenn dir diese App gefällt, kannst du mich gerne unterstützen:

☕ [Buy Me a Coffee](https://buymeacoffee.com/sven4321)

## 🐛 Bug Reports

Bugs bitte als [GitHub Issue](https://github.com/s540d/Pflanzkalender/issues) melden.

## 📝 Changelog

### Version 1.0.0 (In Entwicklung)

- ✅ Grundlegende Projektstruktur
- ✅ Dark/Light Mode
- ✅ Navigation (React Navigation)
- ✅ Firebase Setup
- ✅ 20 vordefinierte Pflanzen
- ✅ Lokale Datenspeicherung
- ⏳ Pflanzkalender-Grid
- ⏳ Aktivitätsverwaltung
- ⏳ Google Authentifizierung
- ⏳ PWA Setup
- ⏳ GitHub Pages Deployment

## 👨‍💻 Autor

**Sven Strohkark**

- GitHub: [@s540d](https://github.com/s540d)
- Buy Me a Coffee: [@sven4321](https://buymeacoffee.com/sven4321)

---

**Hinweis:** Dieses Projekt befindet sich in aktiver Entwicklung. Weitere Features folgen in Kürze.
