import { useRef } from "react"

export default function useDebounceCallback(delay = 300) {
  const ref = useRef<NodeJS.Timeout | null>(null)

  const delayedCallback = (cb: () => void) => {
    if (ref.current === null) {
      const timeoutId = setTimeout(cb, delay)
      ref.current = timeoutId
    } else {
      clearTimeout(ref.current)
      const newTimeoutId = setTimeout(cb, delay)
      ref.current = newTimeoutId
    }
  }

  return { delayedCallback }
}
