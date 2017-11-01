/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Constants and defaults. These values should never change without a MINOR
 * version bump.
 */

//["completeCall", "CSS", "State", "getEasing", "Easings", "data", "debug", "defaults", "hook", "init", "mock", "pauseAll", "queue", "dequeue", "freeAnimationCall", "Redirects", "RegisterEffect", "resumeAll", "RunSequence", "lastTick", "tick", "timestamp", "expandTween", "version"]
const PUBLIC_MEMBERS = ["version", "RegisterEffect", "resumeAll", "pauseAll"];

const DURATION_FAST = 200;
const DURATION_NORMAL = 400;
const DURATION_SLOW = 600;

const DEFAULT_CACHE = true;
const DEFAULT_DELAY = 0;
const DEFAULT_DURATION = DURATION_NORMAL;
const DEFAULT_EASING = "swing";
const DEFAULT_FPSLIMIT = 60;
const DEFAULT_LOOP = 0;
const DEFAULT_MILISECONDS_PER_FRAME = 980;
const DEFAULT_PROMISE = true;
const DEFAULT_PROMISE_REJECT_EMPTY = true;
const DEFAULT_QUEUE = "";
const DEFAULT_REPEAT = 0;
