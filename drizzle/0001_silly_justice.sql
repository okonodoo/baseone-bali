ALTER TABLE `users` ADD `subscriptionTier` enum('free','premium','vip') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(128);