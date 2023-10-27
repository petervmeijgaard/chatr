import { api } from "@/trpc/server";
import { ChatRooms as ClientChatRooms } from "./_components/chat-rooms";
import { ChatRoomCard } from "./_components/chat-room-card";

async function ChatRooms() {
	const chatRooms = await api.chatRoom.listChatRooms.query();

	return <ClientChatRooms rooms={chatRooms} />;
}

function ChatRoomsFallback() {
	return (
		<>
			<ChatRoomCard.Skeleton />
			<ChatRoomCard.Skeleton />
			<ChatRoomCard.Skeleton />
		</>
	);
}

ChatRooms.Fallback = ChatRoomsFallback;

export { ChatRooms };
