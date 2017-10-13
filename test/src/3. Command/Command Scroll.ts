///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

/* Window scrolling. */
QUnit.skip("Scroll (Window)", function(assert) {
	var done = assert.async(4),
			$details = $("#details"),
			$scrollTarget1 = $("<div>Scroll target #1. Should stop 50 pixels above this point.</div>"),
			$scrollTarget2 = $("<div>Scroll target #2. Should stop 50 pixels before this point.</div>"),
			scrollOffset = -50;

	$scrollTarget1
			.css({position: "relative", top: 3000, height: 100, paddingBottom: 10000})
			.appendTo($("body"));

	$scrollTarget2
			.css({position: "absolute", top: 100, left: 3000, width: 100, paddingRight: 15000})
			.appendTo($("body"));

	$scrollTarget1
			.velocity("scroll", {duration: 500, offset: scrollOffset, complete: function() {
					assert.equal(Math.abs(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyTop] - ($scrollTarget1.offset().top + scrollOffset)) <= 100, true, "Page scrolled top with a scroll offset.");

					done();
				}
			})
			.velocity({opacity: 0.5}, function() {
				$details
						.velocity({opacity: 0.5}, 500)
						.velocity("scroll", 500)
						.velocity({opacity: 1}, 500, function() {
							//alert(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyTop] + " " + ($details.offset().top + scrollOffset))
							assert.equal(Math.abs(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyTop] - ($details.offset().top + scrollOffset)) <= 100, true, "Page scroll top was chained.");

							done();

							//$scrollTarget1.remove();

							$scrollTarget2
									.velocity("scroll", {duration: 500, axis: "x", offset: scrollOffset, complete: function() {
											/* Phones can reposition the browser's scroll position by a 10 pixels or so, so we just check for a value that's within that range. */
											assert.equal(Math.abs(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyLeft] - ($scrollTarget2.offset().left + scrollOffset)) <= 100, true, "Page scrolled left with a scroll offset.");

											done();
										}
									})
									.velocity({opacity: 0.5}, function() {
										$details
												.velocity({opacity: 0.5}, 500)
												.velocity("scroll", {duration: 500, axis: "x"})
												.velocity({opacity: 1}, 500, function() {
													assert.equal(Math.abs(Velocity.State.scrollAnchor[Velocity.State.scrollPropertyLeft] - ($details.offset().left + scrollOffset)) <= 100, true, "Page scroll left was chained.");

													done();
												});
									});
						});
			});
});

/* Element scrolling. */
QUnit.skip("Scroll (Element)", function(assert) {
	var done = assert.async(2),
			$scrollTarget1 = $("\
					<div id='scroller'>\
						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
						aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
						<div id='scrollerChild1'>\
							Stop #1\
							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
							bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
						</div>\
						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
						cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
						<div id='scrollerChild2'>\
							Stop #2\
							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
							dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
						</div>\
						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
						eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
					</div>\
				");

	assert.expect(2);
	$scrollTarget1
			.css({position: "absolute", backgroundColor: "white", top: 100, left: "50%", width: 500, height: 100, overflowY: "scroll"})
			.appendTo($("body"));

	/* Test with a jQuery object container. */
	$("#scrollerChild1").velocity("scroll", {container: $("#scroller"), duration: 750, complete: function() {
			/* Test with a raw DOM element container. */
			$("#scrollerChild2").velocity("scroll", {container: $("#scroller")[0], duration: 750, complete: function() {
					/* This test is purely visual. */
					assert.ok(true);

					$scrollTarget1.remove();

					var $scrollTarget2 = $("\
									<div id='scroller'>\
										<div id='scrollerChild1' style='float: left; width: 20%;'>\
											Stop #1\
											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
											bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\
											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
											cccccccccccccccccccccccccccccccccccccccccccccccccccccccc\
										</div>\
										<div id='scrollerChild2' style='float: right; width: 20%;'>\
											Stop #2\
											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
											dddddddddddddddddddddddddddddddddddddddddddddddddddddddd\
											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
											eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee\
										</div>\
									</div>\
								");

					$scrollTarget2
							.css({position: "absolute", backgroundColor: "white", top: 100, left: "50%", width: 100, height: 500, overflowX: "scroll"})
							.appendTo($("body"));

					/* Test with a jQuery object container. */
					$("#scrollerChild2").velocity("scroll", {axis: "x", container: $("#scroller"), duration: 750, complete: function() {
							/* Test with a raw DOM element container. */
							$("#scrollerChild1").velocity("scroll", {axis: "x", container: $("#scroller")[0], duration: 750, complete: function() {
									/* This test is purely visual. */
									assert.ok(true);

									$scrollTarget2.remove();

									done();
								}
							});
						}
					});

					done();
				}
			});
		}
	});
});
	