import { useState, useMemo, useEffect } from 'react'
import {
  Plus,
  Archive,
  ChevronDown,
  ChevronUp,
  User,
  Building2,
  Crown,
  Loader2,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useAppStore, { Profile } from '@/stores/useAppStore'
import { ProfileCard } from '@/components/profiles/ProfileCard'
import { ProfileEditDialog } from '@/components/profiles/ProfileEditDialog'
import { ProfileDeleteFlow } from '@/components/profiles/ProfileDeleteFlow'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export default function Perfis() {
  const { user, profile: userProfile } = useAuth()
  const { profiles, setProfilesFromDB, searchQuery } = useAppStore()
  const { toast } = useToast()

  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [profileType, setProfileType] = useState('personal')
  const [isSaving, setIsSaving] = useState(false)

  const [editingProfile, setEditingProfile] = useState<Partial<Profile> | null>(null)
  const [deletingProfile, setDeletingProfile] = useState<Profile | null>(null)
  const [archivedOpen, setArchivedOpen] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '')
      setBirthDate(userProfile.birth_date || '')
      setProfileType(userProfile.profile_type || 'personal')
    }
  }, [userProfile])

  useEffect(() => {
    if (!user) return

    const loadMembers = async () => {
      const { data: family } = await supabase
        .from('families')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (family) {
        const { data: members } = await supabase
          .from('members')
          .select(`
            id,
            name,
            email,
            role,
            birth_date,
            profile_id,
            profiles (
              full_name,
              email,
              avatar_url,
              profile_type
            )
          `)
          .eq('family_id', family.id)

        if (members) {
          const mappedProfiles = members.map((m: any) => {
            const p = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles
            return {
              id: m.id,
              profile_id: m.profile_id,
              name: p?.full_name || m.name,
              email: p?.email || m.email || '',
              role: m.role,
              birthDate: m.birth_date || null,
              limit: 0,
              avatar: p?.avatar_url || null,
              context: p?.profile_type === 'enterprise' ? 'business' : 'personal',
              isArchived: false,
            }
          })
          setProfilesFromDB(mappedProfiles)
        }
      }
    }

    loadMembers()
  }, [user, setProfilesFromDB])

  const handleSaveAccount = async () => {
    if (!user) return
    setIsSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        birth_date: birthDate || null,
        profile_type: profileType,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    setIsSaving(false)
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar os dados.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Sucesso', description: 'Seus dados foram atualizados com sucesso.' })
    }
  }

  const filteredProfiles = useMemo(() => {
    if (!searchQuery) return profiles
    const lowerQuery = searchQuery.toLowerCase()
    return profiles.filter(
      (p) => p.name.toLowerCase().includes(lowerQuery) || p.role.toLowerCase().includes(lowerQuery),
    )
  }, [profiles, searchQuery])

  const activeProfiles = filteredProfiles.filter((p) => !p.isArchived)
  const archivedProfiles = filteredProfiles.filter((p) => p.isArchived)

  const plan = userProfile?.plan || 'basic'
  const isPremiumOrTeam = plan !== 'basic' && plan !== 'canceled'
  const limit = isPremiumOrTeam ? Infinity : 1
  const canAddProfile = activeProfiles.length < limit

  const planDisplay =
    plan === 'team'
      ? 'Team'
      : plan === 'premium'
        ? 'Premium'
        : plan === 'basic'
          ? 'Básico'
          : plan.replace('_', ' ').toUpperCase()

  const typeDisplay = profileType === 'enterprise' ? 'Empresarial' : 'Pessoal'

  return (
    <div className="space-y-6 animate-slide-in-up pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#016ad9]">
              Gestão de Perfis
            </h1>
            <Badge
              variant={isPremiumOrTeam ? 'default' : 'secondary'}
              className="uppercase text-[10px] font-bold tracking-wider"
            >
              Plano {planDisplay}
            </Badge>
            <Badge
              variant="outline"
              className="uppercase text-[10px] font-bold tracking-wider text-muted-foreground"
            >
              Conta {typeDisplay}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Gerencie sua conta, assinatura e membros da família.
          </p>
        </div>
      </div>

      <Tabs defaultValue="minha-conta" className="w-full space-y-6">
        <TabsList className="grid grid-cols-2 max-w-sm h-10">
          <TabsTrigger value="minha-conta">Minha Conta</TabsTrigger>
          <TabsTrigger value="membros">Membros</TabsTrigger>
        </TabsList>

        <TabsContent value="minha-conta" className="space-y-6 animate-in fade-in-50 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-[#016ad9]" /> Conta Pessoal
                </CardTitle>
                <CardDescription>
                  Suas informações pessoais de acesso e perfil principal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    value={userProfile?.email || user?.email || ''}
                    readOnly
                    className="bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="w-5 h-5 text-[#016ad9]" /> Perfil Empresarial
                  </CardTitle>
                  <CardDescription>Defina a natureza da sua conta principal.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={profileType}
                    onValueChange={setProfileType}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="personal" id="personal" className="peer sr-only" />
                      <Label
                        htmlFor="personal"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#016ad9] peer-data-[state=checked]:bg-[#016ad9]/5 peer-data-[state=checked]:text-[#016ad9] cursor-pointer"
                      >
                        <User className="mb-2 h-6 w-6" />
                        Pessoal
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="enterprise" id="enterprise" className="peer sr-only" />
                      <Label
                        htmlFor="enterprise"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#016ad9] peer-data-[state=checked]:bg-[#016ad9]/5 peer-data-[state=checked]:text-[#016ad9] cursor-pointer"
                      >
                        <Building2 className="mb-2 h-6 w-6" />
                        Empresarial
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Crown className="w-5 h-5 text-amber-500" /> Assinatura Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {plan === 'team' ? (
                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                      <h4 className="font-semibold text-indigo-600 flex items-center gap-2">
                        Plano Team
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Você possui acesso completo e administrativo ao sistema. Permite
                        gerenciamento sem limites.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-muted/50 border rounded-lg">
                      <h4 className="font-semibold capitalize text-foreground">
                        Plano {planDisplay}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {plan === 'basic' || !plan
                          ? 'Você está no plano básico com recursos limitados. Faça um upgrade para liberar todo o potencial do sistema.'
                          : 'Você possui uma assinatura ativa e acesso aos recursos do seu plano.'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end border-t border-border/50 pt-6">
            <Button
              onClick={handleSaveAccount}
              disabled={isSaving}
              className="gap-2 bg-[#016ad9] hover:bg-[#016ad9]/90 text-white min-w-[180px]"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="membros" className="space-y-6 animate-in fade-in-50 duration-500">
          <div className="flex justify-between items-center bg-muted/20 p-4 rounded-lg border border-border/50">
            <div>
              <h3 className="font-medium">Membros da Família / Equipe</h3>
              <p className="text-sm text-muted-foreground">
                Gerencie o acesso e orçamentos de cada membro.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Button
                className="gap-2 bg-[#016ad9] hover:bg-[#016ad9]/90 text-white"
                onClick={() => setEditingProfile({})}
                disabled={!canAddProfile}
              >
                <Plus className="w-4 h-4" /> Novo Perfil
              </Button>
              {!canAddProfile && (
                <span className="text-xs text-muted-foreground">
                  Limite do plano atingido ({limit}).
                </span>
              )}
            </div>
          </div>

          {activeProfiles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/50">
              Nenhum perfil ativo encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onEdit={() => setEditingProfile(profile)}
                  onDelete={() => setDeletingProfile(profile)}
                />
              ))}
            </div>
          )}

          {archivedProfiles.length > 0 && (
            <Collapsible
              open={archivedOpen}
              onOpenChange={setArchivedOpen}
              className="pt-8 space-y-4"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex justify-between items-center text-muted-foreground hover:bg-muted/50 p-4 h-auto rounded-lg border border-dashed border-border"
                >
                  <span className="text-lg font-semibold tracking-tight flex items-center gap-2">
                    <Archive className="w-5 h-5" /> Perfis Arquivados ({archivedProfiles.length})
                  </span>
                  {archivedOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 grayscale-[0.2]">
                  {archivedProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onEdit={() => setEditingProfile(profile)}
                      onDelete={() => setDeletingProfile(profile)}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {editingProfile !== null && (
            <ProfileEditDialog
              profile={editingProfile}
              open={true}
              onOpenChange={(o) => !o && setEditingProfile(null)}
            />
          )}

          {deletingProfile !== null && (
            <ProfileDeleteFlow
              profile={deletingProfile}
              open={true}
              onOpenChange={(o) => !o && setDeletingProfile(null)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
