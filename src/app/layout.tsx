import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import cn from "classnames";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

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
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
