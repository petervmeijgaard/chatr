"use client";

import { PusherProvider as BasePusherProvider } from "@vivid-web/pusher-react";
import { pusher } from "@/client/pusher";
import { PropsWithChildren } from "react";
import { trpcHeaders } from "@/trpc/headers";

export function PusherProvider({ children }: PropsWithChildren) {
	pusher.connection.bind("connected", () => {
		trpcHeaders.set("X-Socket-Id", pusher.connection.socket_id);
	});

	pusher.connection.bind("disconnected", () => {
		trpcHeaders.delete("X-Socket-Id");
	});

	return <BasePusherProvider client={pusher}>{children}</BasePusherProvider>;
}
