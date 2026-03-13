import { useState, useEffect } from 'react'

export function Typewriter({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    if (!text) return

    let i = 0
    setDisplayedText('')

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1))
        i++
        if (i >= text.length) clearInterval(interval)
      }, speed)
      return () => clearInterval(interval)
    }, 100)

    return () => clearTimeout(timeout)
  }, [text, speed])

  return <span>{displayedText}</span>
}
