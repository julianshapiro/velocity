/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Pause all animations.
 */

namespace VelocityStatic {
	export function pauseAll(queueName: string | false): void {
		for (let activeCall = VelocityStatic.State.first; activeCall; activeCall = activeCall.next) {
			/* If we have a queueName and this call is not on that queue, skip */
			if (queueName !== undefined && ((activeCall.queue !== queueName) || (activeCall.queue === false))) {
				continue;
			}
			/* Set call to paused */
			activeCall.paused = true;
		}
	};
};
