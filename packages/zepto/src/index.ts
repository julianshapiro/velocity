/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { patch } from "@velocityjs/core";

const Zepto: { fn: any } = (window as any)?.Zepto;

patch(Zepto, true);
patch(Zepto?.fn);
