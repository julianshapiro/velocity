# Major Changes in Velocity V2

* Transforms - Use these directly within CSS, don't try the old shortcuts as they don't exist.
* Colors - All web colors are supported internally.
* SVG - All SVG attributes are supported internally, though they must be placed on the correct type of element.
* Loop - This no longer copies the animation call, it calls it multiple times.
* Repeat - This is almost identical to loop, but only runs one way.
* Chaining - Chaining is awesome, use it. Chained commands are designed to operate on the chained animation, not on the elements within it.
* Styles - Use `element.velocity("style", "propertyName"[, value])`, the old .Hook has gone.
* Per-element - Animations are now copied per-element, and not one a one-animation-per-array basis as in other libraries (and old Velocity v1).
* Sync - You can now de-sync animations so they start immediately per-element, rather than waiting for all to be ready.
* Speed - You can control the speed of the animation playback.
* Delay - You can pass a negative number to start inside the animation rather than just having a delay before it.
* There are APIs for extending Velocity - see the various register* commands.
* Display - This is a property, no longer an option.
* Visibility - This is a property, no longer an option.

# Currently disabled / not updated:

* UI-Pack
* Reverse
* Scroll (working, but not happy with interface - it's a property if people want to play, alias of scrollTop, there's also scrollLeft)
