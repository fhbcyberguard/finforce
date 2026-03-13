import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import useAppStore from '@/stores/useAppStore'
import { useAuth } from '@/hooks/use-auth'

export function SyncData() {
  const { setProfilesFromDB, setTransactionsFromDB, setGoalsFromDB } = useAppStore()
  const { user, profile } = useAuth()

  useEffect(() => {
    if (!user || !profile) return

    // Sync logged-in user profile natively, overriding any mocks
    setProfilesFromDB([
      {
        id: profile.id,
        name: profile.full_name || user.email?.split('@')[0] || 'Usuário',
        role: 'Admin',
        limit: 5000,
        context: 'personal',
        // Avatar is omitted to trigger the initials fallback
      },
    ])

    // Fetch user transactions
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (!error && data) {
        const formatted = data.map((t: any) => ({
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
          hasAttachment: t.has_attachment,
          profile: t.profile || '',
          expenseType: t.expense_type as any,
          context: 'personal',
        }))
        setTransactionsFromDB(formatted)
      }
    }

    // Fetch user goals
    const fetchGoals = async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        const formatted = data.map((g: any) => ({
          id: g.id,
          name: g.name,
          targetValue: Number(g.target_value),
          currentValue: Number(g.current_value),
          targetDate: g.target_date || new Date().toISOString().split('T')[0],
          monthlyDeposit: Number(g.monthly_contribution),
          context: 'personal' as const,
        }))
        setGoalsFromDB(formatted)
      }
    }

    fetchTransactions()
    fetchGoals()
  }, [user, profile, setProfilesFromDB, setTransactionsFromDB, setGoalsFromDB])

  return null
}
