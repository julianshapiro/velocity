/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { KnownElement } from "../velocity";
import { symbolData } from "./data";

/**
 * Delete the internal data store for an element.
 */
export function deleteData<T = KnownElement>(element: T) {
	delete element[symbolData];
}
