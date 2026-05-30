import { useCallback } from 'react';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db';
import { roomStateTable, medizinisTable } from '@/db/schema';

export type SlotKey = 'Bett' | 'Boden' | 'Wand' | 'Deko';

type SlotUpdate =
  | { slot_bed_item_id: string }
  | { slot_floor_item_id: string }
  | { slot_wall_item_id: string }
  | { slot_deco_item_id: string };

function buildSlotUpdate(slot: SlotKey, itemId: string): SlotUpdate {
  switch (slot) {
    case 'Bett':  return { slot_bed_item_id: itemId };
    case 'Boden': return { slot_floor_item_id: itemId };
    case 'Wand':  return { slot_wall_item_id: itemId };
    case 'Deko':  return { slot_deco_item_id: itemId };
  }
}

export function useRoomState() {
  const { data: rows = [] } = useLiveQuery(db.select().from(roomStateTable).limit(1));
  const roomState = rows[0] ?? null;

  // Returns the item ID placed in the given slot (null = empty).
  const getSlotItem = useCallback(
    (slot: SlotKey): string | null => {
      if (!roomState) return null;
      switch (slot) {
        case 'Bett':  return roomState.slot_bed_item_id ?? null;
        case 'Boden': return roomState.slot_floor_item_id ?? null;
        case 'Wand':  return roomState.slot_wall_item_id ?? null;
        case 'Deko':  return roomState.slot_deco_item_id ?? null;
      }
    },
    [roomState]
  );

  // Places an item into a slot. Caller is responsible for deducting herbs first.
  const placeItem = useCallback(
    async (slot: SlotKey, itemId: string): Promise<void> => {
      const update = buildSlotUpdate(slot, itemId);

      if (roomState) {
        await db
          .update(roomStateTable)
          .set(update)
          .where(eq(roomStateTable.id, roomState.id));
      } else {
        // No room state yet — find the active medizini to link it.
        const [activeMedizini] = await db
          .select()
          .from(medizinisTable)
          .where(eq(medizinisTable.is_active, true))
          .limit(1);
        if (!activeMedizini) return;

        await db.insert(roomStateTable).values({
          medizini_id: activeMedizini.id,
          slot_bed_item_id: 'b1', // Starter Moosbett always pre-placed
          ...update,
        });
      }
    },
    [roomState]
  );

  return { roomState, getSlotItem, placeItem };
}
