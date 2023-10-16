"use client";

import { useZodForm } from "@/lib/zod-form";
import { useParams, useRouter } from "next/navigation";
import {
	addChatMessageSchema,
	DeleteChatRoomSchema,
	deleteChatRoomSchema,
} from "@/lib/validators";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import {
	AlertDialogAction,
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, ButtonWithLoader } from "@/components/ui/button";
import { Trash } from "lucide-react";

type Params = {
	slug: string;
};

export function DeleteChatRoomAlertDialog() {
	const { slug } = useParams<Params>();
	const router = useRouter();
	const form = useZodForm({
		schema: deleteChatRoomSchema,
		defaultValues: {
			slug,
		},
	});

	const deleteChatRoom = api.chatRoom.delete.useMutation({
		onSuccess() {
			router.push("/chat");
			router.refresh();
		},
	});

	const onSubmit = (data: DeleteChatRoomSchema) => {
		deleteChatRoom.mutate(data);
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" className="flex flex-row gap-2">
					<Trash />
					Delete room
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the chat
						room and all messages.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>

					<form onSubmit={form.handleSubmit(onSubmit)}>
						<Input type="hidden" {...form.register("slug")} />
						<AlertDialogAction asChild>
							<ButtonWithLoader
								type="submit"
								isLoading={deleteChatRoom.isLoading}
							>
								Continue
							</ButtonWithLoader>
						</AlertDialogAction>
					</form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
