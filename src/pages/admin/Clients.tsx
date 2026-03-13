import { useState, useEffect, useMemo, useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  Search,
  ArrowUpDown,
  Loader2,
  ShieldCheck,
  UserPlus,
  MoreHorizontal,
  Edit,
  UserMinus,
} from 'lucide-react'

const planLabels: Record<string, string> = {
  basica_mensal: 'Básica Mensal',
  basica_anual: 'Básica Anual',
  pro_mensal: 'Pro Mensal',
  pro_anual: 'Pro Anual',
  top_mensal: 'Top Mensal',
  top_anual: 'Top Anual',
  canceled: 'Cancelado',
}

export default function Clients() {
  const { isMasterAdmin, loading } = useAuth()
  const { toast } = useToast()

  const [profiles, setProfiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<'name' | 'date'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Modals state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [userToEdit, setUserToEdit] = useState<any | null>(null)

  // Form states
  const [newFullName, setNewFullName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const [editFullName, setEditFullName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPlan, setEditPlan] = useState('basica_mensal')
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchProfiles = useCallback(async () => {
    setIsLoading(true)
    const { data } = await supabase.from('profiles').select('*')
    if (data) setProfiles(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isMasterAdmin) fetchProfiles()
  }, [isMasterAdmin, fetchProfiles])

  const sortedProfiles = useMemo(() => {
    return [...profiles]
      .filter((p) => {
        const term = searchQuery.toLowerCase()
        return (
          (p.full_name || '').toLowerCase().includes(term) ||
          (p.email || '').toLowerCase().includes(term)
        )
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          const nameA = a.full_name || ''
          const nameB = b.full_name || ''
          return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
        } else {
          const dateA = new Date(a.updated_at || 0).getTime()
          const dateB = new Date(b.updated_at || 0).getTime()
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
        }
      })
  }, [profiles, searchQuery, sortField, sortOrder])

  const toggleSort = (field: 'name' | 'date') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail || !newFullName || !newPassword) {
      toast({ title: 'Atenção', description: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }
    setIsAdding(true)
    const { error } = await supabase.rpc('admin_create_user', {
      new_email: newEmail,
      new_password: newPassword,
      full_name: newFullName,
    })
    setIsAdding(false)

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Cliente adicionado com sucesso.' })
      setIsAddDialogOpen(false)
      setNewEmail('')
      setNewFullName('')
      setNewPassword('')
      fetchProfiles()
    }
  }

  const openEditDialog = (profile: any) => {
    setUserToEdit(profile)
    setEditFullName(profile.full_name || '')
    setEditEmail(profile.email || '')
    setEditPlan(profile.plan || 'basica_mensal')
    setIsEditDialogOpen(true)
  }

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userToEdit) return
    setIsEditing(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editFullName,
        email: editEmail,
        plan: editPlan,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userToEdit.id)

    setIsEditing(false)

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Dados do cliente atualizados com sucesso.' })
      setIsEditDialogOpen(false)
      fetchProfiles()
    }
  }

  const handleDeleteClient = async () => {
    if (!userToDelete) return
    setIsDeleting(true)
    const { error } = await supabase.rpc('admin_delete_user', { target_user_id: userToDelete })
    setIsDeleting(false)

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Cliente removido com sucesso.' })
      setUserToDelete(null)
      fetchProfiles()
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#126eda]" />
      </div>
    )
  }

  if (!isMasterAdmin) return <Navigate to="/dashboard" replace />

  return (
    <div className="space-y-6 animate-slide-in-up pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#126eda] flex items-center gap-2">
            <ShieldCheck className="w-8 h-8" />
            Gestão de Clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão administrativa de todos os usuários e planos registrados.
          </p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 focus-visible:ring-[#126eda]"
            />
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-[#126eda] hover:bg-[#126eda]/90 shrink-0 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      <Card className="border-[#126eda]/20 bg-background/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#126eda]" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead
                    className="cursor-pointer hover:text-[#126eda] transition-colors"
                    onClick={() => toggleSort('name')}
                  >
                    Nome Completo{' '}
                    {sortField === 'name' && <ArrowUpDown className="w-3 h-3 inline ml-1" />}
                  </TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-[#126eda] transition-colors"
                    onClick={() => toggleSort('date')}
                  >
                    Registro{' '}
                    {sortField === 'date' && <ArrowUpDown className="w-3 h-3 inline ml-1" />}
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProfiles.map((p) => (
                  <TableRow key={p.id} className="group">
                    <TableCell className="font-medium text-foreground">
                      {p.full_name || 'Usuário Sem Nome'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.email || '—'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'uppercase text-[10px] font-bold tracking-wider',
                          p.plan?.includes('top') &&
                            'text-purple-600 border-purple-600/30 bg-purple-600/5',
                          p.plan?.includes('pro') &&
                            'text-[#126eda] border-[#126eda]/30 bg-[#126eda]/5',
                          p.plan?.includes('basica') &&
                            'text-emerald-600 border-emerald-600/30 bg-emerald-600/5',
                          p.plan === 'canceled' &&
                            'bg-destructive/10 text-destructive border-destructive/20',
                        )}
                      >
                        {planLabels[p.plan] || p.plan || 'Desconhecido'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {p.updated_at ? new Date(p.updated_at).toLocaleDateString('pt-BR') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => openEditDialog(p)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Cliente
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setUserToDelete(p.id)}
                            className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
                          >
                            <UserMinus className="mr-2 h-4 w-4" />
                            Remover Acesso
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedProfiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-8 text-muted-foreground">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            <DialogDescription>Crie uma conta manualmente para um novo cliente.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddClient} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="João Silva"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="joao@exemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha Provisória</Label>
              <Input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isAdding}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#126eda] hover:bg-[#126eda]/90 text-white"
                disabled={isAdding}
              >
                {isAdding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Adicionar Cliente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>Atualize as informações do cliente e seu plano.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditClient} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                placeholder="João Silva"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">E-mail</Label>
              <Input
                id="edit-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="joao@exemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-plan">Plano de Assinatura</Label>
              <Select value={editPlan} onValueChange={setEditPlan}>
                <SelectTrigger id="edit-plan">
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basica_mensal">Básica Mensal</SelectItem>
                  <SelectItem value="basica_anual">Básica Anual</SelectItem>
                  <SelectItem value="pro_mensal">Pro Mensal</SelectItem>
                  <SelectItem value="pro_anual">Pro Anual</SelectItem>
                  <SelectItem value="top_mensal">Top Mensal</SelectItem>
                  <SelectItem value="top_anual">Top Anual</SelectItem>
                  <SelectItem value="canceled">Assinatura Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isEditing}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#126eda] hover:bg-[#126eda]/90 text-white"
                disabled={isEditing}
              >
                {isEditing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remover Acesso do Cliente</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este cliente? Esta ação não pode ser desfeita e todos
              os dados relacionados (família, transações) serão apagados permanentemente do sistema.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setUserToDelete(null)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteClient} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Sim, Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
