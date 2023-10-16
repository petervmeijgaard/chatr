import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { api } from "@/trpc/server";
import { CreateChatRoomDialog } from "./_components/create-chat-room-dialog";
import { ChatRoomCard } from "./_components/chat-room-card";

export default async function Page() {
	const chatRooms = await api.chatRoom.listChatRooms.query();

	return (
		<>
			<header className="flex flex-row place-content-between">
				<h1 className="text-3xl font-bold">Select a chatroom</h1>

				<div className="flex flex-row items-center gap-4">
					<SignedOut>
						<Button asChild>
							<SignInButton />
						</Button>
					</SignedOut>
					<SignedIn>
						<CreateChatRoomDialog />

						<UserButton afterSignOutUrl="/chat" />
					</SignedIn>
				</div>
			</header>
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
				{chatRooms.map((chatRoom) => (
					<ChatRoomCard {...chatRoom} key={chatRoom.id} />
				))}

				{!chatRooms.length && <div>No chatrooms found!</div>}
			</div>
		</>
	);
}
