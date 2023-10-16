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

type Props = RouterOutputs["chatRoom"]["listChatRooms"][number];

export function ChatRoomCard({ title, description, slug }: Props) {
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
