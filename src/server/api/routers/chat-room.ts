import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { messages, rooms } from "@/server/db/schema";
import {
	addChatMessageSchema,
	createChatRoomSchema,
	deleteChatRoomSchema,
} from "@/lib/validators";
import { eq } from "drizzle-orm";
import { pusher } from "@/server/pusher";
import { generateRandomString } from "@/lib/utils";

export const chatRoomRouter = createTRPCRouter({
	listChatRooms: publicProcedure.query(async ({ ctx }) => {
		return await ctx.db.query.rooms.findMany();
	}),

	addChatMessage: protectedProcedure
		.input(addChatMessageSchema)
		.mutation(async ({ ctx, input: { hash, message } }) => {
			const room = await ctx.db.query.rooms.findFirst({
				where: (rooms, { eq }) => eq(rooms.hash, hash),
				columns: { id: true },
			});

			if (!room) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Chat room not found",
				});
			}

			const [insertedChatMessage] = await ctx.db
				.insert(messages)
				.values({
					roomId: room.id,
					content: message,
					userId: ctx.auth.userId,
				})
				.returning();

			if (!insertedChatMessage) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Could not create chat message",
				});
			}

			await pusher.trigger(
				`private-chat-room__${hash}`,
				"new-chat-message",
				insertedChatMessage,
				{ socket_id: ctx.socketId },
			);

			return insertedChatMessage;
		}),

	create: protectedProcedure
		.input(createChatRoomSchema)
		.mutation(async ({ ctx, input: { title, description } }) => {
			const { userId } = ctx.auth;

			const hash = generateRandomString(10);

			const [newChatRoom] = await ctx.db
				.insert(rooms)
				.values({ hash, title, description, userId })
				.returning();

			await pusher.trigger("chat-rooms", "chat-room-created", newChatRoom, {
				socket_id: ctx.socketId,
			});

			return hash;
		}),

	delete: protectedProcedure
		.input(deleteChatRoomSchema)
		.mutation(async ({ ctx, input: { hash } }) => {
			const room = await ctx.db.query.rooms.findFirst({
				where: (rooms, { eq, and }) =>
					and(eq(rooms.hash, hash), eq(rooms.userId, ctx.auth.userId)),
				columns: { id: true },
			});

			if (!room) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Chat room not found",
				});
			}

			await ctx.db.delete(rooms).where(eq(rooms.id, room.id));

			await pusher.trigger("chat-rooms", "chat-room-deleted", room, {
				socket_id: ctx.socketId,
			});
		}),

	getByhash: protectedProcedure
		.input(z.object({ hash: z.string() }))
		.query(async ({ ctx, input: { hash } }) => {
			const chatRoom = await ctx.db.query.rooms.findFirst({
				where: (rooms, { eq }) => eq(rooms.hash, hash),
				with: {
					messages: true,
				},
			});

			if (!chatRoom) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Chat room not found",
				});
			}

			return chatRoom;
		}),
});
