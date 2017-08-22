var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

QUnit.todo("Start Value Calculation", function(assert) {
	var testStartValues = {paddingLeft: "10px", height: "100px", paddingRight: "50%", marginLeft: "100px", marginBottom: "33%", marginTop: "100px", lineHeight: "30px", wordSpacing: "40px", backgroundColorRed: "123"};

	/* Properties not previously defined on the element. */
	var $target1 = getTarget();
	Velocity($target1, testStartValues);
	assert.equal(Data($target1).style.paddingLeft.startValue, 0, "Undefined standard start value was calculated.");
	assert.equal(Data($target1).style.backgroundColorRed.startValue, 255, "Undefined start value hook was calculated.");

	/* Properties previously defined on the element. */
	var $target2 = getTarget();
	Velocity($target2, defaultProperties);
	assert.equal(Data($target2).style.width.startValue, parseFloat(defaultStyles.width), "Defined start value #1 was calculated.");
	assert.equal(Data($target2).style.opacity.startValue, parseFloat(defaultStyles.opacity), "Defined start value #2 was calculated.");
	assert.equal(Data($target2).style.colorGreen.startValue, parseFloat(defaultStyles.colorGreen), "Defined hooked start value was calculated.");

	/* Properties that shouldn't cause start values to be unit-converted. */
	var testPropertiesEndNoConvert = {paddingLeft: "20px", height: "40px", paddingRight: "75%"};
	var $target3 = getTarget();
	applyStartValues($target3, testStartValues);
	Velocity($target3, testPropertiesEndNoConvert);
	assert.equal(Data($target3).style.paddingLeft.startValue, parseFloat(testStartValues.paddingLeft), "Start value #1 wasn't unit converted.");
	assert.equal(Data($target3).style.height.startValue, parseFloat(testStartValues.height), "Start value #2 wasn't unit converted.");
//			assert.deepEqual(Data($target3).style.paddingRight.startValue, [Math.floor((parentWidth * parseFloat(testStartValues.paddingRight)) / 100), 0], "Start value #3 was pattern matched.");

	/* Properties that should cause start values to be unit-converted. */
	var testPropertiesEndConvert = {paddingLeft: "20%", height: "40%", lineHeight: "0.5em", wordSpacing: "2rem", marginLeft: "10vw", marginTop: "5vh", marginBottom: "100px"},
			parentWidth = $qunitStage.clientWidth,
			parentHeight = $qunitStage.clientHeight,
			parentFontSize = Velocity.CSS.getPropertyValue($qunitStage, "fontSize"),
			remSize = parseFloat(Velocity.CSS.getPropertyValue(document.body, "fontSize"));

	var $target4 = getTarget();
	applyStartValues($target4, testStartValues);
	Velocity($target4, testPropertiesEndConvert);

	/* Long decimal results can be returned after unit conversion, and Velocity's code and the code here can differ in precision. So, we round floor values before comparison. */
//			assert.deepEqual(Data($target4).style.paddingLeft.startValue, [parseFloat(testStartValues.paddingLeft), 0], "Horizontal property converted to %.");
	assert.equal(Math.floor(Data($target4).style.height.startValue), Math.floor((parseFloat(testStartValues.height) / parentHeight) * 100), "Vertical property converted to %.");
//			assert.equal(Data($target4).style.lineHeight.startValue, Math.floor(parseFloat(testStartValues.lineHeight) / parseFloat(parentFontSize)), "Property converted to em.");
//			assert.equal(Data($target4).style.wordSpacing.startValue, Math.floor(parseFloat(testStartValues.wordSpacing) / parseFloat(remSize)), "Property converted to rem.");
	assert.equal(Math.floor(Data($target4).style.marginBottom.startValue), parseFloat(testStartValues.marginBottom) / 100 * parseFloat($target4.parentNode.offsetWidth), "Property converted to px.");

//			if (!(IE<=8) && !isAndroid) {
//				assert.equal(Data($target4).style.marginLeft.startValue, Math.floor(parseFloat(testStartValues.marginLeft) / window.innerWidth * 100), "Horizontal property converted to vw.");
//				assert.equal(Data($target4).style.marginTop.startValue, Math.floor(parseFloat(testStartValues.marginTop) / window.innerHeight * 100), "Vertical property converted to vh.");
//			}

	// TODO: Tests for auto-parameters as the units are no longer converted.

	/* jQuery TRBL deferring. */
	var testPropertiesTRBL = {left: "1000px"};
	var $TRBLContainer = document.createElement("div");

	$TRBLContainer.setAttribute("id", "TRBLContainer");
	$TRBLContainer.style.marginLeft = testPropertiesTRBL.left;
	$TRBLContainer.style.width = "100px";
	$TRBLContainer.style.height = "100px";
	document.body.appendChild($TRBLContainer);

	var $target5 = getTarget();
	$target5.style.position = "absolute";
	$TRBLContainer.appendChild($target5);
	Velocity($target5, testPropertiesTRBL);

	assert.equal(Math.round(Data($target5).style.left.startValue), Math.round(parseFloat(testPropertiesTRBL.left) + parseFloat(Velocity.CSS.getPropertyValue(document.body, "marginLeft"))), "TRBL value was deferred to jQuery.");
});
