///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Stop", async (assert) => {
	const $target1 = getTarget();

	assert.expect(8);
	/* Ensure an error isn't thrown when "stop" is called on a $target that isn't animating. */
	Velocity($target1, "stop");
	Velocity($target1, defaultProperties, defaultOptions);
	Velocity($target1, {top: 0}, defaultOptions);
	Velocity($target1, {width: 0}, defaultOptions);
	Velocity($target1, "stop");

	await sleep(1);
	/* Ensure "stop" has removed all queued animations. */
	/* We're using the element's queue length as a proxy. 0 and 1 both mean that the element's queue has been cleared -- a length of 1 just indicates that the animation is in progress. */
	//assert.equal(isEmptyObject(Data($target1).queueList), true, "Queue cleared.");

	// Case we stop halfway
	const $target2 = getTarget();
	Velocity($target2, {width: 0}, defaultOptions);

	await sleep(150);
	Velocity($target2, "stop");

	/* End result of the animation should be applied */
	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target2, "width") as string), parseFloat($target2.style.width) as number / 2, "Standard end value width was set.");

	Velocity($target2, {opacity: 0}, Object.assign({}, defaultOptions, {delay: 1000}));
	await sleep(defaultOptions.duration as number / 2);

	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "opacity") as string), 1, "Should not have started animation with delay.");
	const $target3 = getTarget();
	Velocity($target3, {opacity: 0}, Object.assign({}, defaultOptions, {queue: "test"}));
	Velocity($target3, "stop");

	await sleep(defaultOptions.duration as number);

	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target3, "opacity") as string), 1, "Should have not stopped animation with queue.");

	const $target4 = getTarget();
	Velocity($target4, {opacity: 0}, Object.assign({}, defaultOptions, {queue: "test"}));
	Velocity($target4, "stop", "test");

	await sleep(defaultOptions.duration as number);

	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target4, "opacity") as string), 1, "Should have stopped animation with queue.");

	const $target5 = getTarget();
	Velocity($target5, {opacity: 0}, defaultOptions);
	Velocity($target5, {width: "500px"}, defaultOptions);
	Velocity($target5, "stop");

	await sleep(defaultOptions.duration as number);

	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target5, "opacity") as string), 1, "Should have stopped all animations and have initial opacity.");
	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target5, "width") as string), 1, "Should have stopped all animations and have initial width.");

	const $target6 = getTarget();
	Velocity($target6, {opacity: 0}, Object.assign({}, defaultOptions, {queue: "test"}));
	Velocity($target6, {width: "500px"}, Object.assign({}, defaultOptions, {queue: "test"}));
	Velocity($target6, "stop", "test");

	await sleep(defaultOptions.duration as number);

	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target6, "opacity") as string), 1, "Should have stopped all animations with queue and have initial opacity.");
	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target6, "width") as string), 1, "Should have stopped all animations with queue and have initial width.");
});
