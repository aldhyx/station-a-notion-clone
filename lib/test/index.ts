import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { loadEnvConfig } from "@next/env"

// load env.test.local or env.test
loadEnvConfig(process.cwd())

afterEach(() => {
  cleanup()
})
