import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Target } from 'lucide-react'
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
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

const schema = z.object({
  name: z
    .string()
    .min(1, 'O nome é obrigatório')
    .regex(/^[^0-9]*$/, 'O nome não deve conter números'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  role: z.string().min(1, 'O papel é obrigatório'),
  currentAge: z.coerce.number().min(0, 'Idade inválida').optional(),
  avatar: z.string().optional().nullable(),
})

interface ProfileEditDialogProps {
  profile: Partial<Profile>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileEditDialog({ profile, open, onOpenChange }: ProfileEditDialogProps) {
  const { profiles, setProfiles, currentContext, simulatorSettings } = useAppStore()
  const { toast } = useToast()
  const { user } = useAuth()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.name || '',
      email: profile.email || '',
      role: profile.role || '',
      currentAge: profile.currentAge || 0,
      avatar: profile.avatar || null,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role || '',
        currentAge: profile.currentAge || 0,
        avatar: profile.avatar || null,
      })
    }
  }, [profile, open, form])

  const isNew = !profile.id

  const onSubmit = async (data: any) => {
    if (isNew) {
      let newId = Math.random().toString(36).substring(2, 9)
      if (user) {
        const { data: family } = await supabase
          .from('families')
          .select('id')
          .eq('owner_id', user.id)
          .single()
        if (family) {
          const { data: dbMember } = await supabase
            .from('members')
            .insert({
              family_id: family.id,
              name: data.name,
              email: data.email || null,
              role: data.role,
            })
            .select()
            .single()
          if (dbMember) newId = dbMember.id
        }
      }
      const newProfile = {
        id: newId,
        context: currentContext,
        limit: 0,
        ...data,
      }
      setProfiles([...profiles, newProfile])
      toast({ title: 'Perfil criado', description: 'Membro adicionado com sucesso.' })
    } else {
      if (user && profile.id.length > 10) {
        // Naive check for uuid vs random string
        await supabase
          .from('members')
          .update({
            name: data.name,
            email: data.email || null,
            role: data.role,
          })
          .eq('id', profile.id)

        if (data.avatar !== profile.avatar && profile.profile_id) {
          await supabase
            .from('profiles')
            .update({ avatar_url: data.avatar })
            .eq('id', profile.profile_id)
        }
      }
      setProfiles(profiles.map((p) => (p.id === profile.id ? { ...p, ...data } : p)))
      toast({ title: 'Perfil atualizado', description: 'Dados salvos com sucesso.' })
    }
    onOpenChange(false)
  }

  const age = form.watch('currentAge') || 0
  const targetAge = simulatorSettings?.idade || 60
  const duration = Math.max(0, targetAge - age)

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
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center group">
                {form.watch('avatar') ? (
                  <img
                    src={form.watch('avatar') as string}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (ev) => form.setValue('avatar', ev.target?.result as string)
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Clique para alterar a foto</p>
            </div>

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

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Opcional" {...field} />
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
                        <SelectItem value="Dependente">Dependente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>

            <div className="pt-2 border-t border-border/50">
              <p className="text-sm font-medium mb-2">Duração do Plano Estimada</p>
              <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground flex items-center justify-between gap-2 border border-border">
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Tempo até aposentadoria:
                </span>
                <span className="font-medium text-foreground">
                  {duration > 0 ? `${duration} anos` : 'Atingido'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 opacity-80 text-right">
                Baseado na idade alvo de {targetAge} anos.
              </p>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#03f2ff] text-black hover:bg-[#03f2ff]/90">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
