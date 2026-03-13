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
    setIsSyncing,
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
    if (!user) {
      setIsSyncing(false)
      return
    }

    const fetchData = async () => {
      const [resMembers, resTxs, resGoals, resCats, resAccounts, resCards] = await Promise.all([
        supabase
          .from('members')
          .select(
            'id, name, email, role, is_archived, birth_date, profile:profiles(id, full_name, avatar_url, profile_type)',
          ),
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('goals').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('created_at', { ascending: true }),
        supabase.from('accounts').select('*').order('created_at', { ascending: true }),
        supabase.from('cards').select('*').order('created_at', { ascending: true }),
      ])

      if (resMembers.data) {
        const mappedProfiles = resMembers.data.map((m: any) => ({
          id: m.id,
          name: m.name,
          email: m.email || m.profile?.email || '',
          role: m.role,
          birthDate: m.birth_date || null,
          avatar: m.profile?.avatar_url || null,
          profile_id: m.profile?.id || null,
          limit: 0,
          isArchived: m.is_archived || false,
          context: m.profile?.profile_type === 'enterprise' ? 'business' : 'personal',
        }))
        setProfilesFromDB(mappedProfiles)
      }

      if (resTxs.data) {
        const mappedTxs = resTxs.data.map((t: any) => ({
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

        const mappedAssets = resTxs.data
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

      if (resGoals.data) {
        const mappedGoals = resGoals.data.map((g: any) => ({
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

      if (resCats.data && resCats.data.length > 0) {
        const mappedCats: Category[] = resCats.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          type: c.type,
          icon: c.icon || 'CircleDashed',
          context: c.context || 'personal',
        }))
        setCategoriesFromDB(mappedCats)
      }

      if (resAccounts.data) {
        const mappedAccounts = resAccounts.data.map((a: any) => ({
          id: a.id,
          name: a.name,
          bank: a.name,
          balance: Number(a.balance),
          type: a.type || 'Conta Corrente',
          agency: a.agency || '',
          account_number: a.account_number || '',
          account: a.account_number || '',
          color: a.color || '',
          connected: a.connected || false,
          context: a.context || 'personal',
        }))
        setAccountsFromDB(mappedAccounts)
      }

      if (resCards.data) {
        const mappedCards = resCards.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          bank: c.name,
          brand: c.brand || '',
          lastDigits: c.last_digits || '',
          totalLimit: Number(c.limit),
          availableLimit: Number(c.limit),
          dueDate: c.due_day || 1,
          closingDate: c.closing_day || 1,
          bestPurchaseDay: c.closing_day || 1,
          accountId: c.account_id || 'none',
          isArchived: c.is_archived || false,
          context: c.context || 'personal',
        }))
        setCreditCardsFromDB(mappedCards)
      }

      setIsSyncing(false)
    }

    fetchData()

    const channel = supabase
      .channel('public:all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'accounts' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, fetchData)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
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
    setIsSyncing,
  ])

  return null
}
