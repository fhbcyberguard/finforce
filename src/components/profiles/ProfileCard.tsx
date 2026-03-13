import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Edit2, Trash2, ArchiveRestore } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore, { Profile } from '@/stores/useAppStore'

interface ProfileCardProps {
  profile: Profile
  onEdit: () => void
  onDelete: () => void
}

export function ProfileCard({ profile, onEdit, onDelete }: ProfileCardProps) {
  const { profiles, setProfiles } = useAppStore()
  const { toast } = useToast()

  const handleUnarchive = () => {
    setProfiles(profiles.map((p) => (p.id === profile.id ? { ...p, isArchived: false } : p)))
    toast({ title: 'Perfil restaurado', description: 'O perfil voltou a ficar ativo no sistema.' })
  }

  const contextLabel = profile.context === 'business' ? 'Perfil Empresarial' : 'Perfil Pessoal'

  return (
    <Card
      className={`flex flex-col border-border/50 hover:border-primary/30 transition-colors ${profile.isArchived ? 'grayscale-[0.5]' : ''}`}
    >
      <CardContent className="pt-6 flex flex-col items-center text-center flex-1">
        <Avatar className="w-20 h-20 mb-4 ring-4 ring-background shadow-lg">
          {profile.avatar && <AvatarImage src={profile.avatar} />}
          <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg flex flex-col items-center gap-0.5">
          {profile.name}
          {profile.email && (
            <span className="text-sm font-normal text-muted-foreground">{profile.email}</span>
          )}
          <span className="text-xs font-normal text-muted-foreground mt-1">{contextLabel}</span>
        </h3>
        <Badge variant="secondary" className="mt-3 mb-4">
          {profile.role}
        </Badge>
      </CardContent>
      <CardFooter className="border-t bg-muted/20 p-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-muted-foreground hover:text-foreground"
        >
          <Edit2 className="w-4 h-4 mr-2" /> Editar
        </Button>

        {profile.isArchived ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnarchive}
            className="text-muted-foreground hover:text-primary"
            title="Desarquivar"
          >
            <ArchiveRestore className="w-4 h-4 mr-2" /> Restaurar
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-muted-foreground hover:text-destructive"
            title="Remover/Arquivar"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
