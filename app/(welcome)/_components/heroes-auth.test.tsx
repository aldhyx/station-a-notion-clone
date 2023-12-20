import { render, screen, within } from "@testing-library/react"
import HeroesAuth from "./heroes-auth"

describe("heroes auth", () => {
  it("show get station free button when not log in", () => {
    render(<HeroesAuth email={null} />)

    expect(
      screen.queryByRole("link", { name: /view dashboard/i }),
    ).not.toBeInTheDocument()

    expect(screen.getByRole("link", { name: /get station free/i })).toBeInTheDocument()
  })

  it("show view dashboard button when logged in", () => {
    render(<HeroesAuth email={"user@mail.com"} />)

    expect(screen.getByRole("link", { name: /view dashboard/i })).toBeInTheDocument()

    expect(
      screen.queryByRole("link", { name: /get station free/i }),
    ).not.toBeInTheDocument()
  })
})
