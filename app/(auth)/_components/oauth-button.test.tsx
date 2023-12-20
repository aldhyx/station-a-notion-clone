import { render, screen } from "@testing-library/react"
import { FacebookButton, GoogleButton } from "@/app/(auth)/_components/oauth-button"
import userEvent from "@testing-library/user-event"

describe("google oauth button", () => {
  const clickHandler = vi.fn().mockImplementation(() => {})

  it("render without error", () => {
    render(<GoogleButton clickHandler={clickHandler} />)

    expect(
      screen.getByRole("button", { name: /^continue with google/i }),
    ).toBeInTheDocument()
  })

  it("call click handler when clicked", async () => {
    const user = userEvent.setup()

    render(<GoogleButton clickHandler={clickHandler} />)
    await user.click(screen.getByRole("button", { name: /^continue with google/i }))
    expect(clickHandler).toHaveBeenCalledOnce()
  })
})

describe("facebook oauth button", () => {
  const clickHandler = vi.fn().mockImplementation(() => {})

  it("render without error", () => {
    render(<FacebookButton clickHandler={clickHandler} />)

    expect(
      screen.getByRole("button", { name: /^continue with facebook/i }),
    ).toBeInTheDocument()
  })

  it("call click handler when clicked", async () => {
    const user = userEvent.setup()

    render(<FacebookButton clickHandler={clickHandler} />)
    await user.click(screen.getByRole("button", { name: /^continue with facebook/i }))
    expect(clickHandler).toHaveBeenCalledOnce()
  })
})
