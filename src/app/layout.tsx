import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import cn from "classnames";
import { ThemeProvider } from "@/components/theme-provider";
import { TRPCReactProvider } from "@/trpc/react";

import { ClerkProvider } from "@clerk/nextjs";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Chatr",
	description: "Chat with your friends!",
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={cn(inter.className, "flex min-h-screen min-w-full")}>
					<TRPCReactProvider headers={headers()}>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							{children}
						</ThemeProvider>
					</TRPCReactProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
