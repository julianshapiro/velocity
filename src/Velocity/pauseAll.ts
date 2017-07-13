namespace VelocityStatic {

	/* Pause all animations */
	export function pauseAll(queueName) {
		for (var activeCall = VelocityStatic.State.first; activeCall; activeCall = activeCall.next) {
			/* If we have a queueName and this call is not on that queue, skip */
			if (queueName !== undefined && ((activeCall.options.queue !== queueName) || (activeCall.options.queue === false))) {
				continue;
			}
			/* Set call to paused */
			activeCall.paused = true;
		}
	};
};
