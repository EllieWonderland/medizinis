# Entwicklungs-Roadmap (Fokus: MVP)

## Phase 1: Foundation & UI-Skelett
* Setup des Expo-Projekts und der Ordnerstruktur.
* Implementierung des `Expo Routers` (Tabs: Home/Zimmer, Medizinschrank, Apotheke, Buch).
* Erstellung statischer UI-Dummys für alle Screens ohne Logik.

## Phase 2: Offline-First Architektur
* Setup von `Drizzle ORM` + `Expo SQLite` und Definition der Schemata (UserSettings, Medications, Medizinis, RoomState).
* Setup des `Zustand`-Stores für UI-Overlays und das globale Heilkräuter-Konto.
* CRUD-Funktionen für das Hinzufügen von Medikamenten (inkl. Foto-Speicherung für Beipackzettel).
* Implementierung des Refill-Systems: Automatische Reduktion von `current_stock` bei Einnahmebestätigung und Eulen-Warnung bei Erreichen der `package_size`-Grenze.

## Phase 3: Core Loop (Die Einnahme)
* Implementierung lokaler Push-Benachrichtigungen (Die Eule erinnert).
* UI für die Bestätigung der Medikamenteneinnahme.
* Logik zur Berechnung von Dosen: Abhaken füllt den Fortschrittsbalken (`current_doses` vs. `target_doses`).
* Ernten von "Heilkräutern" bei erfolgreicher Bestätigung.

## Phase 4: Gamification & Shop
* **Das Ei/Medizini:** Wischgeste (Swipe) zum Streicheln implementieren.
* **Entwicklung:** Logik für das Schlüpfen (Tap-Geste) und den Wechsel der Altersstufen.
* **Apotheke & Allerlei:** Aufbau des Shop-UIs in feste Slots (Bett, Boden, Wand, Deko). Kauf zieht Kräuter ab und updatet den `RoomState`.

## Phase 5: Medizini-Buch & Epilog
* Ansicht des Medizini-Buchs (Ausgegraute Silhouetten für unentdeckte Wesen).
* **Ruhestands-Logik:** Erwachsenes Wesen verlässt bei der *nächsten* Einnahme den Raum, hinterlässt ein neues Ei und wird im Buch dauerhaft freigeschaltet.

## Post-MVP (Out of Scope für V1)
* Zucht von Medizinis (V4).
* Animierte, interaktive Puzzles für Biome.
* Blutzucker- und Blutdruck-Tracking.