import { useState, useEffect } from 'react'
import { MOCK_PROFILES } from '@/lib/mockData'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Archive, Edit2, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Typewriter } from '../components/Typewriter'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImpulseControlDialog } from '../components/ImpulseControlDialog'

const profileSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  role: z.string().min(1, 'O papel é obrigatório'),
  limit: z.coerce.number().min(0, 'O limite não pode ser negativo'),
})

type ProfileFormValues = z.infer<typeof profileSchema>
type Profile = (typeof MOCK_PROFILES)[0]

export default function Perfis() {
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES || [])
  const [archiveId, setArchiveId] = useState<string | null>(null)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const { toast } = useToast()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', role: '', limit: 0 },
  })

  useEffect(() => {
    if (editingProfile) {
      form.reset({
        name: editingProfile.name,
        role: editingProfile.role,
        limit: editingProfile.limit,
      })
    }
  }, [editingProfile, form])

  const handleArchive = () => {
    setProfiles(profiles.filter((p) => p.id !== archiveId))
    toast({ title: 'Perfil arquivado', description: 'Histórico preservado, mas acesso revogado.' })
  }

  const onSubmit = (data: ProfileFormValues) => {
    if (!editingProfile) return
    setProfiles(profiles.map((p) => (p.id === editingProfile.id ? { ...p, ...data } : p)))
    setEditingProfile(null)
    toast({
      title: 'Perfil atualizado',
      description: `Dados de ${data.name} foram salvos com sucesso.`,
    })
  }

  const currentRole = form.watch('role')
  const showReflection = editingProfile?.role === 'Admin' && currentRole && currentRole !== 'Admin'

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Perfis da Família</h1>
          <p className="text-muted-foreground">Gerencie o acesso e orçamentos de cada membro.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Novo Perfil
        </Button>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/50">
          Nenhum perfil encontrado. Crie um novo perfil para começar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className="flex flex-col border-border/50 hover:border-primary/30 transition-colors"
            >
              <CardContent className="pt-6 flex flex-col items-center text-center flex-1">
                <Avatar className="w-20 h-20 mb-4 ring-4 ring-background shadow-lg">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{profile.name}</h3>
                <Badge variant="secondary" className="mt-1 mb-4">
                  {profile.role}
                </Badge>
                <div className="w-full bg-muted/50 rounded-lg p-3 mt-auto">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Limite Orçamentário
                  </p>
                  <p className="font-mono font-medium">
                    R$ {profile.limit.toLocaleString('pt-BR')}/mês
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 p-3 grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setEditingProfile(profile)}
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => setArchiveId(profile.id)}
                >
                  <Archive className="w-4 h-4 mr-2" /> Arquivar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <ImpulseControlDialog
        open={!!archiveId}
        onOpenChange={(o) => !o && setArchiveId(null)}
        onConfirm={handleArchive}
        title="Arquivar Perfil da Família?"
        description="O perfil será movido para Arquivados. Transações anteriores continuarão existindo para cálculos de patrimônio, mas o acesso ao app será revogado."
        reflectionText="Antes de prosseguir: Qual o real motivo para revogar este acesso? Manter a transparência financeira ajuda no engajamento de toda a família rumo à independência."
        confirmText="Arquivar Perfil"
      />

      <Dialog open={!!editingProfile} onOpenChange={(o) => !o && setEditingProfile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>Atualize as informações do membro da família.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Customizado</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do perfil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Permissão</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Admin">Controle Total</SelectItem>
                          <SelectItem value="Edição">Edição Parcial</SelectItem>
                          <SelectItem value="Visualização">Apenas Visão</SelectItem>
                          <SelectItem value="Dependente">Dependente (Limite)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {showReflection && (
                <div className="pt-2 pb-2 mt-2 text-sm text-amber-500 italic border-l-2 border-amber-500 pl-4 bg-amber-500/10 rounded-r-md">
                  <Typewriter
                    text="Atenção: Remover o acesso de Controle Total revogará privilégios críticos deste perfil. Essa decisão foi conversada em família?"
                    speed={25}
                  />
                </div>
              )}
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setEditingProfile(null)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
