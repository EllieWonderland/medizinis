// Returns the start of the current "game day" (defaults to 4 AM cutoff).
// If the current time is before the cutoff, the game day started yesterday.
export function getGameDayStart(cutoffHour: number = 4): Date {
  const now = new Date();
  const start = new Date(now);
  start.setHours(cutoffHour, 0, 0, 0);
  if (now < start) {
    start.setDate(start.getDate() - 1);
  }
  return start;
}

// Returns true if the medication was already confirmed within the current game day.
export function isDoseTakenToday(
  lastTakenAt: Date | null | undefined,
  cutoffHour: number = 4
): boolean {
  if (!lastTakenAt) return false;
  return lastTakenAt >= getGameDayStart(cutoffHour);
}

// Returns the next upcoming dose time and medication name, or null if none scheduled.
type MedForNextDose = { name: string; reminder_times: string[] };

export function getNextDoseInfo(
  medications: MedForNextDose[]
): { timeLabel: string; name: string } | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let closest: { diffMinutes: number; timeLabel: string; name: string } | null = null;

  for (const med of medications) {
    for (const time of med.reminder_times) {
      const [hourStr, minuteStr] = time.split(':');
      const h = parseInt(hourStr, 10);
      const m = parseInt(minuteStr, 10);
      if (isNaN(h) || isNaN(m)) continue;

      let diff = h * 60 + m - currentMinutes;
      if (diff < 0) diff += 24 * 60;

      if (!closest || diff < closest.diffMinutes) {
        closest = { diffMinutes: diff, timeLabel: `${time} Uhr`, name: med.name };
      }
    }
  }

  return closest ? { timeLabel: closest.timeLabel, name: closest.name } : null;
}

export const STAGE_ORDER = ['Egg', 'Baby', 'Child', 'Teen', 'Adult'] as const;
export type MediziniStage = (typeof STAGE_ORDER)[number];

export function getNextStage(current: MediziniStage): MediziniStage | null {
  const idx = STAGE_ORDER.indexOf(current);
  if (idx === -1 || idx === STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[idx + 1];
}

export const STAGE_EMOJIS: Record<MediziniStage, string> = {
  Egg: '🥚',
  Baby: '🐣',
  Child: '🐥',
  Teen: '🦅',
  Adult: '🦉',
};

export const STAGE_LABELS: Record<MediziniStage, string> = {
  Egg: 'Ei',
  Baby: 'Baby',
  Child: 'Kind',
  Teen: 'Jugendlicher',
  Adult: 'Erwachsener',
};
