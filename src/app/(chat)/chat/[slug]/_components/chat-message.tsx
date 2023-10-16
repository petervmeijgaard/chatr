"use client";

import { RouterOutputs } from "@/trpc/shared";
import { useAuth } from "@clerk/nextjs";

type Props = RouterOutputs["chatRoom"]["getBySlug"]["messages"][number];

export function ChatMessage({ content, userId }: Props) {
	const currentUser = useAuth();

	const isCurrentUser = currentUser.userId === userId;

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
			<div className="rounded rounded-tl-none bg-secondary px-4 py-2 text-secondary-foreground">
				<span>{content}</span>
			</div>
		</div>
	);
}
