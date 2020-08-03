/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

const replace = require("@rollup/plugin-replace");

module.exports = {
	rollup(config, _options) {
		config.plugins.unshift(
			replace({
				__VERSION__: `"${require("../../lerna.json").version}"`,
			}),
		);
		return config;
	},
};
