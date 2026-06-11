CREATE TABLE `activity_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`field_id` int NOT NULL,
	`user_id` int NOT NULL,
	`activity_type` varchar(50) NOT NULL,
	`activity_date` timestamp,
	`crop_name` varchar(100),
	`description` text,
	`quantity` varchar(50),
	`unit` varchar(50),
	`cost` varchar(50),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `activity_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aez_soil_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`aez_code` varchar(10) NOT NULL,
	`aez_name` varchar(255) NOT NULL,
	`district` varchar(100),
	`upazila` varchar(100),
	`description` text,
	`default_soil_ph` varchar(50),
	`organic_matter_status` varchar(50),
	`fertility_class` varchar(50),
	`dominant_soil_texture` varchar(100),
	`land_type` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aez_soil_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `aez_soil_profiles_aez_code_unique` UNIQUE(`aez_code`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`field_id` int,
	`role` enum('user','assistant') NOT NULL,
	`language` varchar(10) DEFAULT 'en',
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fertilizer_recommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`field_id` int NOT NULL,
	`user_id` int NOT NULL,
	`crop_name` varchar(100) NOT NULL,
	`season` varchar(50),
	`yield_goal` varchar(50),
	`recommendation_source` varchar(50),
	`confidence_level` varchar(50),
	`npk_recommendation` text,
	`micronutrients` text,
	`organic_fertilizer` text,
	`chemical_fertilizer` text,
	`bio_fertilizer` text,
	`liming_recommendation` text,
	`application_schedule` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fertilizer_recommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fields` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`field_name` varchar(255) NOT NULL,
	`latitude` varchar(50),
	`longitude` varchar(50),
	`aez_code` varchar(10),
	`area_in_bigha` varchar(50),
	`soil_texture` varchar(100),
	`land_type` varchar(50),
	`soil_ph` varchar(50),
	`organic_matter` varchar(50),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fields_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `soil_tests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`field_id` int NOT NULL,
	`user_id` int NOT NULL,
	`test_date` timestamp,
	`soil_ph` varchar(50),
	`nitrogen` varchar(50),
	`phosphorus` varchar(50),
	`potassium` varchar(50),
	`organic_matter` varchar(50),
	`zinc` varchar(50),
	`boron` varchar(50),
	`sulfur` varchar(50),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `soil_tests_id` PRIMARY KEY(`id`)
);
