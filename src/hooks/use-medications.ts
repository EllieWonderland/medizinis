import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db';
import { medicationsTable, type Medication, type NewMedication } from '@/db/schema';

// Threshold at which the owl warning triggers (≤ this many pills left)
const LOW_STOCK_THRESHOLD = 7;

type MedicationInput = Omit<NewMedication, 'id' | 'reminder_times'> & {
  reminder_times?: string[];
};

export function useMedications() {
  const { data: medications = [] } = useLiveQuery(
    db.select().from(medicationsTable)
  );

  const addMedication = useCallback(async (input: MedicationInput) => {
    await db.insert(medicationsTable).values({
      ...input,
      reminder_times: JSON.stringify(input.reminder_times ?? []),
    });
  }, []);

  const updateMedication = useCallback(async (id: number, patch: Partial<MedicationInput>) => {
    const { reminder_times, ...rest } = patch;
    const update: Partial<NewMedication> = { ...rest };
    if (reminder_times !== undefined) {
      update.reminder_times = JSON.stringify(reminder_times);
    }
    await db.update(medicationsTable).set(update).where(eq(medicationsTable.id, id));
  }, []);

  const deleteMedication = useCallback(async (id: number) => {
    await db.delete(medicationsTable).where(eq(medicationsTable.id, id));
  }, []);

  // Decrements stock by 1, stamps last_taken_at, returns true if stock hits the warning threshold
  const confirmIntake = useCallback(async (id: number): Promise<boolean> => {
    const [med] = await db.select().from(medicationsTable).where(eq(medicationsTable.id, id));
    if (!med) return false;

    const newStock = Math.max(0, med.current_stock - 1);
    await db.update(medicationsTable)
      .set({ current_stock: newStock, last_taken_at: new Date() })
      .where(eq(medicationsTable.id, id));

    return newStock <= LOW_STOCK_THRESHOLD;
  }, []);

  const pickLeafletPhoto = useCallback(async (): Promise<string | null> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });

    if (result.canceled || !result.assets[0]) return null;
    return result.assets[0].uri;
  }, []);

  const parsedMedications = medications.map((med) => ({
    ...med,
    reminder_times: safeParseJson<string[]>(med.reminder_times, []),
    isLowStock: med.current_stock <= LOW_STOCK_THRESHOLD,
    last_taken_at: med.last_taken_at ?? null,
  }));

  const lowStockCount = parsedMedications.filter((m) => m.isLowStock).length;

  return {
    medications: parsedMedications,
    lowStockCount,
    addMedication,
    updateMedication,
    deleteMedication,
    confirmIntake,
    pickLeafletPhoto,
  };
}

function safeParseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
