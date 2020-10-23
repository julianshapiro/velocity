/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { AnimationCall, SequenceList, VelocityTween } from "../velocity";
import { Velocity } from "../velocity";
import { getNormalization } from "../normalizations";

export function expandSequence(animation: AnimationCall, sequence: SequenceList) {
	const tweens = animation.tweens = Object.create(null);
	const element = animation.element;

	for (const propertyName in sequence.tweens) {
		if (sequence.tweens.hasOwnProperty(propertyName)) {
			const fn = getNormalization(element!, propertyName);

			if (!fn && propertyName !== "tween") {
				if (Velocity.debug) {
					console.log(`Skipping [${propertyName}] due to a lack of browser support.`);
				}
				continue;
			}
			tweens[propertyName] = {
				fn,
				sequence: sequence.tweens[propertyName],
			} as VelocityTween;
		}
	}
}
