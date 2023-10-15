import "./src/env.mjs";
import withPlugins from "./next-plugins/with-plugins.mjs";
import withSentry from "./next-plugins/with-sentry.mjs";

const plugins = [withSentry];

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		typedRoutes: true,
		serverActions: true,
	},
};

export default withPlugins(plugins, nextConfig);
