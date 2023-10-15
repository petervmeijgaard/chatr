import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { auth, UserButton } from "@clerk/nextjs";

import { api } from "@/trpc/server";
import { ChatMessage } from "./_components/chat-message";
import { DeleteChatRoomAlertDialog } from "./_components/delete-chat-room-alert-dialog";
import { notFound } from "next/navigation";
import { AddChatMessageForm } from "./_components/add-chat-message-form";

type Props = {
	params: {
		slug: string;
	};
};

export default async function ChatRoom({ params }: Props) {
	const { userId } = auth();

	const chatRoom = await api.chatRoom.getBySlug.query(params);

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
						<Link href={{ pathname: "/chat" }} className="flex flex-row gap-2">
							<ChevronLeft />
							Back to chat rooms
						</Link>
					</Button>
					{userId === chatRoom.userId && <DeleteChatRoomAlertDialog />}
					<UserButton afterSignOutUrl="/chat" />
				</div>
			</header>
			<div className="flex flex-1 flex-col">
				<div className="flex flex-1 flex-col place-items-start gap-6 rounded-md rounded-b-none border border-b-0 p-6">
					{chatRoom.messages.map((message) => (
						<ChatMessage {...message} key={message.id} />
					))}
				</div>
				<AddChatMessageForm />
			</div>
		</>
	);
}
