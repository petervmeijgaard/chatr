type Props = {
	user: string;
	content: string;
	fromMe: boolean;
};

export function ChatMessage({ user, content, fromMe }: Props) {
	if (!fromMe) {
		return (
			<div>
				<span className="text-sm text-muted-foreground">{user}</span>)
				<div className="rounded rounded-tl-none bg-secondary px-4 py-2 text-secondary-foreground">
					<span>{content}</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-1 self-end">
			<div className="rounded rounded-tr-none bg-primary px-4 py-2 text-primary-foreground">
				<span>{content}</span>
			</div>
		</div>
	);
}
