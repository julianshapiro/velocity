/*
 * VelocityJS.org (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import {State as IState} from "../../index.d";
import {CLASSNAME} from "../constants";

const isClient = window && window === window.window,
	windowScrollAnchor = isClient && window.pageYOffset !== undefined;

export const State: IState = {
	isClient,
	isMobile: isClient && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
	isAndroid: isClient && /Android/i.test(navigator.userAgent),
	isGingerbread: isClient && /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
	isChrome: isClient && (window as any).chrome,
	isFirefox: isClient && /Firefox/i.test(navigator.userAgent),
	prefixElement: isClient && document.createElement("div"),
	windowScrollAnchor,
	scrollAnchor: windowScrollAnchor ? window : (!isClient || document.documentElement || document.body.parentNode || document.body),
	scrollPropertyLeft: windowScrollAnchor ? "pageXOffset" : "scrollLeft",
	scrollPropertyTop: windowScrollAnchor ? "pageYOffset" : "scrollTop",
	className: CLASSNAME,
	isTicking: false,
	first: undefined,
	last: undefined,
	firstNew: undefined,
};
