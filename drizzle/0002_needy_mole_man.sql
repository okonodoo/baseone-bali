CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(256) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32),
	`country` varchar(64),
	`budget` varchar(64),
	`sector` varchar(128),
	`source` varchar(128),
	`notes` text,
	`odooLeadId` int,
	`status` enum('new','contacted','qualified','lost') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`titleId` varchar(256),
	`type` enum('villa','commercial','office','land','warehouse') NOT NULL,
	`listingType` enum('rent','sale') NOT NULL,
	`region` varchar(64) NOT NULL,
	`priceUSD` int NOT NULL,
	`priceIDR` int NOT NULL,
	`priceLabel` varchar(32) DEFAULT '/month',
	`area` int NOT NULL,
	`bedrooms` int,
	`bathrooms` int,
	`description` text,
	`descriptionId` text,
	`features` text,
	`featuresId` text,
	`nearbyPlaces` text,
	`image` varchar(512) NOT NULL,
	`images` text,
	`yearBuilt` int,
	`leaseYears` int,
	`furnished` boolean DEFAULT false,
	`parking` int,
	`pool` boolean DEFAULT false,
	`lat` decimal(10,7),
	`lng` decimal(10,7),
	`status` enum('active','inactive','draft') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `country` varchar(64);