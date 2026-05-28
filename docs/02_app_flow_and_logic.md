# App Flow und Core Logic

## 1. Onboarding & Dateneingabe
* Startbildschirm mit Begrüßung durch die Eule.
* Medikament anlegen: Name, Erinnerungszeit, optionale Packungsgröße (für Refill-Erinnerung).
* Beipackzettel: Foto-Funktion, Speicherung lokal im App-Verzeichnis.
* Nach dem ersten Speichern erhält der Nutzer sein erstes, noch farbloses Ei.

## 2. Daily Loop (Einnahme-Logik)
* Benachrichtigung zur eingestellten Zeit via Eule.
* Nutzer bestätigt Einnahme über eine Checkbox / großen Button.
* **Erfolg:** Haptisches Feedback, Medizini bekommt etwas Farbe zurück (falls ohnmächtig), Heilkräuter sprießen und werden dem globalen Konto gutgeschrieben.
* **Interaktion:** Nutzer kann das Medizini durch eine Wischgeste (Swipe) streicheln.
* **Fortschritt:** Der Balken füllt sich (z. B. "20/28 Einnahmen").

## 3. Die Fallback-Mechanik (Keine Streaks!)
* Es gibt keine "in a row"-Voraussetzungen. Jede Einnahme zählt.
* **Teil-Erfolg:** Werden Dosen vergessen, stagniert das Wachstum, das Medizini bleibt hungrig bis zur nächsten Einnahme, aber es gibt keine Strafe.
* **Ohnmacht (Das einzige Fallback):** Nur wenn 3 vollständige Tage (0 Dosen) verstreichen, wird das Medizini ohnmächtig (grau). Es wird durch die nächste Einnahme und anschließendes Streicheln wieder aufgeweckt.
### 3.1 Status-Logik für Medizinis
* **Aktives Medizini (Ei bis Erwachsener):** Erhält Erinnerungen durch die Eule, kann hungrig werden, benötigt Pilleneinnahmen zur Heilung/Wachstum.
* **Ruhestand (Retired Medizini):** Sobald ein Medizini "Erwachsen" ist und durch die nächste Einnahme des Nutzers in den Ruhestand überführt wird (in das Buch umzieht), wird der Status permanent auf `is_retired = true` gesetzt. 
* **Kein Hunger im Ruhestand:** Ein `is_retired` Medizini löst KEINE Push-Benachrichtigungen mehr aus und benötigt keine weiteren Medikamenteneinnahmen. Es ist "satt und glücklich" für immer.
### 3.2 ADHS-Nachteulen-Logik (Offset-Zeit)
* Die App definiert den Tageswechsel nicht um 00:00 Uhr, sondern um 04:00 Uhr.
* Einnahmen in diesem 4-Stunden-Fenster werden auf den vorherigen Kalendertag verbucht, um den Flow nicht zu unterbrechen.
### 3.3 Fainting-Check
* Der Status `is_unconscious` wird bei jedem App-Start und bei jeder Interaktion neu berechnet:
  `days_since_last_dose = floor((now - last_successful_dose) / 86400)`
* Ist `days_since_last_dose >= 3`, wird der Status auf `is_unconscious = true` gesetzt.

## 4. Schlüpfen und Epilog
* Sind die nötigen Einnahmen erreicht, schlüpft das Ei/entwickelt sich das Wesen durch aktives Tapping des Nutzers.
* Erreicht das Wesen den Status "Erwachsener", verbleibt es vorerst im Raum.
* Bei der *darauffolgenden* Pilleneinnahme zieht das erwachsene Medizini aus (wird im Medizini-Buch freigeschaltet) und hinterlässt ein neues Ei im Raum.