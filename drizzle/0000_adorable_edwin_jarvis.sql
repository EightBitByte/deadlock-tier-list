CREATE TABLE `characters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`image_url` text NOT NULL,
	`name_image` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `characters_name_unique` ON `characters` (`name`);--> statement-breakpoint
CREATE TABLE `votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`character_id` integer NOT NULL,
	`tier` text NOT NULL,
	`patch` text DEFAULT 'unknown' NOT NULL,
	`session_id` text NOT NULL,
	`ip_hash` text DEFAULT 'legacy' NOT NULL,
	`created_at` integer DEFAULT '"2026-01-29T04:41:34.926Z"',
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `votes_character_id_ip_hash_patch_unique` ON `votes` (`character_id`,`ip_hash`,`patch`);