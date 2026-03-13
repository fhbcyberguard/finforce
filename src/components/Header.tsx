import { Bell, Search, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { ThemeToggle } from './ThemeToggle'
import { MOCK_ALERTS } from '@/lib/mockData'

export function Header() {
  const urgentAlerts = MOCK_ALERTS.filter((a) => a.type === 'urgent').length

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="hidden md:flex relative w-64 lg:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar transações ou ativos..."
            className="w-full bg-muted/50 pl-9 rounded-full border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          {urgentAlerts > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive animate-pulse-alert" />
          )}
        </Button>
        <ThemeToggle />
        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent transition-all hover:ring-primary">
          <AvatarImage
            src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4"
            alt="User"
          />
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
