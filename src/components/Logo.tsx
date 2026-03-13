import { cn } from '@/lib/utils'
import logoImg from '@/assets/finforce-logo-0eb9e.png'

interface LogoProps {
  className?: string
  collapsed?: boolean
}

export function Logo({ className, collapsed }: LogoProps) {
  return (
    <div
      className={cn('flex items-center', collapsed ? 'justify-center w-8' : 'w-auto', className)}
    >
      <img
        src={logoImg}
        alt="FinForce"
        className={cn(
          'h-8 origin-left transition-all duration-300',
          collapsed ? 'w-8 object-cover object-left' : 'w-auto object-contain',
        )}
      />
    </div>
  )
}
