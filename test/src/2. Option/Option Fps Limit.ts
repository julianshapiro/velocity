///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test('Global Fps Limit', async assert => {
	const testFrame = frameRate => {
		let counter = 0;
		Velocity.defaults.fpsLimit = frameRate;
		/**
		 * Test if the frame rate is assigned succesfully
		 */
		assert.equal(frameRate, Velocity.defaults.fpsLimit);
		return Velocity($target, defaultProperties, {
			duration: asyncCheckDuration,
			progress: () => {
				counter++;
			}
		}).then(() => counter);
	};
	const $target = getTarget();
	assert.expect(8);
	/**
	 * Test if the limit is working for 60, 30, 15 and 5 fps
	 */
	assert.close(await testFrame(60), 8, 2, 'Testing 60fps');
	assert.close(await testFrame(30), 6, 1, 'Testing 30fps');
	assert.close(await testFrame(15), 4, 1, 'Testing 15fps');
	assert.close(await testFrame(5), 1, 1, 'Testing 5fps');
	Velocity.defaults.fpsLimit = 60;
});
