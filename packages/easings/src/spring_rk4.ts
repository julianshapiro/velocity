/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import {
	EasingFn,
	registerEasingValidator,
	isNumber,
} from "@velocityjs/core";

interface springState {
	x: number;
	v: number;
	tension: number;
	friction: number;
}

interface springDelta {
	dx: number;
	dv: number;
}
const springAccelerationForState = (state: springState) =>
	(-state.tension * state.x) - (state.friction * state.v);

const springEvaluateStateWithDerivative = (initialState: springState, dt: number, derivative: springDelta): springDelta => {
	const state = {
		x: initialState.x + derivative.dx * dt,
		v: initialState.v + derivative.dv * dt,
		tension: initialState.tension,
		friction: initialState.friction,
	};

	return {
		dx: state.v,
		dv: springAccelerationForState(state),
	};
}

const springIntegrateState = (state: springState, dt: number) => {
	const a = {
		dx: state.v,
		dv: springAccelerationForState(state),
	};
	const b = springEvaluateStateWithDerivative(state, dt * 0.5, a);
	const c = springEvaluateStateWithDerivative(state, dt * 0.5, b);
	const d = springEvaluateStateWithDerivative(state, dt, c);
	const dxdt = 1 / 6 * (a.dx + 2 * (b.dx + c.dx) + d.dx);
	const dvdt = 1 / 6 * (a.dv + 2 * (b.dv + c.dv) + d.dv);

	state.x = state.x + dxdt * dt;
	state.v = state.v + dvdt * dt;

	return state;
}

/**
 * Runge-Kutta spring physics function generator. Adapted from
 * Framer.js, copyright Koen Bok. MIT License:
 * http://en.wikipedia.org/wiki/MIT_License
 *
 * Given a tension, friction, and duration, a simulation at 60FPS will
 * first run without a defined duration in order to calculate the full
 * path. A second pass then adjusts the time delta - using the relation
 * between actual time and duration - to calculate the path for the
 * duration-constrained animation.
 *
 * The duration comes from the animation itself.
 *
 * @param tension
 * @param friction
 */
export function generateSpringRK4(tension: number, friction: number): number;
export function generateSpringRK4(tension: number, friction: number, duration: number): EasingFn;
export function generateSpringRK4(tension: number, friction: number, duration?: number): any {
	const initState: springState = {
		x: -1,
		v: 0,
		tension: parseFloat(tension as any) || 500,
		friction: parseFloat(friction as any) || 20,
	};
	const path = [0];
	const tolerance = 1 / 10000;
	const DT = 16 / 1000;
	const haveDuration = duration != null; // deliberate "==", as undefined == null != 0
	let timeLapsed = 0;
	let dt: number;
	let lastState: springState;

	/* Calculate the actual time it takes for this animation to complete with the provided conditions. */
	if (haveDuration) {
		/* Run the simulation without a duration. */
		timeLapsed = generateSpringRK4(initState.tension, initState.friction);
		/* Compute the adjusted time delta. */
		dt = (timeLapsed as number) / duration! * DT;
	} else {
		dt = DT;
	}

	while (true) {
		/* Next/step function .*/
		lastState = springIntegrateState(lastState! || initState, dt);
		/* Store the position. */
		path.push(1 + lastState.x);
		timeLapsed += 16;
		/* If the change threshold is reached, break. */
		if (!(Math.abs(lastState.x) > tolerance && Math.abs(lastState.v) > tolerance)) {
			break;
		}
	}

	/* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
	 computed path and returns a snapshot of the position according to a given percentComplete. */
	return !haveDuration ? timeLapsed : (percentComplete: number, startValue: number, endValue: number) => {
		if (percentComplete === 0) {
			return startValue;
		}
		if (percentComplete === 1) {
			return endValue;
		}

		return startValue + path[Math.floor(percentComplete * (path.length - 1))] * (endValue - startValue);
	};
}

registerEasingValidator((value, duration) => {
	if (Array.isArray(value) && value.length === 2 && isNumber(duration)) {
		return generateSpringRK4(value[0], value[1], duration);
	}
})

declare module "@velocityjs/core" {
	export interface IEasingTypes {
		spring_rk4: [number, number];
	}
}
