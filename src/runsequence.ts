/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Sequence Running
 */

/* Note: Sequence calls must use Velocity's single-object arguments syntax. */
import {_deepCopyObject} from "./utility";
import {VelocityFn} from "./core";

export function RunSequence(originalSequence): void {
  let sequence = _deepCopyObject([], originalSequence);

  if (sequence.length > 1) {
    sequence.reverse().forEach(function (currentCall, i) {
      let nextCall = sequence[i + 1];

      if (nextCall) {
        /* Parallel sequence calls (indicated via sequenceQueue:false) are triggered
                   in the previous call's begin callback. Otherwise, chained calls are normally triggered
                   in the previous call's complete callback. */
        let currentCallOptions = currentCall.o || currentCall.options,
          nextCallOptions = nextCall.o || nextCall.options;

        let timing = (currentCallOptions && currentCallOptions.sequenceQueue === false) ? "begin" : "complete",
          callbackOriginal = nextCallOptions && nextCallOptions[timing],
          options = {};

        options[timing] = function () {
          let nextCallElements = nextCall.e || nextCall.elements;
          let elements = nextCallElements.nodeType ? [nextCallElements] : nextCallElements;

          if (callbackOriginal) {
            callbackOriginal.call(elements, elements);
          }
          VelocityFn(currentCall);
        };

        if (nextCall.o) {
          nextCall.o = {...nextCallOptions, ...options};
        } else {
          nextCall.options = {...nextCallOptions, ...options};
        }
      }
    });

    sequence.reverse();
  }

  VelocityFn(sequence[0]);
}
