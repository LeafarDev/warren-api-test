const tsc = require('typescript');
const tsConfig = JSON.parse(require('fs').readFileSync('tsconfig.json', 'utf8'));

module.exports = {
	process(src, path) {
		if (path.endsWith('.ts') || path.endsWith('.tsx')) {
			return tsc.transpile(src, tsConfig.compilerOptions, path, []);
		}
		return src;
	},
};
