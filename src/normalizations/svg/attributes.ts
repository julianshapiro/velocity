///<reference path="../normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import {isFunction, isString} from "../../types";
import {registerNormalization} from "../normalizations";

/**
 * Get/set an attribute.
 */
export function getAttribute(name: string) {
  return function (element: Element, propertyValue?: string): string | boolean {
    if (propertyValue === undefined) {
      return element.getAttribute(name);
    }
    element.setAttribute(name, propertyValue);
    return true;
  } as VelocityNormalizationsFn;
}

const base = document.createElement("div"),
  rxSubtype = /^SVG(.*)Element$/,
  rxElement = /Element$/;

Object.getOwnPropertyNames(window).forEach(function (globals) {
  const subtype = rxSubtype.exec(globals);

  if (subtype) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", (subtype[1] || "svg").toLowerCase()),
      constructor = element.constructor;

    for (let attribute in element) {
      const value = element[attribute];

      if (isString(attribute)
        && !(attribute[0] === "o" && attribute[1] === "n")
        && attribute !== attribute.toUpperCase()
        && !rxElement.test(attribute)
        && !(attribute in base)
        && !isFunction(value)) {
        // TODO: Should this all be set on the generic SVGElement, it would save space and time, but not as powerful
        registerNormalization([constructor as any, attribute, getAttribute(attribute)]);
      }
    }
  }
});
