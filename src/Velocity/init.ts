namespace VelocityStatic {
	/* For legacy support, also expose the literal animate method. */
	export var animate = Velocity;

	/* A shim of the jQuery utility functions used by Velocity -- provided by Velocity's optional jQuery shim. */
	export var Utilities = $;

	/* A design goal of Velocity is to cache data wherever possible in order to avoid DOM requerying. Accordingly, each element has a data cache. */
	export function init(element: HTMLorSVGElement) {
		Data(element, {
			/* Store whether this is an SVG element, since its properties are retrieved and updated differently than standard HTML elements. */
			isSVG: isSVG(element),
			/* Keep track of whether the element is currently being animated by Velocity.
			 This is used to ensure that property values are not transferred between non-consecutive (stale) calls. */
			isAnimating: false,
			/* A reference to the element's live computedStyle object. Learn more here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
			computedStyle: null,
			/* Tween data is cached for each animation on the element so that data can be passed across calls --
			 in particular, end values are used as subsequent start values in consecutive Velocity calls. */
			tweensContainer: null,
			/* The full root property values of each CSS hook being animated on this element are cached so that:
			 1) Concurrently-animating hooks sharing the same root can have their root values' merged into one while tweening.
			 2) Post-hook-injection root values can be transferred over to consecutively chained Velocity calls as starting root values. */
			rootPropertyValueCache: {},
			/* A cache for transform updates, which must be manually flushed via vVelocityStatic.CSS.flushTransformCache(). */
			transformCache: {}
		});
	}
};
