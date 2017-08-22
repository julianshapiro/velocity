module.exports = {
	main: {
		files: ["src/**/*.ts"],
		tasks: ["default"]
	},
	test: {
		files: ["test/src/**/*.js"],
		tasks: ["uglify:test"]
	}
};
