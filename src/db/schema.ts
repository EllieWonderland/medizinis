import { int, sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const userSettingsTable = sqliteTable('user_settings', {
  id: int().primaryKey({ autoIncrement: true }),
  global_herb_balance: int().notNull().default(0),
  day_cutoff_hour: int().notNull().default(4),
  created_at: int({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const medicationsTable = sqliteTable('medications', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  reminder_times: text().notNull().default('[]'), // JSON array of "HH:MM" strings
  package_size: int().notNull(),
  current_stock: int().notNull(),
  image_uri: text(), // local file path for Beipackzettel photo
});

export const medizinisTable = sqliteTable('medizinis', {
  id: int().primaryKey({ autoIncrement: true }),
  species: text().notNull(),
  gender: text({ enum: ['male', 'female'] }).notNull(),
  current_stage: text({ enum: ['Egg', 'Baby', 'Child', 'Teen', 'Adult'] }).notNull().default('Egg'),
  current_doses_progress: int().notNull().default(0),
  target_doses_for_next_stage: int().notNull().default(7),
  is_active: int({ mode: 'boolean' }).notNull().default(false),
  is_retired: int({ mode: 'boolean' }).notNull().default(false),
  is_unconscious: int({ mode: 'boolean' }).notNull().default(false),
  last_medication_date: int({ mode: 'timestamp' }),
});

export const roomStateTable = sqliteTable('room_state', {
  id: int().primaryKey({ autoIncrement: true }),
  medizini_id: int().notNull().references(() => medizinisTable.id),
  slot_floor_item_id: text(),
  slot_bed_item_id: text(),
  slot_wall_item_id: text(),
  slot_deco_item_id: text(),
});

export type UserSettings = typeof userSettingsTable.$inferSelect;
export type NewUserSettings = typeof userSettingsTable.$inferInsert;

export type Medication = typeof medicationsTable.$inferSelect;
export type NewMedication = typeof medicationsTable.$inferInsert;

export type Medizini = typeof medizinisTable.$inferSelect;
export type NewMedizini = typeof medizinisTable.$inferInsert;

export type RoomState = typeof roomStateTable.$inferSelect;
export type NewRoomState = typeof roomStateTable.$inferInsert;
