# Entwicklungs-Roadmap (Fokus: MVP)

## Projektregeln

- Nach jeder erledigten Aufgabe wird diese als erledigt abgehakt.
- Nach jeder erledigten Phase muss ein commit und push erfolgen.
- Neue Aufgaben werden immer oben in der Liste unter ToDo hinzugefügt, es sei denn, sie sind für die Post-MVP bestimmt, dann kommt sie in die ToDo Post-MVP.
- Jede erledigte Phase wird unter Done verschoben und mit dem Datum versehen, an dem sie abgeschlossen wurde.

## ToDo MVP-Entwicklung

## ToDo Post-MVP (Out of Scope für V1)

- Zucht von Medizinis (V4).
- Animierte, interaktive Puzzles für Biome.
- Blutzucker- und Blutdruck-Tracking.

## Done

### Phase 5: Medizini-Buch & Epilog (abgeschlossen: 2026-05-30)

- [x] Ansicht des Medizini-Buchs (Ausgegraute Silhouetten für unentdeckte Wesen).
- [x] **Ruhestands-Logik:** Erwachsenes Wesen verlässt bei der _nächsten_ Einnahme den Raum, hinterlässt ein neues Ei und wird im Buch dauerhaft freigeschaltet.

### Phase 4: Gamification & Shop (abgeschlossen: 2026-05-30)

- [x] **Das Ei/Medizini:** Wischgeste (Swipe) zum Streicheln implementieren.
- [x] **Entwicklung:** Logik für das Schlüpfen (Tap-Geste) und den Wechsel der Altersstufen.
- [x] **Apotheke & Allerlei:** Aufbau des Shop-UIs in feste Slots (Bett, Boden, Wand, Deko). Kauf zieht Kräuter ab und updatet den `RoomState`.

### Phase 3: Core Loop (Die Einnahme) (abgeschlossen: 2026-05-28)

- [x] Implementierung lokaler Push-Benachrichtigungen (Die Eule erinnert).
- [x] UI für die Bestätigung der Medikamenteneinnahme.
- [x] Logik zur Berechnung von Dosen: Abhaken füllt den Fortschrittsbalken (`current_doses` vs. `target_doses`).
- [x] Ernten von "Heilkräutern" bei erfolgreicher Bestätigung.

### Phase 2: Offline-First Architektur (abgeschlossen: 2026-05-28)

- [x] Setup von `Drizzle ORM` + `Expo SQLite` und Definition der Schemata (UserSettings, Medications, Medizinis, RoomState).
- [x] Setup des `Zustand`-Stores für UI-Overlays und das globale Heilkräuter-Konto.
- [x] CRUD-Funktionen für das Hinzufügen von Medikamenten (inkl. Foto-Speicherung für Beipackzettel).
- [x] Implementierung des Refill-Systems: Automatische Reduktion von `current_stock` bei Einnahmebestätigung und Eulen-Warnung bei Erreichen der `package_size`-Grenze.

### Phase 1: Foundation & UI-Skelett (abgeschlossen: 2026-05-28)

- [x] Setup des Expo-Projekts und der Ordnerstruktur.
- [x] Implementierung des `Expo Routers` (Tabs: Home/Zimmer, Medizinschrank, Apotheke, Buch).
- [x] Erstellung statischer UI-Dummys für alle Screens ohne Logik.
