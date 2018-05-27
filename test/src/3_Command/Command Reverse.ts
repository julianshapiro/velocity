/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {asyncTests, defaultProperties, getTarget} from "../utilities";
import "./_module";

QUnit.test("Reverse", (assert) => {
	const $target = getTarget(),
		opacity = $target.velocity("style", "opacity"),
		// Browsers don't always suffix, but Velocity does.
		width = $target.velocity("style", "width") === "0" ? "0px" : $target.velocity("style", "width");

	asyncTests(assert, 2, (done) => {
		Velocity($target, defaultProperties, {
			complete(elements) {
				assert.equal(elements[0].velocity("style", "opacity"), defaultProperties.opacity, `Initial property #1 set correctly. (${defaultProperties.opacity})`);
				assert.equal(elements[0].velocity("style", "width"), defaultProperties.width, `Initial property #2 set correctly. (${defaultProperties.width})`);

				done();
			},
		});
	});

	asyncTests(assert, 2, (done) => {
		Velocity($target, "reverse", {
			complete(elements) {
				assert.equal(elements[0].velocity("style", "opacity"), opacity, `Reversed property #1 set correctly. (${opacity})`);
				assert.equal(elements[0].velocity("style", "width"), width, `Reversed property #2 set correctly. (${width})`);

				done();
			},
		});
	});

	asyncTests(assert, 2, (done) => {
		Velocity($target, "reverse", {
			complete(elements) {
				assert.equal(elements[0].velocity("style", "opacity"), defaultProperties.opacity, `Chained reversed property #1 set correctly. (${defaultProperties.opacity})`);
				assert.equal(elements[0].velocity("style", "width"), defaultProperties.width, `Chained reversed property #2 set correctly. (${defaultProperties.width})`);

				done();
			},
		});
	});

	assert.expect(asyncTests());
});
