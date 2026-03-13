import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Button } from '@/components/ui/button'
import { Typewriter } from '@/components/Typewriter'
import useAppStore, { Profile } from '@/stores/useAppStore'
import { useToast } from '@/hooks/use-toast'

const schema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  role: z.string().min(1, 'O papel é obrigatório'),
  limit: z.coerce.number().min(0, 'O limite não pode ser negativo'),
  avatar: z.string().url('Deve ser uma URL válida').optional().or(z.literal('')),
})

interface ProfileEditDialogProps {
  profile: Partial<Profile>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileEditDialog({ profile, open, onOpenChange }: ProfileEditDialogProps) {
  const { profiles, setProfiles } = useAppStore()
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.name || '',
      role: profile.role || '',
      limit: profile.limit || 0,
      avatar: profile.avatar || '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: profile.name || '',
        role: profile.role || '',
        limit: profile.limit || 0,
        avatar: profile.avatar || '',
      })
    }
  }, [profile, open, form])

  const isNew = !profile.id

  const onSubmit = (data: any) => {
    if (isNew) {
      const newProfile = {
        id: Math.random().toString(36).substring(2, 9),
        avatar:
          data.avatar ||
          `https://img.usecurling.com/ppl/thumbnail?gender=male&seed=${Math.floor(
            Math.random() * 100,
          )}`,
        ...data,
      }
      setProfiles([...profiles, newProfile])
      toast({ title: 'Perfil criado', description: 'Novo membro adicionado com sucesso.' })
    } else {
      setProfiles(
        profiles.map((p) =>
          p.id === profile.id ? { ...p, ...data, avatar: data.avatar || p.avatar } : p,
        ),
      )
      toast({ title: 'Perfil atualizado', description: 'Dados salvos com sucesso.' })
    }
    onOpenChange(false)
  }

  const currentRole = form.watch('role')
  const showReflection = profile.role === 'Admin' && currentRole && currentRole !== 'Admin'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? 'Novo Perfil' : 'Editar Perfil'}</DialogTitle>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Foto (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  text="Atenção: Remover o acesso de Controle Total revogará privilégios críticos. Essa decisão foi conversada?"
                  speed={25}
                />
              </div>
            )}
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
