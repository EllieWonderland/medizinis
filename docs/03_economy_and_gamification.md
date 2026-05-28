# Economy & Gamification

## Währung: Heilkräuter
* Werden durch jede erfolgreiche Einnahme generiert.
* Werden auf einem globalen, nutzerbezogenen Konto gespeichert (nicht an ein spezifisches Medizini gebunden).

## Shop: Apotheke und Allerlei
* Ein Shop-Menü, betreut durch den NPC "Eule" (wechselnde, freundliche Dialog-Strings bei Begrüßung).
* **Slots:** Items sind in feste Slots unterteilt (Bett, Boden/Teppich, Deko, Wand), um UI-Chaos und Reizüberflutung zu vermeiden.
* **Sichtbarkeit:** Items sind von Anfang an sichtbar, um das Sparen zu motivieren. Neue Items werden passend zur Altersstufe des aktuellen Medizinis freigeschaltet.
* **Interaktion:** Gekaufte Möbel werden im Zimmer platziert. Interaktionen finden via UI-VFX statt (Zzz-Blasen beim Klick aufs Bett), um komplexe Animations-Assets zu sparen.

## Das Medizini-Buch (Pokédex-Mechanik)
* Sammelalbum aller Entwicklungsstufen und Wesen.
* Unentdeckte Wesen sind als graue Silhouetten sichtbar.
* **Ruhestand:** Ausgewachsene Medizinis sind hier mit ihrem individuell eingerichteten Zimmer hinterlegt. Sie werden nicht mehr hungrig (`is_retired = true`).