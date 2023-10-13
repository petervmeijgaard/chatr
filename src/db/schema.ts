import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const rooms = sqliteTable("rooms", {
	id: integer("id").primaryKey(),
	title: text("title"),
	description: text("description"),
	slug: text("slug").unique(),
	userId: text("user_id"),
});
