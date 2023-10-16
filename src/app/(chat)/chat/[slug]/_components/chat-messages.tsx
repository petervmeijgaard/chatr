"use client";

import { RouterOutputs } from "@/trpc/shared";
import { useEffect, useState } from "react";
import { ChatMessage } from "./chat-message";
import { pusher } from "@/client/pusher";
import { useParams } from "next/navigation";

type Params = {
	slug: string;
};

type Message = RouterOutputs["chatRoom"]["getBySlug"]["messages"][number];

type Props = {
	messages: Array<Message>;
};

export function ChatMessages({ messages: initialState }: Props) {
	const { slug } = useParams<Params>();
	const [messages, setMessages] = useState(initialState);

	useEffect(() => {
		const channel = pusher.subscribe(`private-chat-room__${slug}`);

		// updates chats
		channel.bind("new-chat-message", (data: Message) => {
			setMessages((curr) => [...curr, data]);
		});

		return () => {
			pusher.unsubscribe(`private-chat-room__${slug}`);
		};
	}, [slug]);

	return (
		<div className="flex flex-1 flex-col place-items-start gap-6 rounded-md rounded-b-none border border-b-0 p-6">
			{messages.map((message) => (
				<ChatMessage {...message} key={message.id} />
			))}
		</div>
	);
}
