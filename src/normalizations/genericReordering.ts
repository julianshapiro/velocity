///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import {getPropertyValue} from "../css/getPropertyValue";
import {ColorNames} from "../css/fixColors";
import {registerNormalization} from "./normalizations";

export function genericReordering(element: HTMLorSVGElement): string;
export function genericReordering(element: HTMLorSVGElement, propertyValue: string): boolean;
export function genericReordering(element: HTMLorSVGElement, propertyValue?: string): string | boolean {
  if (propertyValue === undefined) {
    propertyValue = getPropertyValue(element, "textShadow");
    const split = propertyValue.split(/\s/g),
      firstPart = split[0];
    let newValue = "";

    if (ColorNames[firstPart]) {
      split.shift();
      split.push(firstPart);
      newValue = split.join(" ");
    } else if (firstPart.match(/^#|^hsl|^rgb|-gradient/)) {
      const matchedString = propertyValue.match(/(hsl.*\)|#[\da-fA-F]+|rgb.*\)|.*gradient.*\))\s/g)[0];

      newValue = propertyValue.replace(matchedString, "") + " " + matchedString.trim();
    } else {
      newValue = propertyValue;
    }
    return newValue;
  }
  return false;
}

registerNormalization([Element, "textShadow", genericReordering]);
