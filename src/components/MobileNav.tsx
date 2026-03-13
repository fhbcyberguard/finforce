import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Wallet, Target, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Início', href: '/dashboard' },
  { icon: ArrowLeftRight, label: 'Transações', href: '/transacoes' },
  { icon: Wallet, label: 'Contas', href: '/contas' },
  { icon: Target, label: 'Metas', href: '/metas' },
  { icon: User, label: 'Perfil', href: '/perfis' },
]

export function MobileNav() {
  const location = useLocation()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border pb-[env(safe-area-inset-bottom)]">
      <nav className="flex h-16 items-center justify-around px-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.href || location.pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 h-full px-1 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary/80',
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center rounded-full p-1 transition-all duration-200',
                  isActive ? 'bg-primary/10' : 'bg-transparent',
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 transition-transform duration-200',
                    isActive ? 'scale-110' : 'scale-100',
                  )}
                />
              </div>
              <span
                className={cn('text-[10px] font-medium tracking-wide', isActive && 'font-semibold')}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
