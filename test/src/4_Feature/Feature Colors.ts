/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {getTarget} from "../utilities";
import "./_module";

QUnit.skip("Colors (Shorthands)", (assert) => {
	const $target = getTarget();

	Velocity($target, {borderColor: "#7871c2", color: ["#297dad", "spring", "#5ead29"]});

	//	assert.equal(Data($target).style.borderColorRed.endValue, 120, "Hex #1a component.");
	//	assert.equal(Data($target).style.borderColorGreen.endValue, 113, "Hex #1b component.");
	//	assert.equal(Data($target).style.borderColorBlue.endValue, 194, "Hex #1c component.");
	//	assert.equal(Data($target).style.colorRed.easing, "spring", "Per-property easing.");
	//	assert.equal(Data($target).style.colorRed.startValue, 94, "Forcefed hex #2a component.");
	//	assert.equal(Data($target).style.colorGreen.startValue, 173, "Forcefed hex #2b component.");
	//	assert.equal(Data($target).style.colorBlue.startValue, 41, "Forcefed hex #2c component.");
	//	assert.equal(Data($target).style.colorRed.endValue, 41, "Hex #3a component.");
	//	assert.equal(Data($target).style.colorGreen.endValue, 125, "Hex #3b component.");
	//	assert.equal(Data($target).style.colorBlue.endValue, 173, "Hex #3c component.");
});
