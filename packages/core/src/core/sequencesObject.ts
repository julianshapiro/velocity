/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { SequenceList } from "../velocity";
import { Velocity } from "../velocity";
import { defineProperty } from "../utility";

export const SequencesObject: Record<string, SequenceList> = {};

defineProperty(Velocity, "Sequences", SequencesObject);

declare module "../velocity" {
	export interface IStaticVelocity {
		/**
		 * The currently registered sequences.
		 */
		readonly Sequences: typeof SequencesObject;
	}
}
