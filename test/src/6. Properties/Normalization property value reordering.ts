///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("GenericReordering", function(assert) {

	function genericReordering(element: HTMLorSVGElement, propertyValue?: string): string | void {
		if (propertyValue === undefined) {
			propertyValue = Velocity(element, "style", "textShadow");
			const split = propertyValue.split(/\s/g),
				firstPart = split[0];
			let newValue = "";

			if (Velocity.CSS.ColorNames[firstPart]) {
				split.shift();
				split.push(firstPart);
				newValue = split.join(" ");
			} else if (firstPart.match(/^#|^hsl|^rgb|-gradient/)) {
				const matchedString = propertyValue.match(/(hsl.*\)|#[\da-fA-F]+|rgb.*\)|.*gradient.*\))\s/g)[0];

				newValue = propertyValue.replace(matchedString, "") + " " + matchedString.trim();
			} else {
				newValue = propertyValue;
			}
			return newValue;
		}
	}

	Velocity("registerNormalization", Element, "genericReordering", genericReordering);

	let tests = [
		{
			test: "hsl(16, 100%, 66%) 1px 1px 1px",
			result: "1px 1px 1px hsl(16, 100%, 66%)",
		}, {
			test: "-webkit-linear-gradient(red, yellow) 1px 1px 1px",
			result: "1px 1px 1px -webkit-linear-gradient(rgba(255,0,0,1), rgba(255,255,0,1))",
		}, {
			test: "-o-linear-gradient(red, yellow) 1px 1px 1px",
			result: "1px 1px 1px -o-linear-gradient(rgba(255,0,0,1), rgba(255,255,0,1))",
		}, {
			test: "-moz-linear-gradient(red, yellow) 1px 1px 1px",
			result: "1px 1px 1px -moz-linear-gradient(rgba(255,0,0,1), rgba(255,255,0,1))",
		}, {
			test: "linear-gradient(red, yellow) 1px 1px 1px",
			result: "1px 1px 1px linear-gradient(rgba(255,0,0,1), rgba(255,255,0,1))",
		}, {
			test: "red 1px 1px 1px",
			result: "1px 1px 1px rgba(255,0,0,1)",
		}, {
			test: "#000000 1px 1px 1px",
			result: "1px 1px 1px rgba(0,0,0,1)",
		}, {
			test: "rgb(0, 0, 0) 1px 1px 1px",
			result: "1px 1px 1px rgba(0,0,0,1)",
		}, {
			test: "rgba(0, 0, 0, 1) 1px 1px 1px",
			result: "1px 1px 1px rgba(0,0,0,1)",
		}, {
			test: "1px 1px 1px rgb(0, 0, 0)",
			result: "1px 1px 1px rgba(0,0,0,1)",
		},
	];

	for (let test of tests) {
		let element = getTarget();

		element.velocity("style", "textShadow", test.test);
		assert.equal(element.velocity("style", "genericReordering"), test.result, test.test);
	}

});
