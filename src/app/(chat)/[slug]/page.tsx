import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { auth, UserButton } from "@clerk/nextjs";

import { api } from "@/trpc/server";
import { DeleteChatRoomAlertDialog } from "./_components/delete-chat-room-alert-dialog";
import { AddChatMessageForm } from "./_components/add-chat-message-form";
import { ChatMessages } from "./_components/chat-messages";
import React from "react";
import { ChatRoomProvider } from "@/context/chat-room-context";

type Props = {
	params: {
		slug: string;
	};
};

export default async function ChatRoom({ params: { slug } }: Props) {
	const { userId } = auth();

	const chatRoom = await api.chatRoom.getBySlug.query({ slug });

	return (
		<ChatRoomProvider slug={slug} messages={chatRoom.messages}>
			<header className="flex flex-row place-content-between">
				<h1 className="text-3xl font-bold">
					Welcome to chatroom {`"${chatRoom.title}"`}
				</h1>
				<div className="flex flex-row items-center gap-4">
					<Button asChild>
						<Link href={{ pathname: "/" }} className="flex flex-row gap-2">
							<ChevronLeft />
							Back to chat rooms
						</Link>
					</Button>
					{userId === chatRoom.userId && <DeleteChatRoomAlertDialog />}
					<UserButton afterSignOutUrl="/chat" />
				</div>
			</header>
			<div className="flex flex-1 flex-col">
				<ChatMessages />

				<AddChatMessageForm />
			</div>
		</ChatRoomProvider>
	);
}
