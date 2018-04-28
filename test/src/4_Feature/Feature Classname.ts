/*
 * VelocityJS.org (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "@types/qunit";

import {Velocity} from "../../../index.d";
import {defaultProperties, getTarget} from "../utilities";
import "./_module";

QUnit.test("'velocity-animating' Classname", (assert) => {
	const done = assert.async(1);

	Velocity(getTarget(), defaultProperties, {
		begin(elements) {
			assert.equal(/velocity-animating/.test(elements[0].className), true, "Class added.");
		},
		complete(elements) {
			assert.equal(/velocity-animating/.test(elements[0].className), false, "Class removed.");
		},
	})
		.then(done);
});
