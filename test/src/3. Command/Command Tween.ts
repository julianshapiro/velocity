///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Tween", function(assert) {
	var $target1 = getTarget(),
		startOpacity = $target1.style.opacity;

	assert.expect(11);

	assert.raises(() => {(Velocity as any)("tween", "invalid")}, "Invalid percentComplete throws an error.");
	assert.raises(() => {(Velocity as any)([$target1, $target1], "tween", "invalid")}, "Passing more than one target throws an error.");
	assert.raises(() => {(Velocity as any)("tween", 0, ["invalid"])}, "Invalid propertyMap throws an error.");
	assert.raises(() => {(Velocity as any)("tween", 0, "invalid", 1)}, "Property without an element must be forcefed or throw an error.");

	assert.equal($target1.velocity("tween", 0.5, "opacity", [1, 0], "linear"), "0.5", "Calling on an chain returns the correct value.");
	assert.equal(Velocity($target1, "tween", 0.5, "opacity", [1, 0], "linear"), "0.5", "Calling with an element returns the correct value.");
	assert.equal(Velocity("tween", 0.5, "opacity", [1, 0], "linear"), "0.5", "Calling without an element returns the correct value.");
	assert.equal($target1.style.opacity, startOpacity, "Ensure that the element is not altered.");

	assert.equal(typeof Velocity($target1, "tween", 0.5, "opacity", [1, 0], "linear"), "string", "Calling a single property returns a value.");
	assert.equal(typeof Velocity($target1, "tween", 0.5, {opacity: [1, 0]}, "linear"), "object", "Calling a propertiesMap returns an object.");
	assert.deepEqual($target1.velocity("tween", 0.5, {opacity: [1, 0]}, "linear"), Velocity($target1, "tween", 0.5, {opacity: [1, 0]}, "linear"), "Calling directly returns the same as a chain.");
});
