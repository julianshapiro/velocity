///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.todo("Forcefeeding", function(assert) {
	/* Note: Start values are always converted into pixels. W test the conversion ratio we already know to avoid additional work. */
	let testStartWidth = "1rem",
		testStartWidthToPx = "16px",
		testStartHeight = "10px";

	var $target = getTarget();
	Velocity($target, {
		width: [100, "linear", testStartWidth],
		height: [100, testStartHeight],
		opacity: [defaultProperties.opacity as any, "easeInQuad"]
	});

	assert.equal(Data($target).cache.width, parseFloat(testStartWidthToPx), "Forcefed value #1 passed to tween.");
	assert.equal(Data($target).cache.height, parseFloat(testStartHeight), "Forcefed value #2 passed to tween.");
	assert.equal(Data($target).cache.opacity, defaultStyles.opacity, "Easing was misinterpreted as forcefed value.");
});
