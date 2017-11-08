///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Resume all animations.
 */

namespace VelocityStatic {
	export function resumeAll(queueName: string | false): void {
		for (let activeCall = VelocityStatic.State.first; activeCall; activeCall = activeCall.next) {
			/* If we have a queueName and this call is not on that queue, skip */
			if (queueName !== undefined && ((activeCall.queue !== queueName) || (activeCall.queue === false))) {
				continue;
			}

			/* Set call to resumed if it was paused */
			if (activeCall.paused === true) {
				activeCall.paused = false;
			}
		}
	}

	registerAction(["resumeAll", function(args: any[], elements: HTMLorSVGElement[], promiseHandler?: VelocityPromise, action?: string) {
		resumeAll(args[0]);
	}], true);
};
