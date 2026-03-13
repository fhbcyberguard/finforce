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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="flex items-center basis-1/3 lg:hidden">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="shrink-0 -ml-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
      <div className="flex items-center justify-center basis-1/3 lg:hidden">
        {isMobile && <Logo className="scale-90" />}
      </div>
      <div className="flex items-center justify-end gap-4 basis-1/3 lg:basis-auto lg:flex-1">
        <ThemeToggle />
      </div>
    </header>
  )
}
