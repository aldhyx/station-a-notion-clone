import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { loadEnvConfig } from "@next/env"

// load env.test.local or env.test
loadEnvConfig(process.cwd())

// to make it works like Jest (auto-mocking)
vi.mock("zustand")

afterEach(() => {
  cleanup()
})
