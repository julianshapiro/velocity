module.exports = function(grunt) {
	grunt.registerTask("patch", [
		"bump-only:patch",
		"default",
		"bump-commit"
	]);
};
