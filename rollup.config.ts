export default [
	{
		input: 'libs/index.js',
		external: ['three'],
		output: {
			file: 'bundles/skin3d.js',
			format: 'umd',
			globals: {
				three: 'THREE'
			},
			name: 'skin3d'
		}
	},
	{
		input: 'libs/index.js',
		external: ['three'],
		output: {
			file: 'bundles/skin3d.esm.js',
			format: 'es'
		}
	}
];
