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
import useAppStore, { Profile } from '@/stores/useAppStore'
import { useToast } from '@/hooks/use-toast'
import { Target } from 'lucide-react'

const schema = z.object({
  name: z
    .string()
    .min(1, 'O nome é obrigatório')
    .regex(/^[^0-9]*$/, 'O nome não deve conter números'),
  role: z.string().min(1, 'O papel é obrigatório'),
  limit: z.coerce.number().min(0, 'O limite não pode ser negativo'),
  avatar: z.string().url('Deve ser uma URL válida').optional().or(z.literal('')),
  currentAge: z.coerce.number().min(0, 'Idade inválida').optional(),
  retirementPlanDuration: z.coerce.number().min(0, 'Duração inválida').optional(),
})

interface ProfileEditDialogProps {
  profile: Partial<Profile>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileEditDialog({ profile, open, onOpenChange }: ProfileEditDialogProps) {
  const { profiles, setProfiles, currentContext } = useAppStore()
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.name || '',
      role: profile.role || '',
      limit: profile.limit || 0,
      avatar: profile.avatar || '',
      currentAge: profile.currentAge || 0,
      retirementPlanDuration: profile.retirementPlanDuration || 0,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: profile.name || '',
        role: profile.role || '',
        limit: profile.limit || 0,
        avatar: profile.avatar || '',
        currentAge: profile.currentAge || 0,
        retirementPlanDuration: profile.retirementPlanDuration || 0,
      })
    }
  }, [profile, open, form])

  const isNew = !profile.id

  const onSubmit = (data: any) => {
    if (isNew) {
      const newProfile = {
        id: Math.random().toString(36).substring(2, 9),
        context: currentContext,
        avatar:
          data.avatar ||
          `https://img.usecurling.com/ppl/thumbnail?gender=male&seed=${Math.floor(Math.random() * 100)}`,
        ...data,
      }
      setProfiles([...profiles, newProfile])
      toast({ title: 'Perfil criado', description: 'Membro adicionado com sucesso.' })
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

  const age = form.watch('currentAge') || 0
  const duration = form.watch('retirementPlanDuration') || 0
  const projectedAge = age + duration

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Novo Perfil' : 'Editar Perfil'}</DialogTitle>
          <DialogDescription>
            Atualize as informações de acesso e metas do perfil.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <FormLabel>Limite Mês (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
              <FormField
                control={form.control}
                name="currentAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idade Atual</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="retirementPlanDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração do Plano (anos)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {projectedAge > 0 && (
              <div className="mt-2 p-3 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                <Target className="w-4 h-4" /> Idade ao alcançar: {projectedAge} anos
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
