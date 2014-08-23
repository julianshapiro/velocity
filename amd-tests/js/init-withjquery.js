define(['jquery', 'velocity'], function($) {
	var $foo = $('.foo'), isRed = true
	$('button').bind('click', function() {

		// crazy cool animation...
		if ( isRed ) {
			$foo
				.velocity({scale: 2})
				.velocity({rotateZ: '90deg', backgroundColor: '#0f0'})
				.velocity({scale: 1})
			isRed = false
		} else {
			$foo
				.velocity({scale: 2})
				.velocity({rotateZ: '0deg', backgroundColor: '#f00'})
				.velocity({scale: 1})
			isRed = true
		}
	})
})