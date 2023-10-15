import "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		typedRoutes: true,
		serverActions: true,
	},
};

export default nextConfig;
