/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Get or set a property from one or more elements.
 */

// Project
import {registerAction} from "./actions";
import {propertyAction} from "./property";

registerAction(["style", propertyAction], true);
