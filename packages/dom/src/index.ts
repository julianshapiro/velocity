/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { patch } from "@velocityjs/core";

patch(window, true);
patch(Element?.prototype);
patch(NodeList?.prototype);
patch(HTMLCollection?.prototype);
