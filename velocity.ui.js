/***************
    Details
***************/

/*!
* velocity.ui.js: UI effects pack for Velocity. Load this after Velocity.
* @version 1.1.2
* @docs http://velocityjs.org/#uiPack
* @support <=IE8: Callouts will have no effect, and transitions will simply fade in/out. IE9/Android 2.3: Most effects are fully supported, the rest fade in/out. All other browsers: Full support.
* @license Copyright Julian Shapiro. MIT License: http://en.wikipedia.org/wiki/MIT_License
* @license Portions adapted from Animate.css, copyright Daniel Eden. MIT License: http://en.wikipedia.org/wiki/MIT_License
* @license Portions adapted from Magic.css, copyright Christian Pucci. MIT License: http://en.wikipedia.org/wiki/MIT_License
*/   

(function() {
    var Container = (window.jQuery || window.Zepto || window);

    if (!Container.Velocity || !Container.Velocity.Utilities) {
        console.log("Velocity UI Pack: Velocity must first be loaded. Aborting.");

        return;
    }

    /* Effects declarations. */
    var effects = 
        { 
            /* Animate.css */
            "callout.bounce": {
                defaultDuration: 550,
                calls: [
                    [ { translateY: -30 }, 0.25 ],
                    [ { translateY: 0 }, 0.125 ],
                    [ { translateY: -15 }, 0.125 ],
                    [ { translateY: 0 }, 0.25 ]
                ]
            },
            /* Animate.css */
            "callout.shake": {
                defaultDuration: 800,
                calls: [ 
                    [ { translateX: -10 }, 0.125 ],
                    [ { translateX: 10 }, 0.125, 3 ],
                    [ { translateX: 0 }, 0.125 ]
                ]
            },
            /* Animate.css */
            "callout.flash": {
                defaultDuration: 1100,
                calls: [ 
                    [ { opacity: [ 0, "swing", 1 ] }, 0.25 ],
                    [ { opacity: [ 1, "swing" ] }, 0.25 ],
                    [ { opacity: [ 0, "swing" ] }, 0.25 ],
                    [ { opacity: [ 1, "swing" ] }, 0.25 ]
                ]
            },
            /* Animate.css */
            "callout.pulse": {
                defaultDuration: 900,
                calls: [ 
                    [ { scaleX: 1.1, scaleY: 1.1 }, 0.50 ],
                    [ { scaleX: 1, scaleY: 1 }, 0.50 ]
                ]
            },
            /* Animate.css */
            "callout.swing": {
                defaultDuration: 950,
                calls: [ 
                    [ { rotateZ: 15 }, 0.20 ],
                    [ { rotateZ: -10 }, 0.20 ],
                    [ { rotateZ: 5 }, 0.20 ],
                    [ { rotateZ: -5 }, 0.20 ],
                    [ { rotateZ: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "callout.tada": {
                defaultDuration: 1000,
                calls: [ 
                    [ { scaleX: 0.9, scaleY: 0.9, rotateZ: -3 }, 0.10 ],
                    [ { scaleX: 1.1, scaleY: 1.1, rotateZ: 3 }, 0.10 ],
                    [ { scaleX: 1.1, scaleY: 1.1, rotateZ: -3 }, 0.10, 3 ],
                    [ { scaleX: 1, scaleY: 1, rotateZ: 0 }, 0.20 ]
                ]
            },
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.flipXIn": {
                defaultDuration: 700,
                calls: [ 
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 800, 800 ], rotateY: [ 0, -55 ] } ]
                ],
                reset: { transformPerspective: 0 }
            },
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.flipXOut": {
                defaultDuration: 700,
                calls: [ 
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 800, 800 ], rotateY: 55 } ]
                ],
                reset: { opacity: [ 1, 1 ], transformPerspective: 0, rotateY: 0 }
            },
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.flipYIn": {
                defaultDuration: 700,
                calls: [ 
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 800, 800 ], rotateX: [ 0, -35 ] } ]
                ],
                reset: { transformPerspective: 0 }
            },
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.flipYOut": {
                defaultDuration: 700,
                calls: [ 
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 800, 800 ], rotateX: 25 } ]
                ],
                reset: { opacity: [ 1, 1 ], transformPerspective: 0, rotateX: 0 }
            },
            /* Animate.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.flipBounceXIn": {
                defaultDuration: 900,
                calls: [ 
                    [ { opacity: [ 0.725, 0 ], transformPerspective: [ 400, 400 ], rotateY: [ -10, 90 ] }, 0.50 ],
                    [ { opacity: 0.80, rotateY: 10 }, 0.25 ],
                    [ { opacity: 1, rotateY: 0 }, 0.25 ]
                ],
                reset: { transformPerspective: 0 }
            },
            /* Animate.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.flipBounceXOut": {
                defaultDuration: 800,
                calls: [ 
                    [ { opacity: [ 0.9, 1 ], transformPerspective: [ 400, 400 ], rotateY: -10 }, 0.50 ],
                    [ { opacity: 0, rotateY: 90 }, 0.50 ]
                ],
                reset: { opacity: [ 1, 1 ], transformPerspective: 0, rotateY: 0 }
            },
            /* Animate.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.flipBounceYIn": {
                defaultDuration: 850,
                calls: [ 
                    [ { opacity: [ 0.725, 0 ], transformPerspective: [ 400, 400 ], rotateX: [ -10, 90 ] }, 0.50 ],
                    [ { opacity: 0.80, rotateX: 10 }, 0.25 ],
                    [ { opacity: 1, rotateX: 0 }, 0.25 ]
                ],
                reset: { transformPerspective: 0 }
            },
            /* Animate.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.flipBounceYOut": {
                defaultDuration: 800,
                calls: [ 
                    [ { opacity: [ 0.9, 1 ], transformPerspective: [ 400, 400 ], rotateX: -15 }, 0.50 ],
                    [ { opacity: 0, rotateX: 90 }, 0.50 ]
                ],
                reset: { opacity: [ 1, 1 ], transformPerspective: 0, rotateX: 0 }
            },
            /* Magic.css */
            "transition.swoopIn": {
                defaultDuration: 850,
                calls: [ 
                    [ { opacity: [ 1, 0 ], transformOriginX: [ "100%", "25%" ], transformOriginY: [ "100%", "100%" ], transformOriginZ: [ 0, 0 ], scaleX: [ 1, 0 ], scaleY: [ 1, 0 ], translateX: [ 0, -700 ], translateZ: 0 } ]
                ],
                reset: { transformOriginX: "50%", transformOriginY: "50%" }
            },
            /* Magic.css */
            "transition.swoopOut": {
                defaultDuration: 850,
                calls: [ 
                    [ { opacity: [ 0, 1 ], transformOriginX: [ "25%", "100%" ], transformOriginY: [ "100%", "100%" ], transformOriginZ: [ 0, 0 ], scaleX: 0, scaleY: 0, translateX: -700, translateZ: 0 } ]
                ],
                reset: { opacity: [ 1, 1 ], transformOriginX: "50%", transformOriginY: "50%", scaleX: 1, scaleY: 1, translateX: 0 }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades and scales only.) */
            "transition.whirlIn": {
                defaultDuration: 1000,
                calls: [ 
                    [ { opacity: [ 1, 0 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], transformOriginZ: [ 0, 0 ], scaleX: [ 1, 0 ], scaleY: [ 1, 0 ], rotateY: [ 0, 180 ] } ]
                ]
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades and scales only.) */
            "transition.whirlOut": {
                defaultDuration: 1000,
                calls: [ 
                    [ { opacity: [ 0, 1 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], transformOriginZ: [ 0, 0 ], scaleX: 0, scaleY: 0, rotateY: 180 } ]
                ],
                reset: { opacity: [ 1, 1 ], scaleX: 1, scaleY: 1, rotateY: 0 }
            },
            "transition.shrinkIn": {
                defaultDuration: 700,
                calls: [ 
                    [ { opacity: [ 1, 0 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], transformOriginZ: [ 0, 0 ], scaleX: [ 1, 1.625 ], scaleY: [ 1, 1.625 ], translateZ: 0 } ]
                ]
            },
            "transition.shrinkOut": {
                defaultDuration: 700,
                calls: [ 
                    [ { opacity: [ 0, 1 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], transformOriginZ: [ 0, 0 ], scaleX: 1.35, scaleY: 1.35, translateZ: 0 } ]
                ],
                reset: { opacity: [ 1, 1 ], scaleX: 1, scaleY: 1 }
            },
            "transition.expandIn": {
                defaultDuration: 700,
                calls: [ 
                    [ { opacity: [ 1, 0 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], transformOriginZ: [ 0, 0 ], scaleX: [ 1, 0.625 ], scaleY: [ 1, 0.625 ], translateZ: 0 } ]
                ]
            },
            "transition.expandOut": {
                defaultDuration: 700,
                calls: [ 
                    [ { opacity: [ 0, 1 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], transformOriginZ: [ 0, 0 ], scaleX: 0.5, scaleY: 0.5, translateZ: 0 } ]
                ],
                reset: { opacity: [ 1, 1 ], scaleX: 1, scaleY: 1 }
            },
            /* Animate.css */
            "transition.bounceIn": {
                defaultDuration: 1000,
                calls: [ 
                    [ { opacity: [ 1, 0 ], scaleX: [ 1.05, 0.3 ], scaleY: [ 1.05, 0.3 ] }, 0.40 ],
                    [ { scaleX: 0.9, scaleY: 0.9, translateZ: 0 }, 0.20 ],
                    [ { scaleX: 1, scaleY: 1 }, 0.50 ]
                ]
            },
            /* Animate.css */
            "transition.bounceOut": {
                defaultDuration: 1000,
                calls: [ 
                    [ { opacity: [ 1, 1 ], scaleX: 0.95, scaleY: 0.95 }, 0.35 ],
                    [ { scaleX: 1.1, scaleY: 1.1, translateZ: 0 }, 0.35 ],
                    [ { opacity: 0, scaleX: 0.3, scaleY: 0.3 }, 0.30 ]
                ],
                reset: { opacity: [ 1, 1 ], scaleX: 1, scaleY: 1 }
            },
            /* Animate.css */
            "transition.bounceUpIn": {
                defaultDuration: 1000,
                calls: [ 
                    [ { opacity: [ 1, "easeOutQuad", 0 ], translateY: [ -30, 1000 ] }, 0.60 ],
                    [ { translateY: 10 }, 0.20 ],
                    [ { translateY: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "transition.bounceUpOut": {
                defaultDuration: 1000,
                calls: [ 
                    [ { opacity: [ 1, "easeInQuad", 1 ], translateY: 20 }, 0.20 ],
                    [ { opacity: 0, translateY: -1000 }, 0.80 ]
                ],
                reset: { opacity: [ 1, 1 ], translateY: 0 }
            },
            /* Animate.css */
            "transition.bounceDownIn": {
                defaultDuration: 1000,
                calls: [ 
                    [ { opacity: [ 1, "easeOutQuad", 0 ], translateY: [ 30, -1000 ] }, 0.60 ],
                    [ { translateY: -10 }, 0.20 ],
                    [ { translateY: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "transition.bounceDownOut": {
                defaultDuration: 1000,
                calls: [ 
                    [ { opacity: [ 1, "easeInQuad", 1 ], translateY: -20 }, 0.20 ],
                    [ { opacity: 0, translateY: 1000 }, 0.80 ]
                ],
                reset: { opacity: [ 1, 1 ], translateY: 0 }
            },
            /* Animate.css */
            "transition.bounceLeftIn": {
                defaultDuration: 900,
                calls: [ 
                    [ { opacity: [ 1, "easeOutQuad", 0 ], translateX: [ 30, -1000 ] }, 0.60 ],
                    [ { translateX: -10 }, 0.20 ],
                    [ { translateX: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "transition.bounceLeftOut": {
                defaultDuration: 900,
                calls: [ 
                    [ { opacity: [ 1, "easeOutQuad", 1 ], translateX: 20 }, 0.20 ],
                    [ { opacity: 0, translateX: -1000 }, 0.80 ]
                ],
                reset: { opacity: [ 1, 1 ], translateX: 0 }
            },
            /* Animate.css */
            "transition.bounceRightIn": {
                defaultDuration: 950,
                calls: [ 
                    [ { opacity: [ 1, "easeOutQuad", 0 ], translateX: [ -30, 1000 ] }, 0.60 ],
                    [ { translateX: 10 }, 0.20 ],
                    [ { translateX: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "transition.bounceRightOut": {
                defaultDuration: 950,
                calls: [ 
                    [ { opacity: [ 1, "easeOutQuad", 1 ], translateX: -20 }, 0.20 ],
                    [ { opacity: 0, translateX: 1000 }, 0.80 ]
                ],
                reset: { opacity: [ 1, 1 ], translateX: 0 }
            },
            "transition.slideUpIn": {
                defaultDuration: 1000,
                calls: [ 
                    [ { opacity: [ 1, 0 ], translateY: [ 0, 20 ], translateZ: 0 } ]
                ]
            },
            "transition.slideUpOut": {
                defaultDuration: 1000,
                calls: [ 
                    [ { opacity: [ 0, 1 ], translateY: -20, translateZ: 0 } ]
                ],
                reset: { opacity: [ 1, 1 ], translateY: 0 }
            },
            "transition.slideDownIn": {
                defaultDuration: 1000,
                calls: [ 
                    [ { opacity: [ 1, 0 ], translateY: [ 0, -20 ], translateZ: 0 } ]
                ]
            },
            "transition.slideDownOut": {
                defaultDuration: 1000,
                calls: [ 
                    [ { opacity: [ 0, 1 ], translateY: 20, translateZ: 0 } ]
                ],
                reset: { opacity: [ 1, 1 ], translateY: 0 }
            },
            "transition.slideLeftIn": {
                defaultDuration: 1000,
                calls: [ 
                    [ { opacity: [ 1, 0 ], translateX: [ 0, -20 ], translateZ: 0 } ]
                ]
            },
            "transition.slideLeftOut": {
                defaultDuration: 1050,
                calls: [ 
                    [ { opacity: [ 0, 1 ], translateX: -20, translateZ: 0 } ]
                ],
                reset: { opacity: [ 1, 1 ], translateX: 0 }
            },
            "transition.slideRightIn": {
                defaultDuration: 1000,
                calls: [ 
                    [ { opacity: [ 1, 0 ], translateX: [ 0, 20 ], translateZ: 0 } ]
                ]
            },
            "transition.slideRightOut": {
                defaultDuration: 1050,
                calls: [ 
                    [ { opacity: [ 0, 1 ], translateX: 20, translateZ: 0 } ]
                ],
                reset: { opacity: [ 1, 1 ], translateX: 0 }
            },
            "transition.slideUpBigIn": {
                defaultDuration: 850,
                calls: [ 
                    [ { opacity: [ 1, 0 ], translateY: [ 0, 75 ], translateZ: 0 } ]
                ]
            },
            "transition.slideUpBigOut": {
                defaultDuration: 850,
                calls: [ 
                    [ { opacity: [ 0, 1 ], translateY: -75, translateZ: 0 } ]
                ],
                reset: { opacity: [ 1, 1 ], translateY: 0 }
            },
            "transition.slideDownBigIn": {
                defaultDuration: 850,
                calls: [ 
                    [ { opacity: [ 1, 0 ], translateY: [ 0, -75 ], translateZ: 0 } ]
                ]
            },
            "transition.slideDownBigOut": {
                defaultDuration: 850,
                calls: [ 
                    [ { opacity: [ 0, 1 ], translateY: 75, translateZ: 0 } ]
                ],
                reset: { opacity: [ 1, 1 ], translateY: 0 }
            },
            "transition.slideLeftBigIn": {
                defaultDuration: 850,
                calls: [ 
                    [ { opacity: [ 1, 0 ], translateX: [ 0, -75 ], translateZ: 0 } ]
                ]
            },
            "transition.slideLeftBigOut": {
                defaultDuration: 850,
                calls: [ 
                    [ { opacity: [ 0, 1 ], translateX: -75, translateZ: 0 } ]
                ],
                reset: { opacity: [ 1, 1 ], translateX: 0 }
            },
            "transition.slideRightBigIn": {
                defaultDuration: 850,
                calls: [ 
                    [ { opacity: [ 1, 0 ], translateX: [ 0, 75 ], translateZ: 0 } ]
                ]
            },
            "transition.slideRightBigOut": {
                defaultDuration: 850,
                calls: [ 
                    [ { opacity: [ 0, 1 ], translateX: 75, translateZ: 0 } ]
                ],
                reset: { opacity: [ 1, 1 ], translateX: 0 }
            },
            /* Magic.css */
            "transition.perspectiveUpIn": {
                defaultDuration: 900,
                calls: [ 
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 800, 800 ], transformOriginX: [ 0, 0 ], transformOriginY: [ "100%", "100%" ], transformOriginZ: [ 0, 0 ], rotateX: [ 0, -180 ] } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.perspectiveUpOut": {
                defaultDuration: 950,
                calls: [ 
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 800, 800 ], transformOriginX: [ 0, 0 ], transformOriginY: [ "100%", "100%" ], transformOriginZ: [ 0, 0 ], rotateX: -180 } ]
                ],
                reset: { opacity: [ 1, 1 ], transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateX: 0 }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.perspectiveDownIn": {
                defaultDuration: 925,
                calls: [ 
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 800, 800 ], transformOriginX: [ 0, 0 ], transformOriginY: [ 0, 0 ], transformOriginZ: [ 0, 0 ], rotateX: [ 0, 180 ] } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.perspectiveDownOut": {
                defaultDuration: 950,
                calls: [ 
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 800, 800 ], transformOriginX: [ 0, 0 ], transformOriginY: [ 0, 0 ], transformOriginZ: [ 0, 0 ], rotateX: 180 } ]
                ],
                reset: { opacity: [ 1, 1 ], transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateX: 0 }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.perspectiveLeftIn": {
                defaultDuration: 950,
                calls: [ 
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 2000, 2000 ], transformOriginX: [ 0, 0 ], transformOriginY: [ 0, 0 ], transformOriginZ: [ 0, 0 ], rotateY: [ 0, -180 ] } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.perspectiveLeftOut": {
                defaultDuration: 950,
                calls: [ 
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 2000, 2000 ], transformOriginX: [ 0, 0 ], transformOriginY: [ 0, 0 ], transformOriginZ: [ 0, 0 ], rotateY: -180 } ]
                ],
                reset: { opacity: [ 1, 1 ], transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateY: 0 }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.perspectiveRightIn": {
                defaultDuration: 950,
                calls: [ 
                    [ { opacity: [ 1, 0 ],transformPerspective: [ 2000, 2000 ], transformOriginX: [ "100%", "100%" ], transformOriginY: [ 0, 0 ], transformOriginZ: [ 0, 0 ], rotateY: [ 0, 180 ] } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades only.) */
            "transition.perspectiveRightOut": {
                defaultDuration: 950,
                calls: [ 
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 2000, 2000 ], transformOriginX: [ "100%", "100%" ], transformOriginY: [ 0, 0 ], transformOriginZ: [ 0, 0 ], rotateY: 180 } ]
                ],
                reset: { opacity: [ 1, 1 ], transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateY: 0 }
            }
        };

    /* Sequence generator. */
    for (var effectName in effects) {
        (function(effectName) {
            var effect = effects[effectName];

            Container.Velocity.Sequences[effectName] = function (element, options) {
                for (var callIndex = 0; callIndex < effect.calls.length; callIndex++) {
                    var opts = {};

                    opts.duration = (options.duration || effect.defaultDuration || 1000) * (effect.calls[callIndex][1] || 1);
                    opts.easing = "ease";
                    opts.loop = effect.calls[callIndex][2];

                    if (callIndex === 0) {
                        opts.delay = options.delay;
                        opts.begin = options.begin;

                        if (options.display) {
                            opts.display = options.display;
                        } else if (/In$/.test(effectName)) {
                            opts.display = Container.Velocity.CSS.Values.getDisplayType(element);
                        }
                    }

                    if (callIndex === effect.calls.length - 1) {
                        if (effect.reset) {
                            opts.complete = function() {
                                options.complete && options.complete.call();
                                Container.Velocity.animate(element, effect.reset, { duration: 0, queue: false });
                            };
                        } else {
                            opts.complete = options.complete;
                        }
                        
                        if (/Out$/.test(effectName)) {
                            opts.display = "none";                        
                        }
                    }

                    Container.Velocity.animate(element, effect.calls[callIndex][0], opts);
                } 
            };
        })(effectName);
    }
})();
