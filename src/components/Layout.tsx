import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/useAppStore'
import { useEffect } from 'react'

export default function Layout() {
  const isMobile = useIsMobile()
  const { profile } = useAuth()
  const { profiles, setProfiles } = useAppStore()

  useEffect(() => {
    if (profile?.full_name) {
      const mainProfile = profiles.find((p) => p.id === '1')
      if (mainProfile && mainProfile.name !== profile.full_name) {
        const updatedProfiles = profiles.map((p) =>
          p.id === '1' ? { ...p, name: profile.full_name! } : p,
        )
        setProfiles(updatedProfiles)
      }
    }
  }, [profile?.full_name, profiles, setProfiles])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground selection:bg-primary/30">
        <AppSidebar />
        <SidebarInset className="flex w-full flex-col relative">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 lg:p-8 md:pb-6">
            <Outlet />
          </main>

          <MobileNav />

          {isMobile && (
            <Button
              size="icon"
              className="fixed right-4 h-14 w-14 rounded-full shadow-lg z-40 bottom-[calc(5rem+env(safe-area-inset-bottom))]"
            >
              <Plus className="h-6 w-6" />
            </Button>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
