import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { DynamicIcon } from './dynamic-icon'

const POPULAR_ICONS = [
  'Target',
  'Home',
  'Car',
  'Utensils',
  'Coffee',
  'Briefcase',
  'ShoppingBag',
  'ShoppingCart',
  'Plane',
  'HeartPulse',
  'Stethoscope',
  'Laptop',
  'Smartphone',
  'Zap',
  'Droplet',
  'Flame',
  'Umbrella',
  'Baby',
  'GraduationCap',
  'BookOpen',
  'Dumbbell',
  'Music',
  'Film',
  'Tv',
  'Gamepad',
  'Bike',
  'PiggyBank',
  'CreditCard',
  'Wallet',
  'Banknote',
  'Coins',
  'Landmark',
  'TrendingUp',
  'TrendingDown',
  'ArrowUpRight',
  'ArrowDownRight',
  'CircleDashed',
  'Star',
  'Smile',
  'Gift',
  'Activity',
  'Anchor',
  'Award',
  'Battery',
  'Bell',
  'Camera',
  'Cloud',
  'Compass',
  'Code',
  'Crosshair',
  'Database',
  'Eye',
  'Feather',
  'Flag',
  'Folder',
  'Globe',
]

export function IconPicker({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[60px] h-10 px-0 flex justify-center items-center">
          <DynamicIcon name={value || 'CircleDashed'} className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar ícone..." />
          <CommandList className="max-h-[240px] overflow-y-auto">
            <CommandEmpty>Nenhum ícone encontrado.</CommandEmpty>
            <CommandGroup>
              <div className="grid grid-cols-5 gap-2 p-2">
                {POPULAR_ICONS.map((iconName) => (
                  <CommandItem
                    key={iconName}
                    value={iconName}
                    onSelect={() => {
                      onChange(iconName)
                      setOpen(false)
                    }}
                    className={`h-10 flex justify-center items-center cursor-pointer ${
                      value === iconName
                        ? 'bg-primary text-primary-foreground data-[selected=true]:bg-primary/90 data-[selected=true]:text-primary-foreground'
                        : ''
                    }`}
                    title={iconName}
                  >
                    <DynamicIcon name={iconName} className="w-5 h-5" />
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
