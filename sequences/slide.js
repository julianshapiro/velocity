

/***********************
   Packaged Sequences
***********************/

/* slideUp, slideDown */
$.each([ "Down", "Up" ], function(i, direction) {
    /* Generate the slide sequences dynamically in order to minimize code redundancy. */
    velocity.Sequences["slide" + direction] = function (element, options) {
        var opts = $.extend({}, options),
            originalValues = {
                height: null,
                marginTop: null,
                marginBottom: null,
                paddingTop: null,
                paddingBottom: null,
                overflow: null,
                overflowY: null
            },
            /* The slide functions make use of the begin and complete callbacks, so the user's custom callbacks are stored for triggering when slideDown/Up's logic has completed. */
            begin = opts.begin,
            complete = opts.complete;

        /* Unless the user is trying to override the display option, show the element before slideDown begins and hide the element after slideUp completes. */
        if (direction === "Down") {
            /* All elements subjected to sliding are switched to the "block" display value -- as opposed to an element-appropriate block/inline distinction -- because inline elements cannot have their dimensions modified. */
            opts.display = opts.display || "block";
        } else {
            opts.display = opts.display || "none";
        }

        /* Begin callback. */
        opts.begin = function () {
            if (direction === "Down") {
                originalValues.overflow = [ velocity.CSS.getPropertyValue(element, "overflow"), 0 ];
                originalValues.overflowY = [ velocity.CSS.getPropertyValue(element, "overflowY"), 0 ];

                /* Remove scrollbars and momentarily set the element's height to "auto" so that its natural height can be calculated. */
                element.style.overflow = "hidden";
                element.style.overflowY = "hidden";

                element.style.height = "auto";
                element.style.display = "block";

                /* Cache the elements' original vertical dimensional values so that we can animate back to them from starting values of 0. */
                for (var property in originalValues) {
                    /* Overflow values have already been cached, do not overrwrite them with "hidden", which they were just set to. */
                    if (/^overflow/.test(property)) {
                        continue;
                    }

                    /* Use forcefeeding to animate slideDown properties from 0. */
                    originalValues[property] = [ velocity.CSS.getPropertyValue(element, property), 0 ];
                }

                /* Hide the element inside this begin callback, otherwise it'll momentarily flash itself before the actual animation tick begins. */
                element.style.display = "none";
            } else {
                for (var property in originalValues) {
                    /* Use forcefeeding to animate slideUp properties toward 0. */
                    originalValues[property] = [ 0, velocity.CSS.getPropertyValue(element, property) ];
                }

                /* As with slideDown, slideUp hides the element's scrollbars while animating since scrollbar height tweening looks unappealing. */
                element.style.overflow = "hidden";
                element.style.overflowY = "hidden";
            }

            /* If the user passed in a begin callback, fire it now. */
            if (begin) {
                begin.call(element, element);
            }
        }

        /* Complete callback. */
        opts.complete = function (element) {
            /* Reset the element to its original values once its slide animation is complete. (For slideDown, overflow values are reset. For slideUp, all values are reset (since they were animated to 0).) */
            for (var property in originalValues) {
                element.style[property] = originalValues[property][direction === "Down" ? 0 : 1];
            }

            /* If the user passed in a complete callback, fire it now. */
            if (complete) {
                complete.call(element, element);
            }
        };

        /* Animation triggering. */
        velocity.animate(element, originalValues, opts);
    };
});

/* fadeIn, fadeOut */
$.each([ "In", "Out" ], function(i, direction) {
    /* Generate the slide sequences dynamically in order to minimize code redundancy. */
    velocity.Sequences["fade" + direction] = function (element, options, elementsIndex, elementsSize) {
        var opts = $.extend({}, options),
            propertiesMap = {
                opacity: (direction === "In") ? 1 : 0
            };

        /* Since sequences are triggered individually for each element in the animated set, we avoid repeatedly triggering callbacks by firing them only when the final element is reached. */
        if (elementsIndex !== elementsSize - 1) {
            opts.complete = opts.begin = null;
        }

        /* If a display value was passed into the sequence, use it. Otherwise, default to "none" for fadeOut and default to the element-specific default value for fadeIn. */
        if (!opts.display) {
            opts.display = (direction === "In") ? velocity.CSS.Values.getDisplayType(element) : "none";
        }

        velocity.animate(this, propertiesMap, opts);
    };     
});