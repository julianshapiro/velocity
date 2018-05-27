/**
 * velocity-animate (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Velocity=t()}(this,function(){"use strict";var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e};
/**
   * Check if a variable is a boolean.
   */
function n(e){return!0===e||!1===e}
/**
   * Check if a variable is a function.
   */function r(e){return"[object Function]"===Object.prototype.toString.call(e)}
/**
   * Check if a variable is an HTMLElement or SVGElement.
   */function i(e){return!(!e||!e.nodeType)}
/**
   * Check if a variable is a number.
   */function o(e){return"number"==typeof e}
/**
   * Check if a variable is a plain object (and not an instance).
   */function a(t){if(!t||"object"!==(void 0===t?"undefined":e(t))||t.nodeType||"[object Object]"!==Object.prototype.toString.call(t))return!1;var n=Object.getPrototypeOf(t);return!n||n.hasOwnProperty("constructor")&&n.constructor===Object}
/**
   * Check if a variable is a string.
   */function l(e){return"string"==typeof e}
/**
   * Check if a variable is the result of calling Velocity.
   */function s(e){return e&&o(e.length)&&r(e.velocity)}
/**
   * Check if a variable is an array-like wrapped jQuery, Zepto or similar, where
   * each indexed value is a Node.
   */function u(e){return e&&e!==window&&o(e.length)&&!l(e)&&!r(e)&&!i(e)&&(0===e.length||i(e[0]))}
/**
   * Check is a property is an enumerable member of an object.
   */
/**
   * Clone an array, works for array-like too.
   */
function c(e){return Array.prototype.slice.call(e,0)}
/**
   * The <strong><code>defineProperty()</code></strong> function provides a
   * shortcut to defining a property that cannot be accidentally iterated across.
   */function f(e,t,n,r){e&&Object.defineProperty(e,t,{configurable:!r,writable:!r,value:n})}
/**
   * When there are multiple locations for a value pass them all in, then get the
   * first value that is valid.
   */function d(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=!0,i=!1,o=void 0;try{for(var a,l=arguments[Symbol.iterator]();!(r=(a=l.next()).done);r=!0){var s=a.value;if(void 0!==s&&s==s)return s}}catch(e){i=!0,o=e}finally{try{!r&&l.return&&l.return()}finally{if(i)throw o}}}
/**
   * Shim to get the current milliseconds - on anything except old IE it'll use
   * Date.now() and save creating an object. If that doesn't exist then it'll
   * create one that gets GC.
   */var v=Date.now?Date.now:function(){return(new Date).getTime()};
/**
   * Remove a single className from an Element.
   */function p(e,t){e instanceof Element&&(e.classList?e.classList.remove(t):
// TODO: Need some jsperf tests on performance - can we get rid of the regex and maybe use split / array manipulation?
e.className=e.className.replace(new RegExp("(^|\\s)"+t+"(\\s|$)","gi")," "))}
// Project
// Constants
var g={};
/**
   * Used to register an action. This should never be called by users
   * directly, instead it should be called via  an action:<br/>
   * <code>Velocity("registerAction", "name", VelocityActionFn);</code>
   */function y(e,t){var n,i,o=e[0],a=e[1];l(o)?r(a)?g[o]&&(n=g,i=o,!Object.prototype.propertyIsEnumerable.call(n,i))?console.warn("VelocityJS: Trying to override internal 'registerAction' callback",o):!0===t?f(g,o,a):g[o]=a:console.warn("VelocityJS: Trying to set 'registerAction' callback to an invalid value:",o,a):console.warn("VelocityJS: Trying to set 'registerAction' name to an invalid value:",o)}y(["registerAction",y],!0);
/**
   * Without this it will only un-prefix properties that have a valid "normal"
   * version.
   */
var m=400,h={fast:200,normal:400,slow:600},w={};
/**
   * Used to register a easing. This should never be called by users
   * directly, instead it should be called via an action:<br/>
   * <code>Velocity("registerEasing", "name", VelocityEasingFn);</code>
   */
function b(e){var t=e[0],n=e[1];l(t)?r(n)?w[t]?console.warn("VelocityJS: Trying to override 'registerEasing' callback",t):w[t]=n:console.warn("VelocityJS: Trying to set 'registerEasing' callback to an invalid value:",t,n):console.warn("VelocityJS: Trying to set 'registerEasing' name to an invalid value:",t)}
/**
   * Linear easing, used for sequence parts that don't have an actual easing
   * function.
   */
function S(e,t,n,r){return t+e*(n-t)}
/**
   * Swing is the default for jQuery and Velocity.
   */
// Project
/**
   * Fix to a range of <code>0 <= num <= 1</code>.
   */
function x(e){return Math.min(Math.max(e,0),1)}function k(e,t){return 1-3*t+3*e}function _(e,t){return 3*t-6*e}function E(e){return 3*e}function O(e,t,n){return((k(t,n)*e+_(t,n))*e+E(t))*e}function T(e,t,n){return 3*k(t,n)*e*e+2*_(t,n)*e+E(t)}function M(e,t,n,r){var i=4,o=.001,a=1e-7,l=10,s=11,u=1/(s-1),c="Float32Array"in window;
/* Must contain four arguments. */if(4===arguments.length){
/* Arguments must be numbers. */
for(var f=0;f<4;++f)if("number"!=typeof arguments[f]||isNaN(arguments[f])||!isFinite(arguments[f]))return;
/* X values must be in the [0, 1] range. */e=x(e),n=x(n);var d=c?new Float32Array(s):new Array(s),v=!1,p="generateBezier("+[e,t,n,r]+")",g=function(i,o,a,l){return v||m(),0===i?o:1===i?a:e===t&&n===r?o+i*(a-o):o+O(y(i),t,r)*(a-o)};return g.getControlPoints=function(){return[{x:e,y:t},{x:n,y:r}]},g.toString=function(){return p},g}function y(t){for(var r=s-1,c=0,f=1;f!==r&&d[f]<=t;++f)c+=u;var v=c+(t-d[--f])/(d[f+1]-d[f])*u,p=T(v,e,n);return p>=o?function(t,r){for(var o=0;o<i;++o){var a=T(r,e,n);if(0===a)return r;r-=(O(r,e,n)-t)/a}return r}(t,v):0===p?v:function(t,r,i){var o=void 0,s=void 0,u=0;do{(o=O(s=r+(i-r)/2,e,n)-t)>0?i=s:r=s}while(Math.abs(o)>a&&++u<l);return s}(t,c,c+u)}function m(){v=!0,e===t&&n===r||function(){for(var t=0;t<s;++t)d[t]=O(t*u,e,n)}()}}
/* Common easings */y(["registerEasing",b],!0),b(["linear",S]),b(["swing",function(e,t,n){return t+(.5-Math.cos(e*Math.PI)/2)*(n-t)}
/**
   * A less exaggerated version of easeInOutElastic.
   */]),b(["spring",function(e,t,n){return t+(1-Math.cos(4.5*e*Math.PI)*Math.exp(6*-e))*(n-t)}]);var q=M(.42,0,1,1),V=M(0,0,.58,1),A=M(.42,0,.58,1);
/* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
/* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
   then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */
function N(e){return-e.tension*e.x-e.friction*e.v}function L(e,t,n){var r={x:e.x+n.dx*t,v:e.v+n.dv*t,tension:e.tension,friction:e.friction};return{dx:r.v,dv:N(r)}}function J(e,t){var n={dx:e.v,dv:N(e)},r=L(e,.5*t,n),i=L(e,.5*t,r),o=L(e,t,i),a=1/6*(n.dx+2*(r.dx+i.dx)+o.dx),l=1/6*(n.dv+2*(r.dv+i.dv)+o.dv);return e.x=e.x+a*t,e.v=e.v+l*t,e}b(["ease",M(.25,.1,.25,1)]),b(["easeIn",q]),b(["ease-in",q]),b(["easeOut",V]),b(["ease-out",V]),b(["easeInOut",A]),b(["ease-in-out",A]),b(["easeInSine",M(.47,0,.745,.715)]),b(["easeOutSine",M(.39,.575,.565,1)]),b(["easeInOutSine",M(.445,.05,.55,.95)]),b(["easeInQuad",M(.55,.085,.68,.53)]),b(["easeOutQuad",M(.25,.46,.45,.94)]),b(["easeInOutQuad",M(.455,.03,.515,.955)]),b(["easeInCubic",M(.55,.055,.675,.19)]),b(["easeOutCubic",M(.215,.61,.355,1)]),b(["easeInOutCubic",M(.645,.045,.355,1)]),b(["easeInQuart",M(.895,.03,.685,.22)]),b(["easeOutQuart",M(.165,.84,.44,1)]),b(["easeInOutQuart",M(.77,0,.175,1)]),b(["easeInQuint",M(.755,.05,.855,.06)]),b(["easeOutQuint",M(.23,1,.32,1)]),b(["easeInOutQuint",M(.86,0,.07,1)]),b(["easeInExpo",M(.95,.05,.795,.035)]),b(["easeOutExpo",M(.19,1,.22,1)]),b(["easeInOutExpo",M(1,0,0,1)]),b(["easeInCirc",M(.6,.04,.98,.335)]),b(["easeOutCirc",M(.075,.82,.165,1)]),b(["easeInOutCirc",M(.785,.135,.15,.86)]);
// Constants
var C={};
// Project
/**
   * Parse a duration value and return an ms number. Optionally return a
   * default value if the number is not valid.
   */
function I(e,t){return o(e)?e:l(e)?h[e.toLowerCase()]||parseFloat(e.replace("ms","").replace("s","000")):null==t?void 0:I(t)}
/**
   * Validate a <code>cache</code> option.
   */function j(e){if(n(e))return e;null!=e&&console.warn("VelocityJS: Trying to set 'cache' to an invalid value:",e)}
/**
   * Validate a <code>begin</code> option.
   */function P(e){if(r(e))return e;null!=e&&console.warn("VelocityJS: Trying to set 'begin' to an invalid value:",e)}
/**
   * Validate a <code>complete</code> option.
   */function F(e,t){if(r(e))return e;null==e||t||console.warn("VelocityJS: Trying to set 'complete' to an invalid value:",e)}
/**
   * Validate a <code>delay</code> option.
   */function H(e){var t=I(e);if(!isNaN(t))return t;null!=e&&console.error("VelocityJS: Trying to set 'delay' to an invalid value:",e)}
/**
   * Validate a <code>duration</code> option.
   */function R(e,t){var n=I(e);if(!isNaN(n)&&n>=0)return n;null==e||t||console.error("VelocityJS: Trying to set 'duration' to an invalid value:",e)}
/**
   * Validate a <code>easing</code> option.
   */function W(e,t,n){if(l(e))
// Named easing
return w[e];if(r(e))return e;
// TODO: We should only do these if the correct function exists - don't force loading.
if(Array.isArray(e)){if(1===e.length)
// Steps
return i=e[0],C[i]||(C[i]=function(e,t,n){return 0===e?t:1===e?n:t+Math.round(e*i)*(1/i)*(n-t)});if(2===e.length)
// springRK4 must be passed the animation's duration.
// Note: If the springRK4 array contains non-numbers,
// generateSpringRK4() returns an easing function generated with
// default tension and friction values.
return function e(t,n,r){var i={x:-1,v:0,tension:parseFloat(t)||500,friction:parseFloat(n)||20},o=[0],a=null!=r,l=0,s=void 0,u=void 0;// deliberate "==", as undefined == null != 0
for(
/* Calculate the actual time it takes for this animation to complete with the provided conditions. */
/* Compute the adjusted time delta. */
s=a?(
/* Run the simulation without a duration. */
l=e(i.tension,i.friction))/r*.016:.016;
/* Next/step function .*/
u=J(u||i,s),
/* Store the position. */
o.push(1+u.x),l+=16,Math.abs(u.x)>1e-4&&Math.abs(u.v)>1e-4;);
/* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
       computed path and returns a snapshot of the position according to a given percentComplete. */return a?function(e,t,n){return 0===e?t:1===e?n:t+o[Math.floor(e*(o.length-1))]*(n-t)}:l}(e[0],e[1],t);if(4===e.length)
// Note: If the bezier array contains non-numbers, generateBezier()
// returns undefined.
return M.apply(null,e)||!1}var i;null==e||n||console.error("VelocityJS: Trying to set 'easing' to an invalid value:",e)}
/**
   * Validate a <code>fpsLimit</code> option.
   */function B(e){if(!1===e)return 0;var t=parseInt(e,10);if(!isNaN(t)&&t>=0)return Math.min(t,60);null!=e&&console.warn("VelocityJS: Trying to set 'fpsLimit' to an invalid value:",e)}
/**
   * Validate a <code>loop</code> option.
   */function z(e){switch(e){case!1:return 0;case!0:return!0;default:var t=parseInt(e,10);if(!isNaN(t)&&t>=0)return t}null!=e&&console.warn("VelocityJS: Trying to set 'loop' to an invalid value:",e)}
/**
   * Validate a <code>progress</code> option.
   */
/**
   * Validate a <code>queue</code> option.
   */
function $(e,t){if(!1===e||l(e))return e;null==e||t||console.warn("VelocityJS: Trying to set 'queue' to an invalid value:",e)}
/**
   * Validate a <code>repeat</code> option.
   */function G(e){switch(e){case!1:return 0;case!0:return!0;default:var t=parseInt(e,10);if(!isNaN(t)&&t>=0)return t}null!=e&&console.warn("VelocityJS: Trying to set 'repeat' to an invalid value:",e)}
/**
   * Validate a <code>speed</code> option.
   */function Q(e){if(o(e))return e;null!=e&&console.error("VelocityJS: Trying to set 'speed' to an invalid value:",e)}
/**
   * Validate a <code>sync</code> option.
   */function D(e){if(n(e))return e;null!=e&&console.error("VelocityJS: Trying to set 'sync' to an invalid value:",e)}
// Project
var U={mobileHA:!0},Z=void 0,Y=void 0,X=void 0,K=void 0,ee=void 0,te=void 0,ne=void 0,re=void 0,ie=void 0,oe=void 0,ae=void 0,le=void 0,se=void 0,ue=void 0,ce=void 0,fe=void 0;
// NOTE: Add the variable here, then add the default state in "reset" below.
// IMPORTANT: Make sure any new defaults get added to the actions/set.ts list
Object.defineProperties(U,{reset:{enumerable:!0,value:function(){Z=!0,Y=void 0,X=void 0,K=0,ee=m,te=W("swing",m),ne=60,re=0,oe=980/60,ae=!0,le=!0,se="",ue=0,ce=1,fe=!0}},cache:{enumerable:!0,get:function(){return Z},set:function(e){void 0!==(e=j(e))&&(Z=e)}},begin:{enumerable:!0,get:function(){return Y},set:function(e){void 0!==(e=P(e))&&(Y=e)}},complete:{enumerable:!0,get:function(){return X},set:function(e){void 0!==(e=F(e))&&(X=e)}},delay:{enumerable:!0,get:function(){return K},set:function(e){void 0!==(e=H(e))&&(K=e)}},duration:{enumerable:!0,get:function(){return ee},set:function(e){void 0!==(e=R(e))&&(ee=e)}},easing:{enumerable:!0,get:function(){return te},set:function(e){void 0!==(e=W(e,ee))&&(te=e)}},fpsLimit:{enumerable:!0,get:function(){return ne},set:function(e){void 0!==(e=B(e))&&(ne=e,oe=980/e)}},loop:{enumerable:!0,get:function(){return re},set:function(e){void 0!==(e=z(e))&&(re=e)}},mobileHA:{enumerable:!0,get:function(){return ie},set:function(e){n(e)&&(ie=e)}},minFrameTime:{enumerable:!0,get:function(){return oe}},promise:{enumerable:!0,get:function(){return ae},set:function(e){void 0!==(e=
/**
   * Validate a <code>promise</code> option.
   */
function(e){if(n(e))return e;null!=e&&console.warn("VelocityJS: Trying to set 'promise' to an invalid value:",e)}
/**
   * Validate a <code>promiseRejectEmpty</code> option.
   */(e))&&(ae=e)}},promiseRejectEmpty:{enumerable:!0,get:function(){return le},set:function(e){void 0!==(e=function(e){if(n(e))return e;null!=e&&console.warn("VelocityJS: Trying to set 'promiseRejectEmpty' to an invalid value:",e)}(e))&&(le=e)}},queue:{enumerable:!0,get:function(){return se},set:function(e){void 0!==(e=$(e))&&(se=e)}},repeat:{enumerable:!0,get:function(){return ue},set:function(e){void 0!==(e=G(e))&&(ue=e)}},speed:{enumerable:!0,get:function(){return ce},set:function(e){void 0!==(e=Q(e))&&(ce=e)}},sync:{enumerable:!0,get:function(){return fe},set:function(e){void 0!==(e=D(e))&&(fe=e)}}}),
// Reset to our default values, currently everything is undefined.
U.reset();
/**
   * The highest type index for finding the best normalization for a property.
   */
/**
   * Unlike "actions", normalizations can always be replaced by users.
   */
var de=[],ve={},pe=new Set,ge=[],ye="velocityData";
/**
   * Store a cross-reference to units to be added to specific normalization
   * functions if the user supplies a unit-less number.
   *
   * This is pretty much confined to adding "px" to several css properties.
   */
/**
   * Get (and create) the internal data store for an element.
   */
function me(e){
// Use a string member so Uglify doesn't mangle it.
var t=e[ye];if(t)return t;for(var n=e.ownerDocument.defaultView,r=0,i=0;i<ge.length;i++){var o=ge[i];l(o)?e instanceof n[o]&&(r|=1<<i):e instanceof o&&(r|=1<<i)}
// Use an intermediate object so it errors on incorrect data.
var a={types:r,count:0,computedStyle:null,cache:{},queueList:{},lastAnimationList:{},lastFinishList:{},window:n};return Object.defineProperty(e,ye,{value:a}),a}
// Constants
var he=window&&window===window.window,we=he&&void 0!==window.pageYOffset,be={isClient:he,isMobile:he&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),isAndroid:he&&/Android/i.test(navigator.userAgent),isGingerbread:he&&/Android 2\.3\.[3-7]/i.test(navigator.userAgent),isChrome:he&&window.chrome,isFirefox:he&&/Firefox/i.test(navigator.userAgent),prefixElement:he&&document.createElement("div"),windowScrollAnchor:we,scrollAnchor:we?window:!he||document.documentElement||document.body.parentNode||document.body,scrollPropertyLeft:we?"pageXOffset":"scrollLeft",scrollPropertyTop:we?"pageYOffset":"scrollTop",className:"velocity-animating",isTicking:!1,first:void 0,last:void 0,firstNew:void 0};
// Project
/**
   * Simple queue management. Un-named queue is directly within the element data,
   * named queue is within an object within it.
   */
function Se(e){var t=be.last;e._prev=t,e._next=void 0,t?t._next=e:be.first=e,be.last=e,be.firstNew||(be.firstNew=e);var n=e.element;me(n).count++||
////////////////////////
// Feature: Classname //
////////////////////////
// Project
/**
   * Add a single className to an Element.
   */
function(e,t){e instanceof Element&&(e.classList?e.classList.add(t):(p(e,t),e.className+=(e.className.length?" ":"")+t))}(n,be.className)}
/**
   * Add an item to an animation queue.
   */function xe(e,t,n){var r=me(e);if(!1!==n&&(
// Store the last animation added so we can use it for the
// beginning of the next one.
r.lastAnimationList[n]=t),!1===n)Se(t);else{l(n)||(n="");var i=r.queueList[n];if(i){for(;i._next;)i=i._next;i._next=t,t._prev=i}else null===i?r.queueList[n]=t:(r.queueList[n]=null,Se(t))}}
/**
   * Start the next animation on this element's queue (named or default).
   *
   * @returns the next animation that is starting.
   */
/**
   * Remove an animation from the active animation list. If it has a queue set
   * then remember it as the last animation for that queue, and free the one
   * that was previously there. If the animation list is completely empty then
   * mark us as finished.
   */
function ke(e){var t=e._next,n=e._prev,r=null==e.queue?e.options.queue:e.queue;(be.firstNew===e&&(be.firstNew=t),be.first===e?be.first=t:n&&(n._next=t),be.last===e?be.last=n:t&&(t._prev=n),r)&&(me(e.element)&&(e._next=e._prev=void 0))}var _e={};
// Project
/**
   * Call the complete method of an animation in a separate function so it can
   * benefit from JIT compiling while still having a try/catch block.
   */
/**
   * Complete an animation. This might involve restarting (for loop or repeat
   * options). Once it is finished we also check for any callbacks or Promises
   * that need updating.
   */
function Ee(e){
// TODO: Check if it's not been completed already
var t=e.options,n=d(e.queue,t.queue),r=d(e.loop,t.loop,U.loop),i=d(e.repeat,t.repeat,U.repeat),o=8/* STOPPED */&e._flags;// tslint:disable-line:no-bitwise
if(o||!r&&!i){var a=e.element,s=me(a);
//////////////////////
// Option: Complete //
//////////////////////
// If this is the last animation in this list then we can check for
// and complete calls or Promises.
// TODO: When deleting an element we need to adjust these values.
if(--s.count||o||
////////////////////////
// Feature: Classname //
////////////////////////
p(a,be.className),t&&++t._completed===t._total){!o&&t.complete&&(
// We don't call the complete if the animation is stopped,
// and we clear the key to prevent it being called again.
!function(e){try{var t=e.elements;e.options.complete.call(t,t,e)}catch(e){setTimeout(function(){throw e},1)}}(e),t.complete=null);var u=t._resolver;u&&(
// Fulfil the Promise
u(e.elements),delete t._resolver)}
///////////////////
// Option: Queue //
///////////////////
!1!==n&&(
// We only do clever things with queues...
o||(
// If we're not stopping an animation, we need to remember
// what time it finished so that the next animation in
// sequence gets the correct start time.
s.lastFinishList[n]=e.timeStart+d(e.duration,t.duration,U.duration)),
// Start the next animation in sequence, or delete the queue if
// this was the last one.
function(e,t,n){if(!1!==t){l(t)||(t="");var r=me(e),i=r.queueList[t];i?(r.queueList[t]=i._next||null,n||Se(i)):null===i&&delete r.queueList[t]}}(a,n)),
// Cleanup any pointers, and remember the last animation etc.
ke(e)}else
////////////////////
// Option: Loop   //
// Option: Repeat //
////////////////////
i&&!0!==i?e.repeat=i-1:r&&!0!==r&&(e.loop=r-1,e.repeat=d(e.repeatAgain,t.repeatAgain,U.repeatAgain)),r&&(e._flags^=64/* REVERSE */),!1!==n&&(
// Can't be called when stopped so no need for an extra check.
me(e.element).lastFinishList[n]=e.timeStart+d(e.duration,t.duration,U.duration)),e.timeStart=e.ellapsedTime=e.percentComplete=0,e._flags&=-5/* STARTED */}
// Project
/**
   * Used to register a normalization. This should never be called by users
   * directly, instead it should be called via an action:<br/>
   * <code>Velocity("registerNormalization", "Element", "name", VelocityNormalizationsFn[, false]);</code>
   *
   * The second argument is the class of the animatable object. If this is passed
   * as a class name (ie, `"Element"` -> `window["Element"]`) then this will work
   * cross-iframe. If passed as an actual class (ie `Element`) then it will
   * attempt to find the class on the window and use that name instead. If it
   * can't find it then it will use the class passed, which allows for custom
   * animation targets, but will not work cross-iframe boundary.
   *
   * The fourth argument can be an explicit <code>false</code>, which prevents
   * the property from being cached. Please note that this can be dangerous
   * for performance!
   */function Oe(e){var t=e[0],n=e[1],i=e[2];if((!l(t)||window[t]instanceof Object)&&(l(t)||t instanceof Object))if(l(n))if(r(i)){var o=ge.indexOf(t),a=3;if(o<0&&t instanceof Object)for(var s in window)if(window[s]===t){(o=ge.indexOf(s))<0&&(o=ge.push(s)-1,de[o]={});break}if(o<0&&(o=ge.push(t)-1,de[o]={}),de[o][n]=i,l(e[a])){var u=e[a++],c=ve[u];c||(c=ve[u]=[]),c.push(i)}!1===e[a]&&pe.add(n)}else console.warn("VelocityJS: Trying to set 'registerNormalization' callback to an invalid value:",n,i);else console.warn("VelocityJS: Trying to set 'registerNormalization' name to an invalid value:",n);else console.warn("VelocityJS: Trying to set 'registerNormalization' constructor to an invalid value:",t)}
/**
   * Used to check if a normalisation exists on a specific class.
   */function Te(e){var t=e[0],n=e[1],r=ge.indexOf(t);return!!de[r]&&!!de[r][n]}
/**
   * Get the unit to add to a unitless number based on the normalization used.
   */
/**
   * Get the normalization for an element and propertyName combination. This
   * value should be cached at asking time, as it may change if the user adds
   * more normalizations.
   */
function Me(e,t){for(var n=me(e),r=void 0,i=ge.length-1,o=n.types;!r&&i>=0;i--)o&1<<i&&(
// tslint:disable-line:no-bitwise
r=de[i][t]);return r}
// Project
/**
   * The singular setPropertyValue, which routes the logic for all
   * normalizations.
   */
function qe(e,t,n,r){var i=me(e);i&&i.cache[t]!==n&&(
// By setting it to undefined we force a true "get" later
i.cache[t]=n||void 0,(r=r||Me(e,t))&&r(e,n),Bt.debug>=2&&console.info('Set "'+t+'": "'+n+'"',e))}
/**
   * Cache every camelCase match to avoid repeating lookups.
   */y(["registerNormalization",Oe]),y(["hasNormalization",Te]);var Ve={};
/**
   * Camelcase a property name into its JavaScript notation (e.g.
   * "background-color" ==> "backgroundColor"). Camelcasing is used to
   * normalize property names between and across calls.
   */function Ae(e){var t=Ve[e];return t||(Ve[e]=e.replace(/-([a-z])/g,function(e,t){return t.toUpperCase()}))}
// Constants
var Ne=/#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/gi,Le=/#([a-f\d])([a-f\d])([a-f\d])/gi,Je=/(rgba?\(\s*)?(\b[a-z]+\b)/g,Ce=/rgb(a?)\(([^\)]+)\)/gi,Ie=/\s+/g,je={};
/**
   * This is the list of color names -> rgb values. The object is in here so
   * that the actual name conversion can be in a separate file and not
   * included for custom builds.
   */
/**
   * Convert a hex list to an rgba value. Designed to be used in replace.
   */
function Pe(e,t,n,r){return"rgba("+parseInt(t,16)+","+parseInt(n,16)+","+parseInt(r,16)+",1)"}
/**
   * Replace any css colour name with its rgba() value. It is possible to use
   * the name within an "rgba(blue, 0.4)" string this way.
   */function Fe(e){return e.replace(Ne,Pe).replace(Le,function(e,t,n,r){return Pe(0,t+t,n+n,r+r)}).replace(Je,function(e,t,n){return je[n]?(t||"rgba(")+je[n]+(t?"":",1)"):e}).replace(Ce,function(e,t,n){return"rgba("+n.replace(Ie,"")+(t?"":",1")+")"})}
// Project
/**
   * Figure out the dimensions for this width / height based on the
   * potential borders and whether we care about them.
   */function He(e,t,n){if("border-box"===We(e,"boxSizing").toString().toLowerCase()===n){
// in box-sizing mode, the CSS width / height accessors already
// give the outerWidth / outerHeight.
var r="width"===t?["Left","Right"]:["Top","Bottom"],i=["padding"+r[0],"padding"+r[1],"border"+r[0]+"Width","border"+r[1]+"Width"],o=0,a=!0,l=!1,s=void 0;try{for(var u,c=i[Symbol.iterator]();!(a=(u=c.next()).done);a=!0){var f=u.value,d=parseFloat(We(e,f));isNaN(d)||(o+=d)}}catch(e){l=!0,s=e}finally{try{!a&&c.return&&c.return()}finally{if(l)throw s}}return n?-o:o}return 0}
// Project
// TODO: This is still a complete mess
function Re(e,t){var n=me(e),
// If computedStyle is cached, use it. If not then get the correct one
// for the element to support cross-iframe boundaries.
r=n.computedStyle?n.computedStyle:n.window.getComputedStyle(e,null),i=0;if(n.computedStyle||(n.computedStyle=r),"none"===r.display)switch(t){case"width":case"height":
// Browsers do not return height and width values for elements
// that are set to display:"none". Thus, we temporarily toggle
// display to the element type's default value.
return qe(e,"display","auto"),i=He(e,t,!0),qe(e,"display","none"),String(i)}
/* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
       Also, in all browsers, when border colors aren't all the same, a compound value is returned that Velocity isn't setup to parse.
       So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
/* TODO: There is a borderColor normalisation in legacy/ - figure out where this is needed... */
/* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position,
       defer to jQuery for converting "auto" to a numeric value. (For elements with a "static" or "relative" position, "auto" has the same
       effect as being set to 0, so no conversion is necessary.) */
/* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left"
       property, which reverts to "auto", left's value is 0 relative to its parent element, but is often non-zero relative
       to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */
if(
/* Fall back to the property's style value (if defined) when computedValue returns nothing,
       which can happen when the element hasn't been painted. */
(i=r[t])||(i=e.style[t]),"auto"===i)switch(t){case"width":case"height":i=e.getBoundingClientRect[t]+"px";break;case"top":case"left":case"right":case"bottom":var o=We(e,"position");if("fixed"===o||"absolute"===o){
// Note: this has no pixel unit on its returned values,
// we re-add it here to conform with
// computePropertyValue's behavior.
i=e.getBoundingClientRect[t]+"px";break}
// Deliberate fallthrough!
default:i="0px"}return i?String(i):""}
/**
   * Get a property value. This will grab via the cache if it exists, then
   * via any normalisations.
   */function We(e,t,n,r){var i=me(e),o=void 0;return pe.has(t)&&(r=!0),!r&&i&&null!=i.cache[t]?o=i.cache[t]:(n=n||Me(e,t))&&(o=n(e),i&&(i.cache[t]=o)),Bt.debug>=2&&console.info('Get "'+t+'": "'+o+'"',e),o}
// Project
// Constants
var Be=/^#([A-f\d]{3}){1,2}$/i,ze={function:function(e,t,n,r,i,o){return e.call(t,r,n.length)},number:function(e,t,n,r,i,o){return String(e)+function(e){for(var t in ve)if(ve[t].includes(e))return t;return""}(o.fn)},string:function(e,t,n,r,i,o){return Fe(e)},undefined:function(e,t,n,r,i,o){return Fe(We(t,i,o.fn)||"")}};
/**
   * Expand a VelocityProperty argument into a valid sparse Tween array. This
   * pre-allocates the array as it is then the correct size and slightly
   * faster to access.
   */function $e(t,n){var i=t.tweens=Object.create(null),a=t.elements,s=t.element,u=a.indexOf(s),c=me(s),f=d(t.queue,t.options.queue),v=d(t.options.duration,U.duration);for(var p in n)if(n.hasOwnProperty(p)){var g=Ae(p),y=Me(s,g),m=n[p];if(!y&&"tween"!==g){Bt.debug&&console.log('Skipping "'+p+'" due to a lack of browser support.');continue}if(null==m){Bt.debug&&console.log('Skipping "'+p+'" due to no value supplied.');continue}var h=i[g]={},b=void 0,S=void 0;if(h.fn=y,r(m)&&(
// If we have a function as the main argument then resolve
// it first, in case it returns an array that needs to be
// split.
m=m.call(s,u,a.length,a)),Array.isArray(m)){
// valueData is an array in the form of
// [ endValue, [, easing] [, startValue] ]
var x=m[1],k=m[2];b=m[0],l(x)&&(/^[\d-]/.test(x)||Be.test(x))||r(x)||o(x)?S=x:l(x)&&w[x]||Array.isArray(x)?(h.easing=W(x,v),S=k):S=x||k}else b=m;h.end=ze[void 0===b?"undefined":e(b)](b,s,a,u,g,h),null==S&&!1!==f&&void 0!==c.queueList[f]||(h.start=ze[void 0===S?"undefined":e(S)](S,s,a,u,g,h),Ue(g,h,v))}}
// TODO: Needs a better match for "translate3d" etc - a number must be preceded by some form of break...
var Ge=/((?:[+\-*/]=)?(?:[+-]?\d*\.\d+|[+-]?\d+)[a-z%]*|(?:.(?!$|[+-]?\d|[+\-*/]=[+-]?\d))+.|.)/g,Qe=/^([+\-*/]=)?([+-]?\d*\.\d+|[+-]?\d+)(.*)$/;
/**
   * Find a pattern between multiple strings, return a VelocitySequence with
   * the pattern and the tokenised values.
   *
   * If number then animate.
   * If a string then must match.
   * If units then convert between them by wrapping in a calc().
   * - If already in a calc then nest another layer.
   * If in an rgba() then the first three numbers are rounded.
   */function De(e,t){
// First tokenise the strings - these have all values, we will pull
// numbers later.
for(var n=e.length,r=[],i=[],o=void 0,a=0;a<n;a++){if(!l(e[a]))
// We have an incomplete lineup, it will get tried again later...
return;r[a]=c(e[a].match(Ge)),i[a]=0,
// If it matches more than one thing then we've got a number.
o=o||r[a].length>1}for(var s=[],u=s.pattern=[],f=function(e){if(l(u[u.length-1]))u[u.length-1]+=e;else if(e){u.push(e);for(var t=0;t<n;t++)s[t].push(null)}},d=function(){if(!(o||u.length>1)){for(var r="display"===t,i="visibility"===t,a=0;a<n;a++){var l=e[a];s[a][0]=l,
// Don't care about duration...
s[a].easing=W(r&&"none"===l||i&&"hidden"===l||!r&&!i?"at-end":"at-start",400)}return u[0]=!1,s}},v=!0,p=0;p<n;p++)s[p]=[];for(;v;){for(var g=[],y=[],m=void 0,h=!1,w=!1,b=0;b<n;b++){var S=i[b]++,x=r[b][S];if(!x){if(b)
// Different
return;for(;b<n;b++){var k=i[b]++;if(r[b][k])return d()}
// IMPORTANT: This is the exit point.
v=!1;break}var _=x.match(Qe);// [ignore, change, number, unit]
if(_){
// It's a number, possibly with a += change and unit.
if(m)return d();var E=parseFloat(_[2]),O=_[3],T=_[1]?_[1][0]+O:void 0,M=T||O;y.includes(M)||
// Will be an empty string at the least.
y.push(M),O||(E?w=!0:h=!0),g[b]=T?[E,M,!0]:[E,M]}else{if(g.length)return d();
// It's a string.
if(m){if(m!==x)return d()}else m=x}}if(m)f(m);else if(y.length)if(2===y.length&&h&&!w&&
// If we only have two units, and one is empty, and it's only empty on "0", then treat us as having one unit
y.splice(y[0]?1:0,1),1===y.length){
// All the same units, so append number then unit.
var q=y[0];switch(q[0]){case"+":case"-":case"*":case"/":return void(t&&console.error('Velocity: The first property must not contain a relative function "'+t+'":',e))}u.push(!1);for(var V=0;V<n;V++)s[V].push(g[V][0]);f(q)}else{
// Multiple units, so must be inside a calc.
f("calc(");// Store the beginning of our calc.
for(var A=u.length-1,N=0;N<y.length;N++){var L=y[N],J=L[0],C="*"===J||"/"===J,I=C||"+"===J||"-"===J;C&&(
// TODO: Not sure this should be done automatically!
u[A]+="(",f(")")),N&&f(" "+(I?J:"+")+" "),u.push(!1);for(var j=0;j<n;j++){var P=g[j],F=P[1]===L?P[0]:3===P.length?s[j-1][s[j-1].length-1]:C?1:0;s[j].push(F)}f(I?L.substring(1):L)}f(")")}}
// We've got here, so a valid sequence - now check and fix RGB rounding
// and calc() nesting...
// TODO: Nested calc(a + calc(b + c)) -> calc(a + (b + c))
for(var H=0,R=0;H<u.length;H++){var B=u[H];l(B)?R&&B.indexOf(",")>=0?R++:B.indexOf("rgb")>=0&&(R=1):R&&(R<4?u[H]=!0:R=0)}return s}
/**
   * Convert a string-based tween with start and end strings, into a pattern
   * based tween with arrays.
   */function Ue(e,t,n,r){var i=t.start,o=t.end;if(l(o)&&l(i)){var a=De([i,o],e);if(!a&&r){
// This little piece will take a startValue, split out the
// various numbers in it, then copy the endValue into the
// startValue while replacing the numbers in it to match the
// original start numbers as a repeating sequence.
// Finally this function will run again with the new
// startValue and a now matching pattern.
var s=i.match(/\d\.?\d*/g)||["0"],u=s.length,c=0;a=De([o.replace(/\d+\.?\d*/g,function(){return s[c++%u]}),o],e)}if(a)switch(Bt.debug&&console.log("Velocity: Sequence found:",a),a[0].percent=0,a[1].percent=1,t.sequence=a,t.easing){case w["at-start"]:case w.during:case w["at-end"]:a[0].easing=a[1].easing=t.easing}}}
/**
   * Expand all queued animations that haven't gone yet
   *
   * This will automatically expand the properties map for any recently added
   * animations so that the start and end values are correct.
   */function Ze(e){
// Check if we're actually already ready
if(
// This might be called on an already-ready animation
be.firstNew===e&&(be.firstNew=e._next),!(1/* EXPANDED */&e._flags)){var t=e.element,n=e.tweens;
// tslint:disable-next-line:forin
d(e.options.duration,U.duration);for(var r in n){var i=n[r];if(null==i.start){
// Get the start value as it's not been passed in
var o=We(e.element,r);l(o)?(i.start=Fe(o),Ue(r,i,0,!0)):Array.isArray(o)||console.warn("bad type",i,r,o)}Bt.debug&&console.log('tweensContainer "'+r+'": '+JSON.stringify(i),t)}e._flags|=1/* EXPANDED */}}
// Project
/**
   * Call the begin method of an animation in a separate function so it can
   * benefit from JIT compiling while still having a try/catch block.
   */function Ye(e){try{var t=e.elements;e.options.begin.call(t,t,e)}catch(e){setTimeout(function(){throw e},1)}}
/**
   * Call the progress method of an animation in a separate function so it can
   * benefit from JIT compiling while still having a try/catch block.
   */function Xe(e,t){try{var n=e.elements,r=e.percentComplete,i=e.options,o=e.tween;e.options.progress.call(n,n,r,Math.max(0,e.timeStart+(null!=e.duration?e.duration:null!=i.duration?i.duration:U.duration)-t),void 0!==o?o:String(100*r),e)}catch(e){setTimeout(function(){throw e},1)}}function Ke(){var e=void 0,t=void 0;
// Callbacks and complete that might read the DOM again.
// Progress callback
for(e=at;e;e=t)t=e._nextProgress,
// Pass to an external fn with a try/catch block for optimisation
Xe(e,st);
// Complete animations, including complete callback or looping
for(e=lt;e;e=t)t=e._nextComplete,
/* If this call has finished tweening, pass it to complete() to handle call cleanup. */
Ee(e)}
/**************
   Timing
   **************/var et=1e3/60,
/**
   * Shim for window.performance in case it doesn't exist
   */
tt=function(){var e=window.performance||{};if("function"!=typeof e.now){var t=e.timing&&e.timing.navigationStart?e.timing.navigationStart:v();e.now=function(){return v()-t}}return e}(),
/**
   * Proxy function for when rAF is not available.
   *
   * This should hopefully never be used as the browsers often throttle
   * this to less than one frame per second in the background, making it
   * completely unusable.
   */
nt=function(e){return setTimeout(e,Math.max(0,et-(tt.now()-st)))},
/**
   * Either requestAnimationFrame, or a shim for it.
   */
rt=window.requestAnimationFrame||nt,it=void 0,
/**
   * A background WebWorker that sends us framerate messages when we're in
   * the background. Without this we cannot maintain frame accuracy.
   */
ot=void 0,
/**
   * The first animation with a Progress callback.
   */
at=void 0,
/**
   * The first animation with a Complete callback.
   */
lt=void 0,st=0;
/**
   * Set if we are currently inside a tick() to prevent double-calling.
   */try{
// Create the worker - this might not be supported, hence the try/catch.
// Whenever the worker sends a message we tick()
(ot=new Worker(URL.createObjectURL(new Blob(["("+
/**
   * WebWorker background function.
   *
   * When we're in the background this will send us a msg every tick, when in
   * the foreground it won't.
   *
   * When running in the background the browser reduces allowed CPU etc, so
   * we raun at 30fps instead of 60fps.
   */
function(){var e=this,t=void 0;this.onmessage=function(n){switch(n.data){case!0:t||(t=setInterval(function(){e.postMessage(!0)},1e3/30));break;case!1:t&&(clearInterval(t),t=0);break;default:e.postMessage(n.data)}}}+")()"])))).onmessage=function(e){!0===e.data?ut():Ke()},
// And watch for going to the background to start the WebWorker running.
be.isMobile||void 0===document.hidden||document.addEventListener("visibilitychange",function(){ot.postMessage(be.isTicking&&document.hidden)})}catch(e){}
/*
   * WebWorkers are not supported in this format. This can happen in IE10
   * where it can't create one from a blob this way. We fallback, but make
   * no guarantees towards accuracy in this case.
   */
/**
   * Called on every tick, preferably through rAF. This is reponsible for
   * initialising any new animations, then starting any that need starting.
   * Finally it will expand any tweens and set the properties relating to
   * them. If there are any callbacks relating to the animations then they
   * will attempt to call at the end (with the exception of "begin").
   */function ut(e){if(!it){
/* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on.
       We leverage this metadata to fully ignore the first tick pass since RAF's initial pass is fired whenever
       the browser's next tick sync time occurs, which results in the first elements subjected to Velocity
       calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore
       the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
       by the same Velocity call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */
if(it=!0,!1!==e){var t=tt.now(),n=st?t-st:et,r=U.speed,i=U.easing,o=U.duration,a=void 0,l=void 0,s=void 0,u=void 0;if(at=null,lt=null,n>=U.minFrameTime||!st){
/********************
               Call Iteration
               ********************/
// Expand any tweens that might need it.
for(st=t;be.firstNew;)Ze(be.firstNew);
// Iterate through each active call.
for(a=be.first;a&&a!==be.firstNew;a=a._next){var c=a.element,f=me(c);
// Check to see if this element has been deleted midway
// through the animation. If it's gone then end this
// animation.
if(c.parentNode&&f){
// Don't bother getting until we can use these.
var d=a.options,v=a._flags,p=a.timeStart;
// If this is the first time that this call has been
// processed by tick() then we assign timeStart now so that
// it's value is as close to the real animation start time
// as possible.
if(!p){var g=null!=a.queue?a.queue:d.queue;p=t-n,!1!==g&&(p=Math.max(p,f.lastFinishList[g]||0)),a.timeStart=p}
// If this animation is paused then skip processing unless
// it has been set to resume.
16/* PAUSED */&v?
// tslint:disable-line:no-bitwise
// Update the time start to accomodate the paused
// completion amount.
a.timeStart+=n:
// Check if this animation is ready - if it's synced then it
// needs to wait for all other animations in the sync
2/* READY */&v||(
// tslint:disable-line:no-bitwise
a._flags|=2/* READY */,// tslint:disable-line:no-bitwise
d._ready++)}else
// TODO: Remove safely - decrease count, delete data, remove from arrays
ke(a)}
// Need to split the loop, as ready sync animations must all get
// the same start time.
for(a=be.first;a&&a!==be.firstNew;a=l){var y=a._flags;if(l=a._next,2/* READY */&y&&!(16/* PAUSED */&y)){var m=a.options;if(32/* SYNC */&y&&m._ready<m._total)
// tslint:disable-line:no-bitwise
a.timeStart+=n;else{var h=null!=a.speed?a.speed:null!=m.speed?m.speed:r,w=a.timeStart;
// Don't bother getting until we can use these.
if(!(4/* STARTED */&y)){
// tslint:disable-line:no-bitwise
var b=null!=a.delay?a.delay:m.delay;
// Make sure anything we've delayed doesn't start
// animating yet, there might still be an active delay
// after something has been un-paused
if(b){if(w+b/h>t)continue;a.timeStart=w+=b/(b>0?h:1)}a._flags|=4/* STARTED */,// tslint:disable-line:no-bitwise
// The begin callback is fired once per call, not once
// per element, and is passed the full raw DOM element
// set as both its context and its first argument.
0==m._started++&&(m._first=a,m.begin&&(
// Pass to an external fn with a try/catch block for optimisation
Ye(a),
// Only called once, even if reversed or repeated
m.begin=void 0))}if(1!==h){
// On the first frame we may have a shorter delta
var x=Math.min(n,t-w);a.timeStart=w+=x*(1-h)}m._first===a&&m.progress&&(a._nextProgress=void 0,s?s._nextProgress=s=a:at=s=a);var k=null!=a.easing?a.easing:null!=m.easing?m.easing:i,_=a.ellapsedTime=t-w,E=null!=a.duration?a.duration:null!=m.duration?m.duration:o,O=a.percentComplete=Bt.mock?1:Math.min(_/E,1),T=a.tweens,M=64/* REVERSE */&y;// tslint:disable-line:no-bitwise
// tslint:disable-next-line:forin
for(var q in 1===O&&(a._nextComplete=void 0,u?u._nextComplete=u=a:lt=u=a),T){
// For every element, iterate through each property.
var V=T[q],A=V.sequence,N=A.pattern,L="",J=0;if(N){for(var C=(V.easing||k)(O,0,1,q),I=0,j=0;j<A.length-1;j++)A[j].percent<C&&(I=j);for(var P=A[I],F=A[I+1]||P,H=(O-P.percent)/(F.percent-P.percent),R=F.easing||S;J<N.length;J++){var W=P[J];if(null==W)L+=N[J];else{var B=F[J];if(W===B)L+=W;else{
// All easings must deal with numbers except for our internal ones.
var z=R(M?1-H:H,W,B,q);L+=!0===N[J]?Math.round(z):z}}}"tween"!==q?(1===O&&L.startsWith("calc(0 + ")&&(L=L.replace(/^calc\(0[^\d]* \+ ([^\(\)]+)\)$/,"$1")),
// TODO: To solve an IE<=8 positioning bug, the unit type must be dropped when setting a property value of 0 - add normalisations to legacy
qe(a.element,q,L,V.fn)):
// Skip the fake 'tween' property as that is only
// passed into the progress callback.
a.tween=L}else console.warn("VelocityJS: Missing pattern:",q,JSON.stringify(V[q])),delete T[q]}}}}(at||lt)&&(document.hidden?Ke():ot?ot.postMessage(""):setTimeout(Ke,1))}}be.first?(be.isTicking=!0,document.hidden?ot?!1===e&&
// Make sure we turn on the messages.
ot.postMessage(!0):nt(ut):rt(ut)):(be.isTicking=!1,st=0,document.hidden&&ot&&
// Make sure we turn off the messages.
ot.postMessage(!1)),it=!1}}
// Project
/**
   * Check if an animation should be finished, and if so we set the tweens to
   * the final value for it, then call complete.
   */function ct(e,t,n){if(Ze(e),void 0===t||t===d(e.queue,e.options.queue,n)){if(!(4/* STARTED */&e._flags)){
// tslint:disable-line:no-bitwise
// Copied from tick.ts - ensure that the animation is completely
// valid and run begin() before complete().
var r=e.options;
// The begin callback is fired once per call, not once per
// element, and is passed the full raw DOM element set as both
// its context and its first argument.
0==r._started++&&(r._first=e,r.begin&&(
// Pass to an external fn with a try/catch block for optimisation
Ye(e),
// Only called once, even if reversed or repeated
r.begin=void 0)),e._flags|=4/* STARTED */}
// tslint:disable-next-line:forin
for(var i in e.tweens){var o=e.tweens[i],a=o.sequence,l=a.pattern,s="",u=0;if(l)for(var c=a[a.length-1];u<l.length;u++){var f=c[u];s+=null==f?l[u]:f}qe(e.element,i,s,o.fn)}Ee(e)}}
/**
   * When the finish action is triggered, the elements' currently active call is
   * immediately finished. When an element is finished, the next item in its
   * animation queue is immediately triggered. If passed via a chained call
   * then this will only target the animations in that call, and not the
   * elements linked to it.
   *
   * A queue name may be passed in to specify that only animations on the
   * named queue are finished. The default queue is named "". In addition the
   * value of `false` is allowed for the queue name.
   *
   * An final argument may be passed in to clear an element's remaining queued
   * calls. This may only be the value `true`.
   */y(["finish",function(e,t,n){var r=$(e[0],!0),i=U.queue,o=!0===e[void 0===r?0:1];if(s(t)&&t.velocity.animations){var a=!0,l=!1,u=void 0;try{for(var c,f=t.velocity.animations[Symbol.iterator]();!(a=(c=f.next()).done);a=!0)ct(c.value,r,i)}catch(e){l=!0,u=e}finally{try{!a&&f.return&&f.return()}finally{if(l)throw u}}}else{for(;be.firstNew;)Ze(be.firstNew);for(var d,v=be.first;v&&(o||v!==be.firstNew);v=d||be.firstNew)d=v._next,t&&!t.includes(v.element)||ct(v,r,i)}n&&(s(t)&&t.velocity.animations&&t.then?t.then(n._resolver):n._resolver(t))}],!0);
/**
   * Used to map getters for the various AnimationFlags.
   */
var ft={isExpanded:1/* EXPANDED */,isReady:2/* READY */,isStarted:4/* STARTED */,isStopped:8/* STOPPED */,isPaused:16/* PAUSED */,isSync:32/* SYNC */,isReverse:64/* REVERSE */};
/**
   * Get or set an option or running AnimationCall data value. If there is no
   * value passed then it will get, otherwise we will set.
   *
   * NOTE: When using "get" this will not touch the Promise as it is never
   * returned to the user.
   */
// Project
/**
   * Check if an animation should be paused / resumed.
   */
function dt(e,t,n,r){void 0!==t&&t!==d(e.queue,e.options.queue,n)||(r?e._flags|=16/* PAUSED */:e._flags&=-17/* PAUSED */)}
/**
   * Pause and Resume are call-wide (not on a per element basis). Thus, calling pause or resume on a
   * single element will cause any calls that contain tweens for that element to be paused/resumed
   * as well.
   */function vt(e,t,n,r){var i=0===r.indexOf("pause"),o="false"!==(r.indexOf(".")>=0?r.replace(/^.*\./,""):void 0)&&$(e[0]),a=U.queue;if(s(t)&&t.velocity.animations){var l=!0,u=!1,c=void 0;try{for(var f,d=t.velocity.animations[Symbol.iterator]();!(l=(f=d.next()).done);l=!0){dt(f.value,o,a,i)}}catch(e){u=!0,c=e}finally{try{!l&&d.return&&d.return()}finally{if(u)throw c}}}else for(var v=be.first;v;)t&&!t.includes(v.element)||dt(v,o,a,i),v=v._next;n&&(s(t)&&t.velocity.animations&&t.then?t.then(n._resolver):n._resolver(t))}
// Project
/**
   * Check if an animation should be stopped, and if so then set the STOPPED
   * flag on it, then call complete.
   */
function pt(e,t,n){Ze(e),void 0!==t&&t!==d(e.queue,e.options.queue,n)||(e._flags|=8/* STOPPED */,// tslint:disable-line:no-bitwise
Ee(e))}
/**
   * When the stop action is triggered, the elements' currently active call is
   * immediately stopped. When an element is stopped, the next item in its
   * animation queue is immediately triggered. If passed via a chained call
   * then this will only target the animations in that call, and not the
   * elements linked to it.
   *
   * A queue name may be passed in to specify that only animations on the
   * named queue are stopped. The default queue is named "". In addition the
   * value of `false` is allowed for the queue name.
   *
   * An final argument may be passed in to clear an element's remaining queued
   * calls. This may only be the value `true`.
   *
   * Note: The stop command runs prior to Velocity's Queueing phase since its
   * behavior is intended to take effect *immediately*, regardless of the
   * element's current queue state.
   */y(["option",function(e,t,n,r){var i=e[0],o=r.indexOf(".")>=0?r.replace(/^.*\./,""):void 0,a="false"!==o&&$(o,!0),l=void 0,u=e[1];if(!i)return console.warn("VelocityJS: Cannot access a non-existant key!"),null;
// If we're chaining the return value from Velocity then we are only
// interested in the values related to that call
if(s(t)&&t.velocity.animations)l=t.velocity.animations;else{l=[];for(var c=be.first;c;c=c._next)t.indexOf(c.element)>=0&&d(c.queue,c.options.queue)===a&&l.push(c);
// If we're dealing with multiple elements that are pointing at a
// single running animation, then instead treat them as a single
// animation.
if(t.length>1&&l.length>1){for(var f=1,v=l[0].options;f<l.length;)if(l[f++].options!==v){v=null;break}
// TODO: this needs to check that they're actually a sync:true animation to merge the results, otherwise the individual values may be different
v&&(l=[l[0]])}}
// GET
if(void 0===u){var p=[],g=ft[i],y=!0,m=!1,h=void 0;try{for(var w,b=l[Symbol.iterator]();!(y=(w=b.next()).done);y=!0){var S=w.value;void 0===g?
// A normal key to get.
p.push(d(S[i],S.options[i])):
// A flag that we're checking against.
p.push(0==(S._flags&g))}}catch(e){m=!0,h=e}finally{try{!y&&b.return&&b.return()}finally{if(m)throw h}}return 1===t.length&&1===l.length?p[0]:p}
// SET
var x=void 0;switch(i){case"cache":u=j(u);break;case"begin":u=P(u);break;case"complete":u=F(u);break;case"delay":u=H(u);break;case"duration":u=R(u);break;case"fpsLimit":u=B(u);break;case"loop":u=z(u);break;case"percentComplete":x=!0,u=parseFloat(u);break;case"repeat":case"repeatAgain":u=G(u);break;default:if("_"!==i[0]){var k=parseFloat(u);u===String(k)&&(u=k);break}
// deliberate fallthrough
case"queue":case"promise":case"promiseRejectEmpty":case"easing":case"started":return void console.warn("VelocityJS: Trying to set a read-only key:",i)}if(void 0===u||u!=u)return console.warn("VelocityJS: Trying to set an invalid value:"+i+"="+u+" ("+e[1]+")"),null;var _=!0,E=!1,O=void 0;try{for(var T,M=l[Symbol.iterator]();!(_=(T=M.next()).done);_=!0){var q=T.value;x?q.timeStart=st-d(q.duration,q.options.duration,U.duration)*u:q[i]=u}}catch(e){E=!0,O=e}finally{try{!_&&M.return&&M.return()}finally{if(E)throw O}}n&&(s(t)&&t.velocity.animations&&t.then?t.then(n._resolver):n._resolver(t))}],!0),y(["pause",vt],!0),y(["resume",vt],!0),
// Project
y(["reverse",function(e,t,n,r){
// NOTE: Code needs to split out before here - but this is needed to prevent it being overridden
throw new SyntaxError("VelocityJS: The 'reverse' action is built in and private.")}],!0),y(["stop",function(e,t,n,r){var i=$(e[0],!0),o=U.queue,a=!0===e[void 0===i?0:1];if(s(t)&&t.velocity.animations){var l=!0,u=!1,c=void 0;try{for(var f,d=t.velocity.animations[Symbol.iterator]();!(l=(f=d.next()).done);l=!0)pt(f.value,i,o)}catch(e){u=!0,c=e}finally{try{!l&&d.return&&d.return()}finally{if(u)throw c}}}else{for(;be.firstNew;)Ze(be.firstNew);for(var v,p=be.first;p&&(a||p!==be.firstNew);p=v||be.firstNew)v=p._next,t&&!t.includes(p.element)||pt(p,i,o)}n&&(s(t)&&t.velocity.animations&&t.then?t.then(n._resolver):n._resolver(t))}],!0),y(["style",
// Project
/**
   * Get or set a style of Nomralised property value on one or more elements.
   * If there is no value passed then it will get, otherwise we will set.
   *
   * NOTE: When using "get" this will not touch the Promise as it is never
   * returned to the user.
   *
   * This can fail to set, and will reject the Promise if it does so.
   *
   * Velocity(elements, "style", "property", "value") => elements;
   * Velocity(elements, "style", {"property": "value", ...}) => elements;
   * Velocity(element, "style", "property") => "value";
   * Velocity(elements, "style", "property") => ["value", ...];
   */
function(t,n,r,i){var u=t[0],c=t[1];if(!u)return console.warn("VelocityJS: Cannot access a non-existant property!"),null;
// GET
if(void 0===c&&!a(u)){
// If only a single animation is found and we're only targetting a
// single element, then return the value directly
if(1===n.length)return Fe(We(n[0],u));var f=[],d=!0,v=!1,p=void 0;try{for(var g,y=n[Symbol.iterator]();!(d=(g=y.next()).done);d=!0){var m=g.value;f.push(Fe(We(m,u)))}}catch(e){v=!0,p=e}finally{try{!d&&y.return&&y.return()}finally{if(v)throw p}}return f}
// SET
var h=[];if(a(u)){for(var w in u)if(u.hasOwnProperty(w)){var b=!0,S=!1,x=void 0;try{for(var k,_=n[Symbol.iterator]();!(b=(k=_.next()).done);b=!0){var E=k.value,O=u[w];l(O)||o(O)?qe(E,w,u[w]):(h.push('Cannot set a property "'+w+'" to an unknown type: '+(void 0===O?"undefined":e(O))),console.warn('VelocityJS: Cannot set a property "'+w+'" to an unknown type:',O))}}catch(e){S=!0,x=e}finally{try{!b&&_.return&&_.return()}finally{if(S)throw x}}}}else if(l(c)||o(c)){var T=!0,M=!1,q=void 0;try{for(var V,A=n[Symbol.iterator]();!(T=(V=A.next()).done);T=!0)qe(V.value,u,String(c))}catch(e){M=!0,q=e}finally{try{!T&&A.return&&A.return()}finally{if(M)throw q}}}else h.push('Cannot set a property "'+u+'" to an unknown type: '+(void 0===c?"undefined":e(c))),console.warn('VelocityJS: Cannot set a property "'+u+'" to an unknown type:',c);r&&(h.length?r._rejecter(h.join(", ")):s(n)&&n.velocity.animations&&n.then?n.then(r._resolver):r._resolver(n))}],!0),y(["tween",
// Project
/**
   *
   */
function(e,n,r,i){var s=void 0;if(n){if(1!==n.length)
// TODO: Allow more than a single element to return an array of results
throw new Error("VelocityJS: Cannot tween more than one element!")}else{if(!e.length)return console.info('Velocity(<element>, "tween", percentComplete, property, end | [end, <easing>, <start>], <easing>) => value\nVelocity(<element>, "tween", percentComplete, {property: end | [end, <easing>, <start>], ...}, <easing>) => {property: value, ...}'),null;n=[document.body],s=!0}var u=e[0],c={elements:n,element:n[0],queue:!1,options:{duration:1e3},tweens:null},f={},v=e[1],p=void 0,g=void 0,y=e[2],h=0;if(l(e[1])?_e&&_e[e[1]]?(g=_e[e[1]],v={},y=e[2]):(p=!0,v=t({},e[1],e[2]),y=e[3]):Array.isArray(e[1])&&(p=!0,v={tween:e[1]},y=e[2]),!o(u)||u<0||u>1)throw new Error("VelocityJS: Must tween a percentage from 0 to 1!");if(!a(v))throw new Error("VelocityJS: Cannot tween an invalid property!");if(s)for(var w in v)if(v.hasOwnProperty(w)&&(!Array.isArray(v[w])||v[w].length<2))throw new Error("VelocityJS: When not supplying an element you must force-feed values: "+w);var b=W(d(y,U.easing),m);
// tslint:disable-next-line:forin
for(var x in g?Ut(c,g):$e(c,v),c.tweens){
// For every element, iterate through each property.
var k=c.tweens[x],_=k.sequence,E=_.pattern,O="",T=0;if(h++,E){for(var M=(k.easing||b)(u,0,1,x),q=0,V=0;V<_.length-1;V++)_[V].percent<M&&(q=V);for(var A=_[q],N=_[q+1]||A,L=(u-A.percent)/(N.percent-A.percent),J=N.easing||S;T<E.length;T++){var C=A[T];if(null==C)O+=E[T];else{var I=N[T];if(C===I)O+=C;else{
// All easings must deal with numbers except for our internal ones.
var j=J(L,C,I,x);O+=!0===E[T]?Math.round(j):j}}}f[x]=O}}if(p&&1===h)for(var P in f)if(f.hasOwnProperty(P))return f[P];return f}],!0);
// Project
/**
   * Converting from hex as it makes for a smaller file.
   */
var gt={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgrey:11119017,darkgreen:25600,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,grey:8421504,green:32768,greenyellow:11403055,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgrey:13882323,lightgreen:9498256,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};for(var yt in gt)if(gt.hasOwnProperty(yt)){var mt=gt[yt];je[yt]=Math.floor(mt/65536)+","+Math.floor(mt/256%256)+","+mt%256}
// Project
// TODO: Expose these as actions to register custom easings?
// Project
function ht(e){return e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375}function wt(e){return 1-ht(1-e)}!function(e,t){b([e,function(e,n,r){return 0===e?n:1===e?r:Math.pow(e,2)*((t+1)*e-t)*(r-n)}])}("easeInBack",1.7),function(e,t){b([e,function(e,n,r){return 0===e?n:1===e?r:(Math.pow(--e,2)*((t+1)*e+t)+1)*(r-n)}])}("easeOutBack",1.7),function(e,t){t*=1.525,b([e,function(e,n,r){return 0===e?n:1===e?r:.5*((e*=2)<1?Math.pow(e,2)*((t+1)*e-t):Math.pow(e-2,2)*((t+1)*(e-2)+t)+2)*(r-n)}])}("easeInOutBack",1.7),b(["easeInBounce",function(e,t,n){return 0===e?t:1===e?n:wt(e)*(n-t)}]),b(["easeOutBounce",function(e,t,n){return 0===e?t:1===e?n:ht(e)*(n-t)}]),b(["easeInOutBounce",function(e,t,n){return 0===e?t:1===e?n:(e<.5?.5*wt(2*e):.5*ht(2*e-1)+.5)*(n-t)}]);
// Project
// Constants
var bt=2*Math.PI;
// Project
/**
   * Get/set the inner/outer dimension.
   */
function St(e,t){return function(n,r){if(void 0===r)return He(n,e,t)+"px";qe(n,e,parseFloat(r)-He(n,e,t)+"px")}}!function(e,t,n){b([e,function(e,r,i){return 0===e?r:1===e?i:-t*Math.pow(2,10*(e-=1))*Math.sin((e-n/bt*Math.asin(1/t))*bt/n)*(i-r)}])}("easeInElastic",1,.3),function(e,t,n){b([e,function(e,r,i){return 0===e?r:1===e?i:(t*Math.pow(2,-10*e)*Math.sin((e-n/bt*Math.asin(1/t))*bt/n)+1)*(i-r)}])}("easeOutElastic",1,.3),function(e,t,n){b([e,function(e,r,i){if(0===e)return r;if(1===e)return i;var o=n/bt*Math.asin(1/t);return((e=2*e-1)<0?t*Math.pow(2,10*e)*Math.sin((e-o)*bt/n)*-.5:t*Math.pow(2,-10*e)*Math.sin((e-o)*bt/n)*.5+1)*(i-r)}])}("easeInOutElastic",1,.3*1.5),b(["at-start",
// TODO: Expose these as actions to register custom easings?
// Project
/**
   * Easing function that sets to the specified value immediately after the
   * animation starts.
   */
function(e,t,n){return 0===e?t:n}
/**
   * Easing function that sets to the specified value while the animation is
   * running.
   */]),b(["during",function(e,t,n){return 0===e||1===e?t:n}
/**
   * Easing function that sets to the specified value when the animation ends.
   */]),b(["at-end",function(e,t,n){return 1===e?n:t}]),Oe(["Element","innerWidth",St("width",!0)]),Oe(["Element","innerHeight",St("height",!0)]),Oe(["Element","outerWidth",St("width",!1)]),Oe(["Element","outerHeight",St("height",!1)]);
// Project
// Constants
var xt=/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|let|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i,kt=/^(li)$/i,_t=/^(tr)$/i,Et=/^(table)$/i,Ot=/^(tbody)$/i;function Tt(e,t){return function(n,r){if(null==r)
// Make sure we have these values cached.
return We(n,"client"+e,null,!0),We(n,"scroll"+e,null,!0),We(n,"scroll"+t,null,!0),n["scroll"+t]+"px";var i=parseFloat(r);switch(r.replace(String(i),"")){case"":case"px":n["scroll"+t]=i;break;case"%":var o=parseFloat(We(n,"client"+e)),a=parseFloat(We(n,"scroll"+e));n["scroll"+t]=Math.max(0,a-o)*i/100}}}Oe(["Element","display",function(e,t){var n=e.style;if(void 0===t)return Re(e,"display");if("auto"===t){var r=e&&e.nodeName,i=me(e);t=xt.test(r)?"inline":kt.test(r)?"list-item":_t.test(r)?"table-row":Et.test(r)?"table":Ot.test(r)?"table-row-group":"block",
// IMPORTANT: We need to do this as getPropertyValue bypasses the
// Normalisation when it exists in the cache.
i.cache.display=t}n.display=t}]),Oe(["HTMLElement","scroll",Tt("Height","Top"),!1]),Oe(["HTMLElement","scrollTop",Tt("Height","Top"),!1]),Oe(["HTMLElement","scrollLeft",Tt("Width","Left"),!1]),Oe(["HTMLElement","scrollWidth",function(e,t){if(null==t)return e.scrollWidth+"px"}]),Oe(["HTMLElement","clientWidth",
// Project
function(e,t){if(null==t)return e.clientWidth+"px"}]),Oe(["HTMLElement","scrollHeight",function(e,t){if(null==t)return e.scrollHeight+"px"}]),Oe(["HTMLElement","clientHeight",function(e,t){if(null==t)return e.clientHeight+"px"}]);
// Project
/**
   * An RegExp pattern for the following list of css words using
   * http://kemio.com.ar/tools/lst-trie-re.php to generate:
   *
   * blockSize
   * borderBottomLeftRadius
   * borderBottomRightRadius
   * borderBottomWidth
   * borderImageOutset
   * borderImageWidth
   * borderLeftWidth
   * borderRadius
   * borderRightWidth
   * borderSpacing
   * borderTopLeftRadius
   * borderTopRightRadius
   * borderTopWidth
   * borderWidth
   * bottom
   * columnGap
   * columnRuleWidth
   * columnWidth
   * flexBasis
   * fontSize
   * gridColumnGap
   * gridGap
   * gridRowGap
   * height
   * inlineSize
   * left
   * letterSpacing
   * margin
   * marginBottom
   * marginLeft
   * marginRight
   * marginTop
   * maxBlockSize
   * maxHeight
   * maxInlineSize
   * maxWidth
   * minBlockSize
   * minHeight
   * minInlineSize
   * minWidth
   * objectPosition
   * outlineOffset
   * outlineWidth
   * padding
   * paddingBottom
   * paddingLeft
   * paddingRight
   * paddingTop
   * perspective
   * right
   * shapeMargin
   * strokeDashoffset
   * strokeWidth
   * textIndent
   * top
   * transformOrigin
   * width
   * wordSpacing
   */
// tslint:disable-next-line:max-line-length
var Mt=/^(b(lockSize|o(rder(Bottom(LeftRadius|RightRadius|Width)|Image(Outset|Width)|LeftWidth|R(adius|ightWidth)|Spacing|Top(LeftRadius|RightRadius|Width)|Width)|ttom))|column(Gap|RuleWidth|Width)|f(lexBasis|ontSize)|grid(ColumnGap|Gap|RowGap)|height|inlineSize|le(ft|tterSpacing)|m(a(rgin(Bottom|Left|Right|Top)|x(BlockSize|Height|InlineSize|Width))|in(BlockSize|Height|InlineSize|Width))|o(bjectPosition|utline(Offset|Width))|p(adding(Bottom|Left|Right|Top)|erspective)|right|s(hapeMargin|troke(Dashoffset|Width))|t(extIndent|op|ransformOrigin)|w(idth|ordSpacing))$/;
/**
   * Return a Normalisation that can be used to set / get a prefixed style
   * property.
   */function qt(e,t){return function(n,r){if(void 0===r)return Re(n,e)||Re(n,t);n.style[e]=n.style[t]=r}}
/**
   * Return a Normalisation that can be used to set / get a style property.
   */function Vt(e){return function(t,n){if(void 0===n)return Re(t,e);t.style[e]=n}}
/**
   * Vendor prefixes. Chrome / Safari, Firefox, IE / Edge, Opera.
   */var At=/^(webkit|moz|ms|o)[A-Z]/,Nt=be.prefixElement;for(var Lt in Nt.style)if(At.test(Lt)){var Jt=Lt.replace(/^[a-z]+([A-Z])/,function(e,t){return t.toLowerCase()}),Ct=Mt.test(Jt)?"px":void 0;Oe(["Element",Jt,qt(Lt,Jt),Ct])}else if(!Te([Element,Lt])){var It=Mt.test(Lt)?"px":void 0;Oe(["Element",Lt,Vt(Lt),It])}
// Project
/**
   * Get/set an attribute.
   */function jt(e){return function(t,n){if(void 0===n)return t.getAttribute(e);t.setAttribute(e,n)}}var Pt=document.createElement("div"),Ft=/^SVG(.*)Element$/,Ht=/Element$/;
// Project
/**
   * Get/set the width or height.
   */
function Rt(e){return function(t,n){if(void 0===n)
// Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM.
try{return t.getBBox()[e]+"px"}catch(e){return"0px"}t.setAttribute(e,n)}}Object.getOwnPropertyNames(window).forEach(function(e){var t=Ft.exec(e);if(t&&"SVG"!==t[1])
// Don't do SVGSVGElement.
try{var n=t[1]?document.createElementNS("http://www.w3.org/2000/svg",(t[1]||"svg").toLowerCase()):document.createElement("svg");
// tslint:disable-next-line:forin
for(var i in n){
// Although this isn't a tween without prototypes, we do
// want to get hold of all attributes and not just own ones.
var o=n[i];!l(i)||"o"===i[0]&&"n"===i[1]||i===i.toUpperCase()||Ht.test(i)||i in Pt||r(o)||
// TODO: Should this all be set on the generic SVGElement, it would save space and time, but not as powerful
Oe([e,i,jt(i)])}}catch(t){console.error("VelocityJS: Error when trying to identify SVG attributes on "+e+".",t)}}),Oe(["SVGElement","width",Rt("width")]),Oe(["SVGElement","height",Rt("height")]),Oe(["Element","tween",
// Project
/**
   * A fake normalization used to allow the "tween" property easy access.
   */
function(e,t){if(void 0===t)return""}]);
// Automatically generated
var Wt,Bt=Zt;
// Project
/******************
   Unsupported
   ******************/
if(function(e){
/**
       * Actions cannot be replaced if they are internal (hasOwnProperty is false
       * but they still exist). Otherwise they can be replaced by users.
       *
       * All external method calls should be using actions rather than sub-calls
       * of Velocity itself.
       */
e.Actions=g,
/**
       * Our known easing functions.
       */
e.Easings=w,
/**
       * The currently registered sequences.
       */
e.Sequences=_e,
/**
       * Current internal state of Velocity.
       */
e.State=be,// tslint:disable-line:no-shadowed-variable
/**
       * Velocity option defaults, which can be overriden by the user.
       */
e.defaults=U,
/**
       * Used to patch any object to allow Velocity chaining. In order to chain an
       * object must either be treatable as an array - with a <code>.length</code>
       * property, and each member a Node, or a Node directly.
       *
       * By default Velocity will try to patch <code>window</code>,
       * <code>jQuery</code>, <code>Zepto</code>, and several classes that return
       * Nodes or lists of Nodes.
       */
e.patch=Yt,
/**
       * Set to true, 1 or 2 (most verbose) to output debug info to console.
       */
e.debug=!1,
/**
       * In mock mode, all animations are forced to complete immediately upon the
       * next rAF tick. If there are further animations queued then they will each
       * take one single frame in turn. Loops and repeats will be disabled while
       * <code>mock = true</code>.
       */
e.mock=!1,
/**
       * Save our version number somewhere visible.
       */
e.version="2.0.3",
/**
       * Added as a fallback for "import {Velocity} from 'velocity-animate';".
       */
e.Velocity=Zt}(Wt||(Wt={})),function(){if(document.documentMode)return document.documentMode;for(var e=7;e>4;e--){var t=document.createElement("div");if(t.innerHTML="\x3c!--[if IE "+e+"]><span></span><![endif]--\x3e",t.getElementsByTagName("span").length)return t=null,e}}()<=8)throw new Error("VelocityJS cannot run on Internet Explorer 8 or earlier");
/******************
   Frameworks
   ******************/if(window){
/*
       * Both jQuery and Zepto allow their $.fn object to be extended to allow
       * wrapped elements to be subjected to plugin calls. If either framework is
       * loaded, register a "velocity" extension pointing to Velocity's core
       * animate() method. Velocity also registers itself onto a global container
       * (window.jQuery || window.Zepto || window) so that certain features are
       * accessible beyond just a per-element scope. Accordingly, Velocity can
       * both act on wrapped DOM elements and stand alone for targeting raw DOM
       * elements.
       */
var zt=window.jQuery,$t=window.Zepto;Yt(window,!0),Yt(Element&&Element.prototype),Yt(NodeList&&NodeList.prototype),Yt(HTMLCollection&&HTMLCollection.prototype),Yt(zt,!0),Yt(zt&&zt.fn),Yt($t,!0),Yt($t&&$t.fn)}
// Make sure that the values within Velocity are read-only and upatchable.
var Gt=function(t){if(Wt.hasOwnProperty(t))switch(void 0===t?"undefined":e(t)){case"number":case"boolean":f(Bt,t,{get:function(){return Wt[t]},set:function(e){Wt[t]=e}},!0);break;default:f(Bt,t,Wt[t],!0)}};for(var Qt in Wt)Gt(Qt);
// Project
var Dt=/(\d*\.\d+|\d+\.?|from|to)/g;function Ut(e,t){var n=e.tweens=Object.create(null),r=e.element;for(var i in t.tweens)if(t.tweens.hasOwnProperty(i)){var o=Me(r,i);if(!o&&"tween"!==i){Bt.debug&&console.log("Skipping ["+i+"] due to a lack of browser support.");continue}n[i]={fn:o,sequence:t.tweens[i]}}}
/**
   * Used to register a sequence. This should never be called by users
   * directly, instead it should be called via an action:<br/>
   * <code>Velocity("registerSequence", ""name", VelocitySequence);</code>
   */
// Project
/* tslint:enable:max-line-length */
function Zt(){for(var e=arguments.length,t=Array(e),o=0;o<e;o++)t[o]=arguments[o];var
/**
       * A shortcut to the default options.
       */
v=U,
/**
       * Shortcut to arguments for file size.
       */
p=arguments,
/**
       * Cache of the first argument - this is used often enough to be saved.
       */
y=p[0],
/**
       * To allow for expressive CoffeeScript code, Velocity supports an
       * alternative syntax in which "elements" (or "e"), "properties" (or
       * "p"), and "options" (or "o") objects are defined on a container
       * object that's passed in as Velocity's sole argument.
       *
       * Note: Some browsers automatically populate arguments with a
       * "properties" object. We detect it by checking for its default
       * "names" property.
       */
// TODO: Confirm which browsers - if <=IE8 the we can drop completely
m=a(y)&&(y.p||a(y.properties)&&!y.properties.names||l(y.properties)),
/**
       *  When Velocity is called via the utility function (Velocity()),
       * elements are explicitly passed in as the first parameter. Thus,
       * argument positioning varies.
       */
h=0,
/**
       * The list of elements, extended with Promise and Velocity.
       */
w=void 0,
/**
       * The properties being animated. This can be a string, in which case it
       * is either a function for these elements, or it is a "named" animation
       * sequence to use instead. Named sequences start with either "callout."
       * or "transition.". When used as a callout the values will be reset
       * after finishing. When used as a transtition then there is no special
       * handling after finishing.
       */
b=void 0,
/**
       * Options supplied, this will be mapped and validated into
       * <code>options</code>.
       */
S=void 0,
/**
       * If called via a chain then this contains the <b>last</b> calls
       * animations. If this does not have a value then any access to the
       * element's animations needs to be to the currently-running ones.
       */
x=void 0,
/**
       * The promise that is returned.
       */
k=void 0,
// Used when the animation is finished
_=void 0,
// Used when there was an issue with one or more of the Velocity arguments
E=void 0;
//console.log(`Velocity`, _arguments)
// First get the elements, and the animations connected to the last call if
// this is chained.
// TODO: Clean this up a bit
// TODO: Throw error if the chain is called with elements as the first argument. isVelocityResult(this) && ( (isNode(arg0) || isWrapped(arg0)) && arg0 == this)
i(this)?
// This is from a chain such as document.getElementById("").velocity(...)
w=[this]:u(this)?(
// This might be a chain from something else, but if chained from a
// previous Velocity() call then grab the animations it's related to.
w=c(this),s(this)&&(x=this.velocity.animations)):m?(w=c(y.elements||y.e),h++):i(y)?(w=c([y]),h++):u(y)&&(w=c(y),h++),
// Allow elements to be chained.
w&&(f(w,"velocity",Zt.bind(w)),x&&f(w.velocity,"animations",x));
// Get any options map passed in as arguments first, expand any direct
// options if possible.
var O="reverse"===(
// Next get the propertiesMap and options.
b=m?d(y.properties,y.p):p[h++]),T=!O&&l(b),M=T&&_e[b],q=m?d(y.options,y.o):p[h];a(q)&&(S=q),
// Create the promise if supported and wanted.
Promise&&d(S&&S.promise,v.promise)&&(k=new Promise(function(e,t){E=t,
// IMPORTANT:
// If a resolver tries to run on a Promise then it will wait until
// that Promise resolves - but in this case we're running on our own
// Promise, so need to make sure it's not seen as one. Setting these
// values to <code>undefined</code> for the duration of the resolve.
// Due to being an async call, they should be back to "normal"
// before the <code>.then()</code> function gets called.
_=function(t){if(s(t)){var n=t&&t.then;n&&(t.then=void 0),e(t),n&&(t.then=n)}else e(t)}}),w&&(f(w,"then",k.then.bind(k)),f(w,"catch",k.catch.bind(k)),k.finally&&
// Semi-standard
f(w,"finally",k.finally.bind(k))));var V=d(S&&S.promiseRejectEmpty,v.promiseRejectEmpty);if(k&&(w||T?b||(V?E("Velocity: No properties supplied, if that is deliberate then pass `promiseRejectEmpty:false` as an option. Aborting."):_()):V?E("Velocity: No elements supplied, if that is deliberate then pass `promiseRejectEmpty:false` as an option. Aborting."):_()),!w&&!T||!b)return k;
// NOTE: Can't use isAction here due to type inference - there are callbacks
// between so the type isn't considered safe.
if(T){for(var A=[],N=k&&{_promise:k,_resolver:_,_rejecter:E};h<p.length;)A.push(p[h++]);
// Velocity's behavior is categorized into "actions". If a string is
// passed in instead of a propertiesMap then that will call a function
// to do something special to the animation linked.
// There is one special case - "reverse" - which is handled differently,
// by being stored on the animation and then expanded when the animation
// starts.
var L=b.replace(/\..*$/,""),J=g[L];if(J){var C=J(A,w,N,b);return void 0!==C?C:w||k}if(!M)return void console.error("VelocityJS: First argument ("+b+") was not a property map, a known action, or a registered redirect. Aborting.")}var I=void 0;if(a(b)||O||M){
/**
           * The options for this set of animations.
           */
var j={},B=v.sync;
// Now check the optionsMap
if(
// Private options first - set as non-enumerable, and starting with an
// underscore so we can filter them out.
k&&(f(j,"_promise",k),f(j,"_rejecter",E),f(j,"_resolver",_)),f(j,"_ready",0),f(j,"_started",0),f(j,"_completed",0),f(j,"_total",0),a(S)){var Z=R(S.duration);I=void 0!==Z,j.duration=d(Z,v.duration),j.delay=d(H(S.delay),v.delay),
// Need the extra fallback here in case it supplies an invalid
// easing that we need to overrride with the default.
j.easing=W(d(S.easing,v.easing),j.duration)||W(v.easing,j.duration),j.loop=d(z(S.loop),v.loop),j.repeat=j.repeatAgain=d(G(S.repeat),v.repeat),null!=S.speed&&(j.speed=d(Q(S.speed),1)),n(S.promise)&&(j.promise=S.promise),j.queue=d($(S.queue),v.queue),S.mobileHA&&!be.isGingerbread&&(
/* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
                   on animating elements. HA is removed from the element at the completion of its animation. */
/* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
/* Note: You can read more about the use of mobileHA in Velocity's documentation: velocity-animate/#mobileHA. */
j.mobileHA=!0),O||(null!=S.display&&(b.display=S.display,console.error('Deprecated "options.display" used, this is now a property:',S.display)),null!=S.visibility&&(b.visibility=S.visibility,console.error('Deprecated "options.visibility" used, this is now a property:',S.visibility)));
// TODO: Allow functional options for different options per element
var Y=P(S.begin),X=F(S.complete),K=function(e){if(r(e))return e;null!=e&&console.warn("VelocityJS: Trying to set 'progress' to an invalid value:",e)}(S.progress),ee=D(S.sync);null!=Y&&(j.begin=Y),null!=X&&(j.complete=X),null!=K&&(j.progress=K),null!=ee&&(B=ee)}else if(!m){
// Expand any direct options if possible.
var te=R(p[h],!0),ne=0;if(I=void 0!==te,void 0!==te&&(ne++,j.duration=te),!r(p[h+ne])){
// Despite coming before Complete, we can't pass a fn easing
var re=W(p[h+ne],d(j&&R(j.duration),v.duration),!0);void 0!==re&&(ne++,j.easing=re)}var ie=F(p[h+ne],!0);void 0!==ie&&(j.complete=ie),j.loop=v.loop,j.repeat=j.repeatAgain=v.repeat}if(O&&!1===j.queue)throw new Error("VelocityJS: Cannot reverse a queue:false animation.");M&&!I&&M.duration&&(j.duration=M.duration);
// When a set of elements is targeted by a Velocity call, the set is
// broken up and each element has the current Velocity call individually
// queued onto it. In this way, each element's existing queue is
// respected; some elements may already be animating and accordingly
// should not have this current Velocity call triggered immediately
// unless the sync:true option is used.
var oe={options:j,elements:w,_prev:void 0,_next:void 0,_flags:B?32/* SYNC */:0,percentComplete:0,ellapsedTime:0,timeStart:0};x=[];var ae=!0,le=!1,se=void 0;try{for(var ue,ce=w[Symbol.iterator]();!(ae=(ue=ce.next()).done);ae=!0){var fe=ue.value,de=0;if(i(fe)){
// TODO: This needs to check for valid animation targets, not just Elements
if(O){var ve=me(fe).lastAnimationList[j.queue];if(!(b=ve&&ve.tweens)){console.error("VelocityJS: Attempting to reverse an animation on an element with no previous animation:",fe);continue}de|=64/* REVERSE */&~(64/* REVERSE */&ve._flags)}var pe=Object.assign({},oe,{element:fe,_flags:oe._flags|de});j._total++,x.push(pe),M?Ut(pe,M):O?
// In this case we're using the previous animation, so
// it will be expanded correctly when that one runs.
pe.tweens=b:(pe.tweens=Object.create(null),$e(pe,b)),xe(fe,pe,j.queue)}}}catch(e){le=!0,se=e}finally{try{!ae&&ce.return&&ce.return()}finally{if(le)throw se}}!1===be.isTicking&&
// If the animation tick isn't running, start it. (Velocity shuts it
// off when there are no active calls to process.)
ut(!1),x&&f(w.velocity,"animations",x)}
/***************
       Chaining
       ***************/
/* Return the elements back to the call chain, with wrapped elements taking precedence in case Velocity was called via the $.fn. extension. */return w||k}
// Project
/**
   * Used to patch any object to allow Velocity chaining. In order to chain an
   * object must either be treatable as an array - with a <code>.length</code>
   * property, and each member a Node, or a Node directly.
   *
   * By default Velocity will try to patch <code>window</code>,
   * <code>jQuery</code>, <code>Zepto</code>, and several classes that return
   * Nodes or lists of Nodes.
   */function Yt(e,t){try{f(e,(t?"V":"v")+"elocity",Zt)}catch(e){console.warn("VelocityJS: Error when trying to add prototype.",e)}}
// Project
y(["registerSequence",function e(t){if(a(t[0]))for(var n in t[0])t[0].hasOwnProperty(n)&&e([n,t[0][n]]);else if(l(t[0])){var r=t[0],i=t[1];if(l(r))if(a(i)){_e[r]&&console.warn("VelocityJS: Replacing named sequence:",r);var s={},u=new Array(100),c=[],f=_e[r]={},d=R(i.duration);for(var v in f.tweens={},o(d)&&(f.duration=d),i)if(i.hasOwnProperty(v)){var p=String(v).match(Dt);if(p){var g=!0,y=!1,h=void 0;try{for(var w,b=p[Symbol.iterator]();!(g=(w=b.next()).done);g=!0){var S=w.value,x="from"===S?0:"to"===S?100:parseFloat(S);if(x<0||x>100)console.warn("VelocityJS: Trying to use an invalid value as a percentage (0 <= n <= 100):",r,x);else if(isNaN(x))console.warn("VelocityJS: Trying to use an invalid number as a percentage:",r,v,S);else for(var k in s[String(x)]||(s[String(x)]=[]),s[String(x)].push(v),i[v])c.includes(k)||c.push(k)}}catch(e){y=!0,h=e}finally{try{!g&&b.return&&b.return()}finally{if(y)throw h}}}}var _=Object.keys(s).sort(function(e,t){var n=parseFloat(e),r=parseFloat(t);return n>r?1:n<r?-1:0});_.forEach(function(e){u.push.apply(s[e])});var E=!0,O=!1,T=void 0;try{for(var M,q=c[Symbol.iterator]();!(E=(M=q.next()).done);E=!0){var V=M.value,A=[],N=Ae(V),L=!0,J=!1,C=void 0;try{for(var I,j=_[Symbol.iterator]();!(L=(I=j.next()).done);L=!0){var P=I.value,F=!0,H=!1,B=void 0;try{for(var z,$=s[P][Symbol.iterator]();!(F=(z=$.next()).done);F=!0){var G=i[z.value];G[N]&&A.push(l(G[N])?G[N]:G[N][0])}}catch(e){H=!0,B=e}finally{try{!F&&$.return&&$.return()}finally{if(H)throw B}}}}catch(e){J=!0,C=e}finally{try{!L&&j.return&&j.return()}finally{if(J)throw C}}if(A.length){var Q=De(A,N),D=0;if(Q){var U=!0,Z=!1,Y=void 0;try{for(var X,K=_[Symbol.iterator]();!(U=(X=K.next()).done);U=!0){var ee=X.value,te=!0,ne=!1,re=void 0;try{for(var ie,oe=s[ee][Symbol.iterator]();!(te=(ie=oe.next()).done);te=!0){var ae=i[ie.value][N];ae&&(Array.isArray(ae)&&ae.length>1&&(l(ae[1])||Array.isArray(ae[1]))&&(Q[D].easing=W(ae[1],f.duration||m)),Q[D++].percent=parseFloat(ee)/100)}}catch(e){ne=!0,re=e}finally{try{!te&&oe.return&&oe.return()}finally{if(ne)throw re}}}}catch(e){Z=!0,Y=e}finally{try{!U&&K.return&&K.return()}finally{if(Z)throw Y}}f.tweens[N]=Q}}}}catch(e){O=!0,T=e}finally{try{!E&&q.return&&q.return()}finally{if(O)throw T}}}else console.warn("VelocityJS: Trying to set 'registerSequence' sequence to an invalid value:",r,i);else console.warn("VelocityJS: Trying to set 'registerSequence' name to an invalid value:",r)}}],!0);var Xt,Kt=Zt;
/**
   * These parts of Velocity absolutely must be included, even if they're unused!
   */
/******************
   Unsupported
   ******************/
if(function(e){
/**
       * Actions cannot be replaced if they are internal (hasOwnProperty is false
       * but they still exist). Otherwise they can be replaced by users.
       *
       * All external method calls should be using actions rather than sub-calls
       * of Velocity itself.
       */
e.Actions=g,
/**
       * Our known easing functions.
       */
e.Easings=w,
/**
       * The currently registered sequences.
       */
e.Sequences=_e,
/**
       * Current internal state of Velocity.
       */
e.State=be,// tslint:disable-line:no-shadowed-variable
/**
       * Velocity option defaults, which can be overriden by the user.
       */
e.defaults=U,
/**
       * Used to patch any object to allow Velocity chaining. In order to chain an
       * object must either be treatable as an array - with a <code>.length</code>
       * property, and each member a Node, or a Node directly.
       *
       * By default Velocity will try to patch <code>window</code>,
       * <code>jQuery</code>, <code>Zepto</code>, and several classes that return
       * Nodes or lists of Nodes.
       */
e.patch=Yt,
/**
       * Set to true, 1 or 2 (most verbose) to output debug info to console.
       */
e.debug=!1,
/**
       * In mock mode, all animations are forced to complete immediately upon the
       * next rAF tick. If there are further animations queued then they will each
       * take one single frame in turn. Loops and repeats will be disabled while
       * <code>mock = true</code>.
       */
e.mock=!1,
/**
       * Save our version number somewhere visible.
       */
e.version="2.0.3",
/**
       * Added as a fallback for "import {Velocity} from 'velocity-animate';".
       */
e.Velocity=Zt}(Xt||(Xt={})),function(){if(document.documentMode)return document.documentMode;for(var e=7;e>4;e--){var t=document.createElement("div");if(t.innerHTML="\x3c!--[if IE "+e+"]><span></span><![endif]--\x3e",t.getElementsByTagName("span").length)return t=null,e}}()<=8)throw new Error("VelocityJS cannot run on Internet Explorer 8 or earlier");
/******************
   Frameworks
   ******************/if(window){
/*
       * Both jQuery and Zepto allow their $.fn object to be extended to allow
       * wrapped elements to be subjected to plugin calls. If either framework is
       * loaded, register a "velocity" extension pointing to Velocity's core
       * animate() method. Velocity also registers itself onto a global container
       * (window.jQuery || window.Zepto || window) so that certain features are
       * accessible beyond just a per-element scope. Accordingly, Velocity can
       * both act on wrapped DOM elements and stand alone for targeting raw DOM
       * elements.
       */
var en=window.jQuery,tn=window.Zepto;Yt(window,!0),Yt(Element&&Element.prototype),Yt(NodeList&&NodeList.prototype),Yt(HTMLCollection&&HTMLCollection.prototype),Yt(en,!0),Yt(en&&en.fn),Yt(tn,!0),Yt(tn&&tn.fn)}
// Make sure that the values within Velocity are read-only and upatchable.
var nn=function(t){if(Xt.hasOwnProperty(t))switch(void 0===t?"undefined":e(t)){case"number":case"boolean":f(Kt,t,{get:function(){return Xt[t]},set:function(e){Xt[t]=e}},!0);break;default:f(Kt,t,Xt[t],!0)}};for(var rn in Xt)nn(rn);return Kt});
