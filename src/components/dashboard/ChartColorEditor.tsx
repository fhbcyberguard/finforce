import { Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import useAppStore from '@/stores/useAppStore'

export function ChartColorEditor({
  categories,
}: {
  categories: { name: string; color: string }[]
}) {
  const { setCategoryColor } = useAppStore()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Palette className="h-4 w-4" />
          <span className="sr-only">Editar Cores</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm leading-none mb-1">Cores das Categorias</h4>
            <p className="text-xs text-muted-foreground">
              Personalize as cores exibidas nos gráficos.
            </p>
          </div>
          <div className="max-h-[240px] overflow-y-auto space-y-3 pr-2">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between gap-3">
                <Label className="text-xs truncate flex-1 cursor-pointer" title={cat.name}>
                  {cat.name}
                </Label>
                <div className="relative w-8 h-8 rounded-md overflow-hidden shrink-0 border border-border/50">
                  <Input
                    type="color"
                    value={cat.color}
                    onChange={(e) => setCategoryColor(cat.name, e.target.value)}
                    className="absolute -inset-2 w-12 h-12 p-0 border-0 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
