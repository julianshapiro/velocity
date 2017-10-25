module.exports = {
	main: {
		files: ["src/**/*.ts"],
		tasks: ["default"]
	},
	test: {
		files: ["test/src/**/*.ts"],
		tasks: ["ts:test"]
	}
};
