/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Get or set a property from one or more elements.
 */

import {
	AnimationCall,
	Properties,
	Sequence,
	SequenceList,
	TweenStep,
} from "../velocity";
import { isNumber, isPlainObject, isString } from "../types";
import { defaults } from "../core/defaults";
import { easeLinear, validateEasing } from "../easings";
import { expandSequence } from "../core/sequences";
import { SequencesObject } from "../core/sequencesObject";
import { expandProperties } from "../core/tweens";
import { registerAction } from "./registerAction";
import { DEFAULT_DURATION } from "../constants";
import { IActionThis } from "./actionsObject";
import { EasingType } from "../velocity";

/**
 *
 */
function tweenAction(this: IActionThis, args: any[]): any {
	let { elements } = this;
	let requireForcefeeding = false;

	if (!elements) {
		if (!args.length) {
			console.info(`Velocity(<element>, "tween", percentComplete, property, end | [end, <easing>, <start>], <easing>) => value
Velocity(<element>, "tween", percentComplete, {property: end | [end, <easing>, <start>], ...}, <easing>) => {property: value, ...}`);

			return null;
		}
		elements = [document.body];
		requireForcefeeding = true;
	} else if (elements.length !== 1) {
		// TODO: Allow more than a single element to return an array of results
		throw new Error("VelocityJS: Cannot tween more than one element!");
	}
	const percentComplete: number = args[0];
	const fakeAnimation = {
		elements,
		element: elements[0],
		queue: false,
		options: {
			duration: 1000,
		},
		tweens: null as any as Record<string, Sequence>,
	} as any as AnimationCall;
	const result: Record<string, string> = {};
	let properties: Properties<string> = args[1];
	let singleResult = false;
	let maybeSequence: SequenceList | undefined;
	let easing: EasingType = args[2];
	let count = 0;

	if (isString(args[1])) {
		if (SequencesObject?.[args[1]]) {
			maybeSequence = SequencesObject[args[1]];
			properties = {};
			easing = args[2];
		} else {
			singleResult = true;
			properties = {
				[args[1]]: args[2],
			};
			easing = args[3];
		}
	} else if (Array.isArray(args[1])) {
		singleResult = true;
		properties = {
			tween: args[1],
		} as any;
		easing = args[2];
	}
	if (!isNumber(percentComplete) || percentComplete < 0 || percentComplete > 1) {
		throw new Error("VelocityJS: Must tween a percentage from 0 to 1!");
	}
	if (!isPlainObject(properties)) {
		throw new Error("VelocityJS: Cannot tween an invalid property!");
	}
	if (requireForcefeeding) {
		for (const property in properties) {
			if (properties.hasOwnProperty(property) && (!Array.isArray(properties[property]) || properties[property]!.length < 2)) {
				throw new Error("VelocityJS: When not supplying an element you must force-feed values: " + property);
			}
		}
	}
	const activeEasing = validateEasing(easing ?? defaults.easing, DEFAULT_DURATION);

	if (maybeSequence) {
		expandSequence(fakeAnimation, maybeSequence!);
	} else {
		expandProperties(fakeAnimation as AnimationCall, properties);
	}
	// tslint:disable-next-line:forin
	for (const property in fakeAnimation.tweens) {
		// For every element, iterate through each property.
		const propertyTween = fakeAnimation.tweens[property];
		const sequence = propertyTween.sequence!;
		const pattern = sequence.pattern;
		let currentValue = "";
		let i = 0;

		count++;
		if (pattern) {
			const easingComplete = (propertyTween.easing || activeEasing!)(percentComplete, 0, 1, property);
			let best = 0;

			for (let j = 0; j < sequence.length - 1; j++) {
				if (sequence[j].percent! < easingComplete) {
					best = j;
				}
			}
			const tweenFrom: TweenStep = sequence[best];
			const tweenTo: TweenStep = sequence[best + 1] || tweenFrom;
			const tweenPercent = (percentComplete - tweenFrom.percent!) / (tweenTo.percent! - tweenFrom.percent!);
			const tweenEasing = tweenTo.easing ?? easeLinear;

			for (; i < pattern.length; i++) {
				const startValue = tweenFrom[i];

				if (startValue == null) {
					currentValue += pattern[i];
				} else {
					const endValue = tweenTo[i];

					if (startValue === endValue) {
						currentValue += startValue;
					} else {
						// All easings must deal with numbers except for our internal ones.
						const value = tweenEasing(tweenPercent, startValue as number, endValue as number, property);

						currentValue += pattern[i] === true ? Math.round(value) : value;
					}
				}
			}
			result[property] = currentValue;
		}
	}

	if (singleResult && count === 1) {
		for (const property in result) {
			if (result.hasOwnProperty(property)) {
				return result[property];
			}
		}
	}

	return result;
}

registerAction("tween", tweenAction, true, true);
