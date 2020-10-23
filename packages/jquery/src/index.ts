/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { patch } from "@velocityjs/core";

const jQuery: { fn: any } = (window as any)?.jQuery;

patch(jQuery, true);
patch(jQuery?.fn);
