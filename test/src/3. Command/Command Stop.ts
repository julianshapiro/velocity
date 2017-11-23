///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.todo("Stop", function(assert) {
	var done = assert.async(2),
			$target1 = getTarget();

	assert.expect(4);
	/* Ensure an error isn't thrown when "stop" is called on a $target that isn't animating. */
	Velocity($target1, "stop");
	Velocity($target1, defaultProperties, defaultOptions);
	Velocity($target1, {top: 0}, defaultOptions);
	Velocity($target1, {width: 0}, defaultOptions);
	Velocity($target1, "stop");

	/* Ensure "stop" has removed all queued animations. */
	/* We're using the element's queue length as a proxy. 0 and 1 both mean that the element's queue has been cleared -- a length of 1 just indicates that the animation is in progress. */
	setTimeout(function() {
		assert.equal(!Data($target1).queueList || !Object.keys(Data($target1).queueList).length, true, "Queue cleared.");
		done();
	}, 1);

	var $target2 = getTarget();
	Velocity($target2, {opacity: 0}, Object.assign({}, defaultOptions, {delay: 1000}));
	Velocity($target2, {width: 0}, defaultOptions);
	Velocity($target2, "stop");

	var $target3 = getTarget();
	Velocity($target3, {opacity: 0}, Object.assign({}, defaultOptions, {delay: 1000}));
	Velocity($target3, {width: 0}, defaultOptions);
	Velocity($target3, {width: 100}, defaultOptions);
	Velocity($target3, "stop");

	setTimeout(function() {
		assert.equal(Data($target2).cache.opacity, undefined, "Active call stopped.");
		assert.notEqual(Data($target2).cache.width, undefined, "Next queue item started.");

		assert.equal(!Data($target3).queueList || !Object.keys(Data($target3).queueList), true, "Full queue array cleared.");

		done();
	}, asyncCheckDuration);
});
