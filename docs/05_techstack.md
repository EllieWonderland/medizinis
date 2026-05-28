# Tech Stack & Development Guidelines

## Core Framework
* **React Native** mit **Expo**: Fokus auf eine saubere, plattformübergreifende Codebasis.
* **Expo Router**: Für die Navigation innerhalb der App (File-based Routing).

## State Management & Daten
* **Lokale Datenbank**: `Drizzle ORM` + `Expo SQLite` (Fokus auf Offline-First, reaktive Queries über `useLiveQuery` für Echtzeit-Updates von Medizini- und Raum-Zuständen).
* **Global State**: `Zustand` (Minimalistisch, ohne Boilerplate. Nutzung für den globalen "Heilkräuter"-Kontostand und UI-States).

## Styling & UI
* **Styling**: `NativeWind` (Tailwind CSS für React Native) für konsistentes, schnelles und responsives Design.
* **Animationen**: `React Native Reanimated` für performante, flüssige UI-Übergänge (z. B. wackelndes Ei, sprießende Kräuter).

## Tooling & CI/CD
* **Versionsverwaltung**: GitHub.
* **Build-Prozess**: GitHub Actions und Expo EAS (Expo Application Services) für automatisierte Android-Builds (.apk / .aab), um die App direkt nativ auf dem Smartphone testen zu können.

## LLM / Vibe Coding Guidelines
* Schreibe modulare, funktionale Komponenten.
* Behalte die UI-Logik von der Datenbank-Logik getrennt (Custom Hooks verwenden).
* Nutze TypeScript strikt für alle Modelle, um Typensicherheit zu garantieren.
* Erfinde keine Backend-APIs. Die App funktioniert zu 100 % lokal.