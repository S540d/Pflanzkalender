# Changelog

Alle wesentlichen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-10-26

### Hinzugefügt
- **Pflanzen-Verwaltungs-Screen**: Dedizierte Ansicht zum Verwalten aller Pflanzen
  - Neue Navigation über 🌱 Button im Header
  - Liste aller Pflanzen mit Name, Notizen und Aktivitätsanzahl
  - "Neue Pflanze hinzufügen" Button
  - Löschen-Funktion für einzelne Pflanzen
- **Mehrsprachigkeit (i18n)**:
  - Vollständige Deutsch/English Unterstützung
  - LanguageContext für zentrales Übersetzungsmanagement
  - Sprachumschalter in den Einstellungen
  - Automatische Speicherung der Sprachpräferenz in AsyncStorage
  - Übersetzungen für Settings- und Agenda-Screen

### Geändert
- **Agenda-Ansicht optimiert**:
  - Spaltenbreite von 250px auf 160px reduziert
  - Horizontales Scrolling aktiviert für bessere Übersicht
  - Mehrsprachige Überschriften (Vorher/Previous, Aktuell/Current, Demnächst/Next)
- **Navigation erweitert**: 4-Tab-Layout (Kalender, Agenda, Pflanzen, Einstellungen)
- **Support-Link**: Von Footer in Einstellungen verschoben
- **Settings-Screen**: Übersetzt und übersichtlicher gestaltet

### Entfernt
- **Footer**: Sticky Footer entfernt, um mehr Platz zu schaffen und Verdeckungsproblem zu lösen
- **Metrik-Feature**: Aus Einstellungen entfernt für klarere UI
- **"Neue Pflanze" Button**: Am Ende der Kalenderansicht entfernt (ersetzt durch Pflanzen-Screen)
- Ungenutzte AddPlantModal Imports und State aus CalendarScreen

### Behoben
- Translation-Funktion in LanguageContext korrigiert (flache Key-Struktur statt verschachtelt)
- Sichtbarkeitsproblem der "Neue Pflanze" Taste durch Bounce-Back

## [1.1.0] - 2025-10-06

### Hinzugefügt
- Fixierte Pflanzennamen-Spalte beim horizontalen Scrollen
- Einheitliches Farbschema für Aktivitätstypen
- Tooltips für Aktivitätsbalken (Web) mit Zeitraum-Info
- Hervorhebung des aktuellen Halbmonats (grauer Hintergrund)
- Pflanzen-Verwaltung in Einstellungen mit Löschen-Funktion
- Einstellungen als Modal-Popup

### Behoben
- Aktivitätsbalken-Klicks funktionieren jetzt konsistent
- Doppelte Pflanzennamen-Anzeige entfernt
- Scrolling auf Mobile und Desktop optimiert

## [1.0.0] - 2025-10-06

### Hinzugefügt
- Pflanzkalender-Grid mit 24 Halbmonaten
- Responsive Layout (Desktop: 24 Halbmonate, Mobile: 6 Halbmonate mit Navigation)
- 20 vordefinierte, recherchierte Pflanzen mit typischen Aktivitäten
- Kompaktes Aktivitäten-Layout
- Interaktive Aktivitäten (Bearbeiten/Löschen)
- Agenda-Ansicht mit 3-Spalten-Layout
- Dark/Light/System Theme Support
- Lokale Datenspeicherung via AsyncStorage
- Navigation im Header (Kalender/Agenda/Einstellungen)
- PWA-Unterstützung mit Service Worker
- GitHub Pages Deployment mit automatischem Cache-Busting
- Farbcodierte Aktivitätstypen
- Tooltips auf Web für Aktivitäten

[1.2.0]: https://github.com/s540d/Pflanzkalender/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/s540d/Pflanzkalender/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/s540d/Pflanzkalender/releases/tag/v1.0.0
