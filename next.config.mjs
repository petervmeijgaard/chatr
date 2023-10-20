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
	eslint: {
		// Do not lint during builds. This is being done in a separate GitHub Action
		ignoreDuringBuilds: true
	},
	typescript: {
		// Do not type check during builds. This is being done in a separate GitHub action
		ignoreBuildErrors: true,
	}
};

export default withPlugins(plugins, nextConfig);
