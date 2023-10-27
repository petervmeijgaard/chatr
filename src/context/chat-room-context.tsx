"use client";

import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { Message } from "@/server/db/schema";
import { useEvent, usePrivateChannel } from "@vivid-web/pusher-react";

type ChatRoomContextType = {
	messages: Array<Message>;
	addMessage: (newMessage: Message) => void;
};

const ChatRoomContext = createContext<ChatRoomContextType>(
	{} as ChatRoomContextType,
);

type Props = PropsWithChildren<{
	hash: string;
	messages: Array<Message>;
}>;

export function ChatRoomProvider({
	children,
	hash,
	messages: initialState,
}: Props) {
	const [messages, setMessages] = useState(initialState);

	const addMessage = useCallback((newMessage: Message) => {
		setMessages((curr) => [...curr, newMessage]);
	}, []);

	const channel = usePrivateChannel(`chat-room__${hash}`);

	useEvent(channel, "new-chat-message", addMessage);

	const value = useMemo(
		() => ({
			messages,
			addMessage,
		}),
		[addMessage, messages],
	);

	return (
		<ChatRoomContext.Provider value={value}>
			{children}
		</ChatRoomContext.Provider>
	);
}

export const useChatRoom = (): ChatRoomContextType =>
	useContext(ChatRoomContext);
