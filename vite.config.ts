import { defineConfig } from "vite"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
	root: resolve(__dirname, "demo"), // 👈 makes demo/ the working root
	base: "./",
	publicDir: "public", // relative to new root (demo/public)
	build: {
		outDir: resolve(__dirname, "."), // 👈 output to project root
		emptyOutDir: false, // don't delete vite.config.ts etc.
		rollupOptions: {
			output: {
				entryFileNames: "assets/[name].js",
				chunkFileNames: "assets/[name].js",
				assetFileNames: "assets/[name].[ext]",
			}
		}
	},
	resolve: {
		alias: {
			"@src": resolve(__dirname, "src")
		}
	}
})
