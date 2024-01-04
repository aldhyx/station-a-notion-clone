import { render, screen } from "@testing-library/react"
import NavAuth from "./nav-auth"
import userEvent from "@testing-library/user-event"

describe("nav auth", () => {
  beforeAll(() => {
    vi.mock("next/navigation", () => {
      const actual = vi.importActual("next/navigation")
      return {
        ...actual,
        useRouter: vi.fn(() => ({
          push: vi.fn(),
        })),
        usePathname: vi.fn(),
      }
    })
  })

  it("render without error", () => {
    const props = { email: null, fullname: null, username: null }
    render(<NavAuth {...props} />)

    expect(screen.getByRole("link", { name: /^sign up/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /^log in/i })).toBeInTheDocument()
  })

  it("show button with user email when logged in", () => {
    const props = { email: "user@mail.com", fullname: null, username: null }

    render(<NavAuth {...props} />)
    expect(
      screen.getByRole("button", { name: props.email, expanded: false }),
    ).toBeInTheDocument()

    expect(screen.queryByRole("link", { name: /^sign up/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /^log in/i })).not.toBeInTheDocument()
  })

  it("show hide user popover when clicked on button with user email", async () => {
    const user = userEvent.setup()
    const props = { email: "user@mail.com", fullname: null, username: null }

    render(<NavAuth {...props} />)

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: props.email, expanded: false }))

    expect(screen.getByRole("dialog")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: props.email, expanded: true }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
