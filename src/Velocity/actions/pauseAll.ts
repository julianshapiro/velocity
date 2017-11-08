///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Pause all animations.
 */

namespace VelocityStatic {
	export function pauseAll(queueName: string | false): void {
		for (let activeCall = VelocityStatic.State.first; activeCall; activeCall = activeCall._next) {
			/* If we have a queueName and this call is not on that queue, skip */
			if (queueName !== undefined && ((activeCall.queue !== queueName) || (activeCall.queue === false))) {
				continue;
			}
			/* Set call to paused */
			activeCall.paused = true;
		}
	};

	registerAction(["pauseAll", function(args: any[], elements: HTMLorSVGElement[] | VelocityResult, promiseHandler?: VelocityPromise, action?: string) {
		pauseAll(args[0]);
	}], true);
};
