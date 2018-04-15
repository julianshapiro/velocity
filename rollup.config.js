/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

//import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";
import tslint from "rollup-plugin-tslint";
import typescript from "rollup-plugin-typescript2";
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
		typescript(),
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
				file: path.join(pkg.main),
				name: pkg.name,
				format: "umd",
				sourcemap: true
			}, {
				file: pkg.module,
				format: "es",
				sourcemap: true
			}],
		watch: {
			include: "src/**"
		},
		plugins: getPlugins()
	});
}
if (hasTest) {
	tasks.push({
		input: path.join("test", "src", "app.ts"),
		output: [{
				file: path.join("test", "test.js"),
				name: "velocity-test",
				format: "iife",
				sourcemap: true
			}],
		watch: {
			include: "test/src/**"
		},
		plugins: getPlugins()
	});
}

export default tasks;
