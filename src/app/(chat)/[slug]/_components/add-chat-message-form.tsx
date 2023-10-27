"use client";

import { Input } from "@/components/ui/input";
import { ButtonWithLoader } from "@/components/ui/button";
import { useZodForm } from "@/lib/zod-form";
import { AddChatMessageSchema, addChatMessageSchema } from "@/lib/validators";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { useChatRoom } from "@/context/chat-room-context";

type Params = {
	slug: string;
};

export function AddChatMessageForm() {
	const { slug } = useParams<Params>();
	const chatRoom = useChatRoom();
	const form = useZodForm({
		schema: addChatMessageSchema,
		defaultValues: { slug },
	});

	const addChatMessage = api.chatRoom.addChatMessage.useMutation({
		onSuccess(newMessage) {
			form.reset();

			chatRoom.addMessage(newMessage);
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
			<input type="hidden" {...form.register("slug")} />
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
