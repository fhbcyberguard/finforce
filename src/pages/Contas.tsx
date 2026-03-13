import { useState } from 'react'
import { MOCK_ACCOUNTS } from '@/lib/mockData'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Building2, CreditCard, Lock, ShieldCheck, RefreshCw } from 'lucide-react'

export default function Contas() {
  const [openFinance, setOpenFinance] = useState(false)

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Cartões e Contas</h1>
        <p className="text-muted-foreground">
          Gestão segura de métodos de pagamento e conexões bancárias.
        </p>
      </div>

      <Card className="border-secondary/20 bg-secondary/5">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-secondary/20 p-3 rounded-full mt-1">
              <ShieldCheck className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                Open Finance
                {openFinance ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500">
                    Conectado
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                    Aguardando
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xl mt-1">
                Conecte seus bancos para sincronização automática. Dados protegidos por criptografia
                ponta a ponta e em conformidade com a LGPD.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="of-toggle" className="text-sm text-muted-foreground">
              Sincronização Ativa
            </Label>
            <Switch id="of-toggle" checked={openFinance} onCheckedChange={setOpenFinance} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5" /> Contas Conectadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_ACCOUNTS.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{acc.bank}</p>
                  <p className="text-xs text-muted-foreground">{acc.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-medium">R$ {acc.balance.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground flex items-center justify-end gap-1 mt-0.5">
                    {acc.connected ? (
                      <>
                        <RefreshCw className="w-3 h-3 text-emerald-500" /> Sincronizado
                      </>
                    ) : (
                      'Manual'
                    )}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Adicionar Cartão
            </CardTitle>
            <CardDescription>Insira apenas os últimos 4 dígitos por segurança.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label>Nome da Instituição (Banco/Emissor)</Label>
                <Input placeholder="Ex: Itaú, Nubank" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bandeira</Label>
                  <Input placeholder="Mastercard, Visa" />
                </div>
                <div className="space-y-2">
                  <Label>Últimos 4 Dígitos</Label>
                  <div className="relative">
                    <Input placeholder="1234" maxLength={4} className="font-mono pl-10" />
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4">Salvar Cartão Seguro</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
