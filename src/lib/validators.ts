import { z } from "zod";

export const addChatMessageSchema = z.object({
	slug: z.string(),
	message: z.string().trim().min(1),
});

export type AddChatMessageSchema = z.infer<typeof addChatMessageSchema>;

export const deleteChatRoomSchema = z.object({
	slug: z.string(),
});

export type DeleteChatRoomSchema = z.infer<typeof deleteChatRoomSchema>;

export const createChatRoomSchema = z.object({
	title: z.string().min(5),
	description: z.string().nullable(),
});

export type CreateChatRoomSchema = z.infer<typeof createChatRoomSchema>;
