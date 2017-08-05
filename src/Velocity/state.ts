namespace VelocityStatic {

	/* Container for page-wide Velocity state data. */
	export namespace State {
		export var
			isClient = window && window === window.window,
			/* Detect mobile devices to determine if mobileHA should be turned on. */
			isMobile = isClient && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			/* The mobileHA option's behavior changes on older Android devices (Gingerbread, versions 2.3.3-2.3.7). */
			isAndroid = isClient && /Android/i.test(navigator.userAgent),
			isGingerbread = isClient && /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
			isChrome = isClient && (window as any).chrome,
			isFirefox = isClient && /Firefox/i.test(navigator.userAgent),
			/* Create a cached element for re-use when checking for CSS property prefixes. */
			prefixElement = isClient && document.createElement("div"),
			/* Cache every prefix match to avoid repeating lookups. */
			prefixMatches = {},
			/* Retrieve the appropriate scroll anchor and property name for the browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY */
			windowScrollAnchor = isClient && window.pageYOffset !== undefined,
			/* Cache the anchor used for animating window scrolling. */
			scrollAnchor = windowScrollAnchor ? window : (!isClient || document.documentElement || document.body.parentNode || document.body),
			/* Cache the browser-specific property names associated with the scroll anchor. */
			scrollPropertyLeft = windowScrollAnchor ? "pageXOffset" : "scrollLeft",
			scrollPropertyTop = windowScrollAnchor ? "pageYOffset" : "scrollTop",
			/* Keep track of whether our RAF tick is running. */
			isTicking = false,
			/* Container for every in-progress call to Velocity. */
			first: AnimationCall,
			last: AnimationCall,
			/* First new animation - to shortcut starting them all up and push any css reads to the start of the tick */
			firstNew: AnimationCall
	};
};
