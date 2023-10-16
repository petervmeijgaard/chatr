import { useEffect, useState } from "react";
import { Channel } from "pusher-js";
import { pusher } from "@/client/pusher";

export const usePusherChannel = (channelName: string) => {
	const [channel, setChannel] = useState<Channel>();

	useEffect(() => {
		const _channel = pusher.subscribe(channelName);

		setChannel(_channel);

		return () => pusher.unsubscribe(channelName);
	}, [channelName]);

	return channel;
};
