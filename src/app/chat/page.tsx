import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { api } from "@/trpc/server";
import { CreateChatRoomDialog } from "@/app/chat/_components/create-chat-room-dialog";

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
				{chatRooms.map(({ id, slug, title, description }) => (
					<Card key={id}>
						<CardHeader>
							<CardTitle>{title}</CardTitle>
							{description && <CardDescription>{description}</CardDescription>}
						</CardHeader>
						<CardContent>
							<Button asChild>
								<Link href={`/chat/${slug}`}>Join 5 others</Link>
							</Button>
						</CardContent>
					</Card>
				))}

				{!chatRooms.length && <div>No chatrooms found!</div>}
			</div>
		</>
	);
}
