module.exports = function(grunt) {
	
	grunt.loadNpmTasks('grunt-contrib-requirejs')

	grunt.initConfig({
		"requirejs": {
			"compile-withjquery": {
				"options": {
						"name": "vendor/require",
						"baseUrl": './js',
						"out": "./built-withjquery.js",
						"paths": {
							"jquery": "vendor/jquery-2.1.1.min",
							"velocity": "../../jquery.velocity"
						},
						"deps": [
							"init-withjquery"
					],
					"optimize": "none"
				}
			},
			"compile-withoutjquery": {
				"options": {
						"name": "vendor/require",
						"baseUrl": './js',
						"out": "./built-withoutjquery.js",
						"paths": {
							"velocity": "../../velocity"
						},
						"deps": [
							"init-nojquery"
					],
					"optimize": "none"
				}
			}
		}
	})

	// default task will compile sass, start the server and watch
	// sass files for changes (and after changes recompile).
	grunt.registerTask("default", ["requirejs"])
}