"use server";

import { db } from "@/db";
import { rooms } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import slugify from "slugify";

const schema = z.object({
	title: z.string().min(5),
	description: z.string().nullable(),
});

export const addNewChatRoom = async (formData: FormData) => {
	const { title, description } = schema.parse({
		title: formData.get("title"),
		description: formData.get("description"),
	});

	const slug = slugify(title, { strict: true });

	await db.insert(rooms).values({ slug, title, description });

	revalidatePath("/");
	redirect(`/chat/${slug}`);
};
