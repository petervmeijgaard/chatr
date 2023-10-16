import { api } from "@/trpc/server";
import { ChatRoomCard } from "./_components/chat-room-card";
import { PageShell } from "@/app/(chat)/_components/page-shell";

export default async function Page() {
	const chatRooms = await api.chatRoom.listChatRooms.query();

	return (
		<PageShell>
			{chatRooms.map((chatRoom) => (
				<ChatRoomCard {...chatRoom} key={chatRoom.id} />
			))}

			{!chatRooms.length && <div>No chatrooms found!</div>}
		</PageShell>
	);
}
