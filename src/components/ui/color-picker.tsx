import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
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

export function ColorPicker({
  value,
  onChange,
}: {
  value?: string
  onChange: (v: string) => void
}) {
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
      <PopoverContent className="w-64 p-3" align="start">
        <div className="grid grid-cols-5 gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={cn(
                'w-8 h-8 rounded-md border cursor-pointer hover:scale-110 transition-transform',
                value === c ? 'ring-2 ring-primary ring-offset-2' : 'border-border/50',
              )}
              style={{ backgroundColor: c }}
              onClick={() => onChange(c)}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
