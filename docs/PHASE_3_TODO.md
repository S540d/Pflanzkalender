# Phase 3: Authentifizierung & Cloud-Synchronisation

## Übersicht
Diese Phase fügt Google-Authentifizierung, Cloud-Speicherung und volle CRUD-Funktionalität hinzu.

## Tasks

### 1. Modals & UI Komponenten
- [ ] AddPlantModal - Neue Pflanze hinzufügen
  - Name eingeben
  - Notizen eingeben
  - Standard-Pflanzen zur Auswahl
- [ ] EditPlantModal - Pflanze bearbeiten/löschen
  - Name ändern
  - Notizen ändern
  - Pflanze löschen (mit Bestätigung)
- [ ] AddActivityModal - Aktivität hinzufügen
  - Aktivitätstyp auswählen (vordefiniert)
  - Start-Monat wählen
  - End-Monat wählen
  - Label bearbeiten (optional)
- [ ] EditActivityModal - Aktivität bearbeiten/löschen
  - Zeitraum ändern
  - Label ändern
  - Aktivität löschen

### 2. Firebase Integration
- [ ] Firebase Console Setup
  - Projekt erstellen
  - Web-App registrieren
  - Firebase Config in Code einbauen
- [ ] Authentication einrichten
  - Google Sign-In Provider aktivieren
  - Auth UI Komponente erstellen
  - Login/Logout Funktionalität
- [ ] Firestore einrichten
  - Datenbank erstellen
  - Security Rules definieren
  - Collections: `users/{userId}/plants`
- [ ] Datenmigration
  - Lokale Daten beim ersten Login optional übernehmen
  - Sync-Status anzeigen

### 3. State Management erweitern
- [ ] Auth Context erstellen
  - User State
  - Login/Logout Funktionen
  - isGuest Status
- [ ] PlantContext erweitern
  - Firestore Integration
  - Realtime Sync (optional)
  - Offline Persistence nutzen
- [ ] Loading States
  - Spinner während Sync
  - Optimistic UI Updates

### 4. Settings Screen erweitern
- [ ] Account Section
  - Login Button (wenn Guest)
  - User Info (wenn angemeldet)
  - Logout Button
  - Daten-Migration Option
- [ ] Data Management
  - Zu Standardpflanzen zurücksetzen
  - Alle Daten löschen
  - Export-Funktion (optional)
- [ ] About Section
  - Version anzeigen
  - Support Link
  - GitHub Link

### 5. Testing & Bugfixes
- [ ] Testen: Lokaler Modus
- [ ] Testen: Angemeldeter Modus
- [ ] Testen: Datenmigration
- [ ] Testen: Offline-Fähigkeit
- [ ] Responsive Design prüfen
- [ ] Dark Mode prüfen
- [ ] Performance optimieren

## Priorität
**Mittel** - Die App ist bereits funktionsfähig im lokalen Modus. Diese Phase fügt Cloud-Features hinzu.

## Abhängigkeiten
- Firebase Account
- Google OAuth Credentials
- Internetverbindung für Cloud-Features

## Geschätzte Zeit
3-5 Tage

## Notizen
- Testzugang bleibt erhalten
- Cloud-Features sind optional
- Fokus auf UX beim Wechsel zwischen Gast/Angemeldet
