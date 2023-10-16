import { PageShell } from "@/app/(chat)/_components/page-shell";
import { ChatRoomCard } from "@/app/(chat)/_components/chat-room-card";

export default function Loading() {
	return (
		<PageShell>
			<ChatRoomCard.Skeleton />
			<ChatRoomCard.Skeleton />
			<ChatRoomCard.Skeleton />
		</PageShell>
	);
}
