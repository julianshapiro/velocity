///<reference path="easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.Easing {

	interface springState {
		x: number;
		v: number;
		tension: number;
		friction: number;
	};

	interface springDelta {
		dx: number;
		dv: number;
	};

	/* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
	/* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
	 then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */
	function springAccelerationForState(state: springState) {
		return (-state.tension * state.x) - (state.friction * state.v);
	}

	function springEvaluateStateWithDerivative(initialState: springState, dt: number, derivative: springDelta): springDelta {
		const state = {
			x: initialState.x + derivative.dx * dt,
			v: initialState.v + derivative.dv * dt,
			tension: initialState.tension,
			friction: initialState.friction
		};

		return {
			dx: state.v,
			dv: springAccelerationForState(state)
		};
	}

	function springIntegrateState(state: springState, dt: number) {
		const a = {
			dx: state.v,
			dv: springAccelerationForState(state)
		},
			b = springEvaluateStateWithDerivative(state, dt * 0.5, a),
			c = springEvaluateStateWithDerivative(state, dt * 0.5, b),
			d = springEvaluateStateWithDerivative(state, dt, c),
			dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
			dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);

		state.x = state.x + dxdt * dt;
		state.v = state.v + dvdt * dt;

		return state;
	}

	export function generateSpringRK4(tension: number, friction: number): number;
	export function generateSpringRK4(tension: number, friction: number, duration: number): VelocityEasingFn;
	export function generateSpringRK4(tension: number, friction: number, duration?: number): any {
		let initState: springState = {
			x: -1,
			v: 0,
			tension: parseFloat(tension as any) || 500,
			friction: parseFloat(friction as any) || 20
		},
			path = [0],
			time_lapsed = 0,
			tolerance = 1 / 10000,
			DT = 16 / 1000,
			have_duration = duration != null, // deliberate "==", as undefined == null != 0
			dt: number,
			last_state: springState;

		/* Calculate the actual time it takes for this animation to complete with the provided conditions. */
		if (have_duration) {
			/* Run the simulation without a duration. */
			time_lapsed = generateSpringRK4(initState.tension, initState.friction);
			/* Compute the adjusted time delta. */
			dt = (time_lapsed as number) / duration * DT;
		} else {
			dt = DT;
		}

		while (true) {
			/* Next/step function .*/
			last_state = springIntegrateState(last_state || initState, dt);
			/* Store the position. */
			path.push(1 + last_state.x);
			time_lapsed += 16;
			/* If the change threshold is reached, break. */
			if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
				break;
			}
		}

		/* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
		 computed path and returns a snapshot of the position according to a given percentComplete. */
		return !have_duration ? time_lapsed : function(percentComplete: number, startValue: number, endValue: number) {
			if (percentComplete === 0) {
				return startValue;
			}
			if (percentComplete === 1) {
				return endValue;
			}
			return startValue + path[(percentComplete * (path.length - 1)) | 0] * (endValue - startValue);
		};
	};
};
