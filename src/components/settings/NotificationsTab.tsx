import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function NotificationsTab() {
  const [notificacoesD2, setNotificacoesD2] = useState(true)

  return (
    <Card className="border-border/50">
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="notif-d2" className="flex flex-col space-y-1">
            <span className="text-base">Alertas D-2</span>
            <span className="font-normal text-sm text-muted-foreground">
              Receba avisos 2 dias antes de vencimentos de faturas via App/Email.
            </span>
          </Label>
          <Switch id="notif-d2" checked={notificacoesD2} onCheckedChange={setNotificacoesD2} />
        </div>
      </CardContent>
    </Card>
  )
}
