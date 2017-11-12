///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("GenericReordering", function (assert) {

	let tests = [
		{
			test: "hsl(16, 100%, 66%) 1px 1px 1px",
			result: "1px 1px 1px hsl(16, 100%, 66%)",
		},
		{
			test: "-webkit-linear-gradient(red, yellow) 1px 1px 1px",
			result: "1px 1px 1px -webkit-linear-gradient(red, yellow)",
		},
		{
			test: "-o-linear-gradient(red, yellow) 1px 1px 1px",
			result: "1px 1px 1px -o-linear-gradient(red, yellow)",
		},
		{
			test: "-moz-linear-gradient(red, yellow) 1px 1px 1px",
			result: "1px 1px 1px -moz-linear-gradient(red, yellow)",
		},
		{
			test: "linear-gradient(red, yellow) 1px 1px 1px",
			result: "1px 1px 1px linear-gradient(red, yellow)",
		},
		{
			test: "red 1px 1px 1px",
			result: "1px 1px 1px red",
		},
		{
			test: "#000000 1px 1px 1px",
			result: "1px 1px 1px #000000",
		},
		{
			test: "rgb(0, 0, 0) 1px 1px 1px",
			result: "1px 1px 1px rgb(0, 0, 0)",
		},
		{
			test: "rgba(0, 0, 0) 1px 1px 1px",
			result: "1px 1px 1px rgba(0, 0, 0)",
		},
		{
			test: "1px 1px 1px rgb(0, 0, 0)",
			result: "1px 1px 1px rgb(0, 0, 0)",
		},
	]

	for (let test of tests) {

		let result = (Velocity.CSS as any).Normalizations.textShadow(null, test.test)
		assert.equal(test.result, result);

	}

});
