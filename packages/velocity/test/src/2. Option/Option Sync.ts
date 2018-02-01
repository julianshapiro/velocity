///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Sync", function(assert) {
	async(assert, 1, async function(done) {
		const $target = getTarget(),
			$targetSet = [getTarget(), $target, getTarget()];
		let complete = false;

		Velocity($target, defaultProperties, {
			duration: 300,
			complete: function() {
				complete = true;
			}
		});
		Velocity($targetSet, defaultProperties, {
			sync: false,
			duration: 250
		});
		await sleep(275);
		assert.notOk(complete, "Sync 'false' animations don't wait for completion.");

		done();
	});

	async(assert, 1, async function(done) {
		const $target = getTarget(),
			$targetSet = [getTarget(), $target, getTarget()];
		let complete = false;

		Velocity($target, defaultProperties, {
			duration: 300,
			complete: function() {
				complete = true;
			}
		});
		Velocity($targetSet, defaultProperties, {
			sync: true,
			duration: 250,
			begin: function() {
				assert.ok(complete, "Sync 'true' animations wait for completion.");

				done();
			}
		});
	});

	assert.expect(async());
});
