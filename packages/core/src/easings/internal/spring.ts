/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Bounce easings, based on code from https://github.com/yuichiroharai/easeplus-velocity
 */

import { registerEasing } from "../registerEasings";

/**
 * A less exaggerated version of easeInOutElastic.
 */
export const easeSpring = (percentComplete: number, startValue: number, endValue: number) =>
	startValue + (1 - (Math.cos(percentComplete * 4.5 * Math.PI) * Math.exp(-percentComplete * 6))) * (endValue - startValue);

registerEasing("spring", easeSpring);
