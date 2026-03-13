import { useState } from 'react'
import useAppStore, { Account } from '@/stores/useAppStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
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
import { Building2, Plus, Edit2, Trash2, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { CreditCardsSection } from '../components/contas/CreditCardsSection'

export default function Contas() {
  const { user } = useAuth()
  const { accounts, setAccounts, isSyncing, currentContext } = useAppStore()
  const [openAddAcc, setOpenAddAcc] = useState(false)
  const [editingAcc, setEditingAcc] = useState<Account | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSaveAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    const fd = new FormData(e.currentTarget)
    const name = fd.get('name') as string
    const type = fd.get('type') as string
    const balance = Number(fd.get('balance'))
    const agency = fd.get('agency') as string
    const accountNumber = fd.get('account') as string

    setIsSaving(true)

    const payload = {
      user_id: user.id,
      name,
      type,
      balance,
      agency: agency || null,
      account_number: accountNumber || null,
    }

    if (editingAcc) {
      const { error } = await supabase.from('accounts').update(payload).eq('id', editingAcc.id)
      if (!error) {
        setAccounts(
          accounts.map((a) =>
            a.id === editingAcc.id
              ? {
                  ...a,
                  name,
                  bank: name,
                  type,
                  balance,
                  agency,
                  account_number: accountNumber,
                  account: accountNumber,
                }
              : a,
          ),
        )
        toast({ title: 'Conta Atualizada', description: 'Os dados foram salvos com sucesso.' })
      } else {
        toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' })
      }
    } else {
      const { data, error } = await supabase.from('accounts').insert(payload).select().single()
      if (!error && data) {
        const newAcc = {
          id: data.id,
          name: data.name,
          bank: data.name,
          type: data.type || 'Conta Corrente',
          balance: Number(data.balance),
          agency: data.agency || '',
          account_number: data.account_number || '',
          account: data.account_number || '',
          connected: false,
          context: currentContext,
        }
        setAccounts([...accounts, newAcc])
        toast({ title: 'Conta Adicionada', description: 'Nova instituição vinculada com sucesso.' })
      } else {
        toast({ title: 'Erro ao adicionar', description: error?.message, variant: 'destructive' })
      }
    }

    setIsSaving(false)
    setOpenAddAcc(false)
    setEditingAcc(null)
  }

  const deleteAccount = async (id: string) => {
    const { error } = await supabase.from('accounts').delete().eq('id', id)
    if (!error) {
      setAccounts(accounts.filter((a) => a.id !== id))
      toast({ title: 'Conta Removida', description: 'A conta foi permanentemente excluída.' })
    } else {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  if (isSyncing) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Cartões e Contas</h1>
        <p className="text-muted-foreground">
          Gestão segura de métodos de pagamento e conexões bancárias.
        </p>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="cards">Cartões de Crédito</TabsTrigger>
          <TabsTrigger value="accounts">Contas Bancárias</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-0">
          <CreditCardsSection />
        </TabsContent>

        <TabsContent value="accounts" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row justify-between items-center pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5" /> Minhas Contas
                </CardTitle>
                <Dialog
                  open={openAddAcc || !!editingAcc}
                  onOpenChange={(o) => {
                    if (!o) {
                      setOpenAddAcc(false)
                      setEditingAcc(null)
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 gap-1"
                      onClick={() => setOpenAddAcc(true)}
                    >
                      <Plus className="w-3 h-3" /> Nova
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingAcc ? 'Editar Instituição' : 'Adicionar Instituição'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveAccount} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nome do Banco / Instituição</Label>
                        <Input
                          name="name"
                          required
                          defaultValue={editingAcc?.name || editingAcc?.bank || ''}
                          placeholder="Ex: Inter, C6 Bank"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Agência (Opcional)</Label>
                          <Input
                            name="agency"
                            defaultValue={editingAcc?.agency || ''}
                            placeholder="0001"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Conta (Opcional)</Label>
                          <Input
                            name="account"
                            defaultValue={editingAcc?.account_number || editingAcc?.account || ''}
                            placeholder="12345-6"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tipo de Conta</Label>
                          <Select name="type" defaultValue={editingAcc?.type || 'Conta Corrente'}>
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
                          <Input
                            name="balance"
                            type="number"
                            step="0.01"
                            required
                            defaultValue={editingAcc ? editingAcc.balance : ''}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="w-full" disabled={isSaving}>
                          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                          {editingAcc ? 'Salvar Alterações' : 'Salvar Conta'}
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
                      <p className="font-medium">{acc.name || acc.bank}</p>
                      <p className="text-xs text-muted-foreground flex gap-2">
                        <span>{acc.type}</span>
                        {acc.agency && <span>• Ag: {acc.agency}</span>}
                        {(acc.account_number || acc.account) && (
                          <span>• Cc: {acc.account_number || acc.account}</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right transition-transform group-hover:-translate-x-16">
                      <p className="font-mono font-medium">R$ {acc.balance.toFixed(2)}</p>
                    </div>
                    <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setEditingAcc(acc)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteAccount(acc.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {accounts.length === 0 && (
                  <div className="text-center p-4 text-sm text-muted-foreground border border-dashed rounded-md">
                    Nenhuma conta cadastrada.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
