/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

const commonJS = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const path = require("path");

module.exports = {
	rollup(config, options) {
		if (options.format === "umd") {
			if (options.env === "development") {
				config.output.file = "/dev/null";
			} else {
				config.output.file = "./dist/index.js"
				config.output.esModule = false;
				config.external = false;

				const oldResolve = config.plugins.findIndex((plugin) => plugin && plugin.name === "node-resolve");
				config.plugins.splice(
					oldResolve,
					1,
					resolve({
						browser: true,
						extensions: [".mjs", ".js", ".jsx", ".json", ".node"],
						preferBuiltins: false,
						rootDir: path.join(process.cwd(), "..", ".."),
						dedupe: ["@velocityjs"],
					}),
				);

				// const oldCommonJS = config.plugins.findIndex((plugin) => plugin && plugin.name === "commonjs");
				// config.plugins.splice(
				// 	oldCommonJS,
				// 	1,
				// 	commonJS(),
				// );

				console.log("config", config)
				console.log("options", options)
			}
		}

		return config;
	},
};
