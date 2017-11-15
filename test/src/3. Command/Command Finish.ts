///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.todo("Finish / FinishAll", function(assert) {
	var done = assert.async(2),
		$target1 = getTarget();

	assert.expect(9);
	/* Ensure an error isn't thrown when "finish" is called on a $target that isn't animating. */
	Velocity($target1, "finish");

	/* Animate to defaultProperties, and then "finish" to jump to the end of it. */
	Velocity($target1, defaultProperties, Object.assign({}, defaultOptions, {delay: 1000}));
	Velocity($target1, "finish");

	setTimeout(function() {
		/* Ensure "finish" has removed all queued animations. */
		/* We're using the element's queue length as a proxy. 0 and 1 both mean that the element's queue has been cleared -- a length of 1 just indicates that the animation is in progress. */
		assert.equal(!Data($target1).queueList, true, "Queue cleared.");

		/* End result of the animation should be applied */
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "width") as string), defaultProperties.width, "Standard end value #1 was set.");
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "opacity") as string), defaultProperties.opacity, "Standard end value #2 was set.");

		done();
	}, asyncCheckDuration);

	var $target2 = getTarget();
	Velocity($target2, {opacity: 0}, Object.assign({}, defaultOptions, {delay: 1000}));
	Velocity($target2, {width: 0}, defaultOptions);
	Velocity($target2, "finish");

	var $target3 = getTarget();
	Velocity($target3, {opacity: 0, width: 50}, Object.assign({}, defaultOptions, {delay: 1000}));
	Velocity($target3, {width: 0}, defaultOptions);
	Velocity($target3, {width: 100}, defaultOptions);
	Velocity($target3, "finish", true);

	var $target4 = getTarget();
	Velocity($target4, {opacity: 0, width: 50}, Object.assign({}, defaultOptions, {delay: 1000}));
	Velocity($target4, {width: 0}, defaultOptions);
	Velocity($target4, {width: 100}, defaultOptions);
	Velocity($target4, "finishAll", true);

	setTimeout(function() {
		assert.equal(Data($target2).cache.opacity, undefined, "Active call stopped.");
		assert.notEqual(Data($target2).cache.width, undefined, "Next queue item started.");

		assert.equal(!Data($target3) || !Data($target3).queueList, true, "Full queue array cleared.");
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target3, "width") as string), 50, "Just the first call's width was applied.");

		assert.equal(!Data($target4) || !Data($target4).queueList, true, "Full queue array cleared.");
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target4, "width") as string), 100, "The last call's width was applied.");

		done();
	}, asyncCheckDuration);
});
