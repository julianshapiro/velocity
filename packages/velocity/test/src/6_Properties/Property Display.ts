/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity, {VelocityResult} from "velocity-animate";
import {getTarget, once} from "../utilities";
import "./_module";

QUnit.test("Display", (assert) => {
	const done = assert.async(5);

	Velocity(getTarget(), "style", "display", "none")
		.velocity({display: "block"}, {
			progress: once((elements: VelocityResult) => {
				assert.equal(elements.velocity("style", "display"), "block", "Display:'block' was set immediately.");

				done();
			}),
		});

	Velocity(getTarget(), "style", "display", "none")
		.velocity("style", "display", "auto")
		.then((elements) => {
			assert.equal(elements[0].style.display, "block", "Display:'auto' was understood.");
			assert.equal(elements.velocity("style", "display"), "block", "Display:'auto' was cached as 'block'.");

			done();
		});

	Velocity(getTarget(), "style", "display", "none")
		.velocity("style", "display", "")
		.then((elements) => {
			assert.equal(elements.velocity("style", "display"), "block", "Display:'' was reset correctly.");

			done();
		});

	Velocity(getTarget(), {display: "none"}, {
		progress: once((elements: VelocityResult) => {
			assert.notEqual(elements.velocity("style", "display"), "none", "Display:'none' was not set immediately.");

			done();
		}),
	})
		.then((elements) => {
			assert.equal(elements.velocity("style", "display"), "none", "Display:'none' was set upon completion.");

			done();
		});
});
