var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

/* Note: We don't bother checking all of the GET/SET-related CSS object's functions, as most are repeatedly tested indirectly via the other tests. */
QUnit.test("CSS Object", function(assert) {
	var CSS = Velocity.CSS;

	var testHookRoot = "boxShadow",
			testHookRootValue = IE >= 9 ? "1px 2px 3px 4px black" : "black 1px 2px 3px 4px",
			testHook = "boxShadowY",
			testHookValueExtracted = "2px",
			testHookValueInject = "10px",
			testHookRootValueInjected = "1px 10px 3px 4px";

	/* Hooks manipulation. */
	assert.equal(CSS.Hooks.getRoot(testHook), testHookRoot, "Hooks.getRoot() returned root.");

	/* Hooks have no effect if they're unsupported (which is the case for our hooks on <=IE8), thus we just ensure that errors aren't thrown. */
	if (IE <= 8) {
		CSS.Hooks.extractValue(testHook, testHookRootValue);
		CSS.Hooks.injectValue(testHook, testHookValueInject, testHookRootValue);
	} else {
		assert.equal(CSS.Hooks.extractValue(testHook, testHookRootValue), testHookValueExtracted, "Hooks.extractValue() returned value #1.");
		/* Check for a match anywhere in the string since browser differ in where they inject the color value. */
		assert.equal(CSS.Hooks.injectValue(testHook, testHookValueInject, testHookRootValue).indexOf(testHookRootValueInjected) !== -1, true, "Hooks.extractValue() returned value #2.");
	}

	var testPropertyFake = "fakeProperty";

	/* Property name functions. */
	assert.equal(CSS.Names.prefixCheck(testPropertyFake)[0], testPropertyFake, "Names.prefixCheck() returned unmatched property untouched.");
	assert.equal(CSS.Names.prefixCheck(testPropertyFake)[1], false, "Names.prefixCheck() indicated that unmatched property waws unmatched.");
	assert.equal(CSS.Values.isCSSNullValue("rgba(0,0,0,0)"), true, "Values.isCSSNullValue() matched null value #1.");
	assert.equal(CSS.Values.isCSSNullValue("none"), true, "Values.isCSSNullValue() matched null value #2.");
	assert.equal(CSS.Values.isCSSNullValue(10), false, "Values.isCSSNullValue() didn't match non-null value.");

	var testUnitProperty1 = "rotateZ",
			testUnitPropertyUnit1 = "deg",
			testUnitProperty2 = "width",
			testUnitPropertyUnit2 = "px",
			testElementType1 = document.createElement("div"),
			testElementTypeDisplay1 = "block",
			testElementType2 = document.createElement("span"),
			testElementTypeDisplay2 = "inline";

	/* CSS value functions. */
	assert.equal(CSS.Values.getUnitType(testUnitProperty1), testUnitPropertyUnit1, "Unit type #1 was retrieved.");
	assert.equal(CSS.Values.getUnitType(testUnitProperty2), testUnitPropertyUnit2, "Unit type #2 was retrieved.");

	/* Class addition/removal. */
	var $target1 = getTarget();
	$target1.className = "";
	CSS.Values.addClass($target1, "one");
	assert.equal($target1.className, "one", "First class was added.");
	CSS.Values.addClass($target1, "two");
	assert.equal($target1.className, "one two", "Second class was added.");

	CSS.Values.removeClass($target1, "two");
	assert.equal($target1.className.replace(/^\s+|\s+$/g, ""), "one", "Second class was removed.");
	CSS.Values.removeClass($target1, "one");
	assert.equal($target1.className.replace(/^\s+|\s+$/g, ""), "", "First class was removed.");
});
