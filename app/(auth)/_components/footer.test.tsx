import React from "react"
import { render, screen } from "@testing-library/react"
import Footer from "@/app/(auth)/_components/footer"

it("render without error", () => {
  render(<Footer />)

  expect(screen.getByRole("link", { name: /privacy policy/i })).toBeInTheDocument()
  expect(screen.getByRole("link", { name: /terms & conditions/i })).toBeInTheDocument()
})
