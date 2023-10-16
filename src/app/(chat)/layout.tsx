import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<main className="container mx-auto flex flex-col gap-4 py-4">
			{children}
		</main>
	);
}
