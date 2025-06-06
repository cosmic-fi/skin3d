import { defineConfig } from "rollup";
import { swc } from "rollup-plugin-swc3";
import resolve from "@rollup/plugin-node-resolve";
import { threeMinifier } from "@yushijinhun/three-minifier-rollup";

export default defineConfig({
	input: "src/skin3d.ts",
	output: {
		file: "bundles/skin3d.bundle.js",
		format: "umd",
		name: "skin3d",
		banner: "/* @preserve skin3d / MIT License / https://github.com/cosmic-fi/skin3d */",
		sourcemap: true,
		compact: true,
	},
	plugins: [
		threeMinifier(),
		resolve(),
		swc({
			jsc: { minify: { compress: true, mangle: true, sourceMap: true } },
			minify: true,
			sourceMaps: true
		}),
	],
});