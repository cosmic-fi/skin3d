import { defineConfig } from "vite";

export default defineConfig({
	base: "./",
	root: "demo",
	build: {
		rollupOptions: {
			input: {
				main: "./demo/index.html"
			},
		},
	},
});