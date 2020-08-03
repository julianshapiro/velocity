# Major Changes in Velocity V2

* APIs for extending Velocity - see the various register* commands in the wiki.
* Chaining - Chaining is awesome, use it. Chained commands are designed to operate on the chained animation, not on the elements within it.
* Colors - All web colors are supported internally.
* Delay - You can pass a negative number to start inside the animation rather than just having a delay before it.
* Display - This is a property, no longer an option.
* Loop - This no longer copies the animation call, it calls it multiple times.
* Per-element - Animations are now copied per-element, and not one a one-animation-per-array basis as in other libraries (and old Velocity v1).
* Repeat - This is almost identical to loop, but only runs one way.
* RequireJS - The namespace is now "velocity-animate" for consistency with the NPMjs project name.
* Reverse - Now reverses the last animation at time of adding, not when playing.
* Scroll - It is now a property, though it's preferred to use scrollTop and scrollLeft. (Working, but not happy with internal code - the API will not change again.)
* Sequences - rewritten and completely incompatible with previous versions.
* Speed - You can control the speed of the animation playback.
* Styles - Use `element.velocity("style", "propertyName"[, value])`, the old .Hook has gone.
* SVG - All SVG attributes are supported internally, though they must be placed on the correct type of element.
* Sync - You can now de-sync animations so they start immediately per-element, rather than waiting for all to be ready.
* Transforms - Use these directly within CSS, don't try the old shortcuts as they don't exist.
* UI-Pack - Now only contains animations, all code is in the core Velocity now.
* Visibility - This is a property, no longer an option.
