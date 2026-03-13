import { useState, useMemo, useEffect } from 'react'
import { Plus, Archive, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import useAppStore, { Profile } from '@/stores/useAppStore'
import { ProfileCard } from '@/components/profiles/ProfileCard'
import { ProfileEditDialog } from '@/components/profiles/ProfileEditDialog'
import { ProfileDeleteFlow } from '@/components/profiles/ProfileDeleteFlow'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export default function Perfis() {
  const { user, profile: userProfile } = useAuth()
  const { profiles, setProfilesFromDB, searchQuery, currentContext } = useAppStore()
  const [editingProfile, setEditingProfile] = useState<Partial<Profile> | null>(null)
  const [deletingProfile, setDeletingProfile] = useState<Profile | null>(null)
  const [archivedOpen, setArchivedOpen] = useState(false)

  // Use the synced DB profile type primarily, fall back to state context
  const isBusiness = userProfile?.profile_type === 'enterprise' || currentContext === 'business'
  const title = isBusiness ? 'Perfil Empresarial' : 'Perfil Pessoal'
  const description = isBusiness
    ? 'Gerencie o acesso e orçamentos da sua equipe.'
    : 'Gerencie o acesso e orçamentos de cada membro da família.'

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

  const typeDisplay = userProfile?.profile_type === 'enterprise' ? 'Empresarial' : 'Pessoal'

  return (
    <div className="space-y-6 animate-slide-in-up pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
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
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Button
            className="gap-2 bg-[#126eda] text-white hover:bg-[#126eda]/90"
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
        <Collapsible open={archivedOpen} onOpenChange={setArchivedOpen} className="pt-8 space-y-4">
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
    </div>
  )
}
