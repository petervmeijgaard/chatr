"use client";

import { ChatMessage } from "./chat-message";
import { useChatRoom } from "@/context/chat-room-context";

export function ChatMessages() {
	const { messages } = useChatRoom();

	return (
		<div className="flex flex-1 flex-col place-items-start gap-6 rounded-md rounded-b-none border border-b-0 p-6">
			{messages.map((message) => (
				<ChatMessage {...message} key={message.id} />
			))}
		</div>
	);
}
