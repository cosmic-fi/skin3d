import { defineConfig } from "vite";

export default defineConfig({
	base: "./",
	root: "public/demo",
	build: {
		rollupOptions: {
			input: {
				main: "./public/demo/index.html"
			},
		},
	},
});
