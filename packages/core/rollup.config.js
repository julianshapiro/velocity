/*
 * velocity-animate (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import fs from "fs";
import path from "path";
import process from "process";
import babel from "rollup-plugin-babel";
import license from "rollup-plugin-license";
import sourceMaps from "rollup-plugin-sourcemaps";
//import stripBanner from "rollup-plugin-strip-banner";
import tslint from "rollup-plugin-tslint";
import typescript from "rollup-plugin-typescript2";
import {terser} from "rollup-plugin-terser";

// Copy of https://github.com/mjeanroy/rollup-plugin-strip-banner without a fixed file extension check.
// Waiting for https://github.com/mjeanroy/rollup-plugin-strip-banner/pull/129
// MIT License Copyright (c) 2016 Mickael Jeanroy
import rollupPluginUtils from "rollup-pluginutils";
import extractBanner from "extract-banner";
import MagicString from "magic-string";

function stripBanner(options = {}) {
	const filter = rollupPluginUtils.createFilter(options.include, options.exclude);

	return {
		transform(code, id) {
			if (!filter(id)) {
				return;
			}
			// Remove banner for JS files only
			const ext = path.extname(id).toLowerCase(),
					banner = extractBanner(code);
			if (!banner || (ext !== '.js' && ext !== '.jsx' && ext !== '.ts' && ext !== '.tsx')) {
				return;
			}
			// Use a magicString: it will generate the sourceMap at the end.
			const magicString = new MagicString(code),
					pos = code.indexOf(banner);
			// Remove the banner with the magicString instance.
			magicString.remove(pos, pos + banner.length);
			// Trim left to remove blank spaces.
			magicString.trimStart();
			const result = {code: magicString.toString()};
			if (options.sourceMap !== false) {
				result.map = magicString.generateMap({hires: true});
			}

			return result;
		}
	};
}
// End of rollup-plugin-strip-banner

const pkg = require("./package.json"),
		libraryName = "velocity",
		tasks = [],
		hasBuild = process.env.BUILD === "true",
		hasMinify = process.env.MINIFY === "true",
		hasTest = process.env.TEST === "true",
		typescriptOptions = {
//			verbosity: 2,
			clean: true
		},
		terserOptions = {
			output: {
				comments: /velocity-animate \(C\)/
			}
		};

function getPlugins(tsconfig) {
	return [
		license({
			banner: "velocity-animate (C) 2014-2017 Julian Shapiro.\n\n Licensed under the MIT license. See LICENSE file in the project root for details."
		}),
		stripBanner(),
		typescript(Object.assign({}, typescriptOptions, {
			tsconfig
		})),
		babel({
			exclude: ["node_modules/**"]
		})
	];
}

if (hasBuild || hasMinify) {
	fs.writeFileSync("version.ts", `/*\n * velocity-animate (C) 2014-2017 Julian Shapiro.\n *\n * Licensed under the MIT license. See LICENSE file in the project root for details.\n */\n\n// Automatically generated\nexport const VERSION = "${pkg.version}";\n`);

	tasks.push({
		input: "src/velocity.ts",
		context: "window",
		output: [{
				file: pkg.main.replace(".min", ""),
				name: "Velocity",
				format: "umd",
				sourcemap: true
			}, {
				file: pkg.module,
				name: pkg.name,
				format: "es",
				sourcemap: true
			}],
		watch: {
			include: "src/**"
		},
		plugins: [
			tslint(),
			...getPlugins("src/tsconfig.json"),
			sourceMaps()
		]
	}, {
		input: "src-ui/velocity.ui.ts",
		external: ["velocity-animate"],
		output: [{
				file: pkg.main.replace(".min", ".ui"),
				format: "umd",
				sourcemap: true,
				globals: {
					"velocity-animate": "Velocity"
				}
			}],
		watch: {
			include: "src-ui/**"
		},
		plugins: [
			tslint(),
			...getPlugins("src-ui/tsconfig.json"),
			sourceMaps()
		]
	});
	if (hasMinify) {
		tasks.push({
			input: "src/velocity.ts",
			context: "window",
			output: [{
					file: pkg.main,
					name: "Velocity",
					format: "umd",
					sourcemap: false
				}],
			plugins: [
				...getPlugins("src/tsconfig.json"),
				terser(terserOptions)
			]
		}, {
			input: "src-ui/velocity.ui.ts",
			external: ["velocity-animate"],
			output: [{
					file: pkg.main.replace(".min", ".ui.min"),
					format: "umd",
					sourcemap: false,
					globals: {
						"velocity-animate": "Velocity"
					}
				}],
			plugins: [
				...getPlugins("src-ui/tsconfig.json"),
				terser(terserOptions)
			]
		});
	}
}
if (hasTest) {
	tasks.push({
		input: "test/src/test.ts",
		external: ["qunit", "velocity-animate"],
		context: "window",
		output: [{
				file: "test/test.js",
				format: "umd",
				sourcemap: true,
				globals: {
					"velocity-animate": "Velocity",
					"qunit": "QUnit"
				}
			}],
		plugins: [
			tslint(),
			...getPlugins("test/src/tsconfig.json", true),
			sourceMaps()
		]
	});
}

export default tasks;
