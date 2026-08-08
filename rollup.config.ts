import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const input = 'dist/index.js';
const external = (id: string) => id === 'three';

function createConfig(file: string, format: 'umd' | 'es', minify: boolean) {
	return {
		input,
		external,
		plugins: [
			nodeResolve(),
			...(minify ? [terser({ keep_classnames: true, keep_fnames: true })] : [])
		],
		output: {
			file,
			format,
			sourcemap: true,
			...(format === 'umd' && {
				globals: { three: 'THREE' },
				name: 'skin3d'
			})
		}
	};
}

export default [
	createConfig('dist/skin3d.umd.js', 'umd', false),
	createConfig('dist/skin3d.umd.min.js', 'umd', true),
	createConfig('dist/skin3d.esm.js', 'es', false),
	createConfig('dist/skin3d.esm.min.js', 'es', true)
];
