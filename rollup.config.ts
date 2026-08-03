export default [
	{
		input: 'dist/index.js',
		external: ['three', 'skinview-utils', 'three/examples/jsm/controls/OrbitControls.js', 'three/examples/jsm/postprocessing/EffectComposer.js', 'three/examples/jsm/postprocessing/Pass.js', 'three/examples/jsm/postprocessing/RenderPass.js', 'three/examples/jsm/postprocessing/ShaderPass.js', 'three/examples/jsm/shaders/FXAAShader.js'],
		output: {
			file: 'dist/skin3d.umd.js',
			format: 'umd',
			globals: {
				three: 'THREE',
				'skinview-utils': 'skinviewUtils',
				'three/examples/jsm/controls/OrbitControls.js': 'OrbitControls',
				'three/examples/jsm/postprocessing/EffectComposer.js': 'EffectComposer',
				'three/examples/jsm/postprocessing/Pass.js': 'Pass',
				'three/examples/jsm/postprocessing/RenderPass.js': 'RenderPass',
				'three/examples/jsm/postprocessing/ShaderPass.js': 'ShaderPass',
				'three/examples/jsm/shaders/FXAAShader.js': 'FXAAShader'
			},
			name: 'skin3d'
		}
	},
	{
		input: 'dist/index.js',
		external: ['three', 'skinview-utils', 'three/examples/jsm/controls/OrbitControls.js', 'three/examples/jsm/postprocessing/EffectComposer.js', 'three/examples/jsm/postprocessing/Pass.js', 'three/examples/jsm/postprocessing/RenderPass.js', 'three/examples/jsm/postprocessing/ShaderPass.js', 'three/examples/jsm/shaders/FXAAShader.js'],
		output: {
			file: 'dist/skin3d.esm.js',
			format: 'es'
		}
	}
];
