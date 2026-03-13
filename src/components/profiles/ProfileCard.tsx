import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Archive, Edit2, Trash2, ArchiveRestore } from 'lucide-react'
import { ImpulseControlDialog } from '@/components/ImpulseControlDialog'
import { useToast } from '@/hooks/use-toast'
import useAppStore, { Profile } from '@/stores/useAppStore'

interface ProfileCardProps {
  profile: Profile
  onEdit: () => void
  onDelete: () => void
}

export function ProfileCard({ profile, onEdit, onDelete }: ProfileCardProps) {
  const [archiveOpen, setArchiveOpen] = useState(false)
  const { profiles, setProfiles } = useAppStore()
  const { toast } = useToast()

  const handleArchive = () => {
    setProfiles(profiles.map((p) => (p.id === profile.id ? { ...p, isArchived: true } : p)))
    toast({
      title: 'Perfil arquivado',
      description: 'Histórico preservado, mas acesso ocultado das visões principais.',
    })
    setArchiveOpen(false)
  }

  const handleUnarchive = () => {
    setProfiles(profiles.map((p) => (p.id === profile.id ? { ...p, isArchived: false } : p)))
    toast({ title: 'Perfil restaurado', description: 'O perfil voltou a ficar ativo no sistema.' })
  }

  return (
    <>
      <Card
        className={`flex flex-col border-border/50 hover:border-primary/30 transition-colors ${profile.isArchived ? 'grayscale-[0.5]' : ''}`}
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
            <p className="font-mono font-medium">R$ {profile.limit.toLocaleString('pt-BR')}/mês</p>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/20 p-3 grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-4 h-4" />
          </Button>

          {profile.isArchived ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUnarchive}
              className="text-muted-foreground hover:text-emerald-500"
              title="Desarquivar"
            >
              <ArchiveRestore className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setArchiveOpen(true)}
              className="text-muted-foreground hover:text-amber-500"
              title="Arquivar"
            >
              <Archive className="w-4 h-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-muted-foreground hover:text-destructive"
            title="Excluir Permanentemente"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>

      <ImpulseControlDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        onConfirm={handleArchive}
        title="Arquivar Perfil?"
        description="O perfil será movido para Arquivados. Transações anteriores continuarão existindo para cálculos de patrimônio, mas o acesso ao app será revogado."
        reflectionText="Ocultar dados não resolve problemas estruturais. Você tem certeza desta ação?"
        confirmText="Arquivar Perfil"
      />
    </>
  )
}
