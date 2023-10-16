import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RouterOutputs } from "@/trpc/shared";
import { cn } from "@/lib/utils";

type Props = RouterOutputs["chatRoom"]["listChatRooms"][number];

function ChatRoomCard({ title, description, slug }: Props) {
	return (
		<Card>
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
	);
}

function ProjectCardSkeleton() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span className={cn("flex-1 animate-pulse bg-muted")}>&nbsp;</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Button disabled className={cn("w-[120px] animate-pulse bg-muted")}>
					&nbsp;
				</Button>
			</CardContent>
		</Card>
	);
}

ChatRoomCard.Skeleton = ProjectCardSkeleton;

export { ChatRoomCard };
