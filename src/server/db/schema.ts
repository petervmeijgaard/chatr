import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const rooms = sqliteTable(
	"rooms",
	{
		id: integer("id").primaryKey(),
		title: text("title").notNull(),
		description: text("description"),
		slug: text("slug").notNull().unique(),
		userId: text("user_id").notNull(),
	},
	(table) => ({
		slugIndex: index("slug_idx").on(table.slug),
	}),
);

export type Room = typeof rooms.$inferSelect;

export const roomsRelations = relations(rooms, ({ many }) => ({
	messages: many(messages),
}));

export const messages = sqliteTable("messages", {
	id: integer("id").primaryKey(),
	roomId: integer("room_id")
		.notNull()
		.references(() => rooms.id),
	userId: text("user_id").notNull(),
	content: text("content").notNull(),
	timestamp: text("timestamp")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export type Message = typeof messages.$inferSelect;

export const messagesRelations = relations(messages, ({ one }) => ({
	room: one(rooms, {
		fields: [messages.roomId],
		references: [rooms.id],
	}),
}));
