module.exports = {
	main: {
		options: {
			sourceMap: {
				root: "src/",
				includeSources: true
			},
			sourceMapIn: "build/velocity.js.map",
			compress: false,
			mangle: false,
			beautify: true,
			output: {
				comments: "all"
			},
			banner: `/*! VelocityJS.org (<%= pkg.version %>) (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('velocity-animate', [], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else {
		root['Velocity'] = factory();
	}
}(this, function() {
`,
			footer: `
	return VelocityFn;
}));
`
		},
		files: {
			"velocity.js": ["build/velocity.js"]
		}
	},
	min: {
		options: {
			sourceMap: false,
			banner: `/*! <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today('dddd dS mmmm yyyy, h:MM:ss TT') %>) */`,
			compress: {
				drop_console: true,
				drop_debugger: true,
				pure_getters: true,
				unsafe: true
			}
		},
		files: {
			"velocity.min.js": ["velocity.js"],
			"velocity.ui.min.js": ["velocity.ui.js"]
		}
	}
};
