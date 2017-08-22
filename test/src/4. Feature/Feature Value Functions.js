var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

QUnit.todo("Value Functions", function(assert) {
	var testWidth = 10;

	var $target1 = getTarget(),
			$target2 = getTarget();
	Velocity([$target1, $target2], {width: function(i, total) {
			return (i + 1) / total * testWidth;
		}});

	assert.equal(Data($target1).style.width.endValue, parseFloat(testWidth) / 2, "Function value #1 passed to tween.");
	assert.equal(Data($target2).style.width.endValue, parseFloat(testWidth), "Function value #2 passed to tween.");
});
