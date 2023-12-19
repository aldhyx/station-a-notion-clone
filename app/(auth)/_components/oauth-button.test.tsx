import { fireEvent, render, screen } from "@testing-library/react"
import { afterAll, describe, expect, it, test, vi } from "vitest"
import { FacebookButton, GoogleButton } from "@/app/(auth)/_components/oauth-button"

describe("google oauth button", () => {
  const clickHandler = vi.fn().mockImplementation(() => {})

  it("render correctly", () => {
    render(<GoogleButton clickHandler={clickHandler} />)
    expect(screen.getByText(/^continue with google$/i))
  })

  test("call onClick prop when clicked", () => {
    render(<GoogleButton clickHandler={clickHandler} />)
    fireEvent.click(screen.getByText(/^continue with google$/i))
    expect(clickHandler).toHaveBeenCalledOnce()
  })
})

describe("facebook oauth button", () => {
  const clickHandler = vi.fn().mockImplementation(() => {})

  it("render correctly", () => {
    render(<FacebookButton clickHandler={clickHandler} />)
    expect(screen.getByText(/^continue with facebook$/i))
  })

  test("call onClick prop when clicked", () => {
    render(<FacebookButton clickHandler={clickHandler} />)
    fireEvent.click(screen.getByText(/^continue with facebook$/i))
    expect(clickHandler).toHaveBeenCalledOnce()
  })
})
