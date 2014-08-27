define(['velocity'], function(velocity) {
	var foo = document.querySelector('.foo')
	  , button = document.querySelector('button')
	  , isRed = true


	button.addEventListener('click', function() {
		// crazy cool animation...
		if ( isRed ) {
			velocity(foo, {scale: 2})
			velocity(foo, {rotateZ: '90deg', backgroundColor: '#0f0'})
			velocity(foo, {scale: 1})
			isRed = false
		} else {
			velocity(foo, {scale: 2})
			velocity(foo, {rotateZ: '0deg', backgroundColor: '#f00'})
			velocity(foo, {scale: 1})
			isRed = true
		}
	})
})