import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MOCK_ASSETS } from '@/lib/mockData'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
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

export default function AssetList({ className }: { className?: string }) {
  const [assets, setAssets] = useState(MOCK_ASSETS || [])
  const [open, setOpen] = useState(false)
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

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
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
                  <Label>Tipo</Label>
                  <Select name="category" required defaultValue="Renda Fixa">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Renda Fixa">Renda Fixa</SelectItem>
                      <SelectItem value="Tesouro Direto">Tesouro Direto</SelectItem>
                      <SelectItem value="FIIs">FIIs</SelectItem>
                      <SelectItem value="Ações">Ações</SelectItem>
                      <SelectItem value="Previdência">Previdência</SelectItem>
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
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
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
              <div className="text-right">
                <p className="font-mono font-medium">R$ {asset.value.toLocaleString('pt-BR')}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
