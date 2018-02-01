/**********************
 Velocity UI Pack
 **********************/

/* VelocityJS.org UI Pack (5.2.0). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License. Portions copyright Daniel Eden, Christian Pucci. */

(function(factory) {
	"use strict";
	/* CommonJS module. */
	if (typeof require === "function" && typeof exports === "object") {
		module.exports = factory();
		/* AMD module. */
	} else if (typeof define === "function" && define.amd) {
		define(["velocity"], factory);
		/* Browser globals. */
	} else {
		factory();
	}
}(function(requiredVelocity) {
	"use strict";
	return function(window, undefined) {
		var Velocity = requiredVelocity || (this || window).Velocity;

		/*************
		 Checks
		 *************/

		if (!Velocity) {
			if (window.console) {
				console.log("Velocity UI Pack: Velocity must be loaded first. Aborting.");
			}
			return;
		}

		/*********************
		 Packaged Effects
		 *********************/

		/* Externalize the packagedEffects data so that they can optionally be modified and re-registered. */
		/* Support: <=IE8: Callouts will have no effect, and transitions will simply fade in/out. IE9/Android 2.3: Most effects are fully supported, the rest fade in/out. All other browsers: full support. */
		var packagedEffects = {
			/* Animate.css */
			"callout.bounce": {
				defaultDuration: 550,
				calls: [
					[{translateY: -30}, 0.25],
					[{translateY: 0}, 0.125],
					[{translateY: -15}, 0.125],
					[{translateY: 0}, 0.25]
				]
			},
			/* Animate.css */
			"callout.shake": {
				defaultDuration: 800,
				calls: [
					[{translateX: -11}],
					[{translateX: 11}],
					[{translateX: -11}],
					[{translateX: 11}],
					[{translateX: -11}],
					[{translateX: 11}],
					[{translateX: -11}],
					[{translateX: 0}]
				]
			},
			/* Animate.css */
			"callout.flash": {
				defaultDuration: 1100,
				calls: [
					[{opacity: [0, "easeInOutQuad", 1]}],
					[{opacity: [1, "easeInOutQuad"]}],
					[{opacity: [0, "easeInOutQuad"]}],
					[{opacity: [1, "easeInOutQuad"]}]
				]
			},
			/* Animate.css */
			"callout.pulse": {
				defaultDuration: 825,
				calls: [
					[{scaleX: 1.1, scaleY: 1.1}, 0.50, {easing: "easeInExpo"}],
					[{scaleX: 1, scaleY: 1}, 0.50]
				]
			},
			/* Animate.css */
			"callout.swing": {
				defaultDuration: 950,
				calls: [
					[{rotateZ: 15}],
					[{rotateZ: -10}],
					[{rotateZ: 5}],
					[{rotateZ: -5}],
					[{rotateZ: 0}]
				]
			},
			/* Animate.css */
			"callout.tada": {
				defaultDuration: 1000,
				calls: [
					[{scaleX: 0.9, scaleY: 0.9, rotateZ: -3}, 0.10],
					[{scaleX: 1.1, scaleY: 1.1, rotateZ: 3}, 0.10],
					[{scaleX: 1.1, scaleY: 1.1, rotateZ: -3}, 0.10],
					["reverse", 0.125],
					["reverse", 0.125],
					["reverse", 0.125],
					["reverse", 0.125],
					["reverse", 0.125],
					[{scaleX: 1, scaleY: 1, rotateZ: 0}, 0.20]
				]
			},
			"transition.fadeIn": {
				defaultDuration: 500,
				calls: [
					[{opacity: [1, 0]}]
				]
			},
			"transition.fadeOut": {
				defaultDuration: 500,
				calls: [
					[{opacity: [0, 1]}]
				]
			},
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.flipXIn": {
				defaultDuration: 700,
				calls: [
					[{opacity: [1, 0], transformPerspective: [800, 800], rotateY: [0, -55]}]
				],
				reset: {transformPerspective: 0}
			},
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.flipXOut": {
				defaultDuration: 700,
				calls: [
					[{opacity: [0, 1], transformPerspective: [800, 800], rotateY: 55}]
				],
				reset: {transformPerspective: 0, rotateY: 0}
			},
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.flipYIn": {
				defaultDuration: 800,
				calls: [
					[{opacity: [1, 0], transformPerspective: [800, 800], rotateX: [0, -45]}]
				],
				reset: {transformPerspective: 0}
			},
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.flipYOut": {
				defaultDuration: 800,
				calls: [
					[{opacity: [0, 1], transformPerspective: [800, 800], rotateX: 25}]
				],
				reset: {transformPerspective: 0, rotateX: 0}
			},
			/* Animate.css */
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.flipBounceXIn": {
				defaultDuration: 900,
				calls: [
					[{opacity: [0.725, 0], transformPerspective: [400, 400], rotateY: [-10, 90]}, 0.50],
					[{opacity: 0.80, rotateY: 10}, 0.25],
					[{opacity: 1, rotateY: 0}, 0.25]
				],
				reset: {transformPerspective: 0}
			},
			/* Animate.css */
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.flipBounceXOut": {
				defaultDuration: 800,
				calls: [
					[{opacity: [0.9, 1], transformPerspective: [400, 400], rotateY: -10}],
					[{opacity: 0, rotateY: 90}]
				],
				reset: {transformPerspective: 0, rotateY: 0}
			},
			/* Animate.css */
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.flipBounceYIn": {
				defaultDuration: 850,
				calls: [
					[{opacity: [0.725, 0], transformPerspective: [400, 400], rotateX: [-10, 90]}, 0.50],
					[{opacity: 0.80, rotateX: 10}, 0.25],
					[{opacity: 1, rotateX: 0}, 0.25]
				],
				reset: {transformPerspective: 0}
			},
			/* Animate.css */
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.flipBounceYOut": {
				defaultDuration: 800,
				calls: [
					[{opacity: [0.9, 1], transformPerspective: [400, 400], rotateX: -15}],
					[{opacity: 0, rotateX: 90}]
				],
				reset: {transformPerspective: 0, rotateX: 0}
			},
			/* Magic.css */
			"transition.swoopIn": {
				defaultDuration: 850,
				calls: [
					[{opacity: [1, 0], transformOriginX: ["100%", "50%"], transformOriginY: ["100%", "100%"], scaleX: [1, 0], scaleY: [1, 0], translateX: [0, -700], translateZ: 0}]
				],
				reset: {transformOriginX: "50%", transformOriginY: "50%"}
			},
			/* Magic.css */
			"transition.swoopOut": {
				defaultDuration: 850,
				calls: [
					[{opacity: [0, 1], transformOriginX: ["50%", "100%"], transformOriginY: ["100%", "100%"], scaleX: 0, scaleY: 0, translateX: -700, translateZ: 0}]
				],
				reset: {transformOriginX: "50%", transformOriginY: "50%", scaleX: 1, scaleY: 1, translateX: 0}
			},
			/* Magic.css */
			/* Support: Loses rotation in IE9/Android 2.3. (Fades and scales only.) */
			"transition.whirlIn": {
				defaultDuration: 850,
				calls: [
					[{opacity: [1, 0], transformOriginX: ["50%", "50%"], transformOriginY: ["50%", "50%"], scaleX: [1, 0], scaleY: [1, 0], rotateY: [0, 160]}, 1, {easing: "easeInOutSine"}]
				]
			},
			/* Magic.css */
			/* Support: Loses rotation in IE9/Android 2.3. (Fades and scales only.) */
			"transition.whirlOut": {
				defaultDuration: 750,
				calls: [
					[{opacity: [0, "easeInOutQuint", 1], transformOriginX: ["50%", "50%"], transformOriginY: ["50%", "50%"], scaleX: 0, scaleY: 0, rotateY: 160}, 1, {easing: "swing"}]
				],
				reset: {scaleX: 1, scaleY: 1, rotateY: 0}
			},
			"transition.shrinkIn": {
				defaultDuration: 750,
				calls: [
					[{opacity: [1, 0], transformOriginX: ["50%", "50%"], transformOriginY: ["50%", "50%"], scaleX: [1, 1.5], scaleY: [1, 1.5], translateZ: 0}]
				]
			},
			"transition.shrinkOut": {
				defaultDuration: 600,
				calls: [
					[{opacity: [0, 1], transformOriginX: ["50%", "50%"], transformOriginY: ["50%", "50%"], scaleX: 1.3, scaleY: 1.3, translateZ: 0}]
				],
				reset: {scaleX: 1, scaleY: 1}
			},
			"transition.expandIn": {
				defaultDuration: 700,
				calls: [
					[{opacity: [1, 0], transformOriginX: ["50%", "50%"], transformOriginY: ["50%", "50%"], scaleX: [1, 0.625], scaleY: [1, 0.625], translateZ: 0}]
				]
			},
			"transition.expandOut": {
				defaultDuration: 700,
				calls: [
					[{opacity: [0, 1], transformOriginX: ["50%", "50%"], transformOriginY: ["50%", "50%"], scaleX: 0.5, scaleY: 0.5, translateZ: 0}]
				],
				reset: {scaleX: 1, scaleY: 1}
			},
			/* Animate.css */
			"transition.bounceIn": {
				defaultDuration: 800,
				calls: [
					[{opacity: [1, 0], scaleX: [1.05, 0.3], scaleY: [1.05, 0.3]}, 0.35],
					[{scaleX: 0.9, scaleY: 0.9, translateZ: 0}, 0.20],
					[{scaleX: 1, scaleY: 1}, 0.45]
				]
			},
			/* Animate.css */
			"transition.bounceOut": {
				defaultDuration: 800,
				calls: [
					[{scaleX: 0.95, scaleY: 0.95}, 0.35],
					[{scaleX: 1.1, scaleY: 1.1, translateZ: 0}, 0.35],
					[{opacity: [0, 1], scaleX: 0.3, scaleY: 0.3}, 0.30]
				],
				reset: {scaleX: 1, scaleY: 1}
			},
			/* Animate.css */
			"transition.bounceUpIn": {
				defaultDuration: 800,
				calls: [
					[{opacity: [1, 0], translateY: [-30, 1000]}, 0.60, {easing: "easeOutCirc"}],
					[{translateY: 10}, 0.20],
					[{translateY: 0}, 0.20]
				]
			},
			/* Animate.css */
			"transition.bounceUpOut": {
				defaultDuration: 1000,
				calls: [
					[{translateY: 20}, 0.20],
					[{opacity: [0, "easeInCirc", 1], translateY: -1000}, 0.80]
				],
				reset: {translateY: 0}
			},
			/* Animate.css */
			"transition.bounceDownIn": {
				defaultDuration: 800,
				calls: [
					[{opacity: [1, 0], translateY: [30, -1000]}, 0.60, {easing: "easeOutCirc"}],
					[{translateY: -10}, 0.20],
					[{translateY: 0}, 0.20]
				]
			},
			/* Animate.css */
			"transition.bounceDownOut": {
				defaultDuration: 1000,
				calls: [
					[{translateY: -20}, 0.20],
					[{opacity: [0, "easeInCirc", 1], translateY: 1000}, 0.80]
				],
				reset: {translateY: 0}
			},
			/* Animate.css */
			"transition.bounceLeftIn": {
				defaultDuration: 750,
				calls: [
					[{opacity: [1, 0], translateX: [30, -1250]}, 0.60, {easing: "easeOutCirc"}],
					[{translateX: -10}, 0.20],
					[{translateX: 0}, 0.20]
				]
			},
			/* Animate.css */
			"transition.bounceLeftOut": {
				defaultDuration: 750,
				calls: [
					[{translateX: 30}, 0.20],
					[{opacity: [0, "easeInCirc", 1], translateX: -1250}, 0.80]
				],
				reset: {translateX: 0}
			},
			/* Animate.css */
			"transition.bounceRightIn": {
				defaultDuration: 750,
				calls: [
					[{opacity: [1, 0], translateX: [-30, 1250]}, 0.60, {easing: "easeOutCirc"}],
					[{translateX: 10}, 0.20],
					[{translateX: 0}, 0.20]
				]
			},
			/* Animate.css */
			"transition.bounceRightOut": {
				defaultDuration: 750,
				calls: [
					[{translateX: -30}, 0.20],
					[{opacity: [0, "easeInCirc", 1], translateX: 1250}, 0.80]
				],
				reset: {translateX: 0}
			},
			"transition.slideUpIn": {
				defaultDuration: 900,
				calls: [
					[{opacity: [1, 0], translateY: [0, 20], translateZ: 0}]
				]
			},
			"transition.slideUpOut": {
				defaultDuration: 900,
				calls: [
					[{opacity: [0, 1], translateY: -20, translateZ: 0}]
				],
				reset: {translateY: 0}
			},
			"transition.slideDownIn": {
				defaultDuration: 900,
				calls: [
					[{opacity: [1, 0], translateY: [0, -20], translateZ: 0}]
				]
			},
			"transition.slideDownOut": {
				defaultDuration: 900,
				calls: [
					[{opacity: [0, 1], translateY: 20, translateZ: 0}]
				],
				reset: {translateY: 0}
			},
			"transition.slideLeftIn": {
				defaultDuration: 1000,
				calls: [
					[{opacity: [1, 0], translateX: [0, -20], translateZ: 0}]
				]
			},
			"transition.slideLeftOut": {
				defaultDuration: 1050,
				calls: [
					[{opacity: [0, 1], translateX: -20, translateZ: 0}]
				],
				reset: {translateX: 0}
			},
			"transition.slideRightIn": {
				defaultDuration: 1000,
				calls: [
					[{opacity: [1, 0], translateX: [0, 20], translateZ: 0}]
				]
			},
			"transition.slideRightOut": {
				defaultDuration: 1050,
				calls: [
					[{opacity: [0, 1], translateX: 20, translateZ: 0}]
				],
				reset: {translateX: 0}
			},
			"transition.slideUpBigIn": {
				defaultDuration: 850,
				calls: [
					[{opacity: [1, 0], translateY: [0, 75], translateZ: 0}]
				]
			},
			"transition.slideUpBigOut": {
				defaultDuration: 800,
				calls: [
					[{opacity: [0, 1], translateY: -75, translateZ: 0}]
				],
				reset: {translateY: 0}
			},
			"transition.slideDownBigIn": {
				defaultDuration: 850,
				calls: [
					[{opacity: [1, 0], translateY: [0, -75], translateZ: 0}]
				]
			},
			"transition.slideDownBigOut": {
				defaultDuration: 800,
				calls: [
					[{opacity: [0, 1], translateY: 75, translateZ: 0}]
				],
				reset: {translateY: 0}
			},
			"transition.slideLeftBigIn": {
				defaultDuration: 800,
				calls: [
					[{opacity: [1, 0], translateX: [0, -75], translateZ: 0}]
				]
			},
			"transition.slideLeftBigOut": {
				defaultDuration: 750,
				calls: [
					[{opacity: [0, 1], translateX: -75, translateZ: 0}]
				],
				reset: {translateX: 0}
			},
			"transition.slideRightBigIn": {
				defaultDuration: 800,
				calls: [
					[{opacity: [1, 0], translateX: [0, 75], translateZ: 0}]
				]
			},
			"transition.slideRightBigOut": {
				defaultDuration: 750,
				calls: [
					[{opacity: [0, 1], translateX: 75, translateZ: 0}]
				],
				reset: {translateX: 0}
			},
			/* Magic.css */
			"transition.perspectiveUpIn": {
				defaultDuration: 800,
				calls: [
					[{opacity: [1, 0], transformPerspective: [800, 800], transformOriginX: [0, 0], transformOriginY: ["100%", "100%"], rotateX: [0, -180]}]
				],
				reset: {transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%"}
			},
			/* Magic.css */
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.perspectiveUpOut": {
				defaultDuration: 850,
				calls: [
					[{opacity: [0, 1], transformPerspective: [800, 800], transformOriginX: [0, 0], transformOriginY: ["100%", "100%"], rotateX: -180}]
				],
				reset: {transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateX: 0}
			},
			/* Magic.css */
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.perspectiveDownIn": {
				defaultDuration: 800,
				calls: [
					[{opacity: [1, 0], transformPerspective: [800, 800], transformOriginX: [0, 0], transformOriginY: [0, 0], rotateX: [0, 180]}]
				],
				reset: {transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%"}
			},
			/* Magic.css */
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.perspectiveDownOut": {
				defaultDuration: 850,
				calls: [
					[{opacity: [0, 1], transformPerspective: [800, 800], transformOriginX: [0, 0], transformOriginY: [0, 0], rotateX: 180}]
				],
				reset: {transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateX: 0}
			},
			/* Magic.css */
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.perspectiveLeftIn": {
				defaultDuration: 950,
				calls: [
					[{opacity: [1, 0], transformPerspective: [2000, 2000], transformOriginX: [0, 0], transformOriginY: [0, 0], rotateY: [0, -180]}]
				],
				reset: {transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%"}
			},
			/* Magic.css */
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.perspectiveLeftOut": {
				defaultDuration: 950,
				calls: [
					[{opacity: [0, 1], transformPerspective: [2000, 2000], transformOriginX: [0, 0], transformOriginY: [0, 0], rotateY: -180}]
				],
				reset: {transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateY: 0}
			},
			/* Magic.css */
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.perspectiveRightIn": {
				defaultDuration: 950,
				calls: [
					[{opacity: [1, 0], transformPerspective: [2000, 2000], transformOriginX: ["100%", "100%"], transformOriginY: [0, 0], rotateY: [0, 180]}]
				],
				reset: {transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%"}
			},
			/* Magic.css */
			/* Support: Loses rotation in IE9/Android 2.3 (fades only). */
			"transition.perspectiveRightOut": {
				defaultDuration: 950,
				calls: [
					[{opacity: [0, 1], transformPerspective: [2000, 2000], transformOriginX: ["100%", "100%"], transformOriginY: [0, 0], rotateY: 180}]
				],
				reset: {transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateY: 0}
			}
		};

		/* Register the packaged effects. */
		for (var effectName in packagedEffects) {
			if (packagedEffects.hasOwnProperty(effectName)) {
				Velocity.RegisterEffect(effectName, packagedEffects[effectName]);
			}
		}

	}(window);
}));
