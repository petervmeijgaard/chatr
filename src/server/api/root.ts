import { createTRPCRouter } from "./trpc";
import { chatRoomRouter } from "./routers/chat-room";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	chatRoom: chatRoomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
