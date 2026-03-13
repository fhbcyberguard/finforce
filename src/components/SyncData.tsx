import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import useAppStore, { Category } from '@/stores/useAppStore'

export function SyncData() {
  const { user, profile } = useAuth()
  const {
    currentContext,
    setCurrentContext,
    setProfilesFromDB,
    setTransactionsFromDB,
    setGoalsFromDB,
    setCategoriesFromDB,
    setAccountsFromDB,
    setCreditCardsFromDB,
    setAssetsFromDB,
  } = useAppStore()

  const prevProfileType = useRef<string | null>(null)

  useEffect(() => {
    if (profile?.profile_type && profile.profile_type !== prevProfileType.current) {
      prevProfileType.current = profile.profile_type
      const expectedCtx = profile.profile_type === 'enterprise' ? 'business' : 'personal'
      if (currentContext !== expectedCtx) {
        setCurrentContext(expectedCtx)
      }
    }
  }, [profile?.profile_type, currentContext, setCurrentContext])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      // 1. Fetch profiles
      const { data: familyMembers } = await supabase.from('members').select(`
          id,
          name,
          email,
          role,
          profile:profiles(id, full_name, avatar_url, profile_type)
        `)

      if (familyMembers) {
        const mappedProfiles = familyMembers.map((m: any) => ({
          id: m.id,
          name: m.name,
          email: m.email || m.profile?.email,
          role: m.role,
          avatar: m.profile?.avatar_url || null,
          profile_id: m.profile?.id || null,
          limit: 0,
          context: m.profile?.profile_type === 'enterprise' ? 'business' : 'personal',
        }))
        setProfilesFromDB(mappedProfiles)
      }

      // 2. Fetch transactions
      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (txs) {
        const mappedTxs = txs.map((t: any) => ({
          id: t.id,
          date: new Date(t.date).toISOString().split('T')[0],
          description: t.description,
          amount: Number(t.amount),
          category: t.category,
          type: t.type,
          account: t.account || '',
          cardId: t.card_id || undefined,
          goalId: t.goal_id || undefined,
          recurrence: t.recurrence || 'none',
          hasAttachment: t.has_attachment || false,
          profile: t.profile || '',
          expenseType: t.expense_type as any,
          bankBroker: t.bank_broker || undefined,
          assetName: t.asset_name || undefined,
          context: t.context || 'personal',
        }))
        setTransactionsFromDB(mappedTxs)

        const mappedAssets = txs
          .filter((t: any) => t.type === 'Asset')
          .map((t: any) => ({
            id: t.id,
            name: t.asset_name || t.description,
            value: Number(t.amount),
            type: t.type,
            category: t.category,
            bankBroker: t.bank_broker || '',
            context: t.context || 'personal',
          }))
        setAssetsFromDB(mappedAssets)
      }

      // 3. Fetch goals
      const { data: dbGoals } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false })

      if (dbGoals) {
        const mappedGoals = dbGoals.map((g: any) => ({
          id: g.id,
          name: g.name,
          targetValue: Number(g.target_value),
          currentValue: Number(g.current_value),
          monthlyDeposit: Number(g.monthly_contribution),
          targetDate: g.target_date || new Date().toISOString().split('T')[0],
          icon: g.icon || 'Target',
          context: g.context || 'personal',
        }))
        setGoalsFromDB(mappedGoals)
      }

      // 4. Fetch categories
      const { data: dbCats } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })

      if (dbCats && dbCats.length > 0) {
        const mappedCats: Category[] = dbCats.map((c: any) => ({
          id: c.id,
          name: c.name,
          type: c.type,
          icon: c.icon || 'CircleDashed',
          context: c.context || 'personal',
        }))
        setCategoriesFromDB(mappedCats)
      }

      // 5. Fetch accounts
      const { data: dbAccounts } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: true })
      if (dbAccounts) {
        const mappedAccounts = dbAccounts.map((a: any) => ({
          id: a.id,
          name: a.name,
          balance: Number(a.balance),
          type: a.type || 'Conta Corrente',
          agency: a.agency || '',
          account_number: a.account_number || '',
          color: a.color || '',
          connected: a.connected || false,
          context: a.context || 'personal',
        }))
        setAccountsFromDB(mappedAccounts)
      }

      // 6. Fetch cards
      const { data: dbCards } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: true })
      if (dbCards) {
        const mappedCards = dbCards.map((c: any) => ({
          id: c.id,
          name: c.name,
          bank: c.name,
          totalLimit: Number(c.limit),
          availableLimit: Number(c.limit),
          dueDate: c.due_day || 1,
          closingDate: c.closing_day || 1,
          accountId: c.account_id || 'none',
          context: c.context || 'personal',
        }))
        setCreditCardsFromDB(mappedCards)
      }
    }

    fetchData()

    // Subscriptions
    const txSub = supabase
      .channel('public:transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, fetchData)
      .subscribe()

    const goalsSub = supabase
      .channel('public:goals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, fetchData)
      .subscribe()

    const catSub = supabase
      .channel('public:categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetchData)
      .subscribe()

    const accSub = supabase
      .channel('public:accounts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'accounts' }, fetchData)
      .subscribe()

    const cardsSub = supabase
      .channel('public:cards')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, fetchData)
      .subscribe()

    return () => {
      supabase.removeChannel(txSub)
      supabase.removeChannel(goalsSub)
      supabase.removeChannel(catSub)
      supabase.removeChannel(accSub)
      supabase.removeChannel(cardsSub)
    }
  }, [
    user,
    setProfilesFromDB,
    setTransactionsFromDB,
    setGoalsFromDB,
    setCategoriesFromDB,
    setAccountsFromDB,
    setCreditCardsFromDB,
    setAssetsFromDB,
  ])

  return null
}
