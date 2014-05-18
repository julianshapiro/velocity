var tolerance = 1/10000;

function spring (percentComplete, duration, tension, friction) {
    var initState = {
            x       : -1,
            v       : 0,
            tension : tension || 500,
            friction: friction || 10
        },
        path = [initState.x + 1],
        // the framer implementation uses seconds for animation loop
        // see: https://github.com/koenbok/Framer/blob/master/framer/Utils.coffee#L61
        dt = 16/1000, // 60 FPS
        time_lapsed = 0,
        _continueAnimation = true,
        actual_duration, last_state;

    // since we're not saving any state for now
    // we'll calculate the actual time it takes for this animation with given conditions
    if ( duration != null ) {
        // running simulation without duration
        actual_duration = spring(1, null, tension, friction);
        // adjusting time delta accordingly
        dt = (actual_duration / duration) * dt;
        // allow the actual simulation to run
        _continueAnimation = true;
    }

    while ( _continueAnimation ) {
        // get a new state
        last_state = step(dt, last_state || initState);
        // store position
        path.push(1 + last_state.x);
        // elapse time
        time_lapsed += 16;
        // check if we reached threshold of change
        _continueAnimation = again(last_state.x, last_state.v);
    }

    // if duration is not defined then we return the actual time that elapsed in milliseconds
    // otherwise we return the snapshot of the position, according to percentComplete
    return duration == null ? time_lapsed : path[(percentComplete * (path.length - 1)) | 0];
}


function step (delta, stateBefore) {
    return springIntegrateState(stateBefore, delta);
}

function again (x, v) {
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
