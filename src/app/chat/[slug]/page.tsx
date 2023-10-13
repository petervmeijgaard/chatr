import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";

type Props = {
	params: {
		slug: string;
	};
};

export default async function ChatRoom({ params }: Props) {
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
				<Button asChild>
					<Link href="/chat" className="flex flex-row gap-2">
						<ChevronLeft />
						Back to chat rooms
					</Link>
				</Button>
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
