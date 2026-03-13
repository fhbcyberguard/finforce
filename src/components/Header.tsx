import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { ThemeToggle } from './ThemeToggle'
import { Logo } from './Logo'
import { useIsMobile } from '@/hooks/use-mobile'

export function Header() {
  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2 lg:hidden">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="shrink-0">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        {isMobile && <Logo className="scale-90" />}
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <ThemeToggle />
      </div>
    </header>
  )
}
