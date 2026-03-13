import { useTheme } from 'next-themes'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function AppearanceTab() {
  const { theme, setTheme } = useTheme()

  return (
    <Card className="border-border/50">
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
            <span className="text-base">Modo Escuro (Dark Mode)</span>
            <span className="font-normal text-sm text-muted-foreground">
              Ativa um tema de cores escuras adaptativo para proteger a visão.
            </span>
          </Label>
          <Switch
            id="dark-mode"
            checked={theme === 'dark'}
            onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')}
          />
        </div>
      </CardContent>
    </Card>
  )
}
