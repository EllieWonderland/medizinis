import { useCallback, useEffect } from 'react';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db';
import { userSettingsTable } from '@/db/schema';
import { useAppStore } from '@/store';

export function useUserSettings() {
  const { data: rows = [] } = useLiveQuery(
    db.select().from(userSettingsTable).limit(1)
  );
  const settings = rows[0] ?? null;

  const setHerbBalance = useAppStore((s) => s.setHerbBalance);
  const addHerbsToStore = useAppStore((s) => s.addHerbs);

  // Sync DB balance into Zustand whenever settings load or change
  useEffect(() => {
    if (settings) {
      setHerbBalance(settings.global_herb_balance);
    }
  }, [settings?.global_herb_balance, setHerbBalance]);

  // Creates default settings row if none exists yet
  const ensureSettings = useCallback(async () => {
    const [existing] = await db.select().from(userSettingsTable).limit(1);
    if (existing) return existing;
    const [created] = await db.insert(userSettingsTable).values({}).returning();
    return created;
  }, []);

  // Persists herb reward to DB and updates Zustand store
  const earnHerbs = useCallback(
    async (amount: number) => {
      const current = await ensureSettings();
      if (!current) return;
      const newBalance = current.global_herb_balance + amount;
      await db
        .update(userSettingsTable)
        .set({ global_herb_balance: newBalance })
        .where(eq(userSettingsTable.id, current.id));
      addHerbsToStore(amount);
    },
    [ensureSettings, addHerbsToStore]
  );

  // Deducts herbs from DB and Zustand. Returns false if balance is insufficient.
  const spendHerbs = useCallback(
    async (amount: number): Promise<boolean> => {
      const current = await ensureSettings();
      if (!current || current.global_herb_balance < amount) return false;
      const newBalance = current.global_herb_balance - amount;
      await db
        .update(userSettingsTable)
        .set({ global_herb_balance: newBalance })
        .where(eq(userSettingsTable.id, current.id));
      setHerbBalance(newBalance);
      return true;
    },
    [ensureSettings, setHerbBalance]
  );

  return { settings, ensureSettings, earnHerbs, spendHerbs };
}
