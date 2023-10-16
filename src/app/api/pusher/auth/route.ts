import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { pusher } from "@/server/pusher";

const handler = async (req: NextRequest) => {
	const user = await currentUser();

	const data = await req.formData();

	const socketId = data.get("socket_id");
	const channel = data.get("channel_name");

	if (!user) {
		return new NextResponse("Forbidden", {
			status: 403,
			statusText: "Forbidden",
		});
	}

	if (typeof socketId !== "string") {
		return new NextResponse("Invalid socket ID given", {
			status: 400,
			statusText: "Bad Request",
		});
	}

	if (typeof channel !== "string") {
		return new NextResponse("Invalid channel given", {
			status: 400,
			statusText: "Bad Request",
		});
	}

	const authResponse = pusher.authorizeChannel(socketId, channel);

	return NextResponse.json(authResponse);
};

export { handler as POST };
