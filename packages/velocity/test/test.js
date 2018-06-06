/**
 * velocity-animate (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('qunit'), require('velocity-animate')) :
	typeof define === 'function' && define.amd ? define(['qunit', 'velocity-animate'], factory) :
	(factory(global.QUnit,global.Velocity));
}(this, (function (qunit,Velocity) { 'use strict';

	Velocity = Velocity && Velocity.hasOwnProperty('default') ? Velocity['default'] : Velocity;

	var $ = window.jQuery || window.Zepto,
	    $qunitStage = document.getElementById("qunit-stage"),
	    defaultStyles = {
	    opacity: 1,
	    width: 1,
	    height: 1,
	    marginBottom: 1,
	    colorGreen: 200,
	    textShadowBlur: 3
	},
	    defaultProperties = {
	    opacity: String(defaultStyles.opacity / 2),
	    width: defaultStyles.width * 2 + "px",
	    height: defaultStyles.height * 2 + "px"
	},
	    defaultOptions = {
	    queue: "",
	    duration: 300,
	    easing: "swing",
	    begin: null,
	    complete: null,
	    progress: null,
	    loop: false,
	    delay: 0,
	    mobileHA: true
	},
	    asyncCheckDuration = defaultOptions.duration / 2,
	    completeCheckDuration = defaultOptions.duration * 2,
	    IE = function () {
	    if (document.documentMode) {
	        return document.documentMode;
	    } else {
	        for (var i = 7; i > 0; i--) {
	            var div = document.createElement("div");
	            div.innerHTML = "<!" + "--" + "[if IE " + i + "]><span></span><![endif]-->";
	            if (div.getElementsByTagName("span").length) {
	                div = null;
	                return i;
	            }
	            div = null;
	        }
	    }
	    return undefined;
	}();
	var targets = [];
	var asyncCount = 0;
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
	function getPropertyValue(element, property) {
	    return Velocity(element, "style", property);
	}
	function getTarget(startValues) {
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
	    if (startValues) {
	        applyStartValues(div, startValues);
	    }
	    return div;
	}
	function once(func) {
	    var done = void 0,
	        result = void 0;
	    return function () {
	        if (!done) {
	            result = func.apply(this, arguments);
	            func = done = true; // Don't care about type, just let the GC collect if possible
	        }
	        return result;
	    };
	}
	function sleep(ms) {
	    return new Promise(function (resolve) {
	        return setTimeout(resolve, ms);
	    });
	}
	function asyncTests(assert, count, callback) {
	    if (!assert) {
	        var oldCount = asyncCount;
	        asyncCount = 0;
	        return oldCount;
	    }
	    var done = assert.async(1);
	    asyncCount += count;
	    setTimeout(function () {
	        callback(done);
	    }, 1);
	}
	QUnit.testDone(function () {
	    try {
	        document.querySelectorAll(".velocity-animating").velocity("stop");
	    } catch (_a) {}
	    // We don't care if it fails.

	    // Free all targets requested by the current test.
	    while (targets.length) {
	        try {
	            $qunitStage.removeChild(targets.pop());
	        } catch (_b) {
	            // We don't care if it fails.
	        }
	    }
	    // Ensure we have reset the test counter.
	    asyncTests();
	    // Make sure Velocity goes back to defaults.
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

	QUnit.module("Core");

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	QUnit.test("Arguments", function (assert) {
	    var testComplete = function testComplete() {
	        // Do nothing
	    },
	        testDuration = 1000,
	        testEasing = "easeInSine",
	        testOptions = {
	        duration: 123,
	        easing: testEasing,
	        complete: testComplete
	    };
	    var result = void 0;
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
	    assert.equal(_typeof(result.velocity.animations[0].options.easing), "function", "Overload variation #3: Velocity(element, {properties}, EASING)");
	    result = Velocity(getTarget(), defaultProperties, testComplete);
	    assert.equal(_typeof(result.velocity.animations[0].options.complete), "function", "Overload variation #4: Velocity(element, {properties}, COMPLETE)");
	    result = Velocity(getTarget(), defaultProperties, testDuration, [0.42, 0, 0.58, 1]);
	    assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #5a: Velocity(element, {properties}, DURATION, easing)");
	    assert.equal(result.velocity.animations[0].options.easing(0.2, 0, 1), 0.0816598562658975, "Overload variation #5b: Velocity(element, {properties}, duration, EASING)");
	    result = Velocity(getTarget(), defaultProperties, testDuration, testComplete);
	    assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #6a: Velocity(element, {properties}, DURATION, complete)");
	    assert.equal(result.velocity.animations[0].options.complete, testComplete, "Overload variation #6b: Velocity(element, {properties}, duration, COMPLETE)");
	    result = Velocity(getTarget(), defaultProperties, testDuration, testEasing, testComplete);
	    assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #7a: Velocity(element, {properties}, DURATION, easing, complete)");
	    assert.equal(_typeof(result.velocity.animations[0].options.easing), "function", "Overload variation #7b: Velocity(element, {properties}, duration, EASING, complete)");
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
	    //		assert.equal($($target20).length, $($target20).velocity(defaultProperties, testDuration, testEasing, testComplete)
	    //		.velocity(defaultProperties, testDuration, testEasing, testComplete).length, "$.fn.: Elements passed back to the call stack.");
	    //		// TODO: Should check in a better way - but the prototype chain is now extended with a Promise so a standard (non-length) comparison *will* fail
	    //	}
	});

	QUnit.test("End Value Caching", function (assert) {
	    var done = assert.async(2),
	        newProperties = { height: "50px", width: "250px" };
	    assert.expect(4);
	    /* Called after the last call is complete (stale). Ensure that the newly-set (via $.css()) properties are used. */
	    Velocity(getTarget(newProperties), defaultProperties).then(function (elements) {
	        assert.equal(Data(elements[0]).cache.width, defaultProperties.width, "Stale end value #1 wasn't pulled.");
	        assert.equal(Data(elements[0]).cache.height, defaultProperties.height, "Stale end value #2 wasn't pulled.");
	        done();
	    });
	    Velocity(getTarget(), defaultProperties).velocity(newProperties).then(function (elements) {
	        /* Chained onto a previous call (fresh). */
	        assert.equal(Data(elements[0]).cache.width, newProperties.width, "Chained end value #1 was pulled.");
	        assert.equal(Data(elements[0]).cache.height, newProperties.height, "Chained end value #2 was pulled.");
	        done();
	    });
	});

	QUnit.test("End Value Setting", function (assert) {
	    var done = assert.async(1);
	    /* Standard properties. */
	    Velocity(getTarget(), defaultProperties).then(function (elements) {
	        assert.equal(Velocity(elements[0], "style", "width"), defaultProperties.width, "Standard end value #1 was set.");
	        assert.equal(Velocity(elements[0], "style", "opacity"), defaultProperties.opacity, "Standard end value #2 was set.");
	        done();
	    });
	});

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
	    var testPropertiesEndNoConvert = { paddingLeft: "20px", height: "40px", paddingRight: "75%" },
	        $target3 = getTarget();
	    applyStartValues($target3, testStartValues);
	    Velocity($target3, testPropertiesEndNoConvert);
	    assert.equal(Data($target3).cache.paddingLeft, parseFloat(testStartValues.paddingLeft), "Start value #1 wasn't unit converted.");
	    assert.equal(Data($target3).cache.height, parseFloat(testStartValues.height), "Start value #2 wasn't unit converted.");
	    //			assert.deepEqual(Data($target3).cache.paddingRight.startValue, [Math.floor((parentWidth * parseFloat(testStartValues.paddingRight)) / 100), 0],
	    //			 "Start value #3 was pattern matched.");
	    /* Properties that should cause start values to be unit-converted. */
	    var testPropertiesEndConvert = { paddingLeft: "20%", height: "40%", lineHeight: "0.5em", wordSpacing: "2rem", marginLeft: "10vw", marginTop: "5vh", marginBottom: "100px" },
	        parentWidth = $qunitStage.clientWidth,
	        parentHeight = $qunitStage.clientHeight,
	        parentFontSize = Velocity($qunitStage, "style", "fontSize"),
	        remSize = parseFloat(Velocity(document.body, "style", "fontSize")),
	        $target4 = getTarget();
	    applyStartValues($target4, testStartValues);
	    Velocity($target4, testPropertiesEndConvert);
	    /* Long decimal results can be returned after unit conversion, and Velocity's code and the code here can differ in precision. So, we round floor values before comparison. */
	    //			assert.deepEqual(Data($target4).cache.paddingLeft.startValue, [parseFloat(testStartValues.paddingLeft), 0],
	    //			 "Horizontal property converted to %.");
	    assert.equal(parseInt(Data($target4).cache.height, 10), Math.floor(parseFloat(testStartValues.height) / parentHeight * 100), "Vertical property converted to %.");
	    //			assert.equal(Data($target4).cache.lineHeight.startValue, Math.floor(parseFloat(testStartValues.lineHeight) / parseFloat(parentFontSize)),
	    //			 "Property converted to em.");
	    //			assert.equal(Data($target4).cache.wordSpacing.startValue, Math.floor(parseFloat(testStartValues.wordSpacing) / parseFloat(remSize)),
	    //			 "Property converted to rem.");
	    assert.equal(parseInt(Data($target4).cache.marginBottom, 10), parseFloat(testStartValues.marginBottom) / 100 * parseFloat($target4.parentElement.offsetWidth), "Property converted to px.");
	    //			if (!(IE<=8) && !isAndroid) {
	    //				assert.equal(Data($target4).cache.marginLeft.startValue, Math.floor(parseFloat(testStartValues.marginLeft) / window.innerWidth * 100),
	    //				 "Horizontal property converted to vw.");
	    //				assert.equal(Data($target4).cache.marginTop.startValue, Math.floor(parseFloat(testStartValues.marginTop) / window.innerHeight * 100),
	    //				 "Vertical property converted to vh.");
	    //			}
	    // TODO: Tests for auto-parameters as the units are no longer converted.
	    /* jQuery TRBL deferring. */
	    var testPropertiesTRBL = { left: "1000px" },
	        $TRBLContainer = document.createElement("div");
	    $TRBLContainer.setAttribute("id", "TRBLContainer");
	    $TRBLContainer.style.marginLeft = testPropertiesTRBL.left;
	    $TRBLContainer.style.width = "100px";
	    $TRBLContainer.style.height = "100px";
	    document.body.appendChild($TRBLContainer);
	    var $target5 = getTarget();
	    $target5.style.position = "absolute";
	    $TRBLContainer.appendChild($target5);
	    Velocity($target5, testPropertiesTRBL);
	    assert.equal(parseInt(Data($target5).cache.left, 10), Math.round(parseFloat(testPropertiesTRBL.left) + parseFloat(Velocity(document.body, "style", "marginLeft"))), "TRBL value was deferred to jQuery.");
	});

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */

	function __awaiter(thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	}

	var _this = window;
	QUnit.test("Unit Calculation", function (assert) {
	    // TODO: Add code and tests for operators - probably using calc() internally
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
	    asyncTests(assert, 2, function (done) {
	        return __awaiter(_this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	            var $target;
	            return regeneratorRuntime.wrap(function _callee$(_context) {
	                while (1) {
	                    switch (_context.prev = _context.next) {
	                        case 0:
	                            $target = getTarget();

	                            Velocity($target, { left: "500px" }, { duration: 10 });
	                            _context.next = 4;
	                            return sleep(100);

	                        case 4:
	                            assert.equal(getPropertyValue($target, "left"), "500px", "Finished animated value with given pixels should be the same.");
	                            Velocity($target, { left: "0px" }, { duration: 10 });
	                            _context.next = 8;
	                            return sleep(100);

	                        case 8:
	                            assert.equal(getPropertyValue($target, "left"), "0px", "Finished animated value with 0px should be the same.");
	                            done();

	                        case 10:
	                        case "end":
	                            return _context.stop();
	                    }
	                }
	            }, _callee, this);
	        }));
	    });
	    //	async(assert, 1, async (done) => {
	    //		const $target = getTarget();
	    //
	    //		Velocity($target, {left: "500px"}, {duration: 10});
	    //		await sleep(100);
	    //		Velocity($target, {left: "0"}, {duration: 10});
	    //		await sleep(100);
	    //		assert.equal(getPropertyValue($target, "left"), "0px", "Finished animated value without giving px, but only number as a string should be the same.");
	    //
	    //		done();
	    //	});
	    asyncTests(assert, 1, function (done) {
	        return __awaiter(_this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
	            var $target;
	            return regeneratorRuntime.wrap(function _callee2$(_context2) {
	                while (1) {
	                    switch (_context2.prev = _context2.next) {
	                        case 0:
	                            $target = getTarget();

	                            Velocity($target, { left: "500px" }, { duration: 10 });
	                            _context2.next = 4;
	                            return sleep(100);

	                        case 4:
	                            Velocity($target, { left: 0 }, { duration: 10 });
	                            _context2.next = 7;
	                            return sleep(1000);

	                        case 7:
	                            assert.equal(getPropertyValue($target, "left"), "0px", "Finished animated value given as number 0 should be the same as 0px.");
	                            done();

	                        case 9:
	                        case "end":
	                            return _context2.stop();
	                    }
	                }
	            }, _callee2, this);
	        }));
	    });
	    asyncTests(assert, 2, function (done) {
	        return __awaiter(_this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
	            var $target;
	            return regeneratorRuntime.wrap(function _callee3$(_context3) {
	                while (1) {
	                    switch (_context3.prev = _context3.next) {
	                        case 0:
	                            $target = getTarget();

	                            Velocity($target, { left: 500 }, { duration: 10 });
	                            _context3.next = 4;
	                            return sleep(100);

	                        case 4:
	                            assert.equal(getPropertyValue($target, "left"), "500px", "Finished animated value with given pixels should be the same.");
	                            Velocity($target, { left: 0 }, { duration: 10 });
	                            _context3.next = 8;
	                            return sleep(100);

	                        case 8:
	                            assert.equal(getPropertyValue($target, "left"), "0px", "Omitted pixels (px) when given animation should run properly.");
	                            done();

	                        case 10:
	                        case "end":
	                            return _context3.stop();
	                    }
	                }
	            }, _callee3, this);
	        }));
	    });
	});

	QUnit.module("Option");

	QUnit.test("Begin", function (assert) {
	    asyncTests(assert, 1, function (done) {
	        var $targetSet = [getTarget(), getTarget()];
	        Velocity($targetSet, defaultProperties, {
	            duration: asyncCheckDuration,
	            begin: function begin(elements) {
	                assert.deepEqual(elements, $targetSet, "Elements passed into callback.");
	                done();
	            }
	        });
	    });
	    assert.expect(asyncTests());
	});

	QUnit.test("Complete", function (assert) {
	    asyncTests(assert, 1, function (done) {
	        var $targetSet = [getTarget(), getTarget()];
	        Velocity($targetSet, defaultProperties, {
	            duration: asyncCheckDuration,
	            complete: function complete(elements) {
	                assert.deepEqual(elements, $targetSet, "Elements passed into callback.");
	                done();
	            }
	        });
	    });
	    assert.expect(asyncTests());
	});

	QUnit.test("Delay", function (assert) {
	    var testDelay = 250;
	    asyncTests(assert, 1, function (done) {
	        var start = getNow();
	        Velocity(getTarget(), defaultProperties, {
	            duration: defaultOptions.duration,
	            delay: testDelay,
	            begin: function begin(elements, activeCall) {
	                assert.close(getNow() - start, testDelay, 32, "Delayed calls start after the correct delay.");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 1, function (done) {
	        var start = getNow();
	        Velocity(getTarget(), defaultProperties, {
	            duration: defaultOptions.duration,
	            delay: testDelay
	        }).velocity(defaultProperties, {
	            duration: defaultOptions.duration,
	            delay: testDelay,
	            begin: function begin(elements, activeCall) {
	                assert.close(getNow() - start, testDelay * 2 + defaultOptions.duration, 32, "Chained delays start after the correct delay.");
	                done();
	            }
	        });
	    });
	    assert.expect(asyncTests());
	});

	QUnit.test("Duration", function (assert) {
	    var testDuration = Velocity.defaults.duration;
	    asyncTests(assert, 1, function (done) {
	        var start = getNow();
	        Velocity(getTarget(), defaultProperties, {
	            duration: testDuration,
	            complete: function complete(elements, activeCall) {
	                var time = getNow() - start;
	                assert.close(time, testDuration, 32, "Calls run for the correct duration (~" + Math.floor(time) + "ms / " + testDuration + "ms).");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 1, function (done) {
	        var start = getNow();
	        Velocity(getTarget(), { width: ["200px", "500px"] }, {
	            duration: testDuration
	        }).velocity({ width: ["500px", "200px"] }, {
	            duration: testDuration,
	            complete: function complete(elements, activeCall) {
	                var time = getNow() - start;
	                assert.close(getNow() - start, testDuration * 2, 32, "Chained durations run for the correct duration (~" + Math.floor(time) + "ms / " + testDuration * 2 + "ms).");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 1, function (done) {
	        var start = getNow();
	        Velocity(getTarget(), { width: ["200px", "500px"] }).velocity({ width: ["500px", "200px"] }).then(function () {
	            var time = getNow() - start;
	            assert.close(getNow() - start, testDuration * 2, 32, "Chained durations with defaults run for the correct duration (~" + Math.floor(time) + "ms / " + testDuration * 2 + "ms).");
	            done();
	        });
	    });
	    assert.expect(asyncTests());
	});

	QUnit.test("Easing", function (assert) {
	    asyncTests(assert, 1, function (done) {
	        var success = false;
	        try {
	            success = true;
	            Velocity(getTarget(), defaultProperties, { easing: "fake" });
	        } catch (e) {
	            success = false;
	        }
	        assert.ok(success, "Fake easing string didn't throw error.");
	        done();
	    });
	    asyncTests(assert, 1, function (done) {
	        var success = false;
	        try {
	            success = true;
	            Velocity(getTarget(), defaultProperties, { easing: ["a", 0.5, 0.5, 0.5] });
	            Velocity(getTarget(), defaultProperties, { easing: [0.5, 0.5, 0.5] });
	        } catch (e) {
	            success = false;
	        }
	        assert.ok(success, "Invalid bezier curve didn't throw error.");
	        done();
	    });
	    asyncTests(assert, 1, function (done) {
	        // TODO: Use a "tween" action?
	        /* Ensure that a properly-formatted bezier curve array returns a bezier function. */
	        var easingBezierArray = [0.27, -0.65, 0.78, 0.19],
	            easingBezierTestPercent = 0.25,
	            easingBezierTestValue = -0.23;
	        Velocity(getTarget(), defaultProperties, {
	            easing: easingBezierArray,
	            begin: function begin(elements, animation) {
	                assert.close(animation.options.easing(easingBezierTestPercent, 0, 1), easingBezierTestValue, 0.005, "Array converted into bezier function.");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 1, function (done) {
	        /* Ensure that a properly-formatted spring RK4 array returns a bezier function. */
	        var easingSpringRK4Array = [250, 12],
	            easingSpringRK4TestPercent = 0.25,
	            easingSpringRK4TestValue = 0.928;
	        Velocity(getTarget(), defaultProperties, {
	            duration: 150,
	            easing: easingSpringRK4Array,
	            begin: function begin(elements, animation) {
	                assert.close(animation.options.easing(easingSpringRK4TestPercent, 0, 1), easingSpringRK4TestValue, 10, "Array with duration converted into springRK4 function.");
	                done();
	            }
	        });
	    });
	    // TODO: Get this working in Velocity - so it can be tested
	    //	async(assert, 1, (done) => {
	    //	Velocity(getTarget(), defaultProperties, {
	    //		easing: easingSpringRK4Array,
	    //		begin(elements, animation) {
	    //			assert.equal(animation.duration, easingSpringRK4TestDuration, "Array without duration converted into springRK4 duration.");
	    //			done();
	    //		}
	    //	});
	    //	});
	    asyncTests(assert, 1, function (done) {
	        /* Ensure that a properly-formatted step easing array returns a step function. */
	        var easingStepArray = [4],
	            easingStepTestPercent = 0.35,
	            easingStepTestValue = 0.25;
	        Velocity(getTarget(), defaultProperties, {
	            easing: easingStepArray,
	            begin: function begin(elements, animation) {
	                assert.close(animation.options.easing(easingStepTestPercent, 0, 1), easingStepTestValue, 0.05, "Array converted into Step function.");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 3, function (done) {
	        Velocity(getTarget(), { opacity: [0, "during", 1] }, {
	            duration: asyncCheckDuration,
	            begin: function begin(elements) {
	                assert.equal(elements.velocity("style", "opacity"), 1, "Correct begin value (easing:'during').");
	            },

	            progress: once(function (elements) {
	                assert.equal(elements.velocity("style", "opacity"), 0, "Correct progress value (easing:'during').");
	            }),
	            complete: function complete(elements) {
	                assert.equal(elements.velocity("style", "opacity"), 1, "Correct complete value (easing:'during').");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 3, function (done) {
	        Velocity(getTarget(), { opacity: [0, "at-start", 1] }, {
	            duration: asyncCheckDuration,
	            begin: function begin(elements) {
	                assert.equal(elements.velocity("style", "opacity"), 1, "Correct begin value (easing:'at-start').");
	            },

	            progress: once(function (elements) {
	                assert.equal(elements.velocity("style", "opacity"), 0, "Correct progress value (easing:'at-start').");
	            }),
	            complete: function complete(elements) {
	                assert.equal(elements.velocity("style", "opacity"), 0, "Correct complete value (easing:'at-start').");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 3, function (done) {
	        Velocity(getTarget(), { opacity: [0, "at-end", 1] }, {
	            duration: asyncCheckDuration,
	            begin: function begin(elements) {
	                assert.equal(elements.velocity("style", "opacity"), 1, "Correct begin value (easing:'at-end').");
	            },

	            progress: once(function (elements) {
	                assert.equal(elements.velocity("style", "opacity"), 1, "Correct progress value (easing:'at-end').");
	            }),
	            complete: function complete(elements) {
	                assert.equal(elements.velocity("style", "opacity"), 0, "Correct complete value (easing:'at-end').");
	                done();
	            }
	        });
	    });
	    assert.expect(asyncTests());
	});

	var _this$1 = window;
	QUnit.test("FPS Limit", function (assert) {
	    return __awaiter(_this$1, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	        var count, $target, frameRates, testFrame, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, frameRate;

	        return regeneratorRuntime.wrap(function _callee$(_context) {
	            while (1) {
	                switch (_context.prev = _context.next) {
	                    case 0:
	                        count = void 0;
	                        $target = getTarget(), frameRates = [5, 15, 30, 60], testFrame = function testFrame(frameRate) {
	                            var counter = 0;
	                            Velocity.defaults.fpsLimit = frameRate;
	                            // Test if the frame rate is assigned succesfully.
	                            assert.equal(frameRate, Velocity.defaults.fpsLimit, "Setting global fps limit to " + frameRate);
	                            return Velocity($target, defaultProperties, {
	                                duration: 1000,
	                                progress: function progress() {
	                                    counter++;
	                                }
	                            }).then(function () {
	                                return counter;
	                            });
	                        };

	                        assert.expect(frameRates.length * 2);
	                        // Test if the limit is working for 60, 30, 15 and 5 fps.
	                        _iteratorNormalCompletion = true;
	                        _didIteratorError = false;
	                        _iteratorError = undefined;
	                        _context.prev = 6;
	                        _iterator = frameRates[Symbol.iterator]();

	                    case 8:
	                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	                            _context.next = 21;
	                            break;
	                        }

	                        frameRate = _step.value;
	                        _context.t0 = assert;
	                        _context.next = 13;
	                        return testFrame(frameRate);

	                    case 13:
	                        _context.t1 = count = _context.sent;
	                        _context.t2 = frameRate + 1;
	                        _context.t3 = _context.t1 <= _context.t2;
	                        _context.t4 = "...counted " + count + " frames (\xB11 frame)";

	                        _context.t0.ok.call(_context.t0, _context.t3, _context.t4);

	                    case 18:
	                        _iteratorNormalCompletion = true;
	                        _context.next = 8;
	                        break;

	                    case 21:
	                        _context.next = 27;
	                        break;

	                    case 23:
	                        _context.prev = 23;
	                        _context.t5 = _context["catch"](6);
	                        _didIteratorError = true;
	                        _iteratorError = _context.t5;

	                    case 27:
	                        _context.prev = 27;
	                        _context.prev = 28;

	                        if (!_iteratorNormalCompletion && _iterator.return) {
	                            _iterator.return();
	                        }

	                    case 30:
	                        _context.prev = 30;

	                        if (!_didIteratorError) {
	                            _context.next = 33;
	                            break;
	                        }

	                        throw _iteratorError;

	                    case 33:
	                        return _context.finish(30);

	                    case 34:
	                        return _context.finish(27);

	                    case 35:
	                    case "end":
	                        return _context.stop();
	                }
	            }
	        }, _callee, this, [[6, 23, 27, 35], [28,, 30, 34]]);
	    }));
	});

	QUnit.test("Loop", function (assert) {
	    asyncTests(assert, 4, function (done) {
	        var testOptions = { loop: 2, delay: 100, duration: 100 },
	            start = getNow();
	        var _begin = 0,
	            _complete = 0,
	            loop = 0,
	            lastPercentComplete = 2;
	        Velocity(getTarget(), defaultProperties, {
	            loop: testOptions.loop,
	            delay: testOptions.delay,
	            duration: testOptions.duration,
	            begin: function begin() {
	                _begin++;
	            },
	            progress: function progress(elements, percentComplete) {
	                if (lastPercentComplete > percentComplete) {
	                    loop++;
	                }
	                lastPercentComplete = percentComplete;
	            },
	            complete: function complete() {
	                _complete++;
	            }
	        }).then(function () {
	            assert.equal(_begin, 1, "Begin callback only called once.");
	            assert.equal(loop, testOptions.loop * 2 - 1, "Animation looped correct number of times (once each direction per loop).");
	            assert.close(getNow() - start, (testOptions.delay + testOptions.duration) * loop, 32, "Looping with 'delay' has correct duration.");
	            assert.equal(_complete, 1, "Complete callback only called once.");
	            done();
	        });
	    });
	    assert.expect(asyncTests());
	});

	QUnit.test("Progress", function (assert) {
	    asyncTests(assert, 4, function (done) {
	        var $target = getTarget();
	        Velocity($target, defaultProperties, {
	            duration: asyncCheckDuration,
	            progress: once(function (elements, percentComplete, msRemaining) {
	                assert.deepEqual(elements, [$target], "Elements passed into progress.");
	                assert.deepEqual(this, [$target], "Elements passed into progress as this."); // tslint:disable-line:no-invalid-this
	                assert.equal(percentComplete >= 0 && percentComplete <= 1, true, "'percentComplete' passed into progress.");
	                assert.equal(msRemaining > asyncCheckDuration - 50, true, "'msRemaining' passed into progress.");
	                done();
	            })
	        });
	    });
	    assert.expect(asyncTests());
	});

	QUnit.test("Queue", function (assert) {
	    var done = assert.async(4),
	        testQueue = "custom",
	        $target = getTarget(),
	        ignore = $target.velocity("style", "display"),
	        // Force data creation
	    data = Data($target);
	    var anim1 = void 0,
	        anim2 = void 0;
	    assert.expect(7);
	    assert.ok(data.queueList[testQueue] === undefined, "Custom queue is empty."); // Shouldn't exist
	    $target.velocity(defaultProperties, {
	        queue: testQueue,
	        begin: function begin() {
	            anim1 = true;
	        },
	        complete: function complete() {
	            anim1 = false;
	            assert.ok(!anim2, "Queued animation isn't started early.");
	            done();
	        }
	    });
	    assert.ok(data.queueList[testQueue] !== undefined, "Custom queue was created."); // Should exist, but be "null"
	    $target.velocity(defaultProperties, {
	        queue: testQueue,
	        begin: function begin() {
	            anim2 = true;
	            assert.ok(anim1 === false, "Queued animation starts after first.");
	            done();
	        },
	        complete: function complete() {
	            anim2 = false;
	        }
	    });
	    assert.ok(data.queueList[testQueue], "Custom queue grows."); // Should exist and point at the next animation
	    $target.velocity(defaultProperties, {
	        begin: function begin() {
	            assert.ok(anim1 === true, "Different queue animation starts in parallel.");
	            done();
	        },
	        complete: function complete() {
	        }
	    });
	    $target.velocity(defaultProperties, {
	        queue: false,
	        begin: function begin() {
	            assert.ok(anim1 === true, "Queue:false animation starts in parallel.");
	            done();
	        }
	    });
	});

	QUnit.test("Repeat", function (assert) {
	    asyncTests(assert, 4, function (done) {
	        var testOptions = { repeat: 2, delay: 100, duration: 100 },
	            start = Date.now();
	        var _begin = 0,
	            _complete = 0,
	            repeat = 0;
	        Velocity(getTarget(), defaultProperties, {
	            repeat: testOptions.repeat,
	            delay: testOptions.delay,
	            duration: testOptions.duration,
	            begin: function begin() {
	                _begin++;
	            },
	            progress: function progress(elements, percentComplete) {
	                if (percentComplete === 1) {
	                    repeat++;
	                }
	            },
	            complete: function complete() {
	                _complete++;
	                assert.equal(_begin, 1, "Begin callback only called once.");
	                assert.equal(repeat, testOptions.repeat + 1, "Animation repeated correct number of times (original plus repeats).");
	                assert.close(Date.now() - start, (testOptions.delay + testOptions.duration) * (testOptions.repeat + 1), (testOptions.repeat + 1) * 16 + 32, "Repeat with 'delay' has correct duration.");
	                assert.equal(_complete, 1, "Complete callback only called once.");
	                done();
	            }
	        });
	    });
	    assert.expect(asyncTests());
	});

	QUnit.test("Speed", function (assert) {
	    var delay = 200,
	        duration = 400,
	        startDelay = getNow();
	    asyncTests(assert, 1, function (done) {
	        Velocity.defaults.speed = 3;
	        Velocity(getTarget(), defaultProperties, {
	            speed: 5,
	            begin: function begin(elements) {
	                assert.equal(elements.velocity.animations[0].options.speed, 5, "Speed on options overrides default.");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 1, function (done) {
	        Velocity(getTarget(), defaultProperties, {
	            duration: duration,
	            begin: function begin(elements) {
	                elements.__start = getNow();
	            },
	            complete: function complete(elements) {
	                var actual = getNow() - elements.__start,
	                    expected = duration / 3;
	                assert.close(actual, expected, 32, "Velocity.defaults.speed change is respected. (\xD73, " + Math.floor(actual - expected) + "ms \xB132ms)");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 1, function (done) {
	        Velocity(getTarget(), defaultProperties, {
	            duration: duration,
	            speed: 2,
	            begin: function begin(elements) {
	                elements.__start = getNow();
	            },
	            complete: function complete(elements) {
	                var actual = getNow() - elements.__start,
	                    expected = duration / 2;
	                assert.close(actual, expected, 32, "Double speed animation lasts half as long. (\xD72, " + Math.floor(actual - expected) + "ms \xB132ms)");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 1, function (done) {
	        Velocity(getTarget(), defaultProperties, {
	            duration: duration,
	            delay: delay,
	            speed: 2,
	            begin: function begin(elements) {
	                elements.__start = startDelay;
	            },
	            complete: function complete(elements) {
	                var actual = getNow() - elements.__start,
	                    expected = (duration + delay) / 2;
	                assert.close(actual, expected, 32, "Delayed animation includes speed for delay. (\xD72, " + Math.floor(actual - expected) + "ms \xB132ms)");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 1, function (done) {
	        Velocity(getTarget(), defaultProperties, {
	            duration: duration,
	            delay: -delay,
	            speed: 2,
	            begin: function begin(elements) {
	                elements.__start = startDelay;
	            },
	            complete: function complete(elements) {
	                var actual = getNow() - elements.__start,
	                    expected = (duration - delay) / 2;
	                assert.close(actual, expected, 32, "Negative delay animation includes speed for delay. (\xD72, " + Math.floor(actual - expected) + "ms \xB132ms)");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 1, function (done) {
	        Velocity(getTarget(), defaultProperties, {
	            duration: duration,
	            speed: 0.5,
	            begin: function begin(elements) {
	                elements.__start = getNow();
	            },
	            complete: function complete(elements) {
	                var actual = getNow() - elements.__start,
	                    expected = duration * 2;
	                // TODO: Really not happy with the allowed range - it sits around 40ms, but should be closer to 16ms
	                assert.close(actual, expected, 64, "Half speed animation lasts twice as long. (\xD7\xBD, " + Math.floor(actual - expected) + "ms \xB164ms)");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 1, function (done) {
	        Velocity(getTarget(), defaultProperties, {
	            duration: duration,
	            speed: 0,
	            progress: function progress(elements, percentComplete) {
	                if (!elements.__count) {
	                    elements.__start = percentComplete;
	                    elements.__count = 1;
	                } else {
	                    assert.equal(elements.__start, percentComplete, "Frozen (speed:0) animation doesn't progress.");
	                    elements.velocity("option", "speed", 1) // Just in case "stop" is broken
	                    .velocity("stop");
	                    done();
	                }
	            }
	        });
	    });
	    assert.expect(asyncTests());
	});

	var _this$2 = window;
	QUnit.test("Sync", function (assert) {
	    asyncTests(assert, 1, function (done) {
	        return __awaiter(_this$2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	            var $target, $targetSet, _complete;

	            return regeneratorRuntime.wrap(function _callee$(_context) {
	                while (1) {
	                    switch (_context.prev = _context.next) {
	                        case 0:
	                            $target = getTarget(), $targetSet = [getTarget(), $target, getTarget()];
	                            _complete = false;

	                            Velocity($target, defaultProperties, {
	                                duration: 300,
	                                complete: function complete() {
	                                    _complete = true;
	                                }
	                            });
	                            Velocity($targetSet, defaultProperties, {
	                                sync: false,
	                                duration: 250
	                            });
	                            _context.next = 6;
	                            return sleep(275);

	                        case 6:
	                            assert.notOk(_complete, "Sync 'false' animations don't wait for completion.");
	                            done();

	                        case 8:
	                        case "end":
	                            return _context.stop();
	                    }
	                }
	            }, _callee, this);
	        }));
	    });
	    asyncTests(assert, 1, function (done) {
	        return __awaiter(_this$2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
	            var $target, $targetSet, _complete2;

	            return regeneratorRuntime.wrap(function _callee2$(_context2) {
	                while (1) {
	                    switch (_context2.prev = _context2.next) {
	                        case 0:
	                            $target = getTarget(), $targetSet = [getTarget(), $target, getTarget()];
	                            _complete2 = false;

	                            Velocity($target, defaultProperties, {
	                                duration: 300,
	                                complete: function complete() {
	                                    _complete2 = true;
	                                }
	                            });
	                            Velocity($targetSet, defaultProperties, {
	                                sync: true,
	                                duration: 250,
	                                begin: function begin() {
	                                    assert.ok(_complete2, "Sync 'true' animations wait for completion.");
	                                    done();
	                                }
	                            });

	                        case 4:
	                        case "end":
	                            return _context2.stop();
	                    }
	                }
	            }, _callee2, this);
	        }));
	    });
	    assert.expect(asyncTests());
	});

	QUnit.module("Command");

	var _this$3 = window;
	QUnit.test("Finish", function (assert) {
	    return __awaiter(_this$3, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
	        var _this2 = this;

	        return regeneratorRuntime.wrap(function _callee5$(_context5) {
	            while (1) {
	                switch (_context5.prev = _context5.next) {
	                    case 0:
	                        asyncTests(assert, 1, function (done) {
	                            Velocity(getTarget(), "finish");
	                            assert.ok(true, "Calling on an element that isn't animating doesn't cause an error.");
	                            done();
	                        });
	                        asyncTests(assert, 1, function (done) {
	                            var $target = getTarget();
	                            Velocity($target, defaultProperties, defaultOptions);
	                            Velocity($target, { top: 0 }, defaultOptions);
	                            Velocity($target, { width: 0 }, defaultOptions);
	                            Velocity($target, "finish");
	                            assert.ok(true, "Calling on an element that is animating doesn't cause an error.");
	                            done();
	                        });
	                        asyncTests(assert, 2, function (done) {
	                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	                                var $target, complete1, complete2;
	                                return regeneratorRuntime.wrap(function _callee$(_context) {
	                                    while (1) {
	                                        switch (_context.prev = _context.next) {
	                                            case 0:
	                                                $target = getTarget();
	                                                complete1 = false, complete2 = false;

	                                                Velocity($target, { opacity: [0, 1] }, {
	                                                    queue: "test1",
	                                                    complete: function complete() {
	                                                        complete1 = true;
	                                                    }
	                                                });
	                                                Velocity($target, { opacity: [0, 1] }, {
	                                                    queue: "test2",
	                                                    complete: function complete() {
	                                                        complete2 = true;
	                                                    }
	                                                });
	                                                Velocity($target, "finish", "test1");
	                                                _context.next = 7;
	                                                return sleep(defaultOptions.duration / 2);

	                                            case 7:
	                                                assert.ok(complete1, "Finish animation with correct queue.");
	                                                assert.notOk(complete2, "Don't finish animation with wrong queue.");
	                                                done();

	                                            case 10:
	                                            case "end":
	                                                return _context.stop();
	                                        }
	                                    }
	                                }, _callee, this);
	                            }));
	                        });
	                        asyncTests(assert, 3, function (done) {
	                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
	                                var $target, _begin, _complete;

	                                return regeneratorRuntime.wrap(function _callee2$(_context2) {
	                                    while (1) {
	                                        switch (_context2.prev = _context2.next) {
	                                            case 0:
	                                                $target = getTarget();
	                                                _begin = false, _complete = false;

	                                                Velocity($target, { opacity: [0, 1] }, {
	                                                    begin: function begin() {
	                                                        _begin = true;
	                                                    },
	                                                    complete: function complete() {
	                                                        _complete = true;
	                                                    }
	                                                });
	                                                _context2.next = 5;
	                                                return sleep(500);

	                                            case 5:
	                                                Velocity($target, "finish");
	                                                assert.ok(_begin, "Finish calls 'begin()' callback without delay.");
	                                                assert.ok(_complete, "Finish calls 'complete()' callback without delay.");
	                                                assert.equal(getPropertyValue($target, "opacity"), "0", "Finish animation with correct value.");
	                                                done();

	                                            case 10:
	                                            case "end":
	                                                return _context2.stop();
	                                        }
	                                    }
	                                }, _callee2, this);
	                            }));
	                        });
	                        asyncTests(assert, 3, function (done) {
	                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
	                                var $target, _begin2, _complete2;

	                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
	                                    while (1) {
	                                        switch (_context3.prev = _context3.next) {
	                                            case 0:
	                                                $target = getTarget();
	                                                _begin2 = false, _complete2 = false;

	                                                Velocity($target, { opacity: [0, 1] }, {
	                                                    delay: 1000,
	                                                    begin: function begin() {
	                                                        _begin2 = true;
	                                                    },
	                                                    complete: function complete() {
	                                                        _complete2 = true;
	                                                    }
	                                                });
	                                                _context3.next = 5;
	                                                return sleep(500);

	                                            case 5:
	                                                Velocity($target, "finish");
	                                                assert.ok(_begin2, "Finish calls 'begin()' callback with delay.");
	                                                assert.ok(_complete2, "Finish calls 'complete()' callback with delay.");
	                                                assert.equal(getPropertyValue($target, "opacity"), "0", "Finish animation with correct value before delay ends.");
	                                                done();

	                                            case 10:
	                                            case "end":
	                                                return _context3.stop();
	                                        }
	                                    }
	                                }, _callee3, this);
	                            }));
	                        });
	                        asyncTests(assert, 3, function (done) {
	                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
	                                var $target;
	                                return regeneratorRuntime.wrap(function _callee4$(_context4) {
	                                    while (1) {
	                                        switch (_context4.prev = _context4.next) {
	                                            case 0:
	                                                $target = getTarget();

	                                                Velocity($target, { opacity: 0 }).velocity({ opacity: 1 }).velocity({ opacity: 0.25 }).velocity({ opacity: 0.75 }).velocity({ opacity: 0.5 });
	                                                Velocity($target, "finish");
	                                                assert.equal(getPropertyValue($target, "opacity"), "0", "Finish once starts the second animation.");
	                                                Velocity($target, "finish");
	                                                assert.equal(getPropertyValue($target, "opacity"), "1", "Finish twice starts the third animation.");
	                                                Velocity($target, "finish", true);
	                                                assert.equal(getPropertyValue($target, "opacity"), "0.5", "Finish 'true' finishes all animations.");
	                                                done();

	                                            case 9:
	                                            case "end":
	                                                return _context4.stop();
	                                        }
	                                    }
	                                }, _callee4, this);
	                            }));
	                        });
	                        assert.expect(asyncTests());

	                    case 7:
	                    case "end":
	                        return _context5.stop();
	                }
	            }
	        }, _callee5, this);
	    }));
	});

	var _this$4 = window;
	QUnit.test("Pause + Resume", function (assert) {
	    return __awaiter(_this$4, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
	        var _this2 = this;

	        return regeneratorRuntime.wrap(function _callee5$(_context5) {
	            while (1) {
	                switch (_context5.prev = _context5.next) {
	                    case 0:
	                        asyncTests(assert, 2, function (done) {
	                            var $target = getTarget();
	                            Velocity($target, "pause");
	                            assert.ok(true, "Calling \"pause\" on an element that isn't animating doesn't cause an error.");
	                            Velocity($target, "resume");
	                            assert.ok(true, "Calling \"resume\" on an element that isn't animating doesn't cause an error.");
	                            done();
	                        });
	                        asyncTests(assert, 4, function (done) {
	                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	                                var $target, _progress;

	                                return regeneratorRuntime.wrap(function _callee$(_context) {
	                                    while (1) {
	                                        switch (_context.prev = _context.next) {
	                                            case 0:
	                                                $target = getTarget();
	                                                _progress = false;

	                                                Velocity($target, { opacity: 0 }, {
	                                                    duration: 250,
	                                                    progress: function progress() {
	                                                        _progress = true;
	                                                    }
	                                                });
	                                                Velocity($target, "pause");
	                                                _context.next = 6;
	                                                return sleep(50);

	                                            case 6:
	                                                assert.equal(getPropertyValue($target, "opacity"), "1", "Property value unchanged after pause.");
	                                                assert.notOk(_progress, "Progress callback not run during pause.");
	                                                Velocity($target, "resume");
	                                                _context.next = 11;
	                                                return sleep(300);

	                                            case 11:
	                                                assert.equal(getPropertyValue($target, "opacity"), "0", "Tween completed after pause/resume.");
	                                                assert.ok(_progress, "Progress callback run after pause.");
	                                                done();

	                                            case 14:
	                                            case "end":
	                                                return _context.stop();
	                                        }
	                                    }
	                                }, _callee, this);
	                            }));
	                        });
	                        asyncTests(assert, 3, function (done) {
	                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
	                                var $target;
	                                return regeneratorRuntime.wrap(function _callee2$(_context2) {
	                                    while (1) {
	                                        switch (_context2.prev = _context2.next) {
	                                            case 0:
	                                                $target = getTarget();

	                                                Velocity($target, { opacity: 0 }, { duration: 250, delay: 250 });
	                                                Velocity($target, "pause");
	                                                _context2.next = 5;
	                                                return sleep(500);

	                                            case 5:
	                                                assert.equal(getPropertyValue($target, "opacity"), "1", "Delayed property value unchanged after pause.");
	                                                Velocity($target, "resume");
	                                                _context2.next = 9;
	                                                return sleep(100);

	                                            case 9:
	                                                assert.equal(getPropertyValue($target, "opacity"), "1", "Delayed tween did not start early after pause.");
	                                                _context2.next = 12;
	                                                return sleep(500);

	                                            case 12:
	                                                assert.equal(getPropertyValue($target, "opacity"), "0", "Delayed tween completed after pause/resume.");
	                                                done();

	                                            case 14:
	                                            case "end":
	                                                return _context2.stop();
	                                        }
	                                    }
	                                }, _callee2, this);
	                            }));
	                        });
	                        asyncTests(assert, 1, function (done) {
	                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
	                                var $target;
	                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
	                                    while (1) {
	                                        switch (_context3.prev = _context3.next) {
	                                            case 0:
	                                                $target = getTarget();

	                                                Velocity($target, { opacity: 0 }, { queue: "test", duration: 250 });
	                                                Velocity("pause", "test");
	                                                _context3.next = 5;
	                                                return sleep(300);

	                                            case 5:
	                                                assert.equal(getPropertyValue($target, "opacity"), "1", "Pause 'queue' works globally.");
	                                                done();

	                                            case 7:
	                                            case "end":
	                                                return _context3.stop();
	                                        }
	                                    }
	                                }, _callee3, this);
	                            }));
	                        });
	                        asyncTests(assert, 1, function (done) {
	                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
	                                var $target;
	                                return regeneratorRuntime.wrap(function _callee4$(_context4) {
	                                    while (1) {
	                                        switch (_context4.prev = _context4.next) {
	                                            case 0:
	                                                $target = getTarget();

	                                                Velocity($target, { opacity: 0 }).velocity("pause");
	                                                _context4.next = 4;
	                                                return sleep(300);

	                                            case 4:
	                                                assert.equal(getPropertyValue($target, "opacity"), "1", "Chained pause only pauses chained tweens.");
	                                                done();

	                                            case 6:
	                                            case "end":
	                                                return _context4.stop();
	                                        }
	                                    }
	                                }, _callee4, this);
	                            }));
	                        });
	                        // TODO: Better global tests, queue: false, named queues
	                        //	/* Ensure proper behavior with queue:false  */
	                        //	var $target4 = getTarget();
	                        //	Velocity($target4, {opacity: 0}, {duration: 200});
	                        //
	                        //	var isResumed = false;
	                        //
	                        //	await sleep(100);
	                        //	Velocity($target4, "pause");
	                        //	Velocity($target4, {left: -20}, {
	                        //		duration: 100,
	                        //		easing: "linear",
	                        //		queue: false,
	                        //		begin: function(elements) {
	                        //			assert.ok(true, "Animation with {queue:false} will run regardless of previously paused animations.");
	                        //		}
	                        //	});
	                        //
	                        //	Velocity($target4, {top: 20}, {
	                        //		duration: 100,
	                        //		easing: "linear",
	                        //		begin: function(elements) {
	                        //			assert.ok(isResumed, "Queued animation began after previously paused animation completed");
	                        //		}
	                        //	});
	                        //
	                        //	await sleep(100);
	                        //
	                        //	isResumed = true;
	                        //	Velocity($target4, "resume");
	                        //	await sleep(100);
	                        assert.expect(asyncTests());

	                    case 6:
	                    case "end":
	                        return _context5.stop();
	                }
	            }
	        }, _callee5, this);
	    }));
	});

	QUnit.test("Reverse", function (assert) {
	    var $target = getTarget(),
	        opacity = $target.velocity("style", "opacity"),

	    // Browsers don't always suffix, but Velocity does.
	    width = $target.velocity("style", "width") === "0" ? "0px" : $target.velocity("style", "width");
	    asyncTests(assert, 2, function (done) {
	        Velocity($target, defaultProperties, {
	            complete: function complete(elements) {
	                assert.equal(elements[0].velocity("style", "opacity"), defaultProperties.opacity, "Initial property #1 set correctly. (" + defaultProperties.opacity + ")");
	                assert.equal(elements[0].velocity("style", "width"), defaultProperties.width, "Initial property #2 set correctly. (" + defaultProperties.width + ")");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 2, function (done) {
	        Velocity($target, "reverse", {
	            complete: function complete(elements) {
	                assert.equal(elements[0].velocity("style", "opacity"), opacity, "Reversed property #1 set correctly. (" + opacity + ")");
	                assert.equal(elements[0].velocity("style", "width"), width, "Reversed property #2 set correctly. (" + width + ")");
	                done();
	            }
	        });
	    });
	    asyncTests(assert, 2, function (done) {
	        Velocity($target, "reverse", {
	            complete: function complete(elements) {
	                assert.equal(elements[0].velocity("style", "opacity"), defaultProperties.opacity, "Chained reversed property #1 set correctly. (" + defaultProperties.opacity + ")");
	                assert.equal(elements[0].velocity("style", "width"), defaultProperties.width, "Chained reversed property #2 set correctly. (" + defaultProperties.width + ")");
	                done();
	            }
	        });
	    });
	    assert.expect(asyncTests());
	});

	/* Window scrolling. */
	QUnit.skip("Scroll (Window)", function (assert) {
	    //	var done = assert.async(4),
	    //		$details = $("#details"),
	    //		$scrollTarget1 = $("<div>Scroll target #1. Should stop 50 pixels above this point.</div>"),
	    //		$scrollTarget2 = $("<div>Scroll target #2. Should stop 50 pixels before this point.</div>"),
	    //		scrollOffset = -50;
	    //
	    //	$scrollTarget1
	    //		.css({position: "relative", top: 3000, height: 100, paddingBottom: 10000})
	    //		.appendTo($("body"));
	    //
	    //	$scrollTarget2
	    //		.css({position: "absolute", top: 100, left: 3000, width: 100, paddingRight: 15000})
	    //		.appendTo($("body"));
	    //
	    //	$scrollTarget1
	    //		.velocity("scroll", {
	    //			duration: 500, offset: scrollOffset, complete: function() {
	    //				assert.equal(Math.abs(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyTop]
	    //				 - ($scrollTarget1.offset().top + scrollOffset)) <= 100, true, "Page scrolled top with a scroll offset.");
	    //
	    //				done();
	    //			}
	    //		})
	    //		.velocity({opacity: 0.5}, function() {
	    //			$details
	    //				.velocity({opacity: 0.5}, 500)
	    //				.velocity("scroll", 500)
	    //				.velocity({opacity: 1}, 500, function() {
	    //					//alert(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyTop] + " " + ($details.offset().top + scrollOffset))
	    //					assert.equal(Math.abs(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyTop]
	    //					 - ($details.offset().top + scrollOffset)) <= 100, true, "Page scroll top was chained.");
	    //
	    //					done();
	    //
	    //					//$scrollTarget1.remove();
	    //
	    //					$scrollTarget2
	    //						.velocity("scroll", {
	    //							duration: 500, axis: "x", offset: scrollOffset, complete: function() {
	    //								/* Phones can reposition the browser's scroll position by a 10 pixels or so, so we just check for a value that's within that range. */
	    //								assert.equal(Math.abs(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyLeft]
	    //								 - ($scrollTarget2.offset().left + scrollOffset)) <= 100, true, "Page scrolled left with a scroll offset.");
	    //
	    //								done();
	    //							}
	    //						})
	    //						.velocity({opacity: 0.5}, function() {
	    //							$details
	    //								.velocity({opacity: 0.5}, 500)
	    //								.velocity("scroll", {duration: 500, axis: "x"})
	    //								.velocity({opacity: 1}, 500, function() {
	    //									assert.equal(Math.abs(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyLeft]
	    //									 - ($details.offset().left + scrollOffset)) <= 100, true, "Page scroll left was chained.");
	    //
	    //									done();
	    //								});
	    //						});
	    //				});
	    //		});
	});
	/* Element scrolling. */
	QUnit.skip("Scroll (Element)", function (assert) {
	    //	var done = assert.async(2),
	    //		$scrollTarget1 = $("\
	    //					<div id='scroller'>\
	    //						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
	    //						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
	    //						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
	    //						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
	    //						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
	    //						<div id='scrollerChild1'>\
	    //							Stop #1\
	    //							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
	    //							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
	    //							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
	    //							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
	    //							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
	    //						</div>\
	    //						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
	    //						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
	    //						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
	    //						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
	    //						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
	    //						<div id='scrollerChild2'>\
	    //							Stop #2\
	    //							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
	    //							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
	    //							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
	    //							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
	    //							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
	    //						</div>\
	    //						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
	    //						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
	    //						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
	    //						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
	    //						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
	    //					</div>\
	    //				");
	    //
	    //	assert.expect(2);
	    //	$scrollTarget1
	    //		.css({position: "absolute", backgroundColor: "white", top: 100, left: "50%", width: 500, height: 100, overflowY: "scroll"})
	    //		.appendTo($("body"));
	    //
	    //	/* Test with a jQuery object container. */
	    //	$("#scrollerChild1").velocity("scroll", {
	    //		container: $("#scroller"), duration: 750, complete: function() {
	    //			/* Test with a raw DOM element container. */
	    //			$("#scrollerChild2").velocity("scroll", {
	    //				container: $("#scroller")[0], duration: 750, complete: function() {
	    //					/* This test is purely visual. */
	    //					assert.ok(true);
	    //
	    //					$scrollTarget1.remove();
	    //
	    //					var $scrollTarget2 = $("\
	    //									<div id='scroller'>\
	    //										<div id='scrollerChild1' style='float: left; width: 20%;'>\
	    //											Stop #1\
	    //											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
	    //											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
	    //											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
	    //											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
	    //											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
	    //											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
	    //											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
	    //											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
	    //											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
	    //											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
	    //										</div>\
	    //										<div id='scrollerChild2' style='float: right; width: 20%;'>\
	    //											Stop #2\
	    //											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
	    //											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
	    //											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
	    //											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
	    //											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
	    //											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
	    //											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
	    //											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
	    //											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
	    //											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
	    //										</div>\
	    //									</div>\
	    //								");
	    //
	    //					$scrollTarget2
	    //						.css({position: "absolute", backgroundColor: "white", top: 100, left: "50%", width: 100, height: 500, overflowX: "scroll"})
	    //						.appendTo($("body"));
	    //
	    //					/* Test with a jQuery object container. */
	    //					$("#scrollerChild2").velocity("scroll", {
	    //						axis: "x", container: $("#scroller"), duration: 750, complete: function() {
	    //							/* Test with a raw DOM element container. */
	    //							$("#scrollerChild1").velocity("scroll", {
	    //								axis: "x", container: $("#scroller")[0], duration: 750, complete: function() {
	    //									/* This test is purely visual. */
	    //									assert.ok(true);
	    //
	    //									$scrollTarget2.remove();
	    //
	    //									done();
	    //								}
	    //							});
	    //						}
	    //					});
	    //
	    //					done();
	    //				}
	    //			});
	    //		}
	    //	});
	});

	var _this$5 = window;
	QUnit.test("Stop", function (assert) {
	    return __awaiter(_this$5, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
	        var _this2 = this;

	        return regeneratorRuntime.wrap(function _callee6$(_context6) {
	            while (1) {
	                switch (_context6.prev = _context6.next) {
	                    case 0:
	                        asyncTests(assert, 1, function (done) {
	                            Velocity(getTarget(), "stop");
	                            assert.ok(true, "Calling on an element that isn't animating doesn't cause an error.");
	                            done();
	                        });
	                        asyncTests(assert, 1, function (done) {
	                            var $target = getTarget();
	                            Velocity($target, defaultProperties, defaultOptions);
	                            Velocity($target, { top: 0 }, defaultOptions);
	                            Velocity($target, { width: 0 }, defaultOptions);
	                            Velocity($target, "stop");
	                            assert.ok(true, "Calling on an element that is animating doesn't cause an error.");
	                            done();
	                        });
	                        asyncTests(assert, 1, function (done) {
	                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	                                var $target, startOpacity;
	                                return regeneratorRuntime.wrap(function _callee$(_context) {
	                                    while (1) {
	                                        switch (_context.prev = _context.next) {
	                                            case 0:
	                                                $target = getTarget(), startOpacity = getPropertyValue($target, "opacity");

	                                                Velocity($target, { opacity: [0, 1] }, defaultOptions);
	                                                _context.next = 4;
	                                                return sleep(defaultOptions.duration / 2);

	                                            case 4:
	                                                Velocity($target, "stop");
	                                                assert.close(parseFloat(getPropertyValue($target, "opacity")), parseFloat(startOpacity) / 2, 0.1, "Animation runs until stopped.");
	                                                done();

	                                            case 7:
	                                            case "end":
	                                                return _context.stop();
	                                        }
	                                    }
	                                }, _callee, this);
	                            }));
	                        });
	                        asyncTests(assert, 1, function (done) {
	                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
	                                var $target, _begin;

	                                return regeneratorRuntime.wrap(function _callee2$(_context2) {
	                                    while (1) {
	                                        switch (_context2.prev = _context2.next) {
	                                            case 0:
	                                                $target = getTarget();
	                                                _begin = false;

	                                                Velocity($target, { opacity: [0, 1] }, {
	                                                    delay: 1000,
	                                                    begin: function begin() {
	                                                        _begin = true;
	                                                    }
	                                                });
	                                                _context2.next = 5;
	                                                return sleep(500);

	                                            case 5:
	                                                Velocity($target, "stop");
	                                                assert.notOk(_begin, "Stop animation before delay ends.");
	                                                done();

	                                            case 8:
	                                            case "end":
	                                                return _context2.stop();
	                                        }
	                                    }
	                                }, _callee2, this);
	                            }));
	                        });
	                        asyncTests(assert, 2, function (done) {
	                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
	                                var $target, complete1, complete2;
	                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
	                                    while (1) {
	                                        switch (_context3.prev = _context3.next) {
	                                            case 0:
	                                                $target = getTarget();
	                                                complete1 = false, complete2 = false;

	                                                Velocity($target, { opacity: [0, 1] }, {
	                                                    queue: "test1",
	                                                    complete: function complete() {
	                                                        complete1 = true;
	                                                    }
	                                                });
	                                                Velocity($target, { opacity: [0, 1] }, {
	                                                    queue: "test2",
	                                                    complete: function complete() {
	                                                        complete2 = true;
	                                                    }
	                                                });
	                                                Velocity($target, "stop", "test1");
	                                                _context3.next = 7;
	                                                return sleep(defaultOptions.duration * 2);

	                                            case 7:
	                                                assert.ok(complete2, "Stop animation with correct queue.");
	                                                assert.notOk(complete1, "Don't stop animation with wrong queue.");
	                                                done();

	                                            case 10:
	                                            case "end":
	                                                return _context3.stop();
	                                        }
	                                    }
	                                }, _callee3, this);
	                            }));
	                        });
	                        asyncTests(assert, 1, function (done) {
	                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
	                                var $target, begin1, begin2;
	                                return regeneratorRuntime.wrap(function _callee4$(_context4) {
	                                    while (1) {
	                                        switch (_context4.prev = _context4.next) {
	                                            case 0:
	                                                $target = getTarget();
	                                                begin1 = false, begin2 = false;

	                                                Velocity($target, { opacity: [0, 1] }, {
	                                                    begin: function begin() {
	                                                        begin1 = true;
	                                                    }
	                                                });
	                                                Velocity($target, { width: "500px" }, {
	                                                    begin: function begin() {
	                                                        begin2 = true;
	                                                    }
	                                                });
	                                                Velocity($target, "stop", true);
	                                                _context4.next = 7;
	                                                return sleep(defaultOptions.duration * 2);

	                                            case 7:
	                                                assert.notOk(begin1 || begin2, "Stop 'true' stops all animations.");
	                                                done();

	                                            case 9:
	                                            case "end":
	                                                return _context4.stop();
	                                        }
	                                    }
	                                }, _callee4, this);
	                            }));
	                        });
	                        asyncTests(assert, 2, function (done) {
	                            return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
	                                var $target, anim, begin1, begin2;
	                                return regeneratorRuntime.wrap(function _callee5$(_context5) {
	                                    while (1) {
	                                        switch (_context5.prev = _context5.next) {
	                                            case 0:
	                                                $target = getTarget(), anim = Velocity($target, { opacity: [0, 1] }, {
	                                                    queue: "test",
	                                                    begin: function begin() {
	                                                        begin1 = true;
	                                                    }
	                                                });
	                                                begin1 = false, begin2 = false;

	                                                Velocity($target, { opacity: [0, 1] }, {
	                                                    begin: function begin() {
	                                                        begin2 = true;
	                                                    }
	                                                });
	                                                anim.velocity("stop");
	                                                _context5.next = 6;
	                                                return sleep(defaultOptions.duration * 2);

	                                            case 6:
	                                                assert.notOk(begin1, "Stop without arguments on a chain stops chain animations.");
	                                                assert.ok(begin2, "Stop without arguments on a chain doesn't stop other animations.");
	                                                done();

	                                            case 9:
	                                            case "end":
	                                                return _context5.stop();
	                                        }
	                                    }
	                                }, _callee5, this);
	                            }));
	                        });
	                        assert.expect(asyncTests());

	                    case 8:
	                    case "end":
	                        return _context6.stop();
	                }
	            }
	        }, _callee6, this);
	    }));
	});

	QUnit.test("Tween", function (assert) {
	    var $target1 = getTarget(),
	        startOpacity = $target1.style.opacity;
	    assert.expect(11);
	    assert.raises(function () {
	        return Velocity("tween", "invalid");
	    }, "Invalid percentComplete throws an error.");
	    assert.raises(function () {
	        return Velocity([$target1, $target1], "tween", "invalid");
	    }, "Passing more than one target throws an error.");
	    assert.raises(function () {
	        return Velocity("tween", 0, ["invalid"]);
	    }, "Invalid propertyMap throws an error.");
	    assert.raises(function () {
	        return Velocity("tween", 0, "invalid", 1);
	    }, "Property without an element must be forcefed or throw an error.");
	    assert.equal($target1.velocity("tween", 0.5, "opacity", [1, 0], "linear"), "0.5", "Calling on an chain returns the correct value.");
	    assert.equal(Velocity($target1, "tween", 0.5, "opacity", [1, 0], "linear"), "0.5", "Calling with an element returns the correct value.");
	    assert.equal(Velocity("tween", 0.5, "opacity", [1, 0], "linear"), "0.5", "Calling without an element returns the correct value.");
	    assert.equal($target1.style.opacity, startOpacity, "Ensure that the element is not altered.");
	    assert.equal(_typeof(Velocity($target1, "tween", 0.5, "opacity", [1, 0], "linear")), "string", "Calling a single property returns a value.");
	    assert.equal(_typeof(Velocity($target1, "tween", 0.5, { opacity: [1, 0] }, "linear")), "object", "Calling a propertiesMap returns an object.");
	    assert.deepEqual($target1.velocity("tween", 0.5, { opacity: [1, 0] }, "linear"), Velocity($target1, "tween", 0.5, { opacity: [1, 0] }, "linear"), "Calling directly returns the same as a chain.");
	});

	QUnit.module("Feature");

	QUnit.test("'velocity-animating' Classname", function (assert) {
	    var done = assert.async(1);
	    Velocity(getTarget(), defaultProperties, {
	        begin: function begin(elements) {
	            assert.equal(/velocity-animating/.test(elements[0].className), true, "Class added.");
	        },
	        complete: function complete(elements) {
	            assert.equal(/velocity-animating/.test(elements[0].className), false, "Class removed.");
	        }
	    }).then(done);
	});

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

	QUnit.todo("Forcefeeding", function (assert) {
	    /* Note: Start values are always converted into pixels. W test the conversion ratio we already know to avoid additional work. */
	    var testStartWidth = "1rem",
	        testStartWidthToPx = "16px",
	        testStartHeight = "10px",
	        $target = getTarget();
	    Velocity($target, {
	        width: [100, "linear", testStartWidth],
	        height: [100, testStartHeight],
	        opacity: [defaultProperties.opacity, "easeInQuad"]
	    });
	    assert.equal(Data($target).cache.width, parseFloat(testStartWidthToPx), "Forcefed value #1 passed to tween.");
	    assert.equal(Data($target).cache.height, parseFloat(testStartHeight), "Forcefed value #2 passed to tween.");
	    assert.equal(Data($target).cache.opacity, defaultStyles.opacity, "Easing was misinterpreted as forcefed value.");
	});

	QUnit.test("Promises", function (assert) {
	    var done = assert.async(10),
	        start = getNow();
	    var result = void 0;
	    assert.expect(10);
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
	    Promise.all([Velocity(getTarget(), defaultProperties, defaultOptions).promise, Velocity(getTarget(), defaultProperties, defaultOptions).promise]).then(function () {
	        assert.ok(true, "Promise.all fulfilled when all animations have finished.");
	    }).then(done);
	});

	QUnit.todo("Sequences", function (assert) {
	    //	var done = assert.async(2),
	    //		$target1 = getTarget(),
	    //		$target2 = getTarget(),
	    //		redirectOptions = {duration: 1500};
	    //
	    //	((window as any).jQuery || (window as any).Zepto || window).Velocity.Redirects.test = function(element, options, elementIndex, elementsLength) {
	    //		if (elementIndex === 0) {
	    //			assert.deepEqual(element, $target1, "Element passed through #1.");
	    //			assert.deepEqual(options, redirectOptions, "Options object passed through #1.");
	    //			assert.equal(elementIndex, 0, "Element index passed through #1.");
	    //			assert.equal(elementsLength, 2, "Elements length passed through #1.");
	    //
	    //			done();
	    //		} else if (elementIndex === 1) {
	    //			assert.deepEqual(element, $target2, "Element passed through #2.");
	    //			assert.deepEqual(options, redirectOptions, "Options object passed through #2.");
	    //			assert.equal(elementIndex, 1, "Element index passed through #2.");
	    //			assert.equal(elementsLength, 2, "Elements length passed through #2.");
	    //
	    //			done();
	    //		}
	    //	};
	    //
	    //	Velocity([$target1, $target2], "test", redirectOptions);
	});

	QUnit.todo("Value Functions", function (assert) {
	    var testWidth = 10,
	        $target1 = getTarget(),
	        $target2 = getTarget();
	    Velocity([$target1, $target2], {
	        width: function width(i, total) {
	            return (i + 1) / total * testWidth;
	        }
	    });
	    assert.equal(Data($target1).cache.width, parseFloat(testWidth) / 2, "Function value #1 passed to tween.");
	    assert.equal(Data($target2).cache.width, parseFloat(testWidth), "Function value #2 passed to tween.");
	});

	QUnit.module("UI Pack");

	QUnit.skip("Packaged Effect: slideUp/Down", function (assert) {
	    var done = assert.async(4),
	        $target1 = getTarget(),
	        $target2 = getTarget(),
	        initialStyles = {
	        display: "none",
	        paddingTop: "123px"
	    };
	    $target1.style.display = initialStyles.display;
	    $target1.style.paddingTop = initialStyles.paddingTop;
	    Velocity($target1, "slideDown", {
	        begin: function begin(elements) {
	            assert.deepEqual(elements, [$target1], "slideDown: Begin callback returned.");
	            done();
	        },
	        complete: function complete(elements) {
	            assert.deepEqual(elements, [$target1], "slideDown: Complete callback returned.");
	            //			assert.equal(getPropertyValue($target1, "display"), Values.getDisplayType($target1), "slideDown: display set to default.");
	            assert.notEqual(getPropertyValue($target1, "height"), 0, "slideDown: height set.");
	            assert.equal(getPropertyValue($target1, "paddingTop"), initialStyles.paddingTop, "slideDown: paddingTop set.");
	            done();
	        }
	    });
	    Velocity($target2, "slideUp", {
	        begin: function begin(elements) {
	            assert.deepEqual(elements, [$target2], "slideUp: Begin callback returned.");
	            done();
	        },
	        complete: function complete(elements) {
	            assert.deepEqual(elements, [$target2], "slideUp: Complete callback returned.");
	            assert.equal(getPropertyValue($target2, "display"), 0, "slideUp: display set to none.");
	            assert.notEqual(getPropertyValue($target2, "height"), 0, "slideUp: height reset.");
	            assert.equal(getPropertyValue($target1, "paddingTop"), initialStyles.paddingTop, "slideUp: paddingTop reset.");
	            done();
	        }
	    });
	});

	QUnit.skip("Call Options", function (assert) {
	    var done = assert.async(2),
	        UICallOptions1 = {
	        delay: 123,
	        duration: defaultOptions.duration,
	        easing: "spring"
	    },
	        $target1 = getTarget();
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

	QUnit.skip("Callbacks", function (assert) {
	    var done = assert.async(2),
	        $targets = [getTarget(), getTarget()];
	    assert.expect(3);
	    Velocity($targets, "transition.bounceIn", {
	        begin: function begin(elements) {
	            assert.deepEqual(elements, $targets, "Begin callback returned.");
	            done();
	        },
	        complete: function complete(elements) {
	            assert.deepEqual(elements, $targets, "Complete callback returned.");
	            done();
	        }
	    });
	});

	QUnit.skip("In/Out", function (assert) {
	    var done = assert.async(2),
	        $target1 = getTarget(),
	        $target2 = getTarget(),
	        $target3 = getTarget(),
	        $target4 = getTarget(),
	        $target5 = getTarget(),
	        $target6 = getTarget();
	    Velocity($target1, "transition.bounceIn", defaultOptions.duration);
	    //	Velocity($target2, "transition.bounceIn", {duration: defaultOptions.duration, display: "inline"});
	    //
	    //	Velocity($target3, "transition.bounceOut", defaultOptions.duration);
	    //
	    //	Velocity($target4, "transition.bounceOut", {duration: defaultOptions.duration, display: null});
	    //
	    //	$target5.style.visibility = "hidden";
	    //	Velocity($target5, "transition.bounceIn", {duration: defaultOptions.duration, visibility: "visible"});
	    //
	    //	$target6.style.visibility = "visible";
	    //	Velocity($target6, "transition.bounceOut", {duration: defaultOptions.duration, visibility: "hidden"});
	    assert.expect(8);
	    setTimeout(function () {
	        assert.notEqual(getPropertyValue($target3, "display"), 0, "Out: display not prematurely set to none.");
	        assert.notEqual(getPropertyValue($target6, "visibility"), "hidden", "Out: visibility not prematurely set to hidden.");
	        done();
	    }, asyncCheckDuration);
	    setTimeout(function () {
	        //		assert.equal(getPropertyValue($target1, "display"), Values.getDisplayType($target1), "In: display set to default.");
	        assert.equal(getPropertyValue($target2, "display"), "inline", "In: Custom inline value set.");
	        assert.equal(getPropertyValue($target3, "display"), 0, "Out: display set to none.");
	        //		assert.equal(getPropertyValue($target4, "display"), Values.getDisplayType($target3), "Out: No display value set.");
	        assert.equal(getPropertyValue($target5, "visibility"), "visible", "In: visibility set to visible.");
	        assert.equal(getPropertyValue($target6, "visibility"), "hidden", "Out: visibility set to hidden.");
	        done();
	    }, completeCheckDuration);
	});

	QUnit.skip("RegisterEffect", function (assert) {
	    //	const done = assert.async(1),
	    //		effectDefaultDuration = 800;
	    //
	    //	assert.expect(2);
	    //	Velocity.RegisterEffect("callout.twirl", {
	    //		defaultDuration: effectDefaultDuration,
	    //		calls: [
	    //			[{rotateZ: 1080}, 0.5],
	    //			[{scaleX: 0.5}, 0.25, {easing: "spring"}],
	    //			[{scaleX: 1}, 0.25, {easing: "spring"}],
	    //		],
	    //	});
	    //
	    //	const $target1 = getTarget();
	    //	Velocity($target1, "callout.twirl");
	    //
	    //	setTimeout(() => {
	    //		assert.equal(parseFloat(getPropertyValue($target1, "rotateZ") as string), 1080, "First call's property animated.");
	    //		assert.equal(parseFloat(getPropertyValue($target1, "scaleX") as string), 1, "Last call's property animated.");
	    //
	    //		done();
	    //	}, effectDefaultDuration * 1.5);
	});

	QUnit.skip("RunSequence", function (assert) {
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

	QUnit.module("Properties");

	QUnit.skip("GenericReordering", function (assert) {
	    //	function genericReordering(element: HTMLorSVGElement, propertyValue?: string): string | void {
	    //		if (propertyValue === undefined) {
	    //			propertyValue = Velocity(element, "style", "textShadow");
	    //			const split = propertyValue.split(/\s/g),
	    //				firstPart = split[0];
	    //			let newValue = "";
	    //
	    //			if (Velocity.CSS.ColorNames[firstPart]) {
	    //				split.shift();
	    //				split.push(firstPart);
	    //				newValue = split.join(" ");
	    //			} else if (firstPart.match(/^#|^hsl|^rgb|-gradient/)) {
	    //				const matchedString = propertyValue.match(/(hsl.*\)|#[\da-fA-F]+|rgb.*\)|.*gradient.*\))\s/g)[0];
	    //
	    //				newValue = propertyValue.replace(matchedString, "") + " " + matchedString.trim();
	    //			} else {
	    //				newValue = propertyValue;
	    //			}
	    //			return newValue;
	    //		}
	    //	}
	    //
	    //	Velocity("registerNormalization", "Element", "genericReordering", genericReordering);
	    //
	    //	let tests = [
	    //		{
	    //			test: "hsl(16, 100%, 66%) 1px 1px 1px",
	    //			result: "1px 1px 1px hsl(16, 100%, 66%)",
	    //		}, {
	    //			test: "-webkit-linear-gradient(red, yellow) 1px 1px 1px",
	    //			result: "1px 1px 1px -webkit-linear-gradient(rgba(255,0,0,1), rgba(255,255,0,1))",
	    //		}, {
	    //			test: "-o-linear-gradient(red, yellow) 1px 1px 1px",
	    //			result: "1px 1px 1px -o-linear-gradient(rgba(255,0,0,1), rgba(255,255,0,1))",
	    //		}, {
	    //			test: "-moz-linear-gradient(red, yellow) 1px 1px 1px",
	    //			result: "1px 1px 1px -moz-linear-gradient(rgba(255,0,0,1), rgba(255,255,0,1))",
	    //		}, {
	    //			test: "linear-gradient(red, yellow) 1px 1px 1px",
	    //			result: "1px 1px 1px linear-gradient(rgba(255,0,0,1), rgba(255,255,0,1))",
	    //		}, {
	    //			test: "red 1px 1px 1px",
	    //			result: "1px 1px 1px rgba(255,0,0,1)",
	    //		}, {
	    //			test: "#000000 1px 1px 1px",
	    //			result: "1px 1px 1px rgba(0,0,0,1)",
	    //		}, {
	    //			test: "rgb(0, 0, 0) 1px 1px 1px",
	    //			result: "1px 1px 1px rgba(0,0,0,1)",
	    //		}, {
	    //			test: "rgba(0, 0, 0, 1) 1px 1px 1px",
	    //			result: "1px 1px 1px rgba(0,0,0,1)",
	    //		}, {
	    //			test: "1px 1px 1px rgb(0, 0, 0)",
	    //			result: "1px 1px 1px rgba(0,0,0,1)",
	    //		},
	    //	];
	    //
	    //	for (let test of tests) {
	    //		let element = getTarget();
	    //
	    //		element.velocity("style", "textShadow", test.test);
	    //		assert.equal(element.velocity("style", "genericReordering"), test.result, test.test);
	    //	}
	});

	QUnit.test("Display", function (assert) {
	    var done = assert.async(5);
	    Velocity(getTarget(), "style", "display", "none").velocity({ display: "block" }, {
	        progress: once(function (elements) {
	            assert.equal(elements.velocity("style", "display"), "block", "Display:'block' was set immediately.");
	            done();
	        })
	    });
	    Velocity(getTarget(), "style", "display", "none").velocity("style", "display", "auto").then(function (elements) {
	        assert.equal(elements[0].style.display, "block", "Display:'auto' was understood.");
	        assert.equal(elements.velocity("style", "display"), "block", "Display:'auto' was cached as 'block'.");
	        done();
	    });
	    Velocity(getTarget(), "style", "display", "none").velocity("style", "display", "").then(function (elements) {
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

	QUnit.test("Visibility", function (assert) {
	    var done = assert.async(4);
	    Velocity(getTarget(), "style", "visibility", "hidden").velocity({ visibility: "visible" }, {
	        progress: once(function (elements) {
	            assert.equal(elements.velocity("style", "visibility"), "visible", "Visibility:'visible' was set immediately.");
	            done();
	        })
	    });
	    Velocity(getTarget(), "style", "visibility", "hidden").velocity("style", "visibility", "").then(function (elements) {
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

})));
//# sourceMappingURL=test.js.map
