// Needed tests:
// - new stop behvaior
// - e/p/o shorthands

var QUnit,
		Velocity;

/* IE detection: https://gist.github.com/julianshapiro/9098609 */
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		isAndroid = /Android/i.test(navigator.userAgent),
		$ = (window.jQuery || window.Zepto),
		$qunitStage = document.getElementById("qunit-stage"),
		defaultStyles = {
			opacity: 1,
			width: 1,
			height: 1,
			marginBottom: 1,
			colorGreen: 200
		},
		defaultProperties = {
			opacity: defaultStyles.opacity / 2,
			width: defaultStyles.width * 2,
			height: defaultStyles.height * 2,
			colorGreen: defaultStyles.colorGreen / 2
		},
		defaultOptions = {
			queue: "",
			duration: 300,
			easing: "swing",
			begin: null,
			complete: null,
			progress: null,
			display: null,
			loop: false,
			delay: false,
			mobileHA: true,
			_cacheValues: true
		},
		asyncCheckDuration = defaultOptions.duration / 2,
		completeCheckDuration = defaultOptions.duration * 2,
		IE = (function() {
			if (document.documentMode) {
				return document.documentMode;
			} else {
				for (var i = 7; i > 0; i--) {
					var div = document.createElement("div");

					div.innerHTML = "<!" + "--[if IE " + i + "]><span></span><![endif]--" + ">";

					if (div.getElementsByTagName("span").length) {
						div = null;

						return i;
					}

					div = null;
				}
			}

			return undefined;
		})();

QUnit.config.reorder = false;

Velocity.defaults = defaultOptions;

function applyStartValues(element, startValues) {
	$.each(startValues, function(property, startValue) {
		element.style[property] = startValue;
	});
}

function Data(element) {
	return element.jquery ? Velocity.data.get(element[0]) : Velocity.data.get(element);
}

function getTarget() {
	var div = document.createElement("div");

	div.className = "target";
	div.style.opacity = defaultStyles.opacity;
	div.style.color = "rgb(125, " + defaultStyles.colorGreen + ", 125)";
	div.style.width = defaultStyles.width + "px";
	div.style.height = defaultStyles.height + "px";
	div.style.marginBottom = defaultStyles.marginBottom + "px";
	div.style.textShadow = "0px 0px " + defaultStyles.textShadowBlur + "px red";
	$qunitStage.appendChild(div);
	return div;
}

function once(func) {
	var done, result;

	return function() {
		if (!done) {
			result = func.apply(this, arguments);
			func = done = true; // Don't care about type, just let the GC collect if possible
		}
		return result;
	};
}

/* Cleanup */
QUnit.done(function(details) {
//	$(".velocity-animating").velocity("stop");
	console.log("Total: ", details.total, " Failed: ", details.failed, " Passed: ", details.passed, " Runtime: ", details.runtime);
});

/* Helpful redirect for testing custom and parallel queues. */
// var $div2 = $("#DataBody-PropertiesDummy");
// $.fn.velocity.defaults.duration = 1000;
// $div2.velocity("scroll", { queue: "test" })
// $div2.velocity({width: 100}, { queue: "test" })
// $div2.velocity({ borderWidth: 50 }, { queue: "test" })
// $div2.velocity({height: 20}, { queue: "test" })
// $div2.velocity({marginLeft: 200}, { queue: "test" })
// $div2.velocity({paddingTop: 60});
// $div2.velocity({marginTop: 100});
// $div2.velocity({paddingRight: 40});
// $div2.velocity({marginTop: 0})
// $div2.dequeue("test")
