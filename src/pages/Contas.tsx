import { useState } from 'react'
import { MOCK_ACCOUNTS } from '@/lib/mockData'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Building2, CreditCard, Lock, ShieldCheck, RefreshCw, Archive, Plus } from 'lucide-react'
import { ImpulseControlDialog } from '../components/ImpulseControlDialog'
import { useToast } from '@/hooks/use-toast'

export default function Contas() {
  const [openFinance, setOpenFinance] = useState(false)
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS)
  const [openAddAcc, setOpenAddAcc] = useState(false)
  const [accountToArchive, setAccountToArchive] = useState<string | null>(null)
  const { toast } = useToast()

  const handleAddAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const newAcc = {
      id: Math.random().toString(),
      bank: fd.get('bank') as string,
      type: fd.get('type') as string,
      balance: Number(fd.get('balance')),
      agency: fd.get('agency') as string,
      account: fd.get('account') as string,
      connected: false,
    }
    setAccounts([...accounts, newAcc])
    setOpenAddAcc(false)
    toast({ title: 'Conta Adicionada', description: 'Nova instituição vinculada com sucesso.' })
  }

  const confirmArchive = () => {
    setAccounts(accounts.filter((a) => a.id !== accountToArchive))
    toast({
      title: 'Conta Arquivada',
      description: 'O histórico foi preservado para relatórios anuais.',
    })
  }

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
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5" /> Minhas Contas
            </CardTitle>
            <Dialog open={openAddAcc} onOpenChange={setOpenAddAcc}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 gap-1">
                  <Plus className="w-3 h-3" /> Nova
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Instituição</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddAccount} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome do Banco / Instituição</Label>
                    <Input name="bank" required placeholder="Ex: Inter, C6 Bank" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Agência (Opcional)</Label>
                      <Input name="agency" placeholder="0001" />
                    </div>
                    <div className="space-y-2">
                      <Label>Conta (Opcional)</Label>
                      <Input name="account" placeholder="12345-6" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Conta</Label>
                      <Select name="type" defaultValue="Conta Corrente">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Conta Corrente">Conta Corrente</SelectItem>
                          <SelectItem value="Conta Poupança">Conta Poupança</SelectItem>
                          <SelectItem value="Conta Investimento">Investimento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Saldo Inicial (R$)</Label>
                      <Input name="balance" type="number" step="0.01" required placeholder="0.00" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">
                      Salvar Conta
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors relative overflow-hidden"
              >
                <div>
                  <p className="font-medium">{acc.bank}</p>
                  <p className="text-xs text-muted-foreground flex gap-2">
                    <span>{acc.type}</span>
                    {acc.agency && <span>• Ag: {acc.agency}</span>}
                    {acc.account && <span>• Cc: {acc.account}</span>}
                  </p>
                </div>
                <div className="text-right transition-transform group-hover:-translate-x-10">
                  <p className="font-mono font-medium">R$ {acc.balance.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground flex items-center justify-end gap-1 mt-0.5">
                    {acc.connected ? (
                      <>
                        <RefreshCw className="w-3 h-3 text-emerald-500" /> Sync
                      </>
                    ) : (
                      'Manual'
                    )}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  onClick={() => setAccountToArchive(acc.id)}
                >
                  <Archive className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Adicionar Cartão Seguro
            </CardTitle>
            <CardDescription>
              Insira apenas os últimos 4 dígitos. Nunca pedimos CVV ou número completo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                toast({ title: 'Cartão Salvo' })
              }}
            >
              <div className="space-y-2">
                <Label>Emissor (Banco/Fintech)</Label>
                <Input placeholder="Ex: Itaú Personnalité" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bandeira</Label>
                  <Input placeholder="Mastercard, Visa" required />
                </div>
                <div className="space-y-2">
                  <Label>Últimos 4 Dígitos</Label>
                  <div className="relative">
                    <Input placeholder="1234" maxLength={4} required className="font-mono pl-10" />
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Limite Global (R$)</Label>
                  <Input type="number" placeholder="5000" />
                </div>
                <div className="space-y-2">
                  <Label>Dia Vencimento da Fatura</Label>
                  <Input type="number" min="1" max="31" placeholder="10" required />
                </div>
              </div>
              <Button type="submit" className="w-full mt-2">
                Registrar Cartão
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <ImpulseControlDialog
        open={!!accountToArchive}
        onOpenChange={(o) => !o && setAccountToArchive(null)}
        onConfirm={confirmArchive}
        title="Arquivar Conta Bancária"
        description="Esta conta não aparecerá mais nos saldos diários, mas suas transações passadas serão mantidas no histórico de patrimônio."
        reflectionText="Atenção: Ocultar dados financeiros reais pode criar uma falsa sensação de organização. Você tem certeza que deseja remover esta conta da sua visão diária?"
      />
    </div>
  )
}
