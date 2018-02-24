///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Get or set a property from one or more elements.
 */

namespace VelocityStatic {

	/**
	 * Expose a style shortcut - can't be used with chaining, but might be of
	 * use to people.
	 */
	export function tween(elements: HTMLorSVGElement[], percentComplete: number, properties: VelocityProperties, easing?: VelocityEasingType);
	export function tween(elements: HTMLorSVGElement[], percentComplete: number, propertyName: string, property: VelocityProperty, easing?: VelocityEasingType);
	export function tween(elements: HTMLorSVGElement[], percentComplete: number, properties: VelocityProperties | string, property?: VelocityProperty | VelocityEasingType, easing?: VelocityEasingType) {
		return tweenAction(arguments as any, elements);
	}

	/**
	 * 
	 */
	function tweenAction(args?: any[], elements?: HTMLorSVGElement[], promiseHandler?: VelocityPromise, action?: string): any {
		let requireForcefeeding: boolean;

		if (!elements) {
			if (!args.length) {
				console.info("Velocity(<element>, \"tween\", percentComplete, property, end | [end, <easing>, <start>], <easing>) => value\n"
					+ "Velocity(<element>, \"tween\", percentComplete, {property: end | [end, <easing>, <start>], ...}, <easing>) => {property: value, ...}");
				return null;
			}
			elements = [document.body];
			requireForcefeeding = true;
		} else if (elements.length !== 1) {
			// TODO: Allow more than a single element to return an array of results
			throw new Error("VelocityJS: Cannot tween more than one element!");
		}
		const percentComplete: number = args[0],
			fakeAnimation = {
				elements: elements,
				element: elements[0],
				queue: false,
				options: {
					duration: 1000
				},
				tweens: null as {[property: string]: VelocityTween}
			},
			result: {[property: string]: string} = {};
		let properties: VelocityProperties = args[1],
			singleResult: boolean,
			easing: VelocityEasingType = args[2],
			count = 0;

		if (isString(args[1])) {
			singleResult = true;
			properties = {
				[args[1]]: args[2]
			};
			easing = args[3];
		} else if (Array.isArray(args[1])) {
			singleResult = true;
			properties = {
				"tween": args[1]
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
				if (properties.hasOwnProperty(property) && (!Array.isArray(properties[property]) || properties[property].length < 2)) {
					throw new Error("VelocityJS: When not supplying an element you must force-feed values: " + property);
				}
			}
		}
		const activeEasing = validateEasing(getValue(easing, defaults.easing), 1000);

		expandProperties(fakeAnimation as AnimationCall, properties);
		for (const property in fakeAnimation.tweens) {
			// For every element, iterate through each property.
			const tween = fakeAnimation.tweens[property],
				easing = tween.easing || activeEasing,
				pattern = tween.pattern;
			let currentValue = "";

			count++;
			if (pattern) {
				for (let i = 0; i < pattern.length; i++) {
					const startValue = tween.start[i];

					if (startValue == null) {
						currentValue += pattern[i];
					} else {
						const result = easing(percentComplete, startValue as number, tween.end[i] as number, property)

						currentValue += pattern[i] === true ? Math.round(result) : result;
					}
				}
			}
			result[property] = currentValue;
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

	registerAction(["tween", tweenAction], true);
}
