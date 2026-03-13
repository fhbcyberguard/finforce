import { useState, useMemo } from 'react'
import useAppStore, { Transaction } from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, User, Plus, TrendingUp, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { differenceInYears } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { ImpulseControlDialog } from '@/components/ImpulseControlDialog'
import { Badge } from '@/components/ui/badge'

export default function Patrimonio() {
  const { user } = useAuth()
  const {
    profiles,
    simulatorSettings,
    assets,
    setAssets,
    transactions,
    setTransactions,
    currentContext,
  } = useAppStore()
  const { toast } = useToast()

  const [openAddAsset, setOpenAddAsset] = useState(false)
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const targetAge = simulatorSettings?.idade || 60

  const totalAssets = useMemo(() => {
    return assets.reduce((acc, asset) => acc + asset.value, 0)
  }, [assets])

  const handleAddAsset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    const fd = new FormData(e.currentTarget)
    const assetName = fd.get('name') as string
    const category = fd.get('category') as string
    const value = Number(fd.get('value'))
    const bankBroker = fd.get('bankBroker') as string

    setIsSaving(true)

    const txPayload = {
      user_id: user.id,
      description: `Ativo: ${assetName}`,
      amount: value,
      type: 'Asset',
      category: category,
      date: new Date().toISOString(),
      asset_name: assetName,
      bank_broker: bankBroker || null,
      context: currentContext,
    }

    const { data, error } = await supabase.from('transactions').insert(txPayload).select().single()

    setIsSaving(false)

    if (!error && data) {
      const newAsset = {
        id: data.id,
        name: assetName,
        value,
        type: 'Asset',
        category,
        bankBroker,
        context: currentContext,
      }

      setAssets([...assets, newAsset])
      setTransactions([{ ...data, id: data.id } as any, ...transactions])
      setOpenAddAsset(false)
      toast({ title: 'Ativo Adicionado', description: 'O ativo foi incluído no seu patrimônio.' })
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o ativo. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const confirmDeleteAsset = async () => {
    if (!assetToDelete) return

    const { error } = await supabase.from('transactions').delete().eq('id', assetToDelete)

    if (!error) {
      setAssets(assets.filter((a) => a.id !== assetToDelete))
      setTransactions(transactions.filter((t) => t.id !== assetToDelete))
      toast({ title: 'Ativo Removido', description: 'O ativo foi retirado da sua carteira.' })
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o ativo.',
        variant: 'destructive',
      })
    }
    setAssetToDelete(null)
  }

  return (
    <div className="space-y-8 animate-slide-in-up pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
          Patrimônio & Aposentadoria
        </h1>
        <p className="text-muted-foreground">
          Acompanhe seus ativos e o progresso para a independência financeira.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-3 border-border/50 bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Patrimônio Total Acumulado
              </p>
              <h2 className="text-4xl font-bold text-primary">
                R$ {totalAssets.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h2>
            </div>
            <Dialog open={openAddAsset} onOpenChange={setOpenAddAsset}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" /> Novo Ativo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Ativo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddAsset} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome do Ativo</Label>
                    <Input name="name" placeholder="Ex: CDB Banco Master, Apartamento" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Classe de Ativo</Label>
                      <Select name="category" required defaultValue="Renda Fixa">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Renda Fixa">Renda Fixa (CDB/LCI/LCA)</SelectItem>
                          <SelectItem value="Tesouro Direto">Tesouro Direto</SelectItem>
                          <SelectItem value="FIIs">FIIs</SelectItem>
                          <SelectItem value="Ações">Ações</SelectItem>
                          <SelectItem value="Previdência Privada">Previdência Privada</SelectItem>
                          <SelectItem value="Imóveis">Imóveis</SelectItem>
                          <SelectItem value="Criptomoedas">Criptomoedas</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Valor Atual (R$)</Label>
                      <Input name="value" type="number" step="0.01" placeholder="10000" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Instituição / Corretora (Opcional)</Label>
                    <Input name="bankBroker" placeholder="Ex: XP Investimentos, Banco Inter" />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full" disabled={isSaving}>
                      {isSaving ? 'Salvando...' : 'Salvar Ativo'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Plano de Aposentadoria
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => {
            const currentAge = p.birthDate
              ? differenceInYears(new Date(), new Date(p.birthDate))
              : p.currentAge || 0
            const futureAge = targetAge
            const remaining = futureAge - currentAge

            return (
              <Card
                key={p.id}
                className="border-border/50 hover:border-primary/30 transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2.5 rounded-full text-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{p.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{p.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                    <span className="text-sm text-muted-foreground">Idade Atual</span>
                    <span className="font-semibold">{currentAge} anos</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-primary/5 border border-primary/10">
                    <span className="text-sm text-muted-foreground">Idade Futura (Alvo)</span>
                    <span className="font-bold text-primary">{futureAge} anos</span>
                  </div>
                  <div className="flex justify-between items-center px-2 pt-1 text-sm">
                    <span className="text-muted-foreground">Tempo Restante</span>
                    <span className="font-medium">
                      {remaining > 0 ? `${remaining} anos` : 'Atingido'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {profiles.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted-foreground border border-dashed rounded-lg">
              Nenhum perfil cadastrado no contexto atual. Adicione membros para visualizar.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Meus Ativos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <Card key={asset.id} className="border-border/50 group overflow-hidden relative">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{asset.name}</h3>
                    {asset.bankBroker && (
                      <p className="text-xs text-muted-foreground mt-0.5">{asset.bankBroker}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs font-medium">
                    {asset.category}
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Valor Aplicado</p>
                  <p className="text-xl font-bold">
                    R$ {asset.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                    onClick={() => setAssetToDelete(asset.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {assets.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted-foreground border border-dashed rounded-lg bg-muted/10">
              Nenhum ativo financeiro registrado neste contexto.
            </div>
          )}
        </div>
      </div>

      <ImpulseControlDialog
        open={!!assetToDelete}
        onOpenChange={(o) => !o && setAssetToDelete(null)}
        onConfirm={confirmDeleteAsset}
        title="Excluir Ativo / Resgate?"
        description="Você está prestes a remover este ativo da sua carteira e apagar sua transação correspondente."
        reflectionText="O resgate deste ativo afetará diretamente seu tempo até a independência financeira. Essa mudança de rota foi planejada?"
        confirmText="Sim, Confirmar Resgate"
      />
    </div>
  )
}
