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
import { usePusherChannel } from "@/hooks/use-pusher-channel";
import { usePusherEvent } from "@/hooks/use-pusher-event";

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

	const channel = usePusherChannel(`private-chat-room__${slug}`);

	usePusherEvent(channel, "new-chat-message", addMessage);

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
