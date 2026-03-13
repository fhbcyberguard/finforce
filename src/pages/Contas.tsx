import { useState } from 'react'
import useAppStore, { Account } from '@/stores/useAppStore'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CreditCardsSection } from '../components/contas/CreditCardsSection'
import { AccountList } from '../components/contas/AccountList'
import { AccountEditDialog } from '../components/contas/AccountEditDialog'

export default function Contas() {
  const { isSyncing } = useAppStore()
  const [openAddAcc, setOpenAddAcc] = useState(false)
  const [editingAcc, setEditingAcc] = useState<Account | null>(null)

  if (isSyncing) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Cartões e Contas</h1>
        <p className="text-muted-foreground">
          Gestão segura de métodos de pagamento e conexões bancárias.
        </p>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="cards">Cartões de Crédito</TabsTrigger>
          <TabsTrigger value="accounts">Contas Bancárias</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-0">
          <CreditCardsSection />
        </TabsContent>

        <TabsContent value="accounts" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AccountList
              onAdd={() => {
                setEditingAcc(null)
                setOpenAddAcc(true)
              }}
              onEdit={(acc) => {
                setEditingAcc(acc)
                setOpenAddAcc(true)
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
      <AccountEditDialog
        editingAcc={editingAcc}
        open={openAddAcc}
        onOpenChange={(o) => {
          setOpenAddAcc(o)
          if (!o) setEditingAcc(null)
        }}
      />
    </div>
  )
}
