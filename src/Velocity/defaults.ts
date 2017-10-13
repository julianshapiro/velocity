/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Velocity option defaults, which can be overriden by the user.
 */

namespace VelocityStatic {
	export let defaults: VelocityOptions = {
		queue: "",
		duration: DURATION_DEFAULT,
		easing: EASING_DEFAULT,
		mobileHA: true,
		/* Advanced: Set to false to prevent property values from being cached between consecutive Velocity-initiated chain calls. */
		cache: true,
		/* Advanced: Set to false if the promise should always resolve on empty element lists. */
		promiseRejectEmpty: true
	};
};