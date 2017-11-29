module.exports = {
	main: {
		files: ["index.d.ts", "src/**/*.ts"],
		tasks: ["default"]
	},
	test: {
		files: ["test/src/**/*.ts"],
		tasks: ["ts:test"]
	}
};
