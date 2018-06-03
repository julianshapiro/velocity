/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity, {VelocityResult} from "velocity-animate";
import {asyncTests, defaultProperties, getNow, getTarget} from "../utilities";
import "./_module";

interface ExtendedVelocityExtended extends VelocityResult {
	__count?: number;
	__start?: number;
}

QUnit.test("Speed", (assert) => {
	const delay = 200,
		duration = 400,
		startDelay = getNow();

	asyncTests(assert, 1, (done) => {
		Velocity.defaults.speed = 3;
		Velocity(getTarget(), defaultProperties, {
			speed: 5,
			begin(elements) {
				assert.equal(elements.velocity.animations[0].options.speed, 5, "Speed on options overrides default.");

				done();
			},
		});
	});

	asyncTests(assert, 1, (done) => {
		Velocity(getTarget(), defaultProperties, {
			duration,
			begin(elements: ExtendedVelocityExtended) {
				elements.__start = getNow();
			},
			complete(elements: ExtendedVelocityExtended) {
				const actual = getNow() - elements.__start,
					expected = duration / 3;

				assert.close(actual, expected, 32, `Velocity.defaults.speed change is respected. (\xD73, ${Math.floor(actual - expected)}ms \xB132ms)`);

				done();
			},
		});
	});

	asyncTests(assert, 1, (done) => {
		Velocity(getTarget(), defaultProperties, {
			duration,
			speed: 2,
			begin(elements: ExtendedVelocityExtended) {
				elements.__start = getNow();
			},
			complete(elements: ExtendedVelocityExtended) {
				const actual = getNow() - elements.__start,
					expected = duration / 2;

				assert.close(actual, expected, 32, `Double speed animation lasts half as long. (\xD72, ${Math.floor(actual - expected)}ms \xB132ms)`);

				done();
			},
		});
	});

	asyncTests(assert, 1, (done) => {
		Velocity(getTarget(), defaultProperties, {
			duration,
			delay,
			speed: 2,
			begin(elements: ExtendedVelocityExtended) {
				elements.__start = startDelay;
			},
			complete(elements: ExtendedVelocityExtended) {
				const actual = getNow() - elements.__start,
					expected = (duration + delay) / 2;

				assert.close(actual, expected, 32, `Delayed animation includes speed for delay. (\xD72, ${Math.floor(actual - expected)}ms \xB132ms)`);

				done();
			},
		});
	});

	asyncTests(assert, 1, (done) => {
		Velocity(getTarget(), defaultProperties, {
			duration,
			delay: -delay,
			speed: 2,
			begin(elements: ExtendedVelocityExtended) {
				elements.__start = startDelay;
			},
			complete(elements: ExtendedVelocityExtended) {
				const actual = getNow() - elements.__start,
					expected = (duration - delay) / 2;

				assert.close(actual, expected, 32, `Negative delay animation includes speed for delay. (\xD72, ${Math.floor(actual - expected)}ms \xB132ms)`);

				done();
			},
		});
	});

	asyncTests(assert, 1, (done) => {
		Velocity(getTarget(), defaultProperties, {
			duration,
			speed: 0.5,
			begin(elements: ExtendedVelocityExtended) {
				elements.__start = getNow();
			},
			complete(elements: ExtendedVelocityExtended) {
				const actual = getNow() - elements.__start,
					expected = duration * 2;

				// TODO: Really not happy with the allowed range - it sits around 40ms, but should be closer to 16ms
				assert.close(actual, expected, 64, `Half speed animation lasts twice as long. (\xD7\xBD, ${Math.floor(actual - expected)}ms \xB164ms)`);

				done();
			},
		});
	});

	asyncTests(assert, 1, (done) => {
		Velocity(getTarget(), defaultProperties, {
			duration,
			speed: 0,
			progress(elements: ExtendedVelocityExtended, percentComplete) {
				if (!elements.__count) {
					elements.__start = percentComplete;
					elements.__count = 1;
				} else {
					assert.equal(elements.__start, percentComplete, "Frozen (speed:0) animation doesn't progress.");
					elements
						.velocity("option", "speed", 1) // Just in case "stop" is broken
						.velocity("stop");

					done();
				}
			},
		});
	});

	assert.expect(asyncTests());
});
