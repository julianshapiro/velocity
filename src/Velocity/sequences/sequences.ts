/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.Sequence {
	export const Sequences: {[name: string]: SequenceList} = createEmptyObject();

	type SequenceList = {
		duration: number;
		tweens: {[property in keyof CSSStyleDeclaration]?: Sequence};
	}

	type VelocitySequenceProperty = string | [string] | [string, VelocityEasingType];

	type VelocitySequenceProperties = {
		[property in keyof CSSStyleDeclaration]?: VelocitySequenceProperty;
	};

	type VelocitySequence = {
		duration?: number;
		easing?: VelocityEasingType;
		[percent: number]: VelocitySequenceProperties;
	} | {
			[percent: string]: VelocitySequenceProperties;
		}; // Needs to be like this to prevent warnings.

	const animations: {[name: string]: VelocitySequence} = {
		"bounce": {
			"duration": 1000,
			"0%,20%,53%,80%,100%": {
				transform: ["translate3d(0,0px,0)", "easeOutCubic"]
			},
			"40%,43%": {
				transform: ["translate3d(0,-30px,0)", "easeInQuint"]
			},
			"70%": {
				transform: ["translate3d(0,-15px,0)", "easeInQuint"]
			},
			"90%": {
				transform: "translate3d(0,-4px,0)"
			}
		}
	};

	const rxPercents = /(\d+)/g;

	/**
	 * Used to register a sequence. This should never be called by users
	 * directly, instead it should be called via an action:<br/>
	 * <code>Velocity("registerSequence", "name", VelocitySequence);</code>
	 *
	 * @private
	 */
	export function registerSequence(args?: [string, VelocitySequence] | [{[name: string]: VelocitySequence}]) {
		if (isPlainObject(args[0])) {
			for (let name in (args[0] as {[name: string]: VelocitySequence})) {
				registerSequence([name, args[0][name]]);
			}
		} else if (isString(args[0])) {
			const name = args[0] as string,
				sequence = args[1] as VelocitySequence;

			if (!isString(name)) {
				console.warn("VelocityJS: Trying to set 'registerSequence' name to an invalid value:", name);
			} else if (!isPlainObject(sequence)) {
				console.warn("VelocityJS: Trying to set 'registerSequence' sequence to an invalid value:", name, sequence);
			} else {
				const steps: string[] = new Array(100),
					properties: string[] = [],
					sequenceList: SequenceList = Sequences[name] = createEmptyObject(),
					duration = validateDuration((sequence as any).duration);

				sequenceList.tweens = createEmptyObject();
				if (isNumber(duration)) {
					sequenceList.duration = duration;
				}
				for (let part in sequence) {
					const percents = String(part).match(rxPercents);

					for (let i = 0; percents && i < percents.length; i++) {
						const percent = parseInt(percents[i]);

						if (percent < 0 || percent > 100) {
							console.warn("VelocityJS: Trying to use an invalid value as a percentage:", name, percent);
						} else if (String(percent) != percents[i]) {
							console.warn("VelocityJS: Trying to use a fraction as a percentage:", name, percents[i]);
						} else {
							steps[percent] = part;
							for (let property in sequence[part]) {
								if (property && !_inArray(properties, property)) {
									properties.push(property);
								}
							}
						}
					}
				}
				for (let p = 0; p < properties.length; p++) {
					const property = properties[p],
						parts: string[] = [];

					for (let i = 0; i <= 100; i++) {
						const key = steps[i];

						if (key) {
							const properties: VelocitySequenceProperties = sequence[key];

							const givenProperty: VelocitySequenceProperty = properties[property];

							parts.push(isString(givenProperty)
								? givenProperty
								: givenProperty[0]);
						}
					}
					if (parts.length) {
						const realSequence = findPattern(parts, property);
						console.log("findPattern", parts, property, name)

						if (realSequence) {
							sequenceList.tweens[property] = realSequence;
						}
					}
				}
				//				console.log("sequence", sequenceList)
			}
		}
	}

	registerAction(["registerSequence", registerSequence], true);

	//	setTimeout(() => {
	//		registerSequence([animations]);
	//	}, 1000);
};
