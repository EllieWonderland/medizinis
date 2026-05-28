CREATE TABLE `medications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`reminder_times` text DEFAULT '[]' NOT NULL,
	`package_size` integer NOT NULL,
	`current_stock` integer NOT NULL,
	`image_uri` text
);
--> statement-breakpoint
CREATE TABLE `medizinis` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`species` text NOT NULL,
	`gender` text NOT NULL,
	`current_stage` text DEFAULT 'Egg' NOT NULL,
	`current_doses_progress` integer DEFAULT 0 NOT NULL,
	`target_doses_for_next_stage` integer DEFAULT 7 NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`is_retired` integer DEFAULT false NOT NULL,
	`is_unconscious` integer DEFAULT false NOT NULL,
	`last_medication_date` integer
);
--> statement-breakpoint
CREATE TABLE `room_state` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`medizini_id` integer NOT NULL,
	`slot_floor_item_id` text,
	`slot_bed_item_id` text,
	`slot_wall_item_id` text,
	`slot_deco_item_id` text,
	FOREIGN KEY (`medizini_id`) REFERENCES `medizinis`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`global_herb_balance` integer DEFAULT 0 NOT NULL,
	`day_cutoff_hour` integer DEFAULT 4 NOT NULL,
	`created_at` integer NOT NULL
);
