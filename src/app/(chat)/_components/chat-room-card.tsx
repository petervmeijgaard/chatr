import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Room as Props } from "@/server/db/schema";

function ChatRoomCard({ title, description, slug }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>
				<Button asChild>
					<Link href={`/${slug}`}>Join 5 others</Link>
				</Button>
			</CardContent>
		</Card>
	);
}

function ChatRoomCardSkeleton() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span className="flex-1 animate-pulse bg-muted">&nbsp;</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Button disabled className="w-[120px] animate-pulse bg-muted">
					&nbsp;
				</Button>
			</CardContent>
		</Card>
	);
}

ChatRoomCard.Skeleton = ChatRoomCardSkeleton;

export { ChatRoomCard };
