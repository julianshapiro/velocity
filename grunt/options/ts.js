module.exports = {
	options: {
		"fast": "never"
	},
	main: {
		"tsconfig": true,
		"files": {
			"build/velocity.js": ["src/app.ts"]
		}
	},
	test: {
		"tsconfig": "test/tsconfig.json",
		"files": {
			"test/test.js": ["test/src/app.ts"]
		}
	}
};
