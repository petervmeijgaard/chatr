import { z } from "zod";

const metaData = z
	.object({
		socketId: z.string().optional(),
	})
	.optional();

export const addChatMessageSchema = z.object({
	slug: z.string(),
	message: z.string().trim().min(1),
	metaData,
});

export type AddChatMessageSchema = z.infer<typeof addChatMessageSchema>;

export const deleteChatRoomSchema = z.object({
	slug: z.string(),
	metaData,
});

export type DeleteChatRoomSchema = z.infer<typeof deleteChatRoomSchema>;

export const createChatRoomSchema = z.object({
	title: z.string().min(5),
	description: z.string().nullable(),
	metaData,
});

export type CreateChatRoomSchema = z.infer<typeof createChatRoomSchema>;
