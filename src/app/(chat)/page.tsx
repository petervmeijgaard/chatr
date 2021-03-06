import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CreateChatRoomDialog } from "./_components/create-chat-room-dialog";
import { Suspense } from "react";
import { ChatRooms } from "./chat-rooms";

export default async function Page() {
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

						<UserButton afterSignOutUrl="/" />
					</SignedIn>
				</div>
			</header>
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
				<Suspense fallback={<ChatRooms.Fallback />}>
					<ChatRooms />
				</Suspense>
			</div>
		</>
	);
}
