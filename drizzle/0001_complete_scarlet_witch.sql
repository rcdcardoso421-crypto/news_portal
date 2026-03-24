CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(255) NOT NULL,
	`categoryId` int NOT NULL,
	`title` text NOT NULL,
	`originalTitle` text NOT NULL,
	`description` text,
	`content` text,
	`originalContent` text,
	`author` varchar(255),
	`imageUrl` text,
	`sourceUrl` text NOT NULL,
	`sourceName` varchar(255),
	`publishedAt` timestamp,
	`isRewritten` int NOT NULL DEFAULT 0,
	`views` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_externalId_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
CREATE TABLE `news_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`icon` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `news_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `news_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `reading_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`articleId` int NOT NULL,
	`readAt` timestamp NOT NULL DEFAULT (now()),
	`timeSpent` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reading_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_category_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`categoryId` int NOT NULL,
	`interestScore` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_category_preferences_id` PRIMARY KEY(`id`)
);
