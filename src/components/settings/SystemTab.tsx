import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle as DTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Save, CodeSquare } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/useAppStore'

export function SystemTab() {
  const { toast } = useToast()
  const { logoUrl, setLogoUrl } = useAppStore()
  const [localLogoUrl, setLocalLogoUrl] = useState(logoUrl)
  const [showJson, setShowJson] = useState(false)
  const [sessionName, setSessionName] = useState('Visão Geral')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setLogoUrl(localLogoUrl)
    toast({
      title: 'Personalizações salvas',
      description: 'Nomenclaturas e identidade visual atualizadas com sucesso.',
    })
  }

  const generateSystemState = () =>
    JSON.stringify(
      { branding: { logoUrl: localLogoUrl }, ux: { dashboardName: sessionName } },
      null,
      2,
    )

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Customização de Nomenclatura e Visual</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Nome do Painel Principal (Dashboard)</Label>
                <Input value={sessionName} onChange={(e) => setSessionName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>URL do Logo / Ícone (ico)</Label>
                <Input
                  value={localLogoUrl}
                  onChange={(e) => setLocalLogoUrl(e.target.value)}
                  placeholder="https://img.usecurling.com/i?q=finance&shape=outline&color=teal"
                />
                <p className="text-xs text-muted-foreground">
                  Deixe em branco para usar o ícone padrão da FinFlow.
                </p>
              </div>
            </div>
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" /> Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-dashed border-2 bg-muted/10">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <CodeSquare className="w-4 h-4" /> Diagnóstico e Integridade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" onClick={() => setShowJson(true)}>
            Exportar Estado do Sistema (JSON)
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showJson} onOpenChange={setShowJson}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DTitle>Estado do Sistema Gerado</DTitle>
            <DialogDescription>
              Snapshot atual para auditoria, integridade de dados ou suporte.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-zinc-950 p-4 rounded-md overflow-auto max-h-[400px]">
            <pre className="text-xs text-emerald-400 font-mono">{generateSystemState()}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
