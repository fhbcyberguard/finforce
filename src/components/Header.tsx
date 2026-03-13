import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from 'react-router-dom'

export function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-4 lg:gap-8">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <ThemeToggle />

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-secondary/50 hover:bg-secondary"
              >
                <User className="h-5 w-5 text-foreground/80" />
                <span className="sr-only">Menu do usuário</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-muted-foreground truncate cursor-default">
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="default" size="sm" className="hidden sm:flex">
            <Link to="/login">Entrar</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
