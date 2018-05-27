/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {defaultProperties, getPropertyValue, getTarget} from "../utilities";
import "./_module";

QUnit.skip("RunSequence", (assert) => {
	//
	//	var done = assert.async(1),
	//		$target1 = getTarget(),
	//		$target2 = getTarget(),
	//		$target3 = getTarget(),
	//		mySequence = [
	//			{elements: $target1, properties: {opacity: defaultProperties.opacity}},
	//			{elements: $target2, properties: {height: defaultProperties.height}},
	//			{
	//				elements: $target3, properties: {width: defaultProperties.width}, options: {
	//					delay: 100,
	//					sequenceQueue: false,
	//					complete: function() {
	//						assert.equal(parseFloat(getPropertyValue($target1, "opacity") as string), defaultProperties.opacity, "First call's property animated.");
	//						assert.equal(parseFloat(getPropertyValue($target2, "height") as string), defaultProperties.height, "Second call's property animated.");
	//						assert.equal(parseFloat(getPropertyValue($target3, "width") as string), defaultProperties.width, "Last call's property animated.");
	//
	//						done();
	//					}
	//				}
	//			}
	//		];
	//
	//	assert.expect(3);
	//	Velocity.RunSequence(mySequence);
});
