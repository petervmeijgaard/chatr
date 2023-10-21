"use client";

import { useZodForm } from "@/lib/zod-form";
import { api } from "@/trpc/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, ButtonWithLoader } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CreateChatRoomSchema, createChatRoomSchema } from "@/lib/validators";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export function CreateChatRoomDialog() {
	const router = useRouter();
	const form = useZodForm({
		schema: createChatRoomSchema,
	});

	const createChatRoom = api.chatRoom.create.useMutation({
		onSuccess(slug) {
			router.push(`/chat/${slug}`);
			router.refresh();
		},
	});

	const onSubmit = (data: CreateChatRoomSchema) => {
		createChatRoom.mutate(data);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Add new room</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add chat room</DialogTitle>
					<DialogDescription>
						Add a new chatroom. Click {"Save changes"} when {"you're"}
						content with your chatroom
					</DialogDescription>
				</DialogHeader>
				<form
					className="flex flex-col gap-4 py-4"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className="flex flex-col gap-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							placeholder="My chatroom"
							{...form.register("title")}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="My description"
							{...form.register("description")}
						/>
					</div>
					<ButtonWithLoader type="submit" isLoading={createChatRoom.isLoading}>
						Save changes
					</ButtonWithLoader>
				</form>
			</DialogContent>
		</Dialog>
	);
}
