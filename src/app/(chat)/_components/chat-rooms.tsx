"use client";

import { useCallback, useState } from "react";
import { ChatRoomCard } from "@/app/(chat)/_components/chat-room-card";
import { Room } from "@/server/db/schema";
import { usePusherChannel } from "@/hooks/use-pusher-channel";
import { usePusherEvent } from "@/hooks/use-pusher-event";

type Props = {
	rooms: Array<Room>;
};

export function ChatRooms({ rooms: initialState }: Props) {
	const channel = usePusherChannel("chat-rooms");

	const [chatRooms, setChatRooms] = useState<Array<Room>>(initialState);

	const addChatRoom = useCallback((chatRoom: Room) => {
		setChatRooms((curr) => [...curr, chatRoom]);
	}, []);

	const removeChatRoom = useCallback((chatRoom: Room) => {
		setChatRooms((curr) => curr.filter((item) => item.id !== chatRoom.id));
	}, []);

	usePusherEvent(channel, "chat-room-created", addChatRoom);

	usePusherEvent(channel, "chat-room-deleted", removeChatRoom);

	if (!chatRooms.length) {
		return <div>No chatrooms found!</div>;
	}

	return (
		<>
			{chatRooms.map((chatRoom) => (
				<ChatRoomCard {...chatRoom} key={chatRoom.id} />
			))}
		</>
	);
}
