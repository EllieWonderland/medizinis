# Entwicklungs-Roadmap (Fokus: MVP)

## Projektregeln

- Nach jeder erledigten Aufgabe wird diese als erledigt abgehakt.
- Nach jeder erledigten Phase muss ein commit und push erfolgen.
- Neue Aufgaben werden immer oben in der Liste unter ToDo hinzugefügt, es sei denn, sie sind für die Post-MVP bestimmt, dann kommt sie in die ToDo Post-MVP.
- Jede erledigte Phase wird unter Done verschoben und mit dem Datum versehen, an dem sie abgeschlossen wurde.

## ToDo MVP-Entwicklung

### Phase 6: Stabilisierung & Bugfixes

#### Kritisch

- [ ] **Race Condition – Dosis-Bestätigung:** `confirmIntake()` (Stock-Dekrement) und `confirmDoseProgress()` in `confirm-intake-modal.tsx` in eine DB-Transaktion wrappen, damit bei einem Absturz kein inkonsistenter Zustand entsteht.
- [ ] **Race Condition – Shop:** `spendHerbs()` und `placeItem()` in `shop.tsx` atomar machen – bei einem Fehler nach der Kräuter-Ausgabe darf die Platzierung nicht still scheitern.
- [ ] **Splash Screen wird nie versteckt:** `SplashScreen.hideAsync()` in `_layout.tsx` nach abgeschlossenen DB-Migrationen aufrufen.

#### Hoch

- [ ] **Falsches Tab-Icon:** Apotheke-Tab zeigt `home.png` statt einem eigenen Icon – in `app-tabs.tsx` korrigieren.
- [ ] **Kein Bestätigungs-Dialog vor Medikament-Löschen:** Ein einziger Tap löscht das Medikament dauerhaft. Confirmation-Alert in `cabinet.tsx` vor `deleteMedication()` einbauen.
- [ ] **Zeitformat-Validierung unvollständig:** `dose-logic.ts` und `notifications.ts` prüfen nicht, ob `h ≤ 23` und `m ≤ 59` – Eingaben wie „25:99" werden stillschweigend akzeptiert.
- [ ] **Inkonsistente Kräuter-Store-Updates:** `earnHerbs()` ruft `addHerbsToStore()` (additiv) auf, `spendHerbs()` ruft `setHerbBalance()` (absolut) auf – auf absoluten Setter vereinheitlichen.
- [ ] **Starter-Medizini-Fehler wird verschluckt:** Schlägt das Anlegen des ersten Medizinis fehl, startet die App ohne Pet und ohne Hinweis. Fehler-State und Recovery-UI in `use-medizini.ts` ergänzen.
- [ ] **Notification-Reschedule nicht atomar:** `rescheduleAllNotifications()` löscht zunächst alle Benachrichtigungen; schlägt der Loop fehl, bleibt der Nutzer ohne Reminder. Atomares Umschreiben in `notifications.ts`.

#### Mittel

- [ ] **Formular-Validierung (Medizinschrank):** Negative Zahlen für `packageSize`/`currentStock` und ungültige HH:MM-Uhrzeiten (z. B. „25:99") werden nicht abgefangen – Validierung in `cabinet.tsx` erweitern.
- [ ] **Kein Error Boundary auf dem Home-Screen:** Unbehandelte Fehler können den Hauptscreen crashen. React Error Boundary einbauen.
- [ ] **Migration-Fehler ohne Recovery:** Bei einem DB-Migrationsfehler zeigt `_layout.tsx` nur einen Text ohne „Nochmal versuchen"-Option. Retry-Button ergänzen.
- [ ] **`selectedPet` hat Typ `any` in `book.tsx`:** Mit `typeof SPECIES_CATALOG[number]` korrekt typisieren.
- [ ] **Duplizierter `STAGE_ORDER` in `shop.tsx`:** `STAGE_ORDER` aus `dose-logic.ts` re-exportieren und den doppelten Code in `shop.tsx` entfernen.
- [ ] **`overlayPayload` im Zustand-Store ist `unknown`:** Diskriminierte Union für alle Overlay-Typen definieren, damit Aufrufer typsicher sind.

#### Low

- [ ] **Android Notification-Limit:** Anzahl geplanter Benachrichtigungen vor dem Scheduling prüfen und ggf. warnen/kappen in `notifications.ts`.
- [ ] **Notification-Permission ohne Fallback:** `requestNotificationPermissions()` in `_layout.tsx` wird nicht awaited und hat keine Fallback-UX, wenn der Nutzer die Berechtigung verweigert.
- [ ] **Hardcodierte Katalogdaten:** `SHOP_ITEMS` und `SPECIES_CATALOG` sind im Code verstreut – in eine gemeinsame `constants/catalog.ts` auslagern.

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
