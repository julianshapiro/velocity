/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Bounce easings, based on code from https://github.com/yuichiroharai/easeplus-velocity
 */

import { registerEasing } from "../registerEasings";

/**
 * Swing is the default for jQuery and Velocity.
 */
export const easeSwing = (percentComplete: number, startValue: number, endValue: number) =>
	startValue + (0.5 - Math.cos(percentComplete * Math.PI) / 2) * (endValue - startValue);

registerEasing("swing", easeSwing);
