import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const input = 'dist/index.js';
const external = [
	'three',
	'skinview-utils',
	'three/examples/jsm/controls/OrbitControls.js',
	'three/examples/jsm/postprocessing/EffectComposer.js',
	'three/examples/jsm/postprocessing/Pass.js',
	'three/examples/jsm/postprocessing/RenderPass.js',
	'three/examples/jsm/postprocessing/ShaderPass.js',
	'three/examples/jsm/shaders/FXAAShader.js'
];

const globals = {
	three: 'THREE',
	'skinview-utils': 'skinviewUtils',
	'three/examples/jsm/controls/OrbitControls.js': 'OrbitControls',
	'three/examples/jsm/postprocessing/EffectComposer.js': 'EffectComposer',
	'three/examples/jsm/postprocessing/Pass.js': 'Pass',
	'three/examples/jsm/postprocessing/RenderPass.js': 'RenderPass',
	'three/examples/jsm/postprocessing/ShaderPass.js': 'ShaderPass',
	'three/examples/jsm/shaders/FXAAShader.js': 'FXAAShader'
};

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
			...(format === 'umd' && { globals, name: 'skin3d' })
		}
	};
}

export default [
	createConfig('dist/skin3d.umd.js', 'umd', false),
	createConfig('dist/skin3d.umd.min.js', 'umd', true),
	createConfig('dist/skin3d.esm.js', 'es', false),
	createConfig('dist/skin3d.esm.min.js', 'es', true)
];
