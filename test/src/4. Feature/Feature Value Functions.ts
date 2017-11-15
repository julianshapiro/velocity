///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.todo("Value Functions", function(assert) {
	var testWidth = 10;

	var $target1 = getTarget(),
		$target2 = getTarget();

	Velocity([$target1, $target2], {
		width: function(i, total) {
			return (i + 1) / total * testWidth;
		}
	});

	assert.equal(Data($target1).cache.width, parseFloat(testWidth as any) / 2, "Function value #1 passed to tween.");
	assert.equal(Data($target2).cache.width, parseFloat(testWidth as any), "Function value #2 passed to tween.");
});
