import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import useAppStore, { Category } from '@/stores/useAppStore'

export function SyncData() {
  const { user } = useAuth()
  const { setProfilesFromDB, setTransactionsFromDB, setGoalsFromDB, setCategoriesFromDB } =
    useAppStore()

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      // 1. Fetch profiles
      const { data: familyMembers } = await supabase.from('members').select(`
          id,
          name,
          email,
          role,
          profile:profiles(id, full_name, avatar_url)
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
        }))
        setTransactionsFromDB(mappedTxs)
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
        }))
        setCategoriesFromDB(mappedCats)
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

    return () => {
      supabase.removeChannel(txSub)
      supabase.removeChannel(goalsSub)
      supabase.removeChannel(catSub)
    }
  }, [user, setProfilesFromDB, setTransactionsFromDB, setGoalsFromDB, setCategoriesFromDB])

  return null
}
