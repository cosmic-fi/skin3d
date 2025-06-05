import { defineConfig } from "vite";

export default defineConfig({
	base: "./",
	root: "examples",
	build: {
		rollupOptions: {
			input: {
				main: "./examples/index.html"
			},
		},
	},
});
