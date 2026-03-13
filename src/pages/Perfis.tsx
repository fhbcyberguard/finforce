import { useState } from 'react'
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

export default function Perfis() {
  const [archiveId, setArchiveId] = useState<string | null>(null)
  const [profiles, setProfiles] = useState(MOCK_PROFILES)

  const handleArchive = () => {
    setProfiles(profiles.filter((p) => p.id !== archiveId))
    setArchiveId(null)
  }

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

      <Dialog open={!!archiveId} onOpenChange={(o) => !o && setArchiveId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Archive className="w-5 h-5" /> Arquivar Perfil?
            </DialogTitle>
            <div className="pt-4 pb-2 text-sm text-muted-foreground italic border-l-2 border-primary pl-4 ml-1">
              <Typewriter
                text="Antes de prosseguir: Qual o real motivo para ocultar este histórico? Manter dados passados ajuda na clareza financeira de longo prazo da família."
                speed={30}
              />
            </div>
            <DialogDescription className="mt-4">
              O perfil será movido para "Arquivados". Transações anteriores continuarão existindo
              para cálculos de patrimônio, mas o acesso será revogado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setArchiveId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleArchive}>
              Sim, Arquivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
