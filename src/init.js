/****************
     Summary
****************/

/*
Velocity is a concise CSS manipulation library with a performant animation stack built on top of it. To minimize DOM interaction, Velocity reuses previous animation values and batches DOM queries.
Whenever Velocity triggers a DOM query (a GET) or a DOM update (a SET), a comment indicating such is placed next to the offending line of code.
To learn more about the nuances of DOM performance, check out these talks: https://www.youtube.com/watch?v=cmZqLzPy0XE and https://www.youtube.com/watch?v=n8ep4leoN9A

Velocity is structured into four sections:
- CSS Stack: Works independently from the rest of Velocity.
- $.fn.velocity is the jQuery object extension that, when triggered, iterates over the targeted element set and queues the incoming Velocity animation onto each element individually. This process consists of:
  - Pre-Queueing: Prepare the element for animation by instantiating its data cache and processing the call's options argument.
  - Queueing: The logic that runs once the call has reached its point of execution in the element's $.queue() stack. Most logic is placed here to avoid risking it becoming stale.
  - Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
- Tick: The single requestAnimationFrame loop responsible for tweening all in-progress calls.
- completeCall: Handles the cleanup process for each Velocity call.

Note: To interoperate with jQuery, Velocity uses jQuery's own $.queue() stack for queuing logic.
Note: The biggest cause of both codebase bloat and codepath obfuscation in Velocity is its support for animating individual properties in compound-value properties (e.g. "textShadowBlur" in "textShadow: 0px 0px 0px black").
*/

;(function (global, document, undefined) {  

    /*********************
       Helper Functions
    *********************/

    /* IE detection. Gist: https://gist.github.com/julianshapiro/9098609 */
    var IE = (function() { 
        if (document.documentMode) {
            return document.documentMode;
        } else {
            for (var i = 7; i > 4; i--) {
                var div = document.createElement("div");

                div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";

                if (div.getElementsByTagName("span").length) {
                    div = null;

                    return i;
                }
            }
        }

        return undefined;
    })();


    /********************
      Library integration
     ********************/
    function exportVelocity() {
        global.velocity = velocity;

        if(window.jQuery || window.Zepto) {
            $.fn.velocity = velocity.animate;
        }
    }

    /* RAF polyfill. Gist: https://gist.github.com/julianshapiro/9497513 */
    var requestAnimationFrame = window.requestAnimationFrame || (function() { 
        var timeLast = 0;

        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {                
            var timeCurrent = (new Date()).getTime(),
                timeDelta;

            /* Dynamically set delay on a per-tick basis to match 60fps. */
            /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
            timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
            timeLast = timeCurrent + timeDelta;

            return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
        };
    })();

    /* Sparse array compacting. Copyright Lo-Dash. MIT License: https://github.com/lodash/lodash/blob/master/LICENSE.txt */
    function compactSparseArray (array) {
        var index = -1,
            length = array ? array.length : 0,
            result = [];

        while (++index < length) {
            var value = array[index];

            if (value) {
                result.push(value);
            }
        }

        return result;
    }

    /* Determine if a variable is a function. */
    function isFunction (variable) {
        return Object.prototype.toString.call(variable) === "[object Function]";
    }

    /* Determine if a variable is an array. */
    function isArray (variable) {
        return Object.prototype.toString.call(variable) === "[object Array]";
    }

    /****************
        Aborting
    ****************/

    /* Nothing prevents Velocity from working on IE6+7, but it is not worth the time to test on them. Simply revert to jQuery (and lose Velocity's extra features). */
    if (IE <= 7 && window.jQuery) {
        /* Revert to $.animate() and abort this Velocity declaration. */
        velocity = $.fn.animate;

        exportVelocity();

        return;
    } else if (global.velocity !== undefined) {
        console.log("Velocity is already loaded or its namespace is occupied.");

        return;
    } 

    /*****************
        Constants
    *****************/

    var NAME = "velocity";