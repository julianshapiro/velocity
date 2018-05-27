/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Constants and defaults. These values should never change without a MINOR
 * version bump.
 */

/**
 * Without this it will only un-prefix properties that have a valid "normal"
 * version.
 */
export const ALL_VENDOR_PREFIXES = true;

export const DURATION_FAST = 200;
export const DURATION_NORMAL = 400;
export const DURATION_SLOW = 600;

export const FUZZY_MS_PER_SECOND = 980;

export const DEFAULT_CACHE = true;
export const DEFAULT_DELAY = 0;
export const DEFAULT_DURATION = DURATION_NORMAL;
export const DEFAULT_EASING = "swing";
export const DEFAULT_FPSLIMIT = 60;
export const DEFAULT_LOOP = 0;
export const DEFAULT_PROMISE = true;
export const DEFAULT_PROMISE_REJECT_EMPTY = true;
export const DEFAULT_QUEUE = "";
export const DEFAULT_REPEAT = 0;
export const DEFAULT_SPEED = 1;
export const DEFAULT_SYNC = true;

export const CLASSNAME = "velocity-animating";

export const Duration = {
	fast: DURATION_FAST,
	normal: DURATION_NORMAL,
	slow: DURATION_SLOW,
};
