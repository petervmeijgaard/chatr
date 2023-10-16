import Pusher from "pusher";
import { env } from "@/env.mjs";

export const pusher = new Pusher({
	key: env.NEXT_PUBLIC_PUSHER_KEY,
	cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
	appId: env.PUSHER_APP_ID,
	secret: env.PUSHER_SECRET,
	useTLS: true,
});
