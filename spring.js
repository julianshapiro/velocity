function springRK4 (options) {
    var initState = {
            x       : -1,
            v       : 0,
            tension : null,
            friction: null
        },
        path = [0],
        time_lapsed = 0,
        tolerance = 1 / 10000,
        // default time delta
        /* the framer implementation uses seconds for animation loop
           see: https://github.com/koenbok/Framer/blob/master/framer/Utils.coffee#L61 */
        DT = 16 / 1000, // 60 FPS
        have_duration, duration, dt, last_state;

    // this is a pre-computation run
    duration = options.duration;
    options.tension = options.tension || 600;
    options.friction = options.friction || 20;

    initState.tension = options.tension;
    initState.friction = options.friction;

    have_duration = duration != null;

    // we need to calculate the actual time it takes for this animation with given conditions
    if ( have_duration ) {
        options.duration = null;
        // running simulation without duration
        time_lapsed = springRK4(options);
        // compute adjusted time delta
        dt = time_lapsed / duration * DT;
    }
    /* no duration, so this is when we compute the actual time for this animation with given conditions
       and return the adjusted time delta that accounts for given duration. */
    else {
        dt = DT;
    }

    while ( true ) {
        // get a new state - this is our actual "next/step" function
        last_state = springIntegrateState(last_state || initState, dt);
        // store position
        path.push(1 + last_state.x);
        // elapse time
        time_lapsed += 16;
        // check if we reached threshold of change, and break if we did
        if ( ! (Math.abs(last_state.x) > tolerance &&
                Math.abs(last_state.v) > tolerance) ) break;
    }

    /* if duration is not defined then we return the actual time required for completing
       this animation in given duration. */
    /* otherwise we return a closure that holds the computed path
       and returns a snapshot of the position, according to a given percentComplete input. */
    return ! have_duration ?
           time_lapsed :
           function (percentComplete) {
                return path[(percentComplete * (path.length - 1)) | 0];
           };
}

function springAccelerationForState (state) {
    return -state.tension * state.x - state.friction * state.v;
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
    var a = {
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
