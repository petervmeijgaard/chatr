import { db } from "@/db";
import { messages, rooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { auth, UserButton } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { addChatMessage, deleteChatRoom } from "./actions";
import { Trash } from "lucide-react";
import { ChatMessage } from "@/app/chat/[slug]/components";

type Props = {
	params: {
		slug: string;
	};
};

const getChatroomData = async (slug: string) => {
	const { userId } = auth();
	const [chatRoom] = await db.select().from(rooms).where(eq(rooms.slug, slug));

	if (!chatRoom) {
		return {
			chatRoom: undefined,
			allMessages: [],
		};
	}

	const foundMessages = await db
		.select()
		.from(messages)
		.where(eq(messages.roomId, chatRoom.id))
		.all();

	const allMessagesPromises = foundMessages.map(async (message) => {
		const user = await clerkClient.users.getUser(message.userId);

		return {
			id: message.id,
			content: message.content,
			fromMe: message.userId === userId,
			user: {
				id: user.id,
				name: user.username ?? `${user.firstName} ${user.lastName}`,
			},
		};
	});

	const allMessages = await Promise.all(allMessagesPromises);

	return {
		chatRoom,
		allMessages,
	};
};

export default async function ChatRoom({ params }: Props) {
	const { userId } = auth();

	const { chatRoom, allMessages } = await getChatroomData(params.slug);

	if (!chatRoom) {
		return notFound();
	}

	return (
		<>
			<header className="flex flex-row place-content-between">
				<h1 className="text-3xl font-bold">
					Welcome to chatroom {`"${chatRoom.title}"`}
				</h1>
				<div className="flex flex-row items-center gap-4">
					<Button asChild>
						<Link href="/chat" className="flex flex-row gap-2">
							<ChevronLeft />
							Back to chat rooms
						</Link>
					</Button>
					{userId === chatRoom.userId && (
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
										This action cannot be undone. This will permanently delete
										the chat room and all messages.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<form action={deleteChatRoom}>
										<Input
											type="hidden"
											value={chatRoom.slug ?? ""}
											id="slug"
											name="slug"
										/>
										<AlertDialogAction asChild>
											<Button type="submit">Continue</Button>
										</AlertDialogAction>
									</form>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
					<UserButton afterSignOutUrl="/chat" />
				</div>
			</header>
			<div className="flex flex-1 flex-col">
				<div className="flex flex-1 flex-col place-items-start gap-6 rounded-md rounded-b-none border border-b-0 p-6">
					{allMessages.map((message) => (
						<ChatMessage
							user={message.user.name}
							content={message.content}
							fromMe={message.fromMe}
							key={message.id}
						/>
					))}
				</div>
				<form
					className="flex flex-row items-start gap-2 rounded rounded-t-none border p-4"
					action={addChatMessage}
				>
					<input type="hidden" value={chatRoom.id} name="roomId" id="roomId" />
					<Input
						placeholder="Enter your message..."
						name="message"
						id="message"
					/>
					<Button type="submit">Submit</Button>
				</form>
			</div>
		</>
	);
}
