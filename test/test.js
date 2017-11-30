var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.module("Core");
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Arguments", function (assert) {
    var testComplete = function () { }, // Do nothing
    testDuration = 1000, testEasing = "easeInSine", result, testOptions = {
        duration: 123,
        easing: testEasing,
        complete: testComplete
    };
    assert.expect(18);
    /****************
     Overloading
     ****************/
    result = Velocity(getTarget(), defaultProperties);
    assert.ok(result.length, "Overload variation #1a: Velocity(ELEMENT, {properties})");
    assert.ok(result.velocity.animations.length, "Overload variation #1b: Velocity(element, {PROPERTIES})");
    result = Velocity(getTarget(), defaultProperties, testDuration);
    assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #2a: Velocity(element, {properties}, DURATION<number>)");
    result = Velocity(getTarget(), defaultProperties, "slow");
    assert.equal(result.velocity.animations[0].options.duration, 600, "Overload variation #2b: Velocity(element, {properties}, DURATION<slow>)");
    result = Velocity(getTarget(), defaultProperties, "normal");
    assert.equal(result.velocity.animations[0].options.duration, 400, "Overload variation #2c: Velocity(element, {properties}, DURATION<normal>)");
    result = Velocity(getTarget(), defaultProperties, "fast");
    assert.equal(result.velocity.animations[0].options.duration, 200, "Overload variation #2d: Velocity(element, {properties}, DURATION<fast>)");
    result = Velocity(getTarget(), defaultProperties, testEasing);
    assert.equal(typeof result.velocity.animations[0].options.easing, "function", "Overload variation #3: Velocity(element, {properties}, EASING)");
    result = Velocity(getTarget(), defaultProperties, testComplete);
    assert.equal(typeof result.velocity.animations[0].options.complete, "function", "Overload variation #4: Velocity(element, {properties}, COMPLETE)");
    result = Velocity(getTarget(), defaultProperties, testDuration, [0.42, 0, 0.58, 1]);
    assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #5a: Velocity(element, {properties}, DURATION, easing)");
    assert.equal(result.velocity.animations[0].options.easing(0.2, 0, 1), 0.0816598562658975, "Overload variation #5b: Velocity(element, {properties}, duration, EASING)");
    result = Velocity(getTarget(), defaultProperties, testDuration, testComplete);
    assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #6a: Velocity(element, {properties}, DURATION, complete)");
    assert.equal(result.velocity.animations[0].options.complete, testComplete, "Overload variation #6b: Velocity(element, {properties}, duration, COMPLETE)");
    result = Velocity(getTarget(), defaultProperties, testDuration, testEasing, testComplete);
    assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #7a: Velocity(element, {properties}, DURATION, easing, complete)");
    assert.equal(typeof result.velocity.animations[0].options.easing, "function", "Overload variation #7b: Velocity(element, {properties}, duration, EASING, complete)");
    assert.equal(result.velocity.animations[0].options.complete, testComplete, "Overload variation #7c: Velocity(element, {properties}, duration, easing, COMPLETE)");
    result = Velocity(getTarget(), defaultProperties, testOptions);
    assert.equal(result.velocity.animations[0].options.duration, testOptions.duration, "Overload variation #8: Velocity(element, {properties}, {OPTIONS})");
    Velocity({ elements: [getTarget()], properties: defaultProperties, options: testOptions });
    assert.equal(result.velocity.animations[0].options.duration, testOptions.duration, "Overload variation #9: Velocity({elements:[elements], properties:{properties}, options:{OPTIONS})");
    Velocity({ elements: [getTarget()], properties: "stop", options: testOptions });
    assert.equal(result.velocity.animations[0].options.duration, testOptions.duration, "Overload variation #10: Velocity({elements:[elements], properties:\"ACTION\", options:{OPTIONS})");
    //	var $target12 = getTarget();
    //	Velocity($target12, {opacity: [0.75, "spring", 0.25]}, testDuration);
    //	assert.equal(Data($target12).style.opacity.startValue, 0.25, "Overload variation #10a.");
    //	assert.equal(Data($target12).style.opacity.easing, "spring", "Overload variation #10b.");
    //	assert.equal(Data($target12).style.opacity.endValue, 0.75, "Overload variation #10c.");
    //	var $target13 = getTarget();
    //	Velocity($target13, {opacity: [0.75, 0.25]}, testDuration);
    //	assert.equal(Data($target13).style.opacity.startValue, 0.25, "Overload variation #11a.");
    //	assert.equal(Data($target13).style.opacity.endValue, 0.75, "Overload variation #11b.");
    //	var $target14 = getTarget();
    //	Velocity($target14, {opacity: [0.75, "spring"]}, testDuration);
    //	assert.equal(Data($target14).style.opacity.endValue, 0.75, "Overload variation #12a.");
    //	assert.equal(Data($target14).style.opacity.easing, "spring", "Overload variation #12b.");
    //	if ($) {
    //		var $target17 = getTarget();
    //		$($target17).velocity(defaultProperties, testOptions);
    //		assert.deepEqual(Data($target17).opts, testOptions, "$.fn.: Utility function variation #1: options object.");
    //
    //		var $target18 = getTarget();
    //		$($target18).velocity({properties: defaultProperties, options: testOptions});
    //		assert.deepEqual(Data($target18).opts, testOptions, "$.fn.: Utility function variation #2: single object.");
    //
    //		var $target19 = getTarget();
    //		$($target19).velocity(defaultProperties, testDuration, testEasing, testComplete);
    //		assert.equal(Data($target19).opts.duration, testDuration, "$.fn.: Utility function variation #2a.");
    //		assert.equal(Data($target19).opts.easing, testEasing, "$.fn.: Utility function variation #2b.");
    //		assert.equal(Data($target19).opts.complete, testComplete, "$.fn.: Utility function variation #2c.");
    //
    //		var $target20 = getTarget();
    //		assert.equal($($target20).length, $($target20).velocity(defaultProperties, testDuration, testEasing, testComplete).velocity(defaultProperties, testDuration, testEasing, testComplete).length, "$.fn.: Elements passed back to the call stack.");
    //		// TODO: Should check in a better way - but the prototype chain is now extended with a Promise so a standard (non-length) comparison *will* fail
    //	}
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
/* Note: We don't bother checking all of the GET/SET-related CSS object's functions, as most are repeatedly tested indirectly via the other tests. */
QUnit.test("CSS Object", function (assert) {
    var CSS = Velocity.CSS;
    var testHookRoot = "boxShadow", testHookRootValue = IE >= 9 ? "1px 2px 3px 4px black" : "black 1px 2px 3px 4px", testHook = "boxShadowY", testHookValueExtracted = "2px", testHookValueInject = "10px", testHookRootValueInjected = "1px 10px 3px 4px";
    /* Hooks manipulation. */
    //	assert.equal(CSS.Hooks.getRoot(testHook), testHookRoot, "Hooks.getRoot() returned root.");
    /* Hooks have no effect if they're unsupported (which is the case for our hooks on <=IE8), thus we just ensure that errors aren't thrown. */
    //	if (IE <= 8) {
    //		CSS.Hooks.extractValue(testHook, testHookRootValue);
    //		CSS.Hooks.injectValue(testHook, testHookValueInject, testHookRootValue);
    //	} else {
    //		assert.equal(CSS.Hooks.extractValue(testHook, testHookRootValue), testHookValueExtracted, "Hooks.extractValue() returned value #1.");
    //		/* Check for a match anywhere in the string since browser differ in where they inject the color value. */
    //		assert.equal(CSS.Hooks.injectValue(testHook, testHookValueInject, testHookRootValue).indexOf(testHookRootValueInjected) !== -1, true, "Hooks.extractValue() returned value #2.");
    //	}
    var testPropertyFake = "fakeProperty";
    /* Property name functions. */
    assert.equal(CSS.Names.prefixCheck(testPropertyFake)[0], testPropertyFake, "Names.prefixCheck() returned unmatched property untouched.");
    assert.equal(CSS.Names.prefixCheck(testPropertyFake)[1], false, "Names.prefixCheck() indicated that unmatched property waws unmatched.");
    assert.equal(CSS.Values.isCSSNullValue("rgba(0,0,0,0)"), true, "Values.isCSSNullValue() matched null value #1.");
    assert.equal(CSS.Values.isCSSNullValue("none"), true, "Values.isCSSNullValue() matched null value #2.");
    assert.equal(CSS.Values.isCSSNullValue(10), false, "Values.isCSSNullValue() didn't match non-null value.");
    var testUnitProperty1 = "rotateZ", testUnitPropertyUnit1 = "deg", testUnitProperty2 = "width", testUnitPropertyUnit2 = "px", testElementType1 = document.createElement("div"), testElementTypeDisplay1 = "block", testElementType2 = document.createElement("span"), testElementTypeDisplay2 = "inline";
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
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.todo("End Value Caching", function (assert) {
    //	var done = assert.async(2),
    //			newProperties = {height: "50px", width: "250px"},
    //			$target1 = getTarget();
    //
    //	assert.expect(4);
    //	Velocity($target1, defaultProperties, function() {
    //
    //		applyStartValues($target1, newProperties);
    //		/* Called after the last call is complete (stale). Ensure that the newly-set (via $.css()) properties are used. */
    //		Velocity($target1, defaultProperties);
    //
    //		setTimeout(function() {
    //			assert.equal(Data($target1).style.width.startValue, parseFloat(newProperties.width), "Stale end value #1 wasn't pulled.");
    //			assert.equal(Data($target1).style.height.startValue, parseFloat(newProperties.height), "Stale end value #2 wasn't pulled.");
    //			done();
    //		}, asyncCheckDuration);
    //	});
    //
    //	var $target2 = getTarget();
    //	Velocity($target2, defaultProperties);
    //	Velocity($target2, newProperties, function() {
    //		/* Chained onto a previous call (fresh). */
    //		assert.equal(Data($target2).style.width.startValue, defaultProperties.width, "Chained end value #1 was pulled.");
    //		assert.equal(Data($target2).style.height.startValue, defaultProperties.height, "Chained end value #2 was pulled.");
    //
    //		done();
    //	});
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.todo("End Value Calculation", function (assert) {
    //	/* Standard properties without operators. */
    //	var $target1 = getTarget(),
    //			done = assert.async(2);
    //
    //	Velocity($target1, defaultProperties);
    //	setTimeout(function() {
    //		assert.equal(Data($target1).style.width.endValue, defaultProperties.width, "Standard end value #1 was calculated.");
    //		assert.equal(Data($target1).style.opacity.endValue, defaultProperties.opacity, "Standard end value #2 was calculated.");
    //		done();
    //	}, asyncCheckDuration);
    //
    //	/* Standard properties with operators. */
    //	var testIncrementWidth = "5px",
    //			testDecrementOpacity = 0.25,
    //			testMultiplyMarginBottom = 4,
    //			testDivideHeight = 2;
    //
    //	var $target2 = getTarget();
    //	Velocity($target2, {width: "+=" + testIncrementWidth, opacity: "-=" + testDecrementOpacity, marginBottom: "*=" + testMultiplyMarginBottom, height: "/=" + testDivideHeight});
    //	setTimeout(function() {
    //
    //		assert.equal(Data($target2).style.width.endValue, defaultStyles.width + parseFloat(testIncrementWidth), "Incremented end value was calculated.");
    //		assert.equal(Data($target2).style.opacity.endValue, defaultStyles.opacity - testDecrementOpacity, "Decremented end value was calculated.");
    //		assert.equal(Data($target2).style.marginBottom.endValue, defaultStyles.marginBottom * testMultiplyMarginBottom, "Multiplied end value was calculated.");
    //		assert.equal(Data($target2).style.height.endValue, defaultStyles.height / testDivideHeight, "Divided end value was calculated.");
    //
    //		done();
    //	}, asyncCheckDuration);
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.todo("End Value Setting (Note: Browser Tab Must Have Focus Due to rAF)", function (assert) {
    var count = 0
        + (!(IE < 9) ? 1 : 0)
        + (!(IE < 10) && !Velocity.State.isGingerbread ? 1 : 0)
        + (!Velocity.State.isGingerbread ? 1 : 0), done = assert.async(1);
    /* Transforms and the properties that are hooked by Velocity aren't supported below IE9. */
    if (!(IE < 9)) {
        //		var testHooks: VelocityProperties = {
        //			boxShadowBlur: "10px", // "black 0px 0px 10px 0px"
        //			boxShadowSpread: "20px", // "black 0px 0px 0px 20px"
        //			textShadowBlur: "30px" // "black 0px 0px 30px"
        //		};
        //
        //		/* Hooks. */
        //		var $target3 = getTarget();
        //		Velocity($target3, testHooks);
        //		setTimeout(function() {
        //			/* Check for a match anywhere in the string since browser differ in where they inject the color value. */
        //			assert.equal(/0px 0px 10px 20px/.test(Velocity.CSS.getPropertyValue($target3, "boxShadow") as string), true, "Hook end value #1 was set.");
        //			/* textShadow isn't supported below IE10. */
        //			if (!IE || IE >= 10) {
        //				assert.equal(/0px 0px 30px/.test(Velocity.CSS.getPropertyValue($target3, "textShadow") as string), true, "Hook end value #2 was set.");
        //			}
        //			done();
        //		}, completeCheckDuration);
        //		if (!(IE < 10) && !Velocity.State.isGingerbread) {
        //			var testTransforms: VelocityProperties = {
        //				translateY: "10em", // Should stay the same
        //				translateX: "20px", // Should stay the same
        //				scaleX: "1.50", // Should remain unitless
        //				translateZ: "30", // Should become "10px"
        //				scaleY: "1.50deg" // Should be ignored entirely since it uses an invalid unit
        //			},
        //				testTransformsOutput = "matrix3d(1.5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 20, 160, 30, 1)";
        //
        //			/* Transforms. */
        //			var $target4 = getTarget();
        //			Velocity($target4, testTransforms);
        //			setTimeout(function() {
        //				/* Check for a match anywhere in the string since browser differ in where they inject the color value. */
        //				assert.equal(Velocity.CSS.getPropertyValue($target4, "transform"), testTransformsOutput, "Transform end value was set.");
        //
        //				/* Ensure previous transform values are reused. */
        //				Velocity($target4, {translateX: parseFloat(testTransforms.translateX) / 2});
        //				//				assert.equal(Data($target4).style.translateX.startValue, parseFloat(testTransforms.translateX), "Previous transform value was reused.");
        //				done();
        //			}, completeCheckDuration);
        //		}
        if (!Velocity.State.isGingerbread) {
            /* SVG. */
            var $svgRoot = document.createElementNS("http://www.w3.org/2000/svg", "svg"), $svgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect"), svgStartValues = { x: 100, y: 10, width: 250, height: "30%" }, svgEndValues = { x: 200, width: "50%", strokeDasharray: 10, height: "40%" };
            $svgRoot.setAttribute("width", String(1000));
            $svgRoot.setAttribute("height", String(1000));
            $svgRect.setAttribute("x", String(svgStartValues.x));
            $svgRect.setAttribute("y", String(svgStartValues.y));
            $svgRect.setAttribute("width", String(svgStartValues.width));
            $svgRect.setAttribute("height", String(svgStartValues.height));
            $svgRoot.appendChild($svgRect);
            $qunitStage.appendChild($svgRoot);
            Velocity($svgRect, svgEndValues, defaultOptions);
            //			setTimeout(function() {
            //				assert.equal(Math.round(Data($svgRect).style.x.startValue), svgStartValues.x, "SVG dimensional attribute #1 value was retrieved.");
            //				assert.equal(Math.round(parseFloat(Velocity.CSS.getPropertyValue($svgRect, "x"))), svgEndValues.x, "SVG dimensional attribute #1 end value was set.");
            //
            //				assert.equal(Math.round(Data($svgRect).style.width.startValue), parseFloat(svgStartValues.width) / 1000 * 100, "SVG dimensional attribute #2 value was retrieved.");
            //				assert.equal(Math.round(parseFloat(Velocity.CSS.getPropertyValue($svgRect, "width"))), parseFloat(svgEndValues.width) / 100 * 1000, "SVG dimensional attribute #2 end value was set.");
            //
            //				assert.equal(Math.round(Data($svgRect).style.height.startValue), parseFloat(svgStartValues.height), "SVG dimensional attribute #3 value was retrieved.");
            //				assert.equal(Math.round(parseFloat(Velocity.CSS.getPropertyValue($svgRect, "height"))), parseFloat(svgEndValues.height) / 100 * 1000, "SVG dimensional attribute #3 end value was set.");
            //
            //				assert.equal(Math.round(Data($svgRect).style.rotateZ.startValue), 0, "SVG 2D transform value was retrieved.");
            //				assert.equal(Math.round(parseFloat(Velocity.CSS.getPropertyValue($svgRect, "rotateZ"))), parseFloat(svgEndValues.rotateZ), "SVG 2D transform end value was set.");
            //
            //				if (!IE) {
            //					assert.equal(Math.round(Data($svgRect).style.rotateX.startValue), 0, "SVG 3D transform value was retrieved.");
            //					assert.equal(Math.round(parseFloat(Velocity.CSS.getPropertyValue($svgRect, "rotateX"))), parseFloat(svgEndValues.rotateX), "SVG 3D transform end value was set.");
            //				}
            //
            //				assert.equal(Math.round(Data($svgRect).style.strokeDasharray.startValue), 0, "SVG CSS style value was retrieved.");
            //				assert.equal(parseFloat(Velocity.CSS.getPropertyValue($svgRect, "strokeDasharray")), svgEndValues.strokeDasharray, "SVG CSS style end value was set.");
            //				done();
            //			}, completeCheckDuration);
        }
    }
    /* Standard properties. */
    var $target1 = getTarget();
    Velocity($target1, defaultProperties, {});
    setTimeout(function () {
        assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "width")), defaultProperties.width, "Standard end value #1 was set.");
        assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "opacity")), defaultProperties.opacity, "Standard end value #2 was set.");
        done();
    }, completeCheckDuration);
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.todo("Start Value Calculation", function (assert) {
    var testStartValues = {
        paddingLeft: "10px",
        height: "100px",
        paddingRight: "50%",
        marginLeft: "100px",
        marginBottom: "33%",
        marginTop: "100px",
        lineHeight: "30px",
        wordSpacing: "40px",
        backgroundColor: "rgb(123,0,0)"
    };
    /* Properties not previously defined on the element. */
    var $target1 = getTarget();
    Velocity($target1, testStartValues);
    assert.equal(Data($target1).cache.paddingLeft, testStartValues.paddingLeft, "Undefined standard start value was calculated.");
    assert.equal(Data($target1).cache.backgroundColor, testStartValues.backgroundColor, "Undefined start value hook was calculated.");
    /* Properties previously defined on the element. */
    var $target2 = getTarget();
    Velocity($target2, defaultProperties);
    assert.equal(Data($target2).cache.width, parseFloat(defaultStyles.width), "Defined start value #1 was calculated.");
    assert.equal(Data($target2).cache.opacity, parseFloat(defaultStyles.opacity), "Defined start value #2 was calculated.");
    assert.equal(Data($target2).cache.color, parseFloat(defaultStyles.colorGreen), "Defined hooked start value was calculated.");
    /* Properties that shouldn't cause start values to be unit-converted. */
    var testPropertiesEndNoConvert = { paddingLeft: "20px", height: "40px", paddingRight: "75%" };
    var $target3 = getTarget();
    applyStartValues($target3, testStartValues);
    Velocity($target3, testPropertiesEndNoConvert);
    assert.equal(Data($target3).cache.paddingLeft, parseFloat(testStartValues.paddingLeft), "Start value #1 wasn't unit converted.");
    assert.equal(Data($target3).cache.height, parseFloat(testStartValues.height), "Start value #2 wasn't unit converted.");
    //			assert.deepEqual(Data($target3).cache.paddingRight.startValue, [Math.floor((parentWidth * parseFloat(testStartValues.paddingRight)) / 100), 0], "Start value #3 was pattern matched.");
    /* Properties that should cause start values to be unit-converted. */
    var testPropertiesEndConvert = { paddingLeft: "20%", height: "40%", lineHeight: "0.5em", wordSpacing: "2rem", marginLeft: "10vw", marginTop: "5vh", marginBottom: "100px" }, parentWidth = $qunitStage.clientWidth, parentHeight = $qunitStage.clientHeight, parentFontSize = Velocity.CSS.getPropertyValue($qunitStage, "fontSize"), remSize = parseFloat(Velocity.CSS.getPropertyValue(document.body, "fontSize"));
    var $target4 = getTarget();
    applyStartValues($target4, testStartValues);
    Velocity($target4, testPropertiesEndConvert);
    /* Long decimal results can be returned after unit conversion, and Velocity's code and the code here can differ in precision. So, we round floor values before comparison. */
    //			assert.deepEqual(Data($target4).cache.paddingLeft.startValue, [parseFloat(testStartValues.paddingLeft), 0], "Horizontal property converted to %.");
    assert.equal(parseInt(Data($target4).cache.height), Math.floor((parseFloat(testStartValues.height) / parentHeight) * 100), "Vertical property converted to %.");
    //			assert.equal(Data($target4).cache.lineHeight.startValue, Math.floor(parseFloat(testStartValues.lineHeight) / parseFloat(parentFontSize)), "Property converted to em.");
    //			assert.equal(Data($target4).cache.wordSpacing.startValue, Math.floor(parseFloat(testStartValues.wordSpacing) / parseFloat(remSize)), "Property converted to rem.");
    assert.equal(parseInt(Data($target4).cache.marginBottom), parseFloat(testStartValues.marginBottom) / 100 * parseFloat($target4.parentElement.offsetWidth), "Property converted to px.");
    //			if (!(IE<=8) && !isAndroid) {
    //				assert.equal(Data($target4).cache.marginLeft.startValue, Math.floor(parseFloat(testStartValues.marginLeft) / window.innerWidth * 100), "Horizontal property converted to vw.");
    //				assert.equal(Data($target4).cache.marginTop.startValue, Math.floor(parseFloat(testStartValues.marginTop) / window.innerHeight * 100), "Vertical property converted to vh.");
    //			}
    // TODO: Tests for auto-parameters as the units are no longer converted.
    /* jQuery TRBL deferring. */
    var testPropertiesTRBL = { left: "1000px" };
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
    assert.equal(parseInt(Data($target5).cache.left), Math.round(parseFloat(testPropertiesTRBL.left) + parseFloat(Velocity.CSS.getPropertyValue(document.body, "marginLeft"))), "TRBL value was deferred to jQuery.");
});
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.module("Option");
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Begin", function (assert) {
    var done = assert.async(1), $targetSet = [getTarget(), getTarget()];
    assert.expect(1);
    Velocity($targetSet, defaultProperties, {
        duration: asyncCheckDuration,
        begin: function () {
            assert.deepEqual(this, $targetSet, "Elements passed into callback.");
            done();
        }
    });
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Complete", function (assert) {
    var done = assert.async(1), $targetSet = [getTarget(), getTarget()];
    assert.expect(1);
    Velocity($targetSet, defaultProperties, {
        duration: asyncCheckDuration,
        complete: function () {
            assert.deepEqual(this, $targetSet, "Elements passed into callback.");
            done();
        }
    });
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Delay", function (assert) {
    var done = assert.async(2), testDelay = 250, $target = getTarget(), start = getNow();
    assert.expect(2);
    Velocity($target, defaultProperties, {
        duration: defaultOptions.duration,
        delay: testDelay,
        begin: function (elements, activeCall) {
            assert.close(getNow() - start, testDelay, 32, "Delayed calls start after the correct delay.");
            done();
        }
    });
    Velocity($target, defaultProperties, {
        duration: defaultOptions.duration,
        delay: testDelay,
        begin: function (elements, activeCall) {
            assert.close(getNow() - start, (testDelay * 2) + defaultOptions.duration, 32, "Queued delays start after the correct delay.");
            done();
        }
    });
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Easing", function (assert) {
    var done = assert.async(6), success;
    assert.expect(14);
    /* Ensure that a fake easing doesn't throw an error. */
    try {
        success = true;
        Velocity(getTarget(), defaultProperties, { easing: "fake" });
    }
    catch (e) {
        success = false;
    }
    assert.ok(success, "Fake easing string didn't throw error.");
    /* Ensure that an improperly-formmated bezier curve array doesn't throw an error. */
    try {
        success = true;
        Velocity(getTarget(), defaultProperties, { easing: ["a", 0.5, 0.5, 0.5] });
        Velocity(getTarget(), defaultProperties, { easing: [0.5, 0.5, 0.5] });
    }
    catch (e) {
        success = false;
    }
    assert.ok(success, "Invalid bezier curve didn't throw error.");
    /* Ensure that a properly-formatted bezier curve array returns a bezier function. */
    var easingBezierArray = [0.27, -0.65, 0.78, 0.19], easingBezierTestPercent = 0.25, easingBezierTestValue = -0.23;
    Velocity(getTarget(), defaultProperties, {
        easing: easingBezierArray,
        begin: function (elements, animation) {
            assert.close(animation.options.easing(easingBezierTestPercent, 0, 1), easingBezierTestValue, 0.005, "Array converted into bezier function.");
            done();
        }
    });
    /* Ensure that a properly-formatted spring RK4 array returns a bezier function. */
    var easingSpringRK4Array = [250, 12], easingSpringRK4TestPercent = 0.25, easingSpringRK4TestValue = 0.928, // TODO: Check accuracy
    easingSpringRK4TestDuration = 992;
    Velocity(getTarget(), defaultProperties, {
        duration: 150,
        easing: easingSpringRK4Array,
        begin: function (elements, animation) {
            assert.close(animation.options.easing(easingSpringRK4TestPercent, 0, 1), easingSpringRK4TestValue, 10, "Array with duration converted into springRK4 function.");
            done();
        }
    });
    // TODO: Get this working in Velocity - so it can be tested
    //	Velocity(getTarget(), defaultProperties, {
    //		easing: easingSpringRK4Array,
    //		begin: function(elements, animation) {
    //			assert.equal(animation.duration, easingSpringRK4TestDuration, "Array without duration converted into springRK4 duration.");
    //			done();
    //		}
    //	});
    /* Ensure that a properly-formatted step easing array returns a step function. */
    var easingStepArray = [4], easingStepTestPercent = 0.35, easingStepTestValue = 0.25;
    Velocity(getTarget(), defaultProperties, {
        easing: easingStepArray,
        begin: function (elements, animation) {
            assert.close(animation.options.easing(easingStepTestPercent, 0, 1), easingStepTestValue, 0.05, "Array converted into Step function.");
            done();
        }
    });
    Velocity(getTarget(), { opacity: [0, "during", 1] }, {
        duration: asyncCheckDuration,
        begin: function (elements) {
            assert.equal(elements.velocity("style", "opacity"), 1, "Correct begin value (easing:'during').");
        },
        progress: once(function (elements) {
            assert.equal(elements.velocity("style", "opacity"), 0, "Correct progress value (easing:'during').");
        }),
        complete: function (elements) {
            assert.equal(elements.velocity("style", "opacity"), 1, "Correct complete value (easing:'during').");
            done();
        }
    });
    Velocity(getTarget(), { opacity: [0, "at-start", 1] }, {
        duration: asyncCheckDuration,
        begin: function (elements) {
            assert.equal(elements.velocity("style", "opacity"), 1, "Correct begin value (easing:'at-start').");
        },
        progress: once(function (elements) {
            assert.equal(elements.velocity("style", "opacity"), 0, "Correct progress value (easing:'at-start').");
        }),
        complete: function (elements) {
            assert.equal(elements.velocity("style", "opacity"), 0, "Correct complete value (easing:'at-start').");
            done();
        }
    });
    Velocity(getTarget(), { opacity: [0, "at-end", 1] }, {
        duration: asyncCheckDuration,
        begin: function (elements) {
            assert.equal(elements.velocity("style", "opacity"), 1, "Correct begin value (easing:'at-end').");
        },
        progress: once(function (elements) {
            assert.equal(elements.velocity("style", "opacity"), 1, "Correct progress value (easing:'at-end').");
        }),
        complete: function (elements) {
            assert.equal(elements.velocity("style", "opacity"), 0, "Correct complete value (easing:'at-end').");
            done();
        }
    });
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
var _this = this;
QUnit.test("FPS Limit", function (assert) { return __awaiter(_this, void 0, void 0, function () {
    var count, $target, frameRates, testFrame, i, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                $target = getTarget(), frameRates = [5, 15, 30, 60], testFrame = function (frameRate) {
                    var counter = 0;
                    Velocity.defaults.fpsLimit = frameRate;
                    // Test if the frame rate is assigned succesfully.
                    assert.equal(frameRate, Velocity.defaults.fpsLimit, "Setting global fps limit to " + frameRate);
                    return Velocity($target, defaultProperties, {
                        duration: 1000,
                        progress: function () {
                            counter++;
                        }
                    }).then(function () { return counter; });
                };
                assert.expect(frameRates.length * 2);
                i = 0;
                _c.label = 1;
            case 1:
                if (!(i < frameRates.length)) return [3 /*break*/, 4];
                _b = (_a = assert).close;
                return [4 /*yield*/, testFrame(frameRates[i])];
            case 2:
                _b.apply(_a, [count = _c.sent(), frameRates[i], 1, "...counted " + count + " frames (\xB11 frame)"]);
                _c.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); });
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Loop", function (assert) {
    var done = assert.async(1), testOptions = { loop: 2, delay: 100, duration: 100 }, begin = 0, complete = 0, loop = 0, start = getNow(), lastPercentComplete = 2;
    assert.expect(4);
    Velocity(getTarget(), defaultProperties, {
        loop: testOptions.loop,
        delay: testOptions.delay,
        duration: testOptions.duration,
        begin: function (elements, animation) {
            begin++;
        },
        progress: function (elements, percentComplete, remaining, start, tweenValue) {
            if (lastPercentComplete > percentComplete) {
                loop++;
            }
            lastPercentComplete = percentComplete;
        },
        complete: function (elements, animation) {
            complete++;
        }
    }).then(function () {
        assert.equal(begin, 1, "Begin callback only called once.");
        assert.equal(loop, testOptions.loop * 2 - 1, "Animation looped correct number of times (once each direction per loop).");
        assert.close(getNow() - start, (testOptions.delay + testOptions.duration) * loop, 32, "Looping with 'delay' has correct duration.");
        assert.equal(complete, 1, "Complete callback only called once.");
        done();
    });
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Progress", function (assert) {
    var done = assert.async(1), $target = getTarget();
    assert.expect(4);
    Velocity($target, defaultProperties, {
        duration: asyncCheckDuration,
        progress: once(function (elements, percentComplete, msRemaining) {
            assert.deepEqual(elements, [$target], "Elements passed into progress.");
            assert.deepEqual(this, [$target], "Elements passed into progress as this.");
            assert.equal(percentComplete >= 0 && percentComplete <= 1, true, "'percentComplete' passed into progress.");
            assert.equal(msRemaining > asyncCheckDuration - 50, true, "'msRemaining' passed into progress.");
            done();
        })
    });
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Queue", function (assert) {
    var done = assert.async(4), testQueue = "custom", $target = getTarget(), ignore = $target.velocity("style", "display"), // Force data creation
    data = Data($target), anim1, anim2, anim3;
    assert.expect(7);
    assert.ok(data.queueList[testQueue] === undefined, "Custom queue is empty."); // Shouldn't exist
    $target.velocity(defaultProperties, {
        queue: testQueue,
        begin: function () {
            anim1 = true;
        },
        complete: function () {
            anim1 = false;
            assert.ok(!anim2, "Queued animation isn't started early.");
            done();
        }
    });
    assert.ok(data.queueList[testQueue] !== undefined, "Custom queue was created."); // Should exist, but be "null"
    $target.velocity(defaultProperties, {
        queue: testQueue,
        begin: function () {
            anim2 = true;
            assert.ok(anim1 === false, "Queued animation starts after first.");
            done();
        },
        complete: function () {
            anim2 = false;
        }
    });
    assert.ok(data.queueList[testQueue], "Custom queue grows."); // Should exist and point at the next animation
    $target.velocity(defaultProperties, {
        begin: function () {
            anim3 = true;
            assert.ok(anim1 === true, "Different queue animation starts in parallel.");
            done();
        },
        complete: function () {
            anim3 = false;
        }
    });
    $target.velocity(defaultProperties, {
        queue: false,
        begin: function () {
            assert.ok(anim1 === true, "Queue:false animation starts in parallel.");
            done();
        }
    });
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Repeat", function (assert) {
    var done = assert.async(1), testOptions = { repeat: 2, delay: 100, duration: 100 }, begin = 0, complete = 0, repeat = 0, start = Date.now();
    assert.expect(4);
    Velocity(getTarget(), defaultProperties, {
        repeat: testOptions.repeat,
        delay: testOptions.delay,
        duration: testOptions.duration,
        begin: function (elements, animation) {
            begin++;
        },
        progress: function (elements, percentComplete, remaining, start, tweenValue) {
            if (percentComplete === 1) {
                repeat++;
            }
        },
        complete: function (elements, animation) {
            complete++;
            assert.equal(begin, 1, "Begin callback only called once.");
            assert.equal(repeat, testOptions.repeat + 1, "Animation repeated correct number of times (original plus repeats).");
            assert.close(Date.now() - start, (testOptions.delay + testOptions.duration) * (testOptions.repeat + 1), (testOptions.repeat + 1) * 16 + 32, "Repeat with 'delay' has correct duration.");
            assert.equal(complete, 1, "Complete callback only called once.");
            done();
        }
    });
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Speed", function (assert) {
    var done = assert.async(7), delay = 200, duration = 400, startDelay = getNow();
    assert.expect(7);
    Velocity.defaults.speed = 3;
    Velocity(getTarget(), defaultProperties, {
        speed: 5,
        begin: function (elements) {
            assert.equal(elements.velocity.animations[0].options.speed, 5, "Speed on options overrides default.");
            done();
        }
    });
    Velocity(getTarget(), defaultProperties, {
        duration: duration,
        begin: function (elements) {
            elements.__start = getNow();
        },
        complete: function (elements) {
            var actual = getNow() - elements.__start, expected = duration / 3;
            assert.close(actual, expected, 32, "Velocity.defaults.speed change is respected. (\xD73, " + Math.floor(actual - expected) + "ms \xB132ms)");
            done();
        }
    });
    Velocity(getTarget(), defaultProperties, {
        duration: duration,
        speed: 2,
        begin: function (elements) {
            elements.__start = getNow();
        },
        complete: function (elements) {
            var actual = getNow() - elements.__start, expected = duration / 2;
            assert.close(actual, expected, 32, "Double speed animation lasts half as long. (\xD72, " + Math.floor(actual - expected) + "ms \xB132ms)");
            done();
        }
    });
    Velocity(getTarget(), defaultProperties, {
        duration: duration,
        delay: delay,
        speed: 2,
        begin: function (elements) {
            elements.__start = startDelay;
        },
        complete: function (elements) {
            var actual = getNow() - elements.__start, expected = (duration + delay) / 2;
            assert.close(actual, expected, 32, "Delayed animation includes speed for delay. (\xD72, " + Math.floor(actual - expected) + "ms \xB132ms)");
            done();
        }
    });
    Velocity(getTarget(), defaultProperties, {
        duration: duration,
        delay: -delay,
        speed: 2,
        begin: function (elements) {
            elements.__start = startDelay;
        },
        complete: function (elements) {
            var actual = getNow() - elements.__start, expected = (duration - delay) / 2;
            assert.close(actual, expected, 32, "Negative delay animation includes speed for delay. (\xD72, " + Math.floor(actual - expected) + "ms \xB132ms)");
            done();
        }
    });
    Velocity(getTarget(), defaultProperties, {
        duration: duration,
        speed: 0.5,
        begin: function (elements) {
            elements.__start = getNow();
        },
        complete: function (elements) {
            var actual = getNow() - elements.__start, expected = duration * 2;
            // TODO: Really not happy with the allowed range - it sits around 40ms, but should be closer to 16ms
            assert.close(actual, expected, 64, "Half speed animation lasts twice as long. (\xD7\xBD, " + Math.floor(actual - expected) + "ms \xB164ms)");
            done();
        }
    });
    Velocity(getTarget(), defaultProperties, {
        duration: duration,
        speed: 0,
        progress: function (elements, percentComplete) {
            if (!elements.__count) {
                elements.__start = percentComplete;
                elements.__count = 1;
            }
            else {
                assert.equal(elements.__start, percentComplete, "Frozen (speed:0) animation doesn't progress.");
                elements
                    .velocity("option", "speed", 1) // Just in case "stop" is broken
                    .velocity("stop");
                done();
            }
        }
    });
});
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.module("Command");
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
var _this = this;
QUnit.todo("Finish / FinishAll", function (assert) { return __awaiter(_this, void 0, void 0, function () {
    var $target1, $target2, $target3, $target4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                $target1 = getTarget();
                assert.expect(9);
                /* Ensure an error isn't thrown when "finish" is called on a $target that isn't animating. */
                Velocity($target1, "finish");
                /* Animate to defaultProperties, and then "finish" to jump to the end of it. */
                Velocity($target1, defaultProperties, Object.assign({}, defaultOptions, { delay: 1000 }));
                Velocity($target1, "finish");
                return [4 /*yield*/, sleep(asyncCheckDuration)];
            case 1:
                _a.sent();
                /* Ensure "finish" has removed all queued animations. */
                /* We're using the element's queue length as a proxy. 0 and 1 both mean that the element's queue has been cleared -- a length of 1 just indicates that the animation is in progress. */
                assert.equal(isEmptyObject(Data($target1).queueList), true, "Queue cleared.");
                /* End result of the animation should be applied */
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "width")), defaultProperties.width, "Standard end value #1 was set.");
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "opacity")), defaultProperties.opacity, "Standard end value #2 was set.");
                $target2 = getTarget();
                Velocity($target2, { opacity: 0 }, Object.assign({}, defaultOptions, { delay: 1000 }));
                Velocity($target2, { width: 0 }, defaultOptions);
                Velocity($target2, "finish");
                $target3 = getTarget();
                Velocity($target3, { opacity: 0, width: 50 }, Object.assign({}, defaultOptions, { delay: 1000 }));
                Velocity($target3, { width: 0 }, defaultOptions);
                Velocity($target3, { width: 100 }, defaultOptions);
                Velocity($target3, "finish");
                $target4 = getTarget();
                Velocity($target4, { opacity: 0, width: 50 }, Object.assign({}, defaultOptions, { delay: 1000 }));
                Velocity($target4, { width: 0 }, defaultOptions);
                Velocity($target4, { width: 100 }, defaultOptions);
                Velocity($target4, "finishAll");
                return [4 /*yield*/, sleep(asyncCheckDuration)];
            case 2:
                _a.sent();
                assert.equal(Data($target2).cache.opacity, undefined, "Active call stopped.");
                assert.notEqual(Data($target2).cache.width, undefined, "Next queue item started.");
                assert.equal(!Data($target3) || !Data($target3).queueList, true, "Full queue array cleared.");
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target3, "width")), 50, "Just the first call's width was applied.");
                assert.equal(!Data($target4) || !Data($target4).queueList, true, "Full queue array cleared.");
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target4, "width")), 100, "The last call's width was applied.");
                return [2 /*return*/];
        }
    });
}); });
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
var _this = this;
QUnit.test("Pause / Resume", function (assert) { return __awaiter(_this, void 0, void 0, function () {
    var $target1, $target1d, $target2, $target2d, $target3, percent, isPaused, val, $targetC, $targetD, $targetA, $targetB, $targetC, $targetD, $target4, isResumed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                $target1 = getTarget(), $target1d = getTarget();
                assert.expect(12);
                /* Ensure an error isn't thrown when "pause" is called on a $target that isn't animating. */
                Velocity($target1, "pause");
                Velocity($target1d, "pause");
                /* Ensure an error isn't thrown when "pause" is called on a $target that isn't animating. */
                Velocity($target1, "resume");
                Velocity($target1d, "resume");
                /* Ensure a paused $target ceases to animate */
                Velocity($target1, { opacity: 0 }, defaultOptions);
                Velocity($target1d, { opacity: 0 }, Object.assign({}, defaultOptions, { delay: 200 }));
                Velocity($target1, "pause").then(function () {
                    assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "opacity")), 1, "Property value unchanged after pause.");
                });
                Velocity($target1d, "pause").then(function () {
                    assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1d, "opacity")), 1, "Property value unchanged after pause during delay.");
                });
                $target2 = getTarget();
                $target2d = getTarget();
                Velocity($target2, { opacity: 0 }, defaultOptions);
                Velocity($target2d, { opacity: 0 }, Object.assign({}, defaultOptions, { delay: 100 }));
                Velocity($target2, "pause");
                Velocity($target2, "resume");
                return [4 /*yield*/, sleep(40)];
            case 1:
                _a.sent();
                Velocity($target2d, "pause");
                return [4 /*yield*/, sleep(130)];
            case 2:
                _a.sent();
                Velocity($target2d, "resume");
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target2d, "opacity")), 1, "Delayed tween did not start early after pause.");
                return [4 /*yield*/, sleep(250)];
            case 3:
                _a.sent();
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target2, "opacity")), 0, "Tween completed after pause/resume.");
                return [4 /*yield*/, sleep(100)];
            case 4:
                _a.sent();
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target2d, "opacity")), 0, "Delayed tween completed after pause/resume.");
                $target3 = getTarget(), percent = 0, isPaused = false;
                Velocity($target3, { opacity: 0 }, {
                    duration: 200,
                    easing: "linear",
                    progress: function (elements, _percentComplete, _msRemaining) {
                        if (isPaused) {
                            console.error("Progress callback run after pause.");
                        }
                        percent = _percentComplete;
                    }
                });
                /* Pause element midway through tween */
                return [4 /*yield*/, sleep(100)];
            case 5:
                /* Pause element midway through tween */
                _a.sent();
                Velocity($target3, "pause");
                isPaused = true;
                return [4 /*yield*/, sleep(100)];
            case 6:
                _a.sent();
                Velocity($target3, "resume");
                isPaused = false;
                return [4 /*yield*/, sleep(100)];
            case 7:
                _a.sent();
                val = parseFloat(Velocity.CSS.getPropertyValue($target3, "opacity"));
                /* Prop value and percentage complete should correlate after pause. We need to test this since
                 the timing variables used to calculate and return the percentage complete and msRemaining are
                 modified after pause and resume comamands have been issued on the call */
                // TODO: These both had a 2nd argument to the Math.round - 4
                assert.ok(Math.round(1 - val) === Math.round(percent), "Tween value and percentageComplete correlate correctly after pause.");
                $targetC = getTarget(), $targetD = getTarget();
                Velocity([$targetC, $targetD], { opacity: 0 }, {
                    duration: 100,
                }).then(function () {
                    //TODO this promise doesn't get resolved
                    //assert.equal(parseFloat(Velocity.CSS.getPropertyValue($targetD, "opacity") as string), 0, "Should be 1");
                    //assert.notEqual(parseFloat(Velocity.CSS.getPropertyValue($targetC, "opacity") as string), 0, "Should be 0");
                });
                Velocity($targetC, "pause");
                Velocity($targetD, "pause");
                // resume first element
                return [4 /*yield*/, sleep(50)];
            case 8:
                // resume first element
                _a.sent();
                Velocity($targetC, "resume");
                //TODO this is resolved instead of the promise. Should remove and use it inside of then() above
                return [4 /*yield*/, sleep(150)];
            case 9:
                //TODO this is resolved instead of the promise. Should remove and use it inside of then() above
                _a.sent();
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($targetD, "opacity")), 1, "Second tween animation must have not started when pausing both elements and resuming first tween.");
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($targetC, "opacity")), 0, "First tween animation must be completed when pausing both elements and resuming only first tween.");
                $targetA = getTarget(), $targetB = getTarget();
                Velocity([$targetA, $targetB], { opacity: 0 }, {
                    queue: "test",
                    duration: 100,
                }).then(function () {
                    //assert.equal(parseFloat(Velocity.CSS.getPropertyValue($targetB, "opacity") as string), 0, "Second tween animation finished when pausing the first tween being in same queue");
                    //assert.notEqual(parseFloat(Velocity.CSS.getPropertyValue($targetA, "opacity") as string), 0, "First tween should have animated opacity since it isn't paused being in same queue");
                });
                Velocity($targetA, "pause", "test");
                $targetC = getTarget(), $targetD = getTarget();
                Velocity([$targetC, $targetD], { opacity: 0 }, {
                    queue: "test",
                    duration: 100,
                }).then(function () {
                    //TODO this promise doesn't get resolved
                    //assert.equal(parseFloat(Velocity.CSS.getPropertyValue($targetD, "opacity") as string), 0, "Should be 1");
                    //assert.notEqual(parseFloat(Velocity.CSS.getPropertyValue($targetC, "opacity") as string), 0, "Should be 0");
                });
                Velocity($targetC, "pause", "test");
                Velocity($targetD, "pause", "test");
                // resume first element
                return [4 /*yield*/, sleep(50)];
            case 10:
                // resume first element
                _a.sent();
                Velocity($targetC, "resume", "test");
                //TODO this is resolved instead of the promise. Should remove and use it inside of then() above
                return [4 /*yield*/, sleep(150)];
            case 11:
                //TODO this is resolved instead of the promise. Should remove and use it inside of then() above
                _a.sent();
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($targetD, "opacity")), 1, "Second tween animation must have not started when pausing both elements and resuming first tween when in same queue.");
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($targetC, "opacity")), 0, "First tween animation must be completed when pausing both elements and resuming only first tween when in same queue.");
                $target4 = getTarget();
                Velocity($target4, { opacity: 0 }, { duration: 200 });
                isResumed = false;
                return [4 /*yield*/, sleep(100)];
            case 12:
                _a.sent();
                Velocity($target4, "pause");
                Velocity($target4, { left: -20 }, {
                    duration: 100,
                    easing: "linear",
                    queue: false,
                    begin: function (elements) {
                        assert.ok(true, "Animation with {queue:false} will run regardless of previously paused animations.");
                    }
                });
                Velocity($target4, { top: 20 }, {
                    duration: 100,
                    easing: "linear",
                    begin: function (elements) {
                        assert.ok(isResumed, "Queued animation began after previously paused animation completed");
                    }
                });
                return [4 /*yield*/, sleep(100)];
            case 13:
                _a.sent();
                isResumed = true;
                Velocity($target4, "resume");
                return [4 /*yield*/, sleep(100)];
            case 14:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.todo("Global Pause / Resume", function (assert) {
    var done = assert.async(4), $target1 = getTarget(), $target2 = getTarget(), $target3 = getTarget(), $target4 = getTarget(), isPaused = false, hasProgressed2 = false;
    assert.expect(3);
    Velocity($target1, { opacity: 0 }, Object.assign({}, defaultOptions, {
        delay: 100,
        queue: false,
        progress: function (elements, progress, msRemaining) {
            if (isPaused) {
                throw new Error("Delayed Tween should not progress when globally paused");
            }
        }
    }));
    Velocity($target2, { opacity: 0 }, Object.assign({}, defaultOptions, {
        progress: function (elements, progress, msRemaining) {
            if (isPaused) {
                assert.ok(false, "Tween resumes on individual pause after global resume");
                done();
            }
            else if (!hasProgressed2) {
                hasProgressed2 = true;
                assert.ok(true, "Tween resumes on individual pause after global resume");
                done();
            }
        }
    }));
    Velocity.pauseAll();
    isPaused = true;
    /* Testing with custom queues */
    var hasProgressed3 = false;
    Velocity($target3, { opacity: 0 }, Object.assign({}, defaultOptions, {
        queue: "queue1",
        progress: function (elements, progress, msRemaining) {
            if (!hasProgressed3) {
                hasProgressed3 = true;
                assert.ok(true, "Tweens created after global pause begin immediately");
                done();
            }
        }
    }));
    var hasProgressed4 = false;
    Velocity($target4, { opacity: 0 }, Object.assign({}, defaultOptions, {
        queue: "queue2",
        progress: function (elements, progress, msRemaining) {
            if (!hasProgressed4) {
                hasProgressed4 = true;
                if (isPaused) {
                    assert.ok(false, "Paused tweens on a queue resume after a global resumeAll call");
                }
                else {
                    assert.ok(true, "Paused tweens on a queue resume after a global resumeAll call");
                }
                done();
            }
        }
    }));
    /* Only $target4 should pause */
    Velocity.pauseAll("queue2");
    setTimeout(function () {
        isPaused = false;
        Velocity.resumeAll();
    }, 200);
    setTimeout(function () {
        done(); // Let the tests know when we're running normally again
        Velocity.resumeAll();
    }, 400);
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.skip("Reverse", function (assert) {
    var done = assert.async(1), testEasing = "spring", $target = getTarget();
    assert.expect(4);
    Velocity($target, { opacity: defaultProperties.opacity, width: defaultProperties.width }, { easing: testEasing });
    Velocity($target, "reverse", function () {
        //					assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target, "opacity")), defaultStyles.opacity, "Reversed to initial property #1.");
        //					assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target, "width")), defaultStyles.width, "Reversed to initial property #2.");
        //
        //					done();
    });
    /* Check chained reverses. */
    Velocity($target, "reverse", function () {
        assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target, "opacity")), defaultProperties.opacity, "Reversed to reversed property #1.");
        assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target, "width")), defaultProperties.width, "Reversed to reversed property #2.");
        /* Ensure the options were passed through until the end. */
        //		assert.equal(Data($target).opts.easing, testEasing, "Options object passed through.");
        done();
    });
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
/* Window scrolling. */
QUnit.skip("Scroll (Window)", function (assert) {
    var done = assert.async(4), $details = $("#details"), $scrollTarget1 = $("<div>Scroll target #1. Should stop 50 pixels above this point.</div>"), $scrollTarget2 = $("<div>Scroll target #2. Should stop 50 pixels before this point.</div>"), scrollOffset = -50;
    $scrollTarget1
        .css({ position: "relative", top: 3000, height: 100, paddingBottom: 10000 })
        .appendTo($("body"));
    $scrollTarget2
        .css({ position: "absolute", top: 100, left: 3000, width: 100, paddingRight: 15000 })
        .appendTo($("body"));
    $scrollTarget1
        .velocity("scroll", { duration: 500, offset: scrollOffset, complete: function () {
            assert.equal(Math.abs(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyTop] - ($scrollTarget1.offset().top + scrollOffset)) <= 100, true, "Page scrolled top with a scroll offset.");
            done();
        }
    })
        .velocity({ opacity: 0.5 }, function () {
        $details
            .velocity({ opacity: 0.5 }, 500)
            .velocity("scroll", 500)
            .velocity({ opacity: 1 }, 500, function () {
            //alert(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyTop] + " " + ($details.offset().top + scrollOffset))
            assert.equal(Math.abs(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyTop] - ($details.offset().top + scrollOffset)) <= 100, true, "Page scroll top was chained.");
            done();
            //$scrollTarget1.remove();
            $scrollTarget2
                .velocity("scroll", { duration: 500, axis: "x", offset: scrollOffset, complete: function () {
                    /* Phones can reposition the browser's scroll position by a 10 pixels or so, so we just check for a value that's within that range. */
                    assert.equal(Math.abs(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyLeft] - ($scrollTarget2.offset().left + scrollOffset)) <= 100, true, "Page scrolled left with a scroll offset.");
                    done();
                }
            })
                .velocity({ opacity: 0.5 }, function () {
                $details
                    .velocity({ opacity: 0.5 }, 500)
                    .velocity("scroll", { duration: 500, axis: "x" })
                    .velocity({ opacity: 1 }, 500, function () {
                    assert.equal(Math.abs(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyLeft] - ($details.offset().left + scrollOffset)) <= 100, true, "Page scroll left was chained.");
                    done();
                });
            });
        });
    });
});
/* Element scrolling. */
QUnit.skip("Scroll (Element)", function (assert) {
    var done = assert.async(2), $scrollTarget1 = $("\
					<div id='scroller'>\
						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
						<div id='scrollerChild1'>\
							Stop #1\
							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
						</div>\
						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
						<div id='scrollerChild2'>\
							Stop #2\
							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
						</div>\
						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
					</div>\
				");
    assert.expect(2);
    $scrollTarget1
        .css({ position: "absolute", backgroundColor: "white", top: 100, left: "50%", width: 500, height: 100, overflowY: "scroll" })
        .appendTo($("body"));
    /* Test with a jQuery object container. */
    $("#scrollerChild1").velocity("scroll", { container: $("#scroller"), duration: 750, complete: function () {
            /* Test with a raw DOM element container. */
            $("#scrollerChild2").velocity("scroll", { container: $("#scroller")[0], duration: 750, complete: function () {
                    /* This test is purely visual. */
                    assert.ok(true);
                    $scrollTarget1.remove();
                    var $scrollTarget2 = $("\
									<div id='scroller'>\
										<div id='scrollerChild1' style='float: left; width: 20%;'>\
											Stop #1\
											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
										</div>\
										<div id='scrollerChild2' style='float: right; width: 20%;'>\
											Stop #2\
											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
										</div>\
									</div>\
								");
                    $scrollTarget2
                        .css({ position: "absolute", backgroundColor: "white", top: 100, left: "50%", width: 100, height: 500, overflowX: "scroll" })
                        .appendTo($("body"));
                    /* Test with a jQuery object container. */
                    $("#scrollerChild2").velocity("scroll", { axis: "x", container: $("#scroller"), duration: 750, complete: function () {
                            /* Test with a raw DOM element container. */
                            $("#scrollerChild1").velocity("scroll", { axis: "x", container: $("#scroller")[0], duration: 750, complete: function () {
                                    /* This test is purely visual. */
                                    assert.ok(true);
                                    $scrollTarget2.remove();
                                    done();
                                }
                            });
                        }
                    });
                    done();
                }
            });
        }
    });
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
var _this = this;
QUnit.test("Stop", function (assert) { return __awaiter(_this, void 0, void 0, function () {
    var $target1, $target2, $target3, $target4, $target5, $target6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                $target1 = getTarget();
                assert.expect(8);
                /* Ensure an error isn't thrown when "stop" is called on a $target that isn't animating. */
                Velocity($target1, "stop");
                Velocity($target1, defaultProperties, defaultOptions);
                Velocity($target1, { top: 0 }, defaultOptions);
                Velocity($target1, { width: 0 }, defaultOptions);
                Velocity($target1, "stop");
                return [4 /*yield*/, sleep(1)];
            case 1:
                _a.sent();
                $target2 = getTarget();
                Velocity($target2, { width: 0 }, defaultOptions);
                return [4 /*yield*/, sleep(150)];
            case 2:
                _a.sent();
                Velocity($target2, "stop");
                /* End result of the animation should be applied */
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target2, "width")), parseFloat($target2.style.width) / 2, "Standard end value width was set.");
                Velocity($target2, { opacity: 0 }, Object.assign({}, defaultOptions, { delay: 1000 }));
                return [4 /*yield*/, sleep(defaultOptions.duration / 2)];
            case 3:
                _a.sent();
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "opacity")), 1, "Should not have started animation with delay.");
                $target3 = getTarget();
                Velocity($target3, { opacity: 0 }, Object.assign({}, defaultOptions, { queue: "test" }));
                Velocity($target3, "stop");
                return [4 /*yield*/, sleep(defaultOptions.duration)];
            case 4:
                _a.sent();
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target3, "opacity")), 1, "Should have not stopped animation with queue.");
                $target4 = getTarget();
                Velocity($target4, { opacity: 0 }, Object.assign({}, defaultOptions, { queue: "test" }));
                Velocity($target4, "stop", "test");
                return [4 /*yield*/, sleep(defaultOptions.duration)];
            case 5:
                _a.sent();
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target4, "opacity")), 1, "Should have stopped animation with queue.");
                $target5 = getTarget();
                Velocity($target5, { opacity: 0 }, defaultOptions);
                Velocity($target5, { width: "500px" }, defaultOptions);
                Velocity($target5, "stop");
                return [4 /*yield*/, sleep(defaultOptions.duration)];
            case 6:
                _a.sent();
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target5, "opacity")), 1, "Should have stopped all animations and have initial opacity.");
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target5, "width")), 1, "Should have stopped all animations and have initial width.");
                $target6 = getTarget();
                Velocity($target6, { opacity: 0 }, Object.assign({}, defaultOptions, { queue: "test" }));
                Velocity($target6, { width: "500px" }, Object.assign({}, defaultOptions, { queue: "test" }));
                Velocity($target6, "stop", "test");
                return [4 /*yield*/, sleep(defaultOptions.duration)];
            case 7:
                _a.sent();
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target6, "opacity")), 1, "Should have stopped all animations with queue and have initial opacity.");
                assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target6, "width")), 1, "Should have stopped all animations with queue and have initial width.");
                return [2 /*return*/];
        }
    });
}); });
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Tween", function (assert) {
    var $target1 = getTarget(), startOpacity = $target1.style.opacity;
    assert.expect(11);
    assert.raises(function () { Velocity("tween", "invalid"); }, "Invalid percentComplete throws an error.");
    assert.raises(function () { Velocity([$target1, $target1], "tween", "invalid"); }, "Passing more than one target throws an error.");
    assert.raises(function () { Velocity("tween", 0, ["invalid"]); }, "Invalid propertyMap throws an error.");
    assert.raises(function () { Velocity("tween", 0, "invalid", 1); }, "Property without an element must be forcefed or throw an error.");
    assert.equal($target1.velocity("tween", 0.5, "opacity", [1, 0], "linear"), "0.5", "Calling on an chain returns the correct value.");
    assert.equal(Velocity($target1, "tween", 0.5, "opacity", [1, 0], "linear"), "0.5", "Calling with an element returns the correct value.");
    assert.equal(Velocity("tween", 0.5, "opacity", [1, 0], "linear"), "0.5", "Calling without an element returns the correct value.");
    assert.equal($target1.style.opacity, startOpacity, "Ensure that the element is not altered.");
    assert.equal(typeof Velocity($target1, "tween", 0.5, "opacity", [1, 0], "linear"), "string", "Calling a single property returns a value.");
    assert.equal(typeof Velocity($target1, "tween", 0.5, { opacity: [1, 0] }, "linear"), "object", "Calling a propertiesMap returns an object.");
    assert.deepEqual($target1.velocity("tween", 0.5, { opacity: [1, 0] }, "linear"), Velocity($target1, "tween", 0.5, { opacity: [1, 0] }, "linear"), "Calling directly returns the same as a chain.");
});
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.module("Feature");
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("'velocity-animating' Classname", function (assert) {
    var done = assert.async(1);
    Velocity(getTarget(), defaultProperties, {
        begin: function (elements) {
            assert.equal(/velocity-animating/.test(elements[0].className), true, "Class added.");
        },
        complete: function (elements) {
            assert.equal(/velocity-animating/.test(elements[0].className), false, "Class removed.");
        }
    }).then(done);
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.skip("Colors (Shorthands)", function (assert) {
    var $target = getTarget();
    Velocity($target, { borderColor: "#7871c2", color: ["#297dad", "spring", "#5ead29"] });
    //	assert.equal(Data($target).style.borderColorRed.endValue, 120, "Hex #1a component.");
    //	assert.equal(Data($target).style.borderColorGreen.endValue, 113, "Hex #1b component.");
    //	assert.equal(Data($target).style.borderColorBlue.endValue, 194, "Hex #1c component.");
    //	assert.equal(Data($target).style.colorRed.easing, "spring", "Per-property easing.");
    //	assert.equal(Data($target).style.colorRed.startValue, 94, "Forcefed hex #2a component.");
    //	assert.equal(Data($target).style.colorGreen.startValue, 173, "Forcefed hex #2b component.");
    //	assert.equal(Data($target).style.colorBlue.startValue, 41, "Forcefed hex #2c component.");
    //	assert.equal(Data($target).style.colorRed.endValue, 41, "Hex #3a component.");
    //	assert.equal(Data($target).style.colorGreen.endValue, 125, "Hex #3b component.");
    //	assert.equal(Data($target).style.colorBlue.endValue, 173, "Hex #3c component.");
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.todo("Forcefeeding", function (assert) {
    /* Note: Start values are always converted into pixels. W test the conversion ratio we already know to avoid additional work. */
    var testStartWidth = "1rem", testStartWidthToPx = "16px", testStartHeight = "10px";
    var $target = getTarget();
    Velocity($target, { width: [100, "linear", testStartWidth], height: [100, testStartHeight], opacity: [defaultProperties.opacity, "easeInQuad"] });
    assert.equal(Data($target).cache.width, parseFloat(testStartWidthToPx), "Forcefed value #1 passed to tween.");
    assert.equal(Data($target).cache.height, parseFloat(testStartHeight), "Forcefed value #2 passed to tween.");
    assert.equal(Data($target).cache.opacity, defaultStyles.opacity, "Easing was misinterpreted as forcefed value.");
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Promises", function (assert) {
    var done = assert.async(9), result, start = getNow();
    assert.expect(9);
    /**********************
     Invalid Arguments
     **********************/
    Velocity().then(function () {
        assert.notOk(true, "Calling with no arguments should reject a Promise.");
    }, function () {
        assert.ok(true, "Calling with no arguments should reject a Promise.");
    }).then(done);
    Velocity(getTarget()).then(function () {
        assert.notOk(true, "Calling with no properties should reject a Promise.");
    }, function () {
        assert.ok(true, "Calling with no properties should reject a Promise.");
    }).then(done);
    Velocity(getTarget(), {}).then(function () {
        assert.ok(true, "Calling with empty properties should not reject a Promise.");
    }, function () {
        assert.notOk(true, "Calling with empty properties should not reject a Promise.");
    }).then(done);
    Velocity(getTarget(), {}, defaultOptions.duration).then(function () {
        assert.ok(true, "Calling with empty properties + duration should not reject a Promise.");
    }, function () {
        assert.notOk(true, "Calling with empty properties + duration should not reject a Promise.");
    }).then(done);
    /* Invalid arguments: Ensure an error isn't thrown. */
    Velocity(getTarget(), {}, "fakeArg1", "fakeArg2").then(function () {
        assert.ok(true, "Calling with invalid arguments should reject a Promise.");
    }, function () {
        assert.notOk(true, "Calling with invalid arguments should reject a Promise.");
    }).then(done);
    result = Velocity(getTarget(), defaultProperties, defaultOptions);
    result.then(function (elements) {
        assert.equal(elements.length, 1, "Calling with a single element fulfills with a single element array.");
    }, function () {
        assert.ok(false, "Calling with a single element fulfills with a single element array.");
    }).then(done);
    result.velocity(defaultProperties).then(function (elements) {
        assert.ok(getNow() - start > 2 * defaultOptions.duration, "Queued call fulfilled after correct delay.");
    }, function () {
        assert.ok(false, "Queued call fulfilled after correct delay.");
    }).then(done);
    result = Velocity([getTarget(), getTarget()], defaultProperties, defaultOptions);
    result.then(function (elements) {
        assert.equal(elements.length, 2, "Calling with multiple elements fulfills with a multiple element array.");
    }, function () {
        assert.ok(false, "Calling with multiple elements fulfills with a multiple element array.");
    }).then(done);
    var anim = Velocity(getTarget(), defaultProperties, defaultOptions);
    anim.then(function () {
        assert.ok(getNow() - start < defaultOptions.duration, "Stop call fulfilled after correct delay.");
    }, function () {
        assert.ok(false, "Stop call fulfilled after correct delay.");
    }).then(done);
    anim.velocity("stop");
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Redirects", function (assert) {
    var done = assert.async(2), $target1 = getTarget(), $target2 = getTarget(), redirectOptions = { duration: 1500 };
    (window.jQuery || window.Zepto || window).Velocity.Redirects.test = function (element, options, elementIndex, elementsLength) {
        if (elementIndex === 0) {
            assert.deepEqual(element, $target1, "Element passed through #1.");
            assert.deepEqual(options, redirectOptions, "Options object passed through #1.");
            assert.equal(elementIndex, 0, "Element index passed through #1.");
            assert.equal(elementsLength, 2, "Elements length passed through #1.");
            done();
        }
        else if (elementIndex === 1) {
            assert.deepEqual(element, $target2, "Element passed through #2.");
            assert.deepEqual(options, redirectOptions, "Options object passed through #2.");
            assert.equal(elementIndex, 1, "Element index passed through #2.");
            assert.equal(elementsLength, 2, "Elements length passed through #2.");
            done();
        }
    };
    Velocity([$target1, $target2], "test", redirectOptions);
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.todo("Value Functions", function (assert) {
    var testWidth = 10;
    var $target1 = getTarget(), $target2 = getTarget();
    Velocity([$target1, $target2], {
        width: function (i, total) {
            return (i + 1) / total * testWidth;
        }
    });
    assert.equal(Data($target1).cache.width, parseFloat(testWidth) / 2, "Function value #1 passed to tween.");
    assert.equal(Data($target2).cache.width, parseFloat(testWidth), "Function value #2 passed to tween.");
});
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.module("UI Pack");
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.todo("Packaged Effect: slideUp/Down", function (assert) {
    var done = assert.async(4), $target1 = getTarget(), $target2 = getTarget(), initialStyles = {
        display: "none",
        paddingTop: "123px"
    };
    $target1.style.display = initialStyles.display;
    $target1.style.paddingTop = initialStyles.paddingTop;
    Velocity($target1, "slideDown", {
        begin: function (elements) {
            assert.deepEqual(elements, [$target1], "slideDown: Begin callback returned.");
            done();
        },
        complete: function (elements) {
            assert.deepEqual(elements, [$target1], "slideDown: Complete callback returned.");
            //			assert.equal(Velocity.CSS.getPropertyValue($target1, "display"), Velocity.CSS.Values.getDisplayType($target1), "slideDown: display set to default.");
            assert.notEqual(Velocity.CSS.getPropertyValue($target1, "height"), 0, "slideDown: height set.");
            assert.equal(Velocity.CSS.getPropertyValue($target1, "paddingTop"), initialStyles.paddingTop, "slideDown: paddingTop set.");
            done();
        }
        //	}).then(function(elements) {
        //		assert.deepEqual(elements, [$target1], "slideDown: Promise fulfilled.");
        //
        //		done();
    });
    Velocity($target2, "slideUp", {
        begin: function (elements) {
            assert.deepEqual(elements, [$target2], "slideUp: Begin callback returned.");
            done();
        },
        complete: function (elements) {
            assert.deepEqual(elements, [$target2], "slideUp: Complete callback returned.");
            assert.equal(Velocity.CSS.getPropertyValue($target2, "display"), 0, "slideUp: display set to none.");
            assert.notEqual(Velocity.CSS.getPropertyValue($target2, "height"), 0, "slideUp: height reset.");
            assert.equal(Velocity.CSS.getPropertyValue($target1, "paddingTop"), initialStyles.paddingTop, "slideUp: paddingTop reset.");
            done();
        }
        //	}).then(function(elements) {
        //		assert.deepEqual(elements, [$target2], "slideUp: Promise fulfilled.");
        //
        //		done();
    });
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.skip("Call Options", function (assert) {
    var done = assert.async(2), UICallOptions1 = {
        delay: 123,
        duration: defaultOptions.duration,
        easing: "spring" // Should get ignored
    }, $target1 = getTarget();
    //assert.expect(1);
    Velocity($target1, "transition.slideLeftIn", UICallOptions1);
    setTimeout(function () {
        // Note: We can do this because transition.slideLeftIn is composed of a single call.
        //		assert.equal(Data($target1).opts.delay, UICallOptions1.delay, "Whitelisted option passed in.");
        //		assert.notEqual(Data($target1).opts.easing, UICallOptions1.easing, "Non-whitelisted option not passed in #1a.");
        //		assert.equal(!/velocity-animating/.test(Data($target1).className), true, "Duration option passed in.");
        done();
    }, completeCheckDuration);
    var UICallOptions2 = {
        stagger: 100,
        duration: defaultOptions.duration,
        backwards: true
    };
    var $targets = [getTarget(), getTarget(), getTarget()];
    Velocity($targets, "transition.slideLeftIn", UICallOptions2);
    setTimeout(function () {
        //		assert.equal(Data($targets[0]).opts.delay, UICallOptions2.stagger * 2, "Backwards stagger delay passed in #1a.");
        //		assert.equal(Data($targets[1]).opts.delay, UICallOptions2.stagger * 1, "Backwards stagger delay passed in #1b.");
        //		assert.equal(Data($targets[2]).opts.delay, UICallOptions2.stagger * 0, "Backwards stagger delay passed in #1c.");
        done();
    }, completeCheckDuration);
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.todo("Callbacks", function (assert) {
    var done = assert.async(2), $targets = [getTarget(), getTarget()];
    assert.expect(3);
    Velocity($targets, "transition.bounceIn", {
        begin: function (elements) {
            assert.deepEqual(elements, $targets, "Begin callback returned.");
            done();
        },
        complete: function (elements) {
            assert.deepEqual(elements, $targets, "Complete callback returned.");
            done();
        }
        //	}).then(function(elements) {
        //		assert.deepEqual(elements, $targets, "Promise fulfilled.");
        //
        //		done();
    });
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.todo("In/Out", function (assert) {
    var done = assert.async(2), $target1 = getTarget(), $target2 = getTarget(), $target3 = getTarget(), $target4 = getTarget(), $target5 = getTarget(), $target6 = getTarget();
    Velocity($target1, "transition.bounceIn", defaultOptions.duration);
    Velocity($target2, "transition.bounceIn", { duration: defaultOptions.duration, display: "inline" });
    Velocity($target3, "transition.bounceOut", defaultOptions.duration);
    Velocity($target4, "transition.bounceOut", { duration: defaultOptions.duration, display: null });
    $target5.style.visibility = "hidden";
    Velocity($target5, "transition.bounceIn", { duration: defaultOptions.duration, visibility: "visible" });
    $target6.style.visibility = "visible";
    Velocity($target6, "transition.bounceOut", { duration: defaultOptions.duration, visibility: "hidden" });
    assert.expect(8);
    setTimeout(function () {
        assert.notEqual(Velocity.CSS.getPropertyValue($target3, "display"), 0, "Out: display not prematurely set to none.");
        assert.notEqual(Velocity.CSS.getPropertyValue($target6, "visibility"), "hidden", "Out: visibility not prematurely set to hidden.");
        done();
    }, asyncCheckDuration);
    setTimeout(function () {
        //		assert.equal(Velocity.CSS.getPropertyValue($target1, "display"), Velocity.CSS.Values.getDisplayType($target1), "In: display set to default.");
        assert.equal(Velocity.CSS.getPropertyValue($target2, "display"), "inline", "In: Custom inline value set.");
        assert.equal(Velocity.CSS.getPropertyValue($target3, "display"), 0, "Out: display set to none.");
        //		assert.equal(Velocity.CSS.getPropertyValue($target4, "display"), Velocity.CSS.Values.getDisplayType($target3), "Out: No display value set.");
        assert.equal(Velocity.CSS.getPropertyValue($target5, "visibility"), "visible", "In: visibility set to visible.");
        assert.equal(Velocity.CSS.getPropertyValue($target6, "visibility"), "hidden", "Out: visibility set to hidden.");
        done();
    }, completeCheckDuration);
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.todo("RegisterEffect", function (assert) {
    var done = assert.async(1), effectDefaultDuration = 800;
    assert.expect(2);
    Velocity.RegisterEffect("callout.twirl", {
        defaultDuration: effectDefaultDuration,
        calls: [
            [{ rotateZ: 1080 }, 0.50],
            [{ scaleX: 0.5 }, 0.25, { easing: "spring" }],
            [{ scaleX: 1 }, 0.25, { easing: "spring" }]
        ]
    });
    var $target1 = getTarget();
    Velocity($target1, "callout.twirl");
    setTimeout(function () {
        assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "rotateZ")), 1080, "First call's property animated.");
        assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "scaleX")), 1, "Last call's property animated.");
        done();
    }, effectDefaultDuration * 1.50);
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.skip("RunSequence", function (assert) {
    var done = assert.async(1), $target1 = getTarget(), $target2 = getTarget(), $target3 = getTarget(), mySequence = [
        { elements: $target1, properties: { opacity: defaultProperties.opacity } },
        { elements: $target2, properties: { height: defaultProperties.height } },
        {
            elements: $target3, properties: { width: defaultProperties.width }, options: {
                delay: 100,
                sequenceQueue: false,
                complete: function () {
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
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.module("Properties");
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.todo("GenericReordering", function (assert) {
    var tests = [
        {
            test: "hsl(16, 100%, 66%) 1px 1px 1px",
            result: "1px 1px 1px hsl(16, 100%, 66%)",
        }, {
            test: "-webkit-linear-gradient(red, yellow) 1px 1px 1px",
            result: "1px 1px 1px -webkit-linear-gradient(red, yellow)",
        }, {
            test: "-o-linear-gradient(red, yellow) 1px 1px 1px",
            result: "1px 1px 1px -o-linear-gradient(red, yellow)",
        }, {
            test: "-moz-linear-gradient(red, yellow) 1px 1px 1px",
            result: "1px 1px 1px -moz-linear-gradient(red, yellow)",
        }, {
            test: "linear-gradient(red, yellow) 1px 1px 1px",
            result: "1px 1px 1px linear-gradient(red, yellow)",
        }, {
            test: "red 1px 1px 1px",
            result: "1px 1px 1px red",
        }, {
            test: "#000000 1px 1px 1px",
            result: "1px 1px 1px #000000",
        }, {
            test: "rgb(0, 0, 0) 1px 1px 1px",
            result: "1px 1px 1px rgb(0, 0, 0)",
        }, {
            test: "rgba(0, 0, 0, 1) 1px 1px 1px",
            result: "1px 1px 1px rgba(0, 0, 0, 1)",
        }, {
            test: "1px 1px 1px rgb(0, 0, 0)",
            result: "1px 1px 1px rgb(0, 0, 0)",
        },
    ];
    for (var _i = 0, tests_1 = tests; _i < tests_1.length; _i++) {
        var test = tests_1[_i];
        var element = getTarget();
        element.style.textShadow = test.test;
        assert.equal(Velocity.CSS.Normalizations["textShadow"](element), test.result, test.test);
    }
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Display", function (assert) {
    var done = assert.async(5);
    Velocity(getTarget(), "style", "display", "none")
        .velocity({ display: "block" }, {
        progress: once(function (elements) {
            assert.equal(elements.velocity("style", "display"), "block", "Display:'block' was set immediately.");
            done();
        })
    });
    Velocity(getTarget(), "style", "display", "none")
        .velocity("style", "display", "auto")
        .then(function (elements) {
        assert.equal(elements[0].style.display, "block", "Display:'auto' was understood.");
        assert.equal(elements.velocity("style", "display"), "block", "Display:'auto' was cached as 'block'.");
        done();
    });
    Velocity(getTarget(), "style", "display", "none")
        .velocity("style", "display", "")
        .then(function (elements) {
        assert.equal(elements.velocity("style", "display"), "block", "Display:'' was reset correctly.");
        done();
    });
    Velocity(getTarget(), { display: "none" }, {
        progress: once(function (elements) {
            assert.notEqual(elements.velocity("style", "display"), "none", "Display:'none' was not set immediately.");
            done();
        })
    }).then(function (elements) {
        assert.equal(elements.velocity("style", "display"), "none", "Display:'none' was set upon completion.");
        done();
    });
});
///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
QUnit.test("Visibility", function (assert) {
    var done = assert.async(4);
    Velocity(getTarget(), "style", "visibility", "hidden")
        .velocity({ visibility: "visible" }, {
        progress: once(function (elements) {
            assert.equal(elements.velocity("style", "visibility"), "visible", "Visibility:'visible' was set immediately.");
            done();
        })
    });
    Velocity(getTarget(), "style", "visibility", "hidden")
        .velocity("style", "visibility", "")
        .then(function (elements) {
        // NOTE: The test elements inherit "hidden", so while illogical it
        // is in fact correct.
        assert.equal(elements.velocity("style", "visibility"), "hidden", "Visibility:'' was reset correctly.");
        done();
    });
    Velocity(getTarget(), { visibility: "hidden" }, {
        progress: once(function (elements) {
            assert.notEqual(elements.velocity("style", "visibility"), "visible", "Visibility:'hidden' was not set immediately.");
            done();
        })
    }).then(function (elements) {
        assert.equal(elements.velocity("style", "visibility"), "hidden", "Visibility:'hidden' was set upon completion.");
        done();
    });
});
///<reference types="qunit" />
///<reference path="../../index.d.ts" />
///<reference path="1. Core/_all.d.ts" />
///<reference path="2. Option/_all.d.ts" />
///<reference path="3. Command/_all.d.ts" />
///<reference path="4. Feature/_all.d.ts" />
///<reference path="5. UI Pack/_all.d.ts" />
///<reference path="6. Properties/_all.d.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
// Needed tests:
// - new stop behvaior
// - e/p/o shorthands
var defaultStyles = {
    opacity: 1,
    width: 1,
    height: 1,
    marginBottom: 1,
    colorGreen: 200,
    textShadowBlur: 3
};
var defaultProperties = {
    opacity: defaultStyles.opacity / 2,
    width: defaultStyles.width * 2,
    height: defaultStyles.height * 2
};
var defaultOptions = {
    queue: "",
    duration: 300,
    easing: "swing",
    begin: null,
    complete: null,
    progress: null,
    loop: false,
    delay: 0,
    mobileHA: true
};
/* IE detection: https://gist.github.com/julianshapiro/9098609 */
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), isAndroid = /Android/i.test(navigator.userAgent), $ = (window.jQuery || window.Zepto), $qunitStage = document.getElementById("qunit-stage"), asyncCheckDuration = defaultOptions.duration / 2, completeCheckDuration = defaultOptions.duration * 2, IE = (function () {
    if (document.documentMode) {
        return document.documentMode;
    }
    else {
        for (var i = 7; i > 0; i--) {
            var div = document.createElement("div");
            div.innerHTML = "<!" + "--[if IE " + i + "]><span></span><![endif]--" + ">";
            if (div.getElementsByTagName("span").length) {
                div = null;
                return i;
            }
            div = null;
        }
    }
    return undefined;
})();
QUnit.config.reorder = false;
function applyStartValues(element, startValues) {
    $.each(startValues, function (property, startValue) {
        element.style[property] = startValue;
    });
}
function Data(element) {
    return (element.jquery ? element[0] : element).velocityData;
}
function getNow() {
    return performance && performance.now ? performance.now() : Date.now();
}
var targets = [];
function getTarget() {
    var div = document.createElement("div");
    div.className = "target";
    div.style.opacity = String(defaultStyles.opacity);
    div.style.color = "rgb(125, " + defaultStyles.colorGreen + ", 125)";
    div.style.width = defaultStyles.width + "px";
    div.style.height = defaultStyles.height + "px";
    div.style.marginBottom = defaultStyles.marginBottom + "px";
    div.style.textShadow = "0px 0px " + defaultStyles.textShadowBlur + "px red";
    $qunitStage.appendChild(div);
    targets.push(div);
    return div;
}
function freeTargets() {
    while (targets.length) {
        try {
            $qunitStage.removeChild(targets.pop());
        }
        catch (e) { }
    }
}
function once(func) {
    var done, result;
    return function () {
        if (!done) {
            result = func.apply(this, arguments);
            func = done = true; // Don't care about type, just let the GC collect if possible
        }
        return result;
    };
}
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function isEmptyObject(variable) {
    for (var name_1 in variable) {
        if (variable.hasOwnProperty(name_1)) {
            return false;
        }
    }
    return true;
}
QUnit.testDone(function () {
    try {
        document.querySelectorAll(".velocity-animating").velocity("stop");
    }
    catch (e) { }
    freeTargets();
    Velocity.defaults.reset();
});
/* Cleanup */
QUnit.done(function (details) {
    //	$(".velocity-animating").velocity("stop");
    console.log("Total: ", details.total, " Failed: ", details.failed, " Passed: ", details.passed, " Runtime: ", details.runtime);
});
/* Helpful redirect for testing custom and parallel queues. */
// var $div2 = $("#DataBody-PropertiesDummy");
// $.fn.velocity.defaults.duration = 1000;
// $div2.velocity("scroll", { queue: "test" })
// $div2.velocity({width: 100}, { queue: "test" })
// $div2.velocity({ borderWidth: 50 }, { queue: "test" })
// $div2.velocity({height: 20}, { queue: "test" })
// $div2.velocity({marginLeft: 200}, { queue: "test" })
// $div2.velocity({paddingTop: 60});
// $div2.velocity({marginTop: 100});
// $div2.velocity({paddingRight: 40});
// $div2.velocity({marginTop: 0})
// $div2.dequeue("test")
//# sourceMappingURL=test.js.map