import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    alias: [{ find: "@", replacement: resolve(__dirname, "./") }],
    environment: "jsdom",
    setupFiles: ["./lib/test/index.ts"],
    globals: true,
  },
})
