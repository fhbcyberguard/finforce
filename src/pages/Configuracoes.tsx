import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, Bell, SlidersHorizontal, Shield, User, Tags } from 'lucide-react'
import { AccountTab } from '@/components/settings/AccountTab'
import { AppearanceTab } from '@/components/settings/AppearanceTab'
import { NotificationsTab } from '@/components/settings/NotificationsTab'
import { SystemTab } from '@/components/settings/SystemTab'
import { SecuritySettings } from '@/components/settings/SecuritySettings'
import { CategoriesTab } from '@/components/settings/CategoriesTab'

export default function Configuracoes() {
  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie preferências, notificações e segurança.</p>
      </div>

      <Tabs defaultValue="conta" className="w-full">
        <TabsList className="grid grid-cols-2 md:flex h-auto w-full md:w-auto bg-muted p-1 gap-1 mb-6 flex-wrap">
          <TabsTrigger value="conta" className="flex items-center gap-2">
            <User className="w-4 h-4" /> Conta
          </TabsTrigger>
          <TabsTrigger value="aparencia" className="flex items-center gap-2">
            <Palette className="w-4 h-4" /> Aparência
          </TabsTrigger>
          <TabsTrigger value="categorias" className="flex items-center gap-2">
            <Tags className="w-4 h-4" /> Categorias
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <Bell className="w-4 h-4" /> Alertas
          </TabsTrigger>
          <TabsTrigger value="personalizacao" className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Sistema
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Shield className="w-4 h-4" /> Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conta">
          <AccountTab />
        </TabsContent>
        <TabsContent value="aparencia">
          <AppearanceTab />
        </TabsContent>
        <TabsContent value="categorias">
          <CategoriesTab />
        </TabsContent>
        <TabsContent value="notificacoes">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="personalizacao">
          <SystemTab />
        </TabsContent>
        <TabsContent value="seguranca">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
