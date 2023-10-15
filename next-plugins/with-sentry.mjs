import { withSentryConfig as nextSentry } from "@sentry/nextjs";

const sentryWebpackPluginOptions = {
	silent: true,
	org: "vivid-websolutions",
	project: "chatr",
};

const sentryOptions = {
	// Upload a larger set of source maps for prettier stack traces (increases build time)
	widenClientFileUpload: true,

	// Transpiles SDK to be compatible with IE11 (increases bundle size)
	transpileClientSDK: true,

	// Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
	tunnelRoute: "/monitoring",

	// Hides source maps from generated client bundles
	hideSourceMaps: true,

	// Automatically tree-shake Sentry logger statements to reduce bundle size
	disableLogger: true,
};

/** @param nextConfig {import('next').NextConfig} */
export const withSentry = (nextConfig) =>
	nextSentry(nextConfig, sentryWebpackPluginOptions, sentryOptions);

export default withSentry;
