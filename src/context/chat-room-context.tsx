"use client";

import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
	useMemo,
	useCallback,
} from "react";
import { pusher } from "@/client/pusher";
import { Message } from "@/server/db/schema";

type ChatRoomContextType = {
	messages: Array<Message>;
	addMessage: (newMessage: Message) => void;
};

const ChatRoomContext = createContext<ChatRoomContextType>(
	{} as ChatRoomContextType,
);

type Props = PropsWithChildren<{
	slug: string;
	messages: Array<Message>;
}>;

export function ChatRoomProvider({
	children,
	slug,
	messages: initialState,
}: Props) {
	const [messages, setMessages] = useState(initialState);

	const addMessage = useCallback((newMessage: Message) => {
		setMessages((curr) => [...curr, newMessage]);
	}, []);

	const value = useMemo(
		() => ({
			messages,
			addMessage,
		}),
		[addMessage, messages],
	);

	useEffect(() => {
		const channel = pusher.subscribe(`private-chat-room__${slug}`);

		channel.bind("new-chat-message", addMessage);

		return () => {
			pusher.unsubscribe(`private-chat-room__${slug}`);
		};
	}, [addMessage, slug]);

	return (
		<ChatRoomContext.Provider value={value}>
			{children}
		</ChatRoomContext.Provider>
	);
}

export const useChatRoom = (): ChatRoomContextType =>
	useContext(ChatRoomContext);
