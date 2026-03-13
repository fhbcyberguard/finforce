import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import useAppStore, { Category } from '@/stores/useAppStore'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import { IconPicker } from '@/components/ui/icon-picker'
import { ColorPicker } from '@/components/ui/color-picker'
import { Trash2, Edit2, Plus, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

export function CategoriesTab() {
  const { user } = useAuth()
  const { categories, setCategories } = useAppStore()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [type, setType] = useState('Expense')
  const [icon, setIcon] = useState('CircleDashed')
  const [color, setColor] = useState('#64748b')
  const [editingId, setEditingId] = useState<string | null>(null)

  const SECTIONS = useMemo(
    () => [
      { key: 'Revenue', title: 'Receitas', icon: TrendingUp, color: 'text-emerald-500' },
      { key: 'Expense', title: 'Despesas', icon: TrendingDown, color: 'text-rose-500' },
      { key: 'Investment', title: 'Investimentos', icon: PiggyBank, color: 'text-indigo-500' },
    ],
    [],
  )

  const resetForm = () => {
    setName('')
    setType('Expense')
    setIcon('CircleDashed')
    setColor('#64748b')
    setEditingId(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const payload = { name, type, icon, color, user_id: user.id }

    if (editingId) {
      const { error } = await supabase
        .from('categories')
        .update(payload as any)
        .eq('id', editingId)
      if (!error) {
        setCategories(categories.map((c) => (c.id === editingId ? { ...c, ...payload } : c)))
        toast({ title: 'Categoria atualizada' })
        resetForm()
      } else {
        toast({ title: 'Erro ao atualizar', variant: 'destructive' })
      }
    } else {
      const { data, error } = await supabase
        .from('categories')
        .insert(payload as any)
        .select()
        .single()
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
    setColor(cat.color || '#64748b')
    setEditingId(cat.id)
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">
            {editingId ? 'Editar Categoria' : 'Nova Categoria'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2">
              <Label>Ícone</Label>
              <IconPicker value={icon} onChange={setIcon} />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <ColorPicker value={color} onChange={setColor} />
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
                  <SelectItem value="Revenue">Receita</SelectItem>
                  <SelectItem value="Expense">Despesa</SelectItem>
                  <SelectItem value="Investment">Investimento</SelectItem>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {SECTIONS.map((section) => {
          const sectionCats = categories.filter((c) => c.type === section.key)
          return (
            <Card key={section.key} className="border-border/50 overflow-hidden shadow-sm h-full">
              <div className="bg-muted/30 px-4 py-3 border-b flex items-center gap-2">
                <section.icon className={cn('w-4 h-4', section.color)} />
                <h3 className="font-medium text-sm">{section.title}</h3>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {sectionCats.length}
                </Badge>
              </div>
              <CardContent className="p-0">
                <Table>
                  <TableBody>
                    {sectionCats.map((cat) => (
                      <TableRow key={cat.id} className="group">
                        <TableCell className="w-[40px] pl-4 pr-0">
                          <DynamicIcon
                            name={cat.icon}
                            className="w-4 h-4"
                            style={{ color: cat.color || 'var(--muted-foreground)' }}
                          />
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: cat.color || '#64748b' }}
                            />
                            <span className="truncate">{cat.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-4 py-2">
                          <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEdit(cat)}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDelete(cat.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {sectionCats.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground py-6 text-xs h-24"
                        >
                          Nenhuma categoria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
