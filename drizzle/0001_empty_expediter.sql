ALTER TABLE `users` ADD `stripeCustomerId` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeSubscriptionId` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionPlan` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStatus` varchar(32);