import { RouterOutputs } from "@/trpc/shared";
import { auth, clerkClient } from "@clerk/nextjs";

type Props =
	RouterOutputs["chatRoom"]["getBySlugWithMessages"]["messages"][number];

export async function ChatMessage({ content, userId }: Props) {
	const currentUser = auth();
	const user = await clerkClient.users.getUser(userId);

	const isCurrentUser = currentUser.userId === userId;
	const username = user.username ?? `${user.firstName} ${user.lastName}`;

	if (isCurrentUser) {
		return (
			<div className="flex flex-col gap-1 self-end">
				<div className="rounded rounded-tr-none bg-primary px-4 py-2 text-primary-foreground">
					<span>{content}</span>
				</div>
			</div>
		);
	}

	return (
		<div>
			{username && (
				<span className="text-sm text-muted-foreground">{username}</span>
			)}
			<div className="rounded rounded-tl-none bg-secondary px-4 py-2 text-secondary-foreground">
				<span>{content}</span>
			</div>
		</div>
	);
}
