Velocity with RequireJS
====

Velocity presently has two builds, `jquery.velocity.js` and `velocity.js`.

`jquery.velocity.js` depends on jquery, and `velocity.js` includes a shim so that it can run without jQuery in IE8+. If jQuery is present it will be used over the shim, however.

Both velocity builds can be used with requirejs and r.js simply by including it in your project and requiring it.

If you're using `jquery.velocity.js`, make sure jQuery is shimmed as a dependency in your requirejs configuration.

As is usual for jQuery plugins, `jquery.velocity.js` extends jQuery.fn, which means that you only have to require it once if you choose to use it like `$(<<selector>>).velocity(<<velocity-options>>)`.

If you want to use the Velocity utility function in your jQuery project, simply require velocity as a dependency, and the value for that dependency will be the utility function.

If you're using a custom build of jQuery, please ensure that the `exports/global` module is included in the build.