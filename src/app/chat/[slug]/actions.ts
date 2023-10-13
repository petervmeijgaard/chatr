"use server";

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { rooms } from "@/db/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const schema = z.object({
	slug: z.string(),
});

export const deleteChatRoom = async (formData: FormData) => {
	const { userId } = auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const { slug } = schema.parse({ slug: formData.get("slug") });

	await db
		.delete(rooms)
		.where(and(eq(rooms.slug, slug), eq(rooms.userId, userId)));

	revalidatePath("/chat");
	redirect("/chat");
};
