"use client";

import { PusherProvider as BasePusherProvider } from "@vivid-web/pusher-react";
import { pusher } from "@/client/pusher";
import { PropsWithChildren } from "react";

export function PusherProvider({ children }: PropsWithChildren) {
	return <BasePusherProvider client={pusher}>{children}</BasePusherProvider>;
}
