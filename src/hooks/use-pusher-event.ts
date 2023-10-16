import { Channel } from "pusher-js";
import { useEffect } from "react";

export const usePusherEvent = <Data>(
	channel: Channel | undefined,
	eventName: string,
	callback: (data: Data) => void,
) => {
	useEffect(() => {
		if (channel === undefined) return;

		channel.bind(eventName, callback);

		return () => {
			channel.unbind(eventName, callback);
		};
	}, [callback, channel, eventName]);
};
