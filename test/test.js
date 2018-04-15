/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
System.register("1. Core/_module", ["Arguments.ts", "End Value Caching.ts", "End Value Setting.ts", "Start Value Calculation.ts", "Unit Calculation.ts"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (_1) {
            },
            function (_2) {
            },
            function (_3) {
            },
            function (_4) {
            },
            function (_5) {
            }
        ],
        execute: function () {/*
             * VelocityJS.org (C) 2014-2017 Julian Shapiro.
             *
             * Licensed under the MIT license. See LICENSE file in the project root for details.
             */
            QUnit.module("Core");
        }
    };
});
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
System.register("2. Option/_module", ["Option Begin.ts", "Option Complete.ts", "Option Delay.ts", "Option Easing.ts", "Option Fps Limit.ts", "Option Loop.ts", "Option Progress.ts", "Option Queue.ts", "Option Repeat.ts", "Option Speed.ts", "Option Sync.ts"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (_6) {
            },
            function (_7) {
            },
            function (_8) {
            },
            function (_9) {
            },
            function (_10) {
            },
            function (_11) {
            },
            function (_12) {
            },
            function (_13) {
            },
            function (_14) {
            },
            function (_15) {
            },
            function (_16) {
            }
        ],
        execute: function () {/*
             * VelocityJS.org (C) 2014-2017 Julian Shapiro.
             *
             * Licensed under the MIT license. See LICENSE file in the project root for details.
             */
            QUnit.module("Option");
        }
    };
});
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
System.register("3. Command/_module", ["Command Finish.ts", "Command Pause + Resume.ts", "Command Reverse.ts", "Command Scroll.ts", "Command Stop.ts", "Command Tween.ts"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (_17) {
            },
            function (_18) {
            },
            function (_19) {
            },
            function (_20) {
            },
            function (_21) {
            },
            function (_22) {
            }
        ],
        execute: function () {/*
             * VelocityJS.org (C) 2014-2017 Julian Shapiro.
             *
             * Licensed under the MIT license. See LICENSE file in the project root for details.
             */
            QUnit.module("Command");
        }
    };
});
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
System.register("4. Feature/_module", ["Feature Classname.ts", "Feature Colors.ts", "Feature Forcefeeding.ts", "Feature Promises.ts", "Feature Sequences.ts", "Feature Value Functions.ts"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (_23) {
            },
            function (_24) {
            },
            function (_25) {
            },
            function (_26) {
            },
            function (_27) {
            },
            function (_28) {
            }
        ],
        execute: function () {/*
             * VelocityJS.org (C) 2014-2017 Julian Shapiro.
             *
             * Licensed under the MIT license. See LICENSE file in the project root for details.
             */
            QUnit.module("Feature");
        }
    };
});
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
System.register("5. UI Pack/_module", ["Packaged Effect slideUp+Down.ts", "UI Pack Call Options.ts", "UI Pack Callbacks.ts", "UI Pack In+Out.ts", "UI Pack RegisterEffect.ts", "UI Pack RunSequence.ts"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (_29) {
            },
            function (_30) {
            },
            function (_31) {
            },
            function (_32) {
            },
            function (_33) {
            },
            function (_34) {
            }
        ],
        execute: function () {/*
             * VelocityJS.org (C) 2014-2017 Julian Shapiro.
             *
             * Licensed under the MIT license. See LICENSE file in the project root for details.
             */
            QUnit.module("UI Pack");
        }
    };
});
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
System.register("6. Properties/_module", ["Normalization property value reordering.ts", "Property Display.ts", "Property Visibility.ts"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (_35) {
            },
            function (_36) {
            },
            function (_37) {
            }
        ],
        execute: function () {/*
             * VelocityJS.org (C) 2014-2017 Julian Shapiro.
             *
             * Licensed under the MIT license. See LICENSE file in the project root for details.
             */
            QUnit.module("Properties");
        }
    };
});
///<reference types="qunit" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
System.register("app", ["../../index.d", "1. Core/_module", "2. Option/_module", "3. Command/_module", "4. Feature/_module", "5. UI Pack/_module", "6. Properties/_module"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    function applyStartValues(element, startValues) {
        $.each(startValues, function (property, startValue) {
            element.style[property] = startValue;
        });
    }
    exports_7("applyStartValues", applyStartValues);
    function Data(element) {
        return (element.jquery ? element[0] : element).velocityData;
    }
    exports_7("Data", Data);
    function getNow() {
        return performance && performance.now ? performance.now() : Date.now();
    }
    exports_7("getNow", getNow);
    function getPropertyValue(element, property) {
        return index_d_1.Velocity.CSS.getPropertyValue(element, property);
    }
    exports_7("getPropertyValue", getPropertyValue);
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
    exports_7("getTarget", getTarget);
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
    exports_7("once", once);
    function sleep(ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    }
    exports_7("sleep", sleep);
    function async(assert, count, callback) {
        if (!assert) {
            var count_1 = asyncCount;
            asyncCount = 0;
            return count_1;
        }
        var done = assert.async(1);
        asyncCount += count;
        setTimeout(function () {
            callback(done);
        }, 1);
    }
    exports_7("async", async);
    function isEmptyObject(variable) {
        for (var name_1 in variable) {
            if (variable.hasOwnProperty(name_1)) {
                return false;
            }
        }
        return true;
    }
    exports_7("isEmptyObject", isEmptyObject);
    var index_d_1, defaultStyles, defaultProperties, defaultOptions, isMobile, isAndroid, $, $qunitStage, asyncCheckDuration, completeCheckDuration, IE, targets, asyncCount;
    return {
        setters: [
            function (index_d_1_1) {
                index_d_1 = index_d_1_1;
            },
            function (_38) {
            },
            function (_39) {
            },
            function (_40) {
            },
            function (_41) {
            },
            function (_42) {
            },
            function (_43) {
            }
        ],
        execute: function () {///<reference types="qunit" />
            /*
             * VelocityJS.org (C) 2014-2017 Julian Shapiro.
             *
             * Licensed under the MIT license. See LICENSE file in the project root for details.
             */
            // Needed tests:
            // - new stop behvaior
            // - e/p/o shorthands
            exports_7("defaultStyles", defaultStyles = {
                opacity: 1,
                width: 1,
                height: 1,
                marginBottom: 1,
                colorGreen: 200,
                textShadowBlur: 3
            }), exports_7("defaultProperties", defaultProperties = {
                opacity: String(defaultStyles.opacity / 2),
                width: defaultStyles.width * 2 + "px",
                height: defaultStyles.height * 2 + "px"
            }), exports_7("defaultOptions", defaultOptions = {
                queue: "",
                duration: 300,
                easing: "swing",
                begin: null,
                complete: null,
                progress: null,
                loop: false,
                delay: 0,
                mobileHA: true
            }), exports_7("isMobile", isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)), exports_7("isAndroid", isAndroid = /Android/i.test(navigator.userAgent)), exports_7("$", $ = (window.jQuery || window.Zepto)), exports_7("$qunitStage", $qunitStage = document.getElementById("qunit-stage")), exports_7("asyncCheckDuration", asyncCheckDuration = defaultOptions.duration / 2), exports_7("completeCheckDuration", completeCheckDuration = defaultOptions.duration * 2), exports_7("IE", IE = (function () {
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
            })());
            targets = [], asyncCount = 0;
            QUnit.config.reorder = false;
            QUnit.testDone(function () {
                try {
                    document.querySelectorAll(".velocity-animating").velocity("stop");
                }
                catch (e) { }
                // Free all targets requested by the current test.
                while (targets.length) {
                    try {
                        $qunitStage.removeChild(targets.pop());
                    }
                    catch (e) { }
                }
                // Ensure we have reset the test counter.
                async();
                // Make sure Velocity goes back to defaults.
                index_d_1.Velocity.defaults.reset();
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
        }
    };
});
//# sourceMappingURL=test.js.map