import { useState, useMemo } from 'react'
import { Plus, Archive, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useAppStore, { Profile } from '@/stores/useAppStore'
import { ProfileCard } from '@/components/profiles/ProfileCard'
import { ProfileEditDialog } from '@/components/profiles/ProfileEditDialog'
import { ProfileDeleteFlow } from '@/components/profiles/ProfileDeleteFlow'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'

export default function Perfis() {
  const { profiles, searchQuery } = useAppStore()
  const [editingProfile, setEditingProfile] = useState<Partial<Profile> | null>(null)
  const [deletingProfile, setDeletingProfile] = useState<Profile | null>(null)
  const [archivedOpen, setArchivedOpen] = useState(false)

  const filteredProfiles = useMemo(() => {
    if (!searchQuery) return profiles
    const lowerQuery = searchQuery.toLowerCase()
    return profiles.filter(
      (p) => p.name.toLowerCase().includes(lowerQuery) || p.role.toLowerCase().includes(lowerQuery),
    )
  }, [profiles, searchQuery])

  const activeProfiles = filteredProfiles.filter((p) => !p.isArchived)
  const archivedProfiles = filteredProfiles.filter((p) => p.isArchived)

  return (
    <div className="space-y-6 animate-slide-in-up pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Perfis da Família</h1>
          <p className="text-muted-foreground">Gerencie o acesso e orçamentos de cada membro.</p>
        </div>
        <Button className="gap-2" onClick={() => setEditingProfile({})}>
          <Plus className="w-4 h-4" /> Novo Perfil
        </Button>
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
