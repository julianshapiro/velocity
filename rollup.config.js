/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import copy from "rollup-plugin-copy";
import resolve from "rollup-plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";
import tsc from "rollup-plugin-tsc";
import tslint from "rollup-plugin-tslint";
import typescript from "rollup-plugin-typescript2";
import uglify from "rollup-plugin-uglify";
import path from "path";

const pkg = require("./package.json"),
		libraryName = "velocity",
		tasks = [],
		hasBuild = process.env.BUILD === "true",
		hasMinify = process.env.MINIFY === "true",
		hasTest = process.env.TEST === "true";

function getPlugins() {
	return [
		tslint(),
		resolve(),
		tsc(require("./src/tsconfig.json")),
//		typescript({
//			verbosity: 2,
//			rollupCommonJSResolveHack: true,
//			include: ["*(\.d)?\.tsx?", "**/*(\.d)?\.tsx?"]
//		}),
		babel({
			exclude: "node_modules/**"
		}),
		commonjs(),
		sourceMaps()
	];
}

if (hasBuild) {
	tasks.push({
		input: path.join("src", "app.ts"),
		output: [{
				file: path.join(pkg.main.replace(".min", "")),
				name: pkg.name,
				format: "umd",
				sourcemap: true
			}],
		watch: {
			include: "src/**"
		},
		plugins: getPlugins()
	});
}
//if (hasMinify) {
//	tasks.push({
//		input: path.join("src", "app.ts"),
//		output: [{
//				file: path.join(pkg.main),
//				name: pkg.name,
//				format: "umd",
//				sourcemap: false
//			}, {
//				file: pkg.module,
//				format: "es",
//				sourcemap: false
//			}],
//		plugins: [
//			...getPlugins(),
//			uglify()
//		]
//	});
//}
if (hasTest) {
	tasks.push({
		input: path.join("test", "src", "app.ts"),
		output: [{
				file: path.join("test", "test.js"),
				name: "velocity-test",
				format: "iife",
				sourcemap: true
			}],
		plugins: [
			copy({
//				"node_modules/qunit-assert-close/qunit-assert-close.js": "test/qunit-assert-close.js",
				"node_modules/qunit/qunit/qunit.css": "test/qunit.css",
				"node_modules/qunit/qunit/qunit.js": "test/qunit.js",
				verbose: true
			}),
			...getPlugins()
		]
	});
}

export default tasks;
