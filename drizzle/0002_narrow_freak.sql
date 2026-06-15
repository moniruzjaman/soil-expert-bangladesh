CREATE TABLE `yields` (
	`id` int AUTO_INCREMENT NOT NULL,
	`field_id` int NOT NULL,
	`user_id` int NOT NULL,
	`crop_name` varchar(100) NOT NULL,
	`season` varchar(50),
	`harvest_date` timestamp,
	`quantity_produced` varchar(50) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`expected_yield` varchar(50),
	`yield_percentage` varchar(50),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `yields_id` PRIMARY KEY(`id`)
);
