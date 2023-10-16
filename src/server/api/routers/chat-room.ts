import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { slugify } from "@/lib/utils";
import { messages, rooms } from "@/server/db/schema";
import {
	addChatMessageSchema,
	createChatRoomSchema,
	deleteChatRoomSchema,
} from "@/lib/validators";
import { eq } from "drizzle-orm";
import { pusher } from "@/server/pusher";

export const chatRoomRouter = createTRPCRouter({
	listChatRooms: publicProcedure.query(async ({ ctx }) => {
		return await ctx.db.query.rooms.findMany();
	}),

	addChatMessage: protectedProcedure
		.input(addChatMessageSchema)
		.mutation(async ({ ctx, input: { slug, message, metaData } }) => {
			const room = await ctx.db.query.rooms.findFirst({
				where: (rooms, { eq, and }) =>
					and(eq(rooms.slug, slug), eq(rooms.userId, ctx.auth.userId)),
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

			await pusher.trigger(
				`private-chat-room__${slug}`,
				"new-chat-message",
				insertedChatMessage,
				{
					socket_id: metaData?.socketId,
				},
			);
		}),

	create: protectedProcedure
		.input(createChatRoomSchema)
		.mutation(async ({ ctx, input: { title, description } }) => {
			const { userId } = ctx.auth;
			const slug = slugify(title);

			await ctx.db.insert(rooms).values({ slug, title, description, userId });

			return slug;
		}),

	delete: protectedProcedure
		.input(deleteChatRoomSchema)
		.mutation(async ({ ctx, input: { slug } }) => {
			const room = await ctx.db.query.rooms.findFirst({
				where: (rooms, { eq, and }) =>
					and(eq(rooms.slug, slug), eq(rooms.userId, ctx.auth.userId)),
				columns: { id: true },
			});

			if (!room) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Chat room not found",
				});
			}

			await ctx.db.delete(messages).where(eq(messages.roomId, room.id));
			await ctx.db.delete(rooms).where(eq(rooms.id, room.id));
		}),

	getBySlug: protectedProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ ctx, input: { slug } }) => {
			const chatRoom = await ctx.db.query.rooms.findFirst({
				where: (rooms, { eq }) => eq(rooms.slug, slug),
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
