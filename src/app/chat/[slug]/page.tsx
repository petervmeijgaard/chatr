import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { auth, UserButton } from "@clerk/nextjs";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteChatRoom } from "./actions";
import { Trash } from "lucide-react";

type Props = {
	params: {
		slug: string;
	};
};

export default async function ChatRoom({ params }: Props) {
	const { userId } = auth();
	const [chatRoom] = await db
		.select()
		.from(rooms)
		.where(eq(rooms.slug, params.slug));

	if (!chatRoom) {
		return notFound();
	}

	return (
		<>
			<header className="flex flex-row place-content-between">
				<h1 className="text-3xl font-bold">
					Welcome to chatroom {`"${chatRoom.title}"`}
				</h1>
				<div className="flex flex-row items-center gap-4">
					<Button asChild>
						<Link href="/chat" className="flex flex-row gap-2">
							<ChevronLeft />
							Back to chat rooms
						</Link>
					</Button>
					{userId === chatRoom.userId && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="destructive" className="flex flex-row gap-2">
									<Trash />
									Delete room
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										the chat room and all messages.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<form action={deleteChatRoom}>
										<Input
											type="hidden"
											value={chatRoom.slug ?? ""}
											id="slug"
											name="slug"
										/>
										<AlertDialogAction asChild>
											<Button type="submit">Continue</Button>
										</AlertDialogAction>
									</form>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
					<UserButton afterSignOutUrl="/chat" />
				</div>
			</header>
			<div className="flex flex-1 flex-col">
				<div className="flex flex-1 flex-col place-items-start gap-6 rounded-md rounded-b-none border border-b-0 p-6">
					<div>
						<span className="text-sm text-muted-foreground">J. Doe</span>
						<div className="rounded rounded-tl-none bg-secondary px-4 py-2 text-secondary-foreground">
							Test
						</div>
					</div>
					<div className="flex flex-col gap-1 self-end">
						<div className="rounded rounded-tr-none bg-primary px-4 py-2 text-primary-foreground">
							Hello
						</div>
					</div>
				</div>
				<form className="flex flex-row items-start gap-2 rounded rounded-t-none border p-4">
					<Input placeholder="Enter your message..." />
					<Button>Submit</Button>
				</form>
			</div>
		</>
	);
}
