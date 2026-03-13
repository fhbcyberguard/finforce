import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useAppStore, { Profile } from '@/stores/useAppStore'
import { ProfileCard } from '@/components/profiles/ProfileCard'
import { ProfileEditDialog } from '@/components/profiles/ProfileEditDialog'
import { ProfileDeleteFlow } from '@/components/profiles/ProfileDeleteFlow'

export default function Perfis() {
  const { profiles } = useAppStore()
  const [editingProfile, setEditingProfile] = useState<Partial<Profile> | null>(null)
  const [deletingProfile, setDeletingProfile] = useState<Profile | null>(null)

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Perfis da Família</h1>
          <p className="text-muted-foreground">Gerencie o acesso e orçamentos de cada membro.</p>
        </div>
        <Button className="gap-2" onClick={() => setEditingProfile({})}>
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
            <ProfileCard
              key={profile.id}
              profile={profile}
              onEdit={() => setEditingProfile(profile)}
              onDelete={() => setDeletingProfile(profile)}
            />
          ))}
        </div>
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
