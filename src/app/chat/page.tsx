import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { rooms } from "@/db/schema";
import Link from "next/link";
import { SubmitButton } from "./components";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addNewChatRoom } from "./actions";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default async function Page() {
	const result = await db.select().from(rooms).all();

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
						<Dialog>
							<DialogTrigger asChild>
								<Button>Add new room</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add chat room</DialogTitle>
									<DialogDescription>
										Add a new chatroom. Click {"Save changes"} when {"you're"}
										content with your chatroom
									</DialogDescription>
								</DialogHeader>
								<form
									className="flex flex-col gap-4 py-4"
									action={addNewChatRoom}
								>
									<div className="flex flex-col gap-2">
										<Label htmlFor="title">Title</Label>
										<Input id="title" placeholder="My chatroom" name="title" />
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="description">Description</Label>
										<Textarea
											id="description"
											name="description"
											placeholder="My description"
										/>
									</div>
									<SubmitButton type="submit">Save changes</SubmitButton>
								</form>
							</DialogContent>
						</Dialog>
						<UserButton afterSignOutUrl="/chat" />
					</SignedIn>
				</div>
			</header>
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
				{result.map(({ id, slug, title, description }) => (
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

				{!result.length && <div>No chatrooms found!</div>}
			</div>
		</>
	);
}
