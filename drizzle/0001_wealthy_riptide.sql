CREATE TABLE `generatedPrompts` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`topic` text NOT NULL,
	`category` varchar(100),
	`youtubePrompt` text NOT NULL,
	`tiktokPrompt` text NOT NULL,
	`templateId` varchar(64),
	`customizations` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `generatedPrompts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promptTemplates` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text,
	`youtubePrompt` text NOT NULL,
	`tiktokPrompt` text NOT NULL,
	`isPublic` enum('true','false') NOT NULL DEFAULT 'true',
	`createdBy` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `promptTemplates_id` PRIMARY KEY(`id`)
);
