import { useState, useMemo } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
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
import { useToast } from '@/hooks/use-toast'
import { ImpulseControlDialog } from '../ImpulseControlDialog'

export default function AssetList({ className }: { className?: string }) {
  const { assets, setAssets, searchQuery } = useAppStore()
  const [open, setOpen] = useState(false)
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const newAsset = {
      id: Math.random().toString(),
      name: fd.get('name') as string,
      category: fd.get('category') as string,
      value: Number(fd.get('value')),
      rate: fd.get('rate') as string,
    }
    setAssets([...assets, newAsset])
    setOpen(false)
    toast({ title: 'Ativo adicionado', description: 'O ativo foi incluído no seu patrimônio.' })
  }

  const confirmDelete = () => {
    setAssets(assets.filter((a) => a.id !== assetToDelete))
    toast({ title: 'Ativo removido', description: 'O ativo foi retirado da sua carteira.' })
  }

  const filteredAssets = useMemo(() => {
    if (!searchQuery) return assets
    const lowerQuery = searchQuery.toLowerCase()
    return assets.filter(
      (a) =>
        a.name.toLowerCase().includes(lowerQuery) || a.category.toLowerCase().includes(lowerQuery),
    )
  }, [assets, searchQuery])

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Meus Ativos</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="w-4 h-4" /> Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Ativo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Ativo</Label>
                <Input name="name" placeholder="Ex: CDB Banco Master" required />
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor Atual (R$)</Label>
                  <Input name="value" type="number" step="0.01" placeholder="10000" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Rentabilidade/Taxa</Label>
                <Input name="rate" placeholder="Ex: 110% CDI, IPCA + 6%" required />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">
                  Salvar Ativo
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mt-2">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors relative overflow-hidden"
            >
              <div>
                <p className="font-medium">{asset.name}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-[10px]">
                    {asset.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{asset.rate}</span>
                </div>
              </div>
              <div className="text-right transition-transform group-hover:-translate-x-8">
                <p className="font-mono font-medium">R$ {asset.value.toLocaleString('pt-BR')}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                onClick={() => setAssetToDelete(asset.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {filteredAssets.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              Nenhum ativo encontrado.
            </p>
          )}
        </div>
      </CardContent>

      <ImpulseControlDialog
        open={!!assetToDelete}
        onOpenChange={(o) => !o && setAssetToDelete(null)}
        onConfirm={confirmDelete}
        title="Excluir Ativo / Resgate?"
        description="Você está prestes a remover este ativo da sua carteira."
        reflectionText="Remover este patrimônio impacta seu Ponto de Liberdade. Você revisou sua estratégia de diversificação?"
        confirmText="Sim, Confirmar Resgate"
      />
    </Card>
  )
}
