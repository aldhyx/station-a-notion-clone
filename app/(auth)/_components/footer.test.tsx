import React from "react"
import { render, screen } from "@testing-library/react"
import { expect, it } from "vitest"
import Footer from "@/app/(auth)/_components/footer"

it("renders correctly", () => {
  render(<Footer />)
  expect(screen.getByText(/privacy policy/i)).toBeInTheDocument()
  expect(screen.getByText(/terms & condition/i)).toBeInTheDocument()
})
