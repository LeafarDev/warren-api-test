module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module'
	},
	env: {
		es6: true,
		node: true
	},
	plugins: [
		'@typescript-eslint'
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended'
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	rules: {
		"@typescript-eslint/ban-ts-comment": "warn",
		"comma-dangle": "error",
		"comma-style": "error",
		"semi": "error",
		"brace-style": "error",
		"camelcase": "warn"
	}
};
