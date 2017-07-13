namespace VelocityStatic {

	/* Resume all animations */
	export function resumeAll(queueName) {
		for (var activeCall = VelocityStatic.State.first; activeCall; activeCall = activeCall.next) {
			/* If we have a queueName and this call is not on that queue, skip */
			if (queueName !== undefined && ((activeCall.options.queue !== queueName) || (activeCall.options.queue === false))) {
				continue;
			}

			/* Set call to resumed if it was paused */
			if (activeCall.paused === true) {
				activeCall.paused = false;
			}
		}
	}
};
