"use server";

import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { messages, rooms } from "@/db/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const deleteChatRoomSchema = z.object({
	slug: z.string(),
});

const addChatMessageSchema = z.object({
	roomId: z.coerce.number(),
	message: z.string(),
});

export const deleteChatRoom = async (formData: FormData) => {
	const { userId } = auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const { slug } = deleteChatRoomSchema.parse({ slug: formData.get("slug") });

	const [room] = await db
		.select()
		.from(rooms)
		.where(and(eq(rooms.slug, slug), eq(rooms.userId, userId)));

	if (!room) {
		return notFound();
	}

	await db.delete(messages).where(eq(messages.roomId, room.id));
	await db.delete(rooms).where(eq(rooms.id, room.id));

	revalidatePath("/chat");
	redirect("/chat");
};

export const addChatMessage = async (formData: FormData) => {
	const { userId } = auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const { roomId, message } = addChatMessageSchema.parse({
		roomId: formData.get("roomId"),
		message: formData.get("message"),
	});

	const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId));

	if (!room) {
		notFound();
	}

	await db.insert(messages).values({
		roomId,
		content: message,
		userId,
	});

	revalidatePath(`/chat/${room.slug}`);
};
