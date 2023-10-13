import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const rooms = sqliteTable("rooms", {
	id: integer("id").primaryKey(),
	title: text("title"),
	description: text("description"),
	slug: text("slug").unique(),
	userId: text("user_id").notNull(),
});

export const messages = sqliteTable("messages", {
	id: integer("id").primaryKey(),
	roomId: integer("room_id").references(() => rooms.id),
	userId: text("user_id").notNull(),
	content: text("content"),
	timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
});
