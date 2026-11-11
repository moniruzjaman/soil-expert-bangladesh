ALTER TABLE `fields` ADD `boundary_geo_json` text;--> statement-breakpoint
ALTER TABLE `fields` ADD `location_accuracy_meters` varchar(50);--> statement-breakpoint
ALTER TABLE `fields` ADD `address` text;--> statement-breakpoint
ALTER TABLE `fields` ADD `district` varchar(100);--> statement-breakpoint
ALTER TABLE `fields` ADD `upazila` varchar(100);--> statement-breakpoint
ALTER TABLE `fields` ADD `union_name` varchar(100);--> statement-breakpoint
ALTER TABLE `fields` ADD `mouza_name` varchar(150);--> statement-breakpoint
ALTER TABLE `fields` ADD `sheet_number` varchar(100);--> statement-breakpoint
ALTER TABLE `fields` ADD `plot_number` varchar(100);--> statement-breakpoint
ALTER TABLE `fields` ADD `cadastral_status` varchar(100);