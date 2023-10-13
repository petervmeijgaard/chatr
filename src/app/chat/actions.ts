"use server";

import { db } from "@/db";
import { rooms } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { auth } from "@clerk/nextjs";

const schema = z.object({
	title: z.string().min(5),
	description: z.string().nullable(),
});

export const addNewChatRoom = async (formData: FormData) => {
	const { userId } = auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const { title, description } = schema.parse({
		title: formData.get("title"),
		description: formData.get("description"),
	});

	const slug = slugify(title);

	await db.insert(rooms).values({ slug, title, description, userId });

	revalidatePath("/chat");
	redirect(`/chat/${slug}`);
};
