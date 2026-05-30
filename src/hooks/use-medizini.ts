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

  // True when the progress bar is full AND a next stage exists (egg is ready to hatch).
  const isReadyToHatch = medizini
    ? medizini.current_doses_progress >= medizini.target_doses_for_next_stage &&
      getNextStage(medizini.current_stage as MediziniStage) !== null
    : false;

  // Increments progress toward the next stage. Capped at the target — stage advances only
  // when the user taps the egg (see `hatch`).
  // Exception: Adult stage has no next stage — the next dose triggers retirement instead.
  const confirmDoseProgress = useCallback(async (count: number = 1): Promise<{ retired: boolean; species: string }> => {
    if (!medizini) return { retired: false, species: '' };

    // Adult medizini retires on the very next intake confirmation.
    if (medizini.current_stage === 'Adult') {
      await db
        .update(medizinisTable)
        .set({ is_active: false, is_retired: true, last_medication_date: new Date() })
        .where(eq(medizinisTable.id, medizini.id));
      return { retired: true, species: medizini.species };
    }

    const newProgress = Math.min(
      medizini.current_doses_progress + count,
      medizini.target_doses_for_next_stage
    );
    await db
      .update(medizinisTable)
      .set({
        current_doses_progress: newProgress,
        last_medication_date: new Date(),
      })
      .where(eq(medizinisTable.id, medizini.id));
    return { retired: false, species: '' };
  }, [medizini]);

  // Advances to the next stage when the egg is ready. Called by the tap gesture on the egg.
  const hatch = useCallback(async (): Promise<MediziniStage | null> => {
    if (!medizini || !isReadyToHatch) return null;
    const nextStage = getNextStage(medizini.current_stage as MediziniStage);
    if (!nextStage) return null;

    await db
      .update(medizinisTable)
      .set({
        current_doses_progress: 0,
        current_stage: nextStage,
        last_medication_date: new Date(),
      })
      .where(eq(medizinisTable.id, medizini.id));

    return nextStage;
  }, [medizini, isReadyToHatch]);

  return { medizini, progressPercent, isReadyToHatch, confirmDoseProgress, hatch };
}
