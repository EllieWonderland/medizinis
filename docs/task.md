# Task-Liste: Medizinis

Jede erledigte muss direkt abgehakt werden.
Nach jeder Phase muss ein Commit und Push auf https://github.com/EllieWonderland/medizinis erfolgen.

- `[x]` Review der Anforderungen & Anpassung des Techstacks auf Drizzle ORM + Expo SQLite
  - **Commit-Notiz:** `docs: update techstack and roadmap to Drizzle ORM and Expo SQLite`
- `[x]` Phase 1: Foundation & UI-Skelett
  - `[x]` Setup des Expo-Projekts mit TypeScript und der Ordnerstruktur.
    - **Commit-Notiz:** `chore: initialize expo project with typescript and custom folder structure`
  - `[x]` Setup des `Expo Routers` mit Tab-Navigation (Home/Zimmer, Medizinschrank, Apotheke, Buch).
    - **Commit-Notiz:** `feat: configure expo router with tabs for Home, Cabinet, Shop, and Book`
  - `[x]` Erstellung statischer UI-Dummys für alle Screens ohne Logik.
    - **Commit-Notiz:** `feat: create static UI mockups for all navigation tab screens`
- `[x]` Phase 2: Offline-First Architektur
  - `[x]` Setup von `Drizzle ORM` + `Expo SQLite` und Definition der Schemata (UserSettings, Medications, Medizinis, RoomState).
    - **Commit-Notiz:** `feat: setup sqlite database schema using drizzle-orm for settings, meds, medizinis, and roomState`
  - `[x]` Setup des `Zustand`-Stores für UI-Overlays und das globale Heilkräuter-Konto.
    - **Commit-Notiz:** `feat: configure global zustand store for herb balance and UI overlay state`
  - `[x]` CRUD-Funktionen für Medikamente inkl. lokaler Beipackzettel-Foto-Speicherung.
    - **Commit-Notiz:** `feat: add medication CRUD functions and local file system photo picker for leaflets`
  - `[x]` Implementierung des Refill-Systems (Mengenreduktion und Eulen-Warnungen).
    - **Commit-Notiz:** `feat: implement stock reduction logic and owl alert notifications for low medication stock`
- `[x]` Phase 3: Core Loop (Die Einnahme)
  - `[x]` Lokale Push-Benachrichtigungen mit der Eule als Questgeber.
    - **Commit-Notiz:** `feat: configure local notifications scheduler for scheduled owl medication reminders`
  - `[x]` UI für die Bestätigung der Medikamenteneinnahme (Haptik-Feedback).
    - **Commit-Notiz:** `feat: create medicine intake confirmation UI modal with haptic feedback`
  - `[x]` Logik zur Berechnung von Dosen & Fortschritt (4:00 Uhr Offset für Nachteulen).
    - **Commit-Notiz:** `feat: calculate dose progression with custom 4 AM night-owl offset logic`
  - `[x]` Ernten von Heilkräutern und Zuweisung zum globalen Zustand-Store.
    - **Commit-Notiz:** `feat: credit harvested herbs currency to global account upon intake success`
- `[ ]` Phase 4: Gamification & Shop
  - `[ ]` Interaktion: Swipe-Geste zum Streicheln des Medizinis implementieren.
    - **Commit-Notiz:** `feat: implement react-native-gesture-handler swipe-to-pet interaction for medizinis`
  - `[ ]` Entwicklung: Ei schlüpfen (Tap-Geste) und Altersstufen-Wechsel.
    - **Commit-Notiz:** `feat: build egg hatching tap mechanics and medizinis evolution growth logic`
  - `[ ]` Fainting-Check (Ohnmachts-Berechnung $\ge 3$ Tage bei App-Start/Interaktion).
    - **Commit-Notiz:** `feat: implement unconscious state recalculation on app startup or interactions`
  - `[ ]` Apotheke & Allerlei Shop: Zimmer-Einrichtung (Deko-Slots) und Kauf-Abbuchung.
    - **Commit-Notiz:** `feat: build room shop UI with slot restrictions and deduct herb costs`
- `[ ]` Phase 5: Medizini-Buch & Epilog
  - `[ ]` Medizini-Buch-Ansicht (Pokédex-Mechanik mit Silhouetten).
    - **Commit-Notiz:** `feat: create medizini handbook screen showing discovered pets and silhouettes`
  - `[ ]` Ruhestands-Logik (Auszug, neues Ei hinterlassen, is_retired = true).
    - **Commit-Notiz:** `feat: implement medizini retirement logic moving adult pets to handbook and spawning new egg`
