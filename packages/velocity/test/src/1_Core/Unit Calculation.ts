/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {asyncTests, getPropertyValue, getTarget, sleep} from "../utilities";
import "./_module";

QUnit.test("Unit Calculation", (assert) => {
	// TODO: Add code and tests for operators - probably using calc() internally
	//	/* Standard properties with operators. */
	//	var testIncrementWidth = "5px",
	//			testDecrementOpacity = 0.25,
	//			testMultiplyMarginBottom = 4,
	//			testDivideHeight = 2;
	//
	//	var $target2 = getTarget();
	//	Velocity($target2, {width: "+=" + testIncrementWidth, opacity: "-=" + testDecrementOpacity, marginBottom: "*=" + testMultiplyMarginBottom, height: "/=" + testDivideHeight});
	//	setTimeout(function() {
	//
	//		assert.equal(Data($target2).style.width.endValue, defaultStyles.width + parseFloat(testIncrementWidth), "Incremented end value was calculated.");
	//		assert.equal(Data($target2).style.opacity.endValue, defaultStyles.opacity - testDecrementOpacity, "Decremented end value was calculated.");
	//		assert.equal(Data($target2).style.marginBottom.endValue, defaultStyles.marginBottom * testMultiplyMarginBottom, "Multiplied end value was calculated.");
	//		assert.equal(Data($target2).style.height.endValue, defaultStyles.height / testDivideHeight, "Divided end value was calculated.");
	//
	//		done();
	//	}, asyncCheckDuration);

	asyncTests(assert, 2, async (done) => {
		const $target = getTarget();

		Velocity($target, {left: "500px"}, {duration: 10});
		await sleep(100);
		assert.equal(getPropertyValue($target, "left"), "500px", "Finished animated value with given pixels should be the same.");
		Velocity($target, {left: "0px"}, {duration: 10});
		await sleep(100);
		assert.equal(getPropertyValue($target, "left"), "0px", "Finished animated value with 0px should be the same.");

		done();
	});

	//	async(assert, 1, async (done) => {
	//		const $target = getTarget();
	//
	//		Velocity($target, {left: "500px"}, {duration: 10});
	//		await sleep(100);
	//		Velocity($target, {left: "0"}, {duration: 10});
	//		await sleep(100);
	//		assert.equal(getPropertyValue($target, "left"), "0px", "Finished animated value without giving px, but only number as a string should be the same.");
	//
	//		done();
	//	});

	asyncTests(assert, 1, async (done) => {
		const $target = getTarget();

		Velocity($target, {left: "500px"}, {duration: 10});
		await sleep(100);
		Velocity($target, {left: 0}, {duration: 10});
		await sleep(1000);
		assert.equal(getPropertyValue($target, "left"), "0px", "Finished animated value given as number 0 should be the same as 0px.");

		done();
	});

	asyncTests(assert, 2, async (done) => {
		const $target = getTarget();

		Velocity($target, {left: 500}, {duration: 10});
		await sleep(100);
		assert.equal(getPropertyValue($target, "left"), "500px", "Finished animated value with given pixels should be the same.");
		Velocity($target, {left: 0}, {duration: 10});
		await sleep(100);
		assert.equal(getPropertyValue($target, "left"), "0px", "Omitted pixels (px) when given animation should run properly.");

		done();
	});
});
