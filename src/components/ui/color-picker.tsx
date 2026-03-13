import React, { useState, useRef, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
import { Input } from './input'
import { cn } from '@/lib/utils'

const COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#64748b',
  '#737373',
  '#000000',
  '#ffffff',
]

function hsvToHex(h: number, s: number, v: number): string {
  s /= 100
  v /= 100
  const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)
  const r = Math.round(f(5) * 255)
  const g = Math.round(f(3) * 255)
  const b = Math.round(f(1) * 255)
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`
}

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  let r = 0,
    g = 0,
    b = 0
  hex = hex.replace('#', '')
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16)
    g = parseInt(hex.slice(2, 4), 16)
    b = parseInt(hex.slice(4, 6), 16)
  }
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  const d = max - min
  const s = max === 0 ? 0 : d / max
  const v = max
  let h = 0
  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return { h: h * 360, s: s * 100, v: v * 100 }
}

export function ColorPicker({
  value = '#64748b',
  onChange,
}: {
  value?: string
  onChange: (v: string) => void
}) {
  const [hsv, setHsv] = useState({ h: 0, s: 0, v: 0 })
  const [hexInputValue, setHexInputValue] = useState(value)
  const svRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value && /^#[0-9A-Fa-f]{3,6}$/i.test(value)) {
      if (value.toLowerCase() !== hexInputValue.toLowerCase()) {
        setHsv(hexToHsv(value))
        setHexInputValue(value)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleSvPointerDown = (e: React.PointerEvent) => {
    const el = svRef.current
    if (!el) return

    const handlePointerMove = (ev: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      let x = ev.clientX - rect.left
      let y = ev.clientY - rect.top
      x = Math.max(0, Math.min(x, rect.width))
      y = Math.max(0, Math.min(y, rect.height))

      const s = (x / rect.width) * 100
      const v = 100 - (y / rect.height) * 100

      setHsv((prev) => {
        const newHsv = { ...prev, s, v }
        const newHex = hsvToHex(newHsv.h, newHsv.s, newHsv.v)
        setHexInputValue(newHex)
        onChange(newHex)
        return newHsv
      })
    }

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    handlePointerMove(e as unknown as PointerEvent)
  }

  const handleHuePointerDown = (e: React.PointerEvent) => {
    const el = hueRef.current
    if (!el) return

    const handlePointerMove = (ev: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      let x = ev.clientX - rect.left
      x = Math.max(0, Math.min(x, rect.width))

      const h = (x / rect.width) * 360

      setHsv((prev) => {
        const newHsv = { ...prev, h }
        const newHex = hsvToHex(newHsv.h, newHsv.s, newHsv.v)
        setHexInputValue(newHex)
        onChange(newHex)
        return newHsv
      })
    }

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    handlePointerMove(e as unknown as PointerEvent)
  }

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setHexInputValue(val)
    if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
      setHsv(hexToHsv(val))
      onChange(val)
    }
  }

  const handlePresetClick = (c: string) => {
    setHexInputValue(c)
    setHsv(hexToHsv(c))
    onChange(c)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[60px] h-10 p-1 flex justify-center items-center overflow-hidden"
        >
          <div
            className="w-full h-full rounded-sm border border-border/50"
            style={{ backgroundColor: value || '#64748b' }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 space-y-4" align="start">
        <div className="space-y-3">
          <div
            ref={svRef}
            onPointerDown={handleSvPointerDown}
            className="w-full h-32 rounded-md relative cursor-crosshair touch-none overflow-hidden"
            style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            <div
              className="absolute w-4 h-4 -ml-2 -mt-2 border-2 border-white rounded-full shadow-sm pointer-events-none"
              style={{
                left: `${hsv.s}%`,
                top: `${100 - hsv.v}%`,
                backgroundColor: hexInputValue,
              }}
            />
          </div>

          <div
            ref={hueRef}
            onPointerDown={handleHuePointerDown}
            className="w-full h-4 rounded-md relative cursor-ew-resize touch-none"
            style={{
              background:
                'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
            }}
          >
            <div
              className="absolute w-4 h-4 -ml-2 top-0 border-2 border-white rounded-full shadow-sm pointer-events-none bg-white"
              style={{ left: `${(hsv.h / 360) * 100}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-md border border-border/50 shrink-0"
              style={{ backgroundColor: hexInputValue }}
            />
            <Input
              value={hexInputValue}
              onChange={handleHexInputChange}
              className="h-8 uppercase font-mono text-xs"
              maxLength={7}
            />
          </div>

          <div className="grid grid-cols-5 gap-2 pt-2 border-t">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={cn(
                  'w-8 h-8 rounded-md border cursor-pointer hover:scale-110 transition-transform',
                  (value || '').toLowerCase() === c
                    ? 'ring-2 ring-primary ring-offset-2'
                    : 'border-border/50',
                )}
                style={{ backgroundColor: c }}
                onClick={() => handlePresetClick(c)}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
