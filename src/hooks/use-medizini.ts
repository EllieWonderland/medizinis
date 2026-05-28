import { useCallback, useEffect } from 'react';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db';
import { medizinisTable } from '@/db/schema';
import { getNextStage, type MediziniStage } from '@/lib/dose-logic';

export function useMedizini() {
  const { data: rows = [] } = useLiveQuery(
    db.select().from(medizinisTable).where(eq(medizinisTable.is_active, true)).limit(1)
  );
  const medizini = rows[0] ?? null;

  // Seed the starter Medizini if none is active (fresh install or after retirement).
  useEffect(() => {
    if (rows.length === 0) {
      db.insert(medizinisTable)
        .values({
          species: 'Salbeikauz',
          gender: 'female',
          current_stage: 'Egg',
          current_doses_progress: 0,
          target_doses_for_next_stage: 7,
          is_active: true,
          is_retired: false,
          is_unconscious: false,
        })
        .catch(console.error);
    }
  }, [rows.length]);

  const progressPercent = medizini
    ? Math.min(
        100,
        Math.round(
          (medizini.current_doses_progress / medizini.target_doses_for_next_stage) * 100
        )
      )
    : 0;

  // Increments the active medizini's dose progress by `count` and advances stage when threshold is reached.
  // Returns whether a stage advancement happened and what the new stage is.
  const confirmDoseProgress = useCallback(async (count: number = 1): Promise<{
    advanced: boolean;
    newStage: MediziniStage | null;
  }> => {
    if (!medizini) return { advanced: false, newStage: null };

    const newProgress = medizini.current_doses_progress + count;
    const shouldAdvance = newProgress >= medizini.target_doses_for_next_stage;
    const nextStage = shouldAdvance
      ? getNextStage(medizini.current_stage as MediziniStage)
      : null;

    await db
      .update(medizinisTable)
      .set({
        current_doses_progress: shouldAdvance ? 0 : newProgress,
        current_stage: nextStage ?? medizini.current_stage,
        last_medication_date: new Date(),
      })
      .where(eq(medizinisTable.id, medizini.id));

    return { advanced: shouldAdvance && nextStage !== null, newStage: nextStage };
  }, [medizini]);

  return { medizini, progressPercent, confirmDoseProgress };
}
