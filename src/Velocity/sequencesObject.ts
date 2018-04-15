/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import {Sequence} from "../../index.d";

export const SequencesObject: {[name: string]: SequenceList} = {};

export interface SequenceList {
	duration: number;
	tweens: {[property in keyof CSSStyleDeclaration]?: Sequence};
}
