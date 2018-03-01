///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Finish all animation.
 */

import {Tween, validateTweens} from "../tweens";
import {_inArray, getValue} from "../utility";
import {callBegin} from "../tick";
import {setPropertyValue} from "../css/setPropertyValue";
import {completeCall} from "../complete";
import {validateQueue} from "../validate";
import {defaults} from "../defaults";
import {isVelocityResult} from "../types";
import {State} from "../state";
import {registerAction} from "./actions";

/**
 * Check if an animation should be finished, and if so we set the tweens to
 * the final value for it, then call complete.
 */
export function checkAnimationShouldBeFinished(animation: AnimationCall, queueName: false | string, defaultQueue: false | string) {
  validateTweens(animation);
  if (queueName === undefined || queueName === getValue(animation.queue, animation.options.queue, defaultQueue)) {
    if (!(animation._flags & AnimationFlags.STARTED)) {
      // Copied from tick.ts - ensure that the animation is completely
      // valid and run begin() before complete().
      const options = animation.options;

      // The begin callback is fired once per call, not once per
      // element, and is passed the full raw DOM element set as both
      // its context and its first argument.
      if (options._started++ === 0) {
        options._first = animation;
        if (options.begin) {
          // Pass to an external fn with a try/catch block for optimisation
          callBegin(animation);
          // Only called once, even if reversed or repeated
          options.begin = undefined;
        }
      }
      animation._flags |= AnimationFlags.STARTED;
    }
    for (const property in animation.tweens) {
      const tween = animation.tweens[property],
        pattern = tween[Tween.PATTERN];
      let currentValue = "",
        i = 0;

      if (pattern) {
        for (; i < pattern.length; i++) {
          const endValue = tween[Tween.END][i];

          currentValue += endValue == null ? pattern[i] : endValue;
        }
      }
      setPropertyValue(animation.element, property, currentValue);
    }
    completeCall(animation);
  }
}

/**
 * When the finish action is triggered, the elements' currently active call is
 * immediately finished. When an element is finished, the next item in its
 * animation queue is immediately triggered. If passed via a chained call
 * then this will only target the animations in that call, and not the
 * elements linked to it.
 *
 * A queue name may be passed in to specify that only animations on the
 * named queue are finished. The default queue is named "". In addition the
 * value of `false` is allowed for the queue name.
 *
 * An final argument may be passed in to clear an element's remaining queued
 * calls. This may only be the value `true`.
 */
export function finish(args: any[], elements: VelocityResult, promiseHandler?: VelocityPromise): void {
  const queueName: string | false = validateQueue(args[0], true),
    defaultQueue: false | string = defaults.queue,
    finishAll = args[queueName === undefined ? 0 : 1] === true;

  if (isVelocityResult(elements) && elements.velocity.animations) {
    for (let i = 0, animations = elements.velocity.animations; i < animations.length; i++) {
      checkAnimationShouldBeFinished(animations[i], queueName, defaultQueue);
    }
  } else {
    let activeCall = State.first,
      nextCall: AnimationCall;

    while ((activeCall = State.firstNew)) {
      validateTweens(activeCall);
    }
    for (activeCall = State.first; activeCall && (finishAll || activeCall !== State.firstNew); activeCall = nextCall || State.firstNew) {
      nextCall = activeCall._next;
      if (!elements || _inArray(elements, activeCall.element)) {
        checkAnimationShouldBeFinished(activeCall, queueName, defaultQueue);
      }
    }
  }
  if (promiseHandler) {
    if (isVelocityResult(elements) && elements.velocity.animations && elements.then) {
      elements.then(promiseHandler._resolver);
    } else {
      promiseHandler._resolver(elements);
    }
  }
}

registerAction(["finish", finish], true);
