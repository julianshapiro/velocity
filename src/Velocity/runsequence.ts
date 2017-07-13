namespace VelocityStatic {
	/*********************
	 Sequence Running
	 **********************/

	/* Note: Sequence calls must use Velocity's single-object arguments syntax. */
	export function RunSequence(originalSequence) {
		var sequence = $.extend(true, [], originalSequence);

		if (sequence.length > 1) {
			$.each(sequence.reverse(), function(i, currentCall) {
				var nextCall = sequence[i + 1];

				if (nextCall) {
					/* Parallel sequence calls (indicated via sequenceQueue:false) are triggered
					 in the previous call's begin callback. Otherwise, chained calls are normally triggered
					 in the previous call's complete callback. */
					var currentCallOptions = currentCall.o || currentCall.options,
						nextCallOptions = nextCall.o || nextCall.options;

					var timing = (currentCallOptions && currentCallOptions.sequenceQueue === false) ? "begin" : "complete",
						callbackOriginal = nextCallOptions && nextCallOptions[timing],
						options = {};

					options[timing] = function() {
						var nextCallElements = nextCall.e || nextCall.elements;
						var elements = nextCallElements.nodeType ? [nextCallElements] : nextCallElements;

						if (callbackOriginal) {
							callbackOriginal.call(elements, elements);
						}
						Velocity(currentCall);
					};

					if (nextCall.o) {
						nextCall.o = $.extend({}, nextCallOptions, options);
					} else {
						nextCall.options = $.extend({}, nextCallOptions, options);
					}
				}
			});

			sequence.reverse();
		}

		Velocity(sequence[0]);
	};
};
