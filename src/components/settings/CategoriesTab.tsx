import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import useAppStore, { Category } from '@/stores/useAppStore'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import { IconPicker } from '@/components/ui/icon-picker'
import { Trash2, Edit2, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export function CategoriesTab() {
  const { user } = useAuth()
  const { categories, setCategories } = useAppStore()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [type, setType] = useState('Expense')
  const [icon, setIcon] = useState('CircleDashed')
  const [editingId, setEditingId] = useState<string | null>(null)

  const resetForm = () => {
    setName('')
    setType('Expense')
    setIcon('CircleDashed')
    setEditingId(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const payload = { name, type, icon, user_id: user.id }

    if (editingId) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editingId)
      if (!error) {
        setCategories(categories.map((c) => (c.id === editingId ? { ...c, ...payload } : c)))
        toast({ title: 'Categoria atualizada' })
        resetForm()
      } else {
        toast({ title: 'Erro ao atualizar', variant: 'destructive' })
      }
    } else {
      const { data, error } = await supabase.from('categories').insert(payload).select().single()
      if (!error && data) {
        setCategories([...categories, { ...payload, id: data.id }])
        toast({ title: 'Categoria adicionada' })
        resetForm()
      } else {
        toast({ title: 'Erro ao adicionar', variant: 'destructive' })
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (!error) {
      setCategories(categories.filter((c) => c.id !== id))
      toast({ title: 'Categoria removida' })
    }
  }

  const openEdit = (cat: Category) => {
    setName(cat.name)
    setType(cat.type)
    setIcon(cat.icon)
    setEditingId(cat.id)
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Nova Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2">
              <Label>Ícone</Label>
              <IconPicker value={icon} onChange={setIcon} />
            </div>
            <div className="space-y-2 flex-1">
              <Label>Nome</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex: Mercado"
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Expense">Despesa</SelectItem>
                  <SelectItem value="Revenue">Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="gap-2">
              {editingId ? (
                <>
                  <Edit2 className="w-4 h-4" /> Atualizar
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Adicionar
                </>
              )}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <DynamicIcon name={cat.icon} className="w-5 h-5 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>
                    {cat.type === 'Revenue' ? (
                      <span className="text-emerald-500 text-xs font-medium">Receita</span>
                    ) : (
                      <span className="text-rose-500 text-xs font-medium">Despesa</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
