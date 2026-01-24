export default [
	{
		input: 'dist/index.js',
		external: ['three'],
		output: {
			file: 'dist/skin3d.umd.js',
			format: 'umd',
			globals: {
				three: 'THREE'
			},
			name: 'skin3d'
		}
	},
	{
		input: 'dist/index.js',
		external: ['three'],
		output: {
			file: 'dist/skin3d.esm.js',
			format: 'es'
		}
	}
];
