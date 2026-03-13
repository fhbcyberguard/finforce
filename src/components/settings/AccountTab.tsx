import { Link, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LogOut } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/useAppStore'
import { useAuth } from '@/hooks/use-auth'

export function AccountTab() {
  const { profiles } = useAppStore()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user, profile, signOut, isMasterAdmin } = useAuth()

  const mainProfile = profiles[0] || {
    id: '0',
    name: 'Admin',
    role: 'Admin',
    avatar: '',
  }

  const handleLogout = async () => {
    await signOut()
    toast({ title: 'Sessão encerrada', description: 'Você saiu da sua conta.' })
    navigate('/', { replace: true })
  }

  const displayUser =
    profile?.full_name || user?.email?.split('@')[0] || mainProfile?.name || 'Usuário'
  const displayEmail = user?.email || 'conta@familia.com'

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Perfil Principal</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="w-24 h-24 ring-2 ring-primary/20">
            <AvatarImage src={mainProfile.avatar} />
            <AvatarFallback>{displayUser.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-2 flex-1 overflow-hidden">
            <h3 className="font-semibold text-lg truncate flex items-center">
              {displayUser}
              {isMasterAdmin && (
                <Badge
                  variant="default"
                  className="ml-2 text-[10px] uppercase font-bold tracking-wider"
                >
                  MASTER
                </Badge>
              )}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{displayEmail}</p>
            {!isMasterAdmin && <Badge variant="secondary">{mainProfile.role}</Badge>}
          </div>
          <Button variant="outline" asChild>
            <Link to="/perfis">Gerenciar Família</Link>
          </Button>
        </CardContent>
      </Card>
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="pt-6">
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sair da Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
