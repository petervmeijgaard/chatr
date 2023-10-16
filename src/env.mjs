import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	shared: {
		NODE_ENV: z.enum(["development", "test", "production"]),
	},
	server: {
		DATABASE_URL: z.string().url(),
		DATABASE_AUTH_TOKEN: z.string().min(1),
		CLERK_SECRET_KEY: z.string().min(1),
		PUSHER_APP_ID: z.string().min(1),
		PUSHER_SECRET: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_PUSHER_KEY: z.string().min(1),
		NEXT_PUBLIC_PUSHER_CLUSTER: z.string().min(1),
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
	},
	experimental__runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
		NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
	},
});
