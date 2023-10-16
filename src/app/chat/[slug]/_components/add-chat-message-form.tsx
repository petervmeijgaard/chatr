"use client";

import { Input } from "@/components/ui/input";
import { ButtonWithLoader } from "@/components/ui/button";
import { useZodForm } from "@/lib/zod-form";
import { AddChatMessageSchema, addChatMessageSchema } from "@/lib/validators";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";

type Params = {
	slug: string;
};

export function AddChatMessageForm() {
	const { slug } = useParams<Params>();
	const router = useRouter();
	const form = useZodForm({
		schema: addChatMessageSchema,
		defaultValues: {
			slug,
		},
	});

	const addChatMessage = api.chatRoom.addChatMessage.useMutation({
		onSuccess() {
			form.reset();

			router.refresh();
		},
	});

	const onSubmit = (data: AddChatMessageSchema) => {
		addChatMessage.mutate(data);
	};

	return (
		<form
			className="flex flex-row items-start gap-2 rounded rounded-t-none border p-4"
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<input type="hidden" value={slug} {...form.register("slug")} />
			<Input
				placeholder="Enter your message..."
				{...form.register("message")}
			/>
			<ButtonWithLoader type="submit" isLoading={addChatMessage.isLoading}>
				Submit
			</ButtonWithLoader>
		</form>
	);
}
