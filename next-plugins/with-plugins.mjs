/**
 *
 * @param plugins {*[]}
 * @param nextConfig
 * @return {*}
 */
export const withPlugins = (plugins = [], nextConfig = {}) =>
	plugins.reduce((config, plugin) => plugin(config), nextConfig);

export default withPlugins;
