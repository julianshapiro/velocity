///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Delay", function(assert) {
	const testDelay = 250;

	async(assert, 1, function(done) {
		const start = getNow();

		Velocity(getTarget(), defaultProperties, {
			duration: defaultOptions.duration,
			delay: testDelay,
			begin: function(elements, activeCall) {
				assert.close(getNow() - start, testDelay, 32, "Delayed calls start after the correct delay.");
				done();
			}
		});
	});

	async(assert, 1, function(done) {
		const start = getNow();

		Velocity(getTarget(), defaultProperties, {
			duration: defaultOptions.duration,
			delay: testDelay
		})
			.velocity(defaultProperties, {
				duration: defaultOptions.duration,
				delay: testDelay,
				begin: function(elements, activeCall) {
					assert.close(getNow() - start, (testDelay * 2) + (defaultOptions.duration as number), 32, "Queued delays start after the correct delay.");
					done();
				}
			});
	});

	assert.expect(async());
});
