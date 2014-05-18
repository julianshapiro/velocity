var _continueAnimation = true,
    tolerance = 1/10000;

function spring (percentComplete, duration, distance, tension, friction) {
    var path = [],
        initState = {
            x       : -1,
            v       : 0,
            tension : tension || 500,
            friction: friction || 10
        },
        // the framer implementation uses seconds for animation loop
        // see: https://github.com/koenbok/Framer/blob/master/framer/Utils.coffee#L61
        dt = 16/1000, // 60 FPS
        last_state;

    while ( _continueAnimation ) {
        last_state = step(dt, last_state || initState);
        path.push(1 + last_state.x);
    }
    _continueAnimation = true;

    return path[(percentComplete * (path.length - 1)) | 0];
}


function step (delta, stateBefore) {
    var stateAfter = springIntegrateState(stateBefore, delta);
    _continueAnimation = stop(stateAfter.x, stateAfter.v);
    return stateAfter;
}

function stop (x, v) {
    return Math.abs(x) > tolerance && Math.abs(v) > tolerance;
}

function springAccelerationForState (state) {
    return -state.tension * state.x - state.friction * state.v;
}

function springEvaluateState (initialState) {
    return {
        dx: initialState.v,
        dv: springAccelerationForState(initialState)
    };
}

function springEvaluateStateWithDerivative (initialState, dt, derivative) {
    var state = {
        x       : initialState.x + derivative.dx * dt,
        v       : initialState.v + derivative.dv * dt,
        tension : initialState.tension,
        friction: initialState.friction
    };

    return {
        dx: state.v,
        dv: springAccelerationForState(state)
    };
}

function springIntegrateState (state, dt) {
    var a = springEvaluateState(state),
        b = springEvaluateStateWithDerivative(state, dt * 0.5, a),
        c = springEvaluateStateWithDerivative(state, dt * 0.5, b),
        d = springEvaluateStateWithDerivative(state, dt, c),
        dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
        dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);

    state.x = state.x + dxdt * dt;
    state.v = state.v + dvdt * dt;

    return state;
}
