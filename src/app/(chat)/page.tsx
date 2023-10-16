import { api } from "@/trpc/server";
import { PageShell } from "@/app/(chat)/_components/page-shell";
import { ChatRooms } from "@/app/(chat)/_components/chat-rooms";

export default async function Page() {
	const chatRooms = await api.chatRoom.listChatRooms.query();

	return (
		<PageShell>
			<ChatRooms rooms={chatRooms} />
		</PageShell>
	);
}
