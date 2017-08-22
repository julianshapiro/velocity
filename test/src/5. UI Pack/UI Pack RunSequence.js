var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

QUnit.test("RunSequence", function(assert) {

	var done = assert.async(1),
			$target1 = getTarget(),
			$target2 = getTarget(),
			$target3 = getTarget(),
			mySequence = [
				{elements: $target1, properties: {opacity: defaultProperties.opacity}},
				{elements: $target2, properties: {height: defaultProperties.height}},
				{elements: $target3, properties: {width: defaultProperties.width}, options: {
						delay: 100,
						sequenceQueue: false,
						complete: function() {
							assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "opacity")), defaultProperties.opacity, "First call's property animated.");
							assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target2, "height")), defaultProperties.height, "Second call's property animated.");
							assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target3, "width")), defaultProperties.width, "Last call's property animated.");

							done();
						}
					}
				}
			];

	assert.expect(3);
	Velocity.RunSequence(mySequence);
});
