import { useSyncExternalStore, useMemo, useCallback } from 'react'
import {
  MOCK_ACCOUNTS,
  MOCK_CREDIT_CARDS,
  MOCK_ASSETS,
  MOCK_GOALS,
  MOCK_ALERTS,
} from '@/lib/mockData'

export type ContextType = 'personal' | 'business'
export type Profile = {
  id: string
  name: string
  role: string
  limit: number
  avatar?: string
  isArchived?: boolean
  context?: ContextType
  currentAge?: number
  retirementPlanDuration?: number
}
export type Account = (typeof MOCK_ACCOUNTS)[0] & { context?: ContextType }
export type CreditCard = (typeof MOCK_CREDIT_CARDS)[0] & {
  isArchived?: boolean
  context?: ContextType
  accountId?: string
  name?: string
}
export type Asset = (typeof MOCK_ASSETS)[0] & { context?: ContextType }
export type Goal = (typeof MOCK_GOALS)[0] & { context?: ContextType }
export type Alert = (typeof MOCK_ALERTS)[0] & { context?: ContextType }
export type Transaction = {
  id: string
  date: string
  description: string
  amount: number
  category: string
  type: string
  account: string
  recurrence: string
  hasAttachment?: boolean
  profile?: string
  expenseType?: 'fixed' | 'variable'
  cardId?: string
  context?: ContextType
}

interface SimulatorSettings {
  aporte: number
  retorno: number
  idade: number
  rendaDesejada: number
}

interface AppState {
  profiles: Profile[]
  accounts: Account[]
  creditCards: CreditCard[]
  assets: Asset[]
  goals: Goal[]
  transactions: Transaction[]
  alerts: Alert[]
  logoUrl: string
  searchQuery: string
  timeframe: 'monthly' | 'annual'
  selectedYear: string
  simulatorSettings: SimulatorSettings
  currentContext: ContextType
  subscriptionPlan: 'basic' | 'medium' | 'top'
  categoryColors: Record<string, string>
}

const loadData = <T>(key: string, mockData: T): T => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : mockData
  } catch {
    return mockData
  }
}

const defaultSimulator: SimulatorSettings = {
  aporte: 2000,
  retorno: 8.5,
  idade: 55,
  rendaDesejada: 10000,
}

const getInitialState = (): AppState => ({
  profiles: loadData('finflow_profiles', [] as Profile[]),
  accounts: loadData('finflow_accounts', MOCK_ACCOUNTS),
  creditCards: loadData('finflow_credit_cards', MOCK_CREDIT_CARDS as CreditCard[]),
  assets: loadData('finflow_assets', MOCK_ASSETS),
  goals: loadData('finflow_goals', MOCK_GOALS),
  transactions: loadData('finflow_transactions', [] as Transaction[]),
  alerts: loadData('finflow_alerts', MOCK_ALERTS),
  simulatorSettings: loadData('finflow_simulator', defaultSimulator),
  logoUrl: localStorage.getItem('finflow_logo') || '',
  searchQuery: '',
  timeframe: 'monthly',
  selectedYear: new Date().getFullYear().toString(),
  currentContext: (localStorage.getItem('finflow_context') as ContextType) || 'personal',
  subscriptionPlan: (localStorage.getItem('finflow_plan') as any) || 'basic',
  categoryColors: loadData('finflow_category_colors', {}),
})

let state: AppState = getInitialState()

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function updateState(partial: Partial<AppState>) {
  state = { ...state, ...partial }
  if (partial.profiles) localStorage.setItem('finflow_profiles', JSON.stringify(partial.profiles))
  if (partial.accounts) localStorage.setItem('finflow_accounts', JSON.stringify(partial.accounts))
  if (partial.creditCards)
    localStorage.setItem('finflow_credit_cards', JSON.stringify(partial.creditCards))
  if (partial.assets) localStorage.setItem('finflow_assets', JSON.stringify(partial.assets))
  if (partial.goals) localStorage.setItem('finflow_goals', JSON.stringify(partial.goals))
  if (partial.transactions)
    localStorage.setItem('finflow_transactions', JSON.stringify(partial.transactions))
  if (partial.alerts) localStorage.setItem('finflow_alerts', JSON.stringify(partial.alerts))
  if (partial.simulatorSettings)
    localStorage.setItem('finflow_simulator', JSON.stringify(partial.simulatorSettings))
  if (partial.logoUrl !== undefined) localStorage.setItem('finflow_logo', partial.logoUrl)
  if (partial.currentContext) localStorage.setItem('finflow_context', partial.currentContext)
  if (partial.subscriptionPlan) localStorage.setItem('finflow_plan', partial.subscriptionPlan)
  if (partial.categoryColors)
    localStorage.setItem('finflow_category_colors', JSON.stringify(partial.categoryColors))
  emit()
}

const mergeCtx = <T extends { context?: string }>(all: T[], updated: T[], ctx: string) => {
  const others = all.filter((a) => (a.context || 'personal') !== ctx)
  const ctxUpdated = updated.map((a) => ({ ...a, context: a.context || ctx }))
  return [...others, ...ctxUpdated] as T[]
}

export default function useAppStore() {
  const store = useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => state,
  )

  const ctx = store.currentContext || 'personal'

  // Memoize filtered arrays to ensure referential stability and prevent infinite render loops
  const profiles = useMemo(
    () => store.profiles.filter((a) => (a.context || 'personal') === ctx),
    [store.profiles, ctx],
  )
  const accounts = useMemo(
    () => store.accounts.filter((a) => (a.context || 'personal') === ctx),
    [store.accounts, ctx],
  )
  const creditCards = useMemo(
    () => store.creditCards.filter((a) => (a.context || 'personal') === ctx),
    [store.creditCards, ctx],
  )
  const assets = useMemo(
    () => store.assets.filter((a) => (a.context || 'personal') === ctx),
    [store.assets, ctx],
  )
  const goals = useMemo(
    () => store.goals.filter((a) => (a.context || 'personal') === ctx),
    [store.goals, ctx],
  )
  const transactions = useMemo(
    () => store.transactions.filter((a) => (a.context || 'personal') === ctx),
    [store.transactions, ctx],
  )
  const alerts = useMemo(
    () => store.alerts.filter((a) => (a.context || 'personal') === ctx),
    [store.alerts, ctx],
  )

  const setProfiles = useCallback(
    (p: Profile[]) => updateState({ profiles: mergeCtx(state.profiles, p, ctx) }),
    [ctx],
  )
  const setProfilesFromDB = useCallback((p: Profile[]) => updateState({ profiles: p }), [])
  const setTransactionsFromDB = useCallback(
    (t: Transaction[]) => updateState({ transactions: t }),
    [],
  )
  const setAccounts = useCallback(
    (a: Account[]) => updateState({ accounts: mergeCtx(state.accounts, a, ctx) }),
    [ctx],
  )
  const setCreditCards = useCallback(
    (c: CreditCard[]) => updateState({ creditCards: mergeCtx(state.creditCards, c, ctx) }),
    [ctx],
  )
  const setAssets = useCallback(
    (a: Asset[]) => updateState({ assets: mergeCtx(state.assets, a, ctx) }),
    [ctx],
  )
  const setGoals = useCallback(
    (g: Goal[]) => updateState({ goals: mergeCtx(state.goals, g, ctx) }),
    [ctx],
  )
  const setTransactions = useCallback(
    (t: Transaction[]) => updateState({ transactions: mergeCtx(state.transactions, t, ctx) }),
    [ctx],
  )
  const setAlerts = useCallback(
    (al: Alert[]) => updateState({ alerts: mergeCtx(state.alerts, al, ctx) }),
    [ctx],
  )

  const setSimulatorSettings = useCallback(
    (s: SimulatorSettings) => updateState({ simulatorSettings: s }),
    [],
  )
  const setLogoUrl = useCallback((l: string) => updateState({ logoUrl: l }), [])
  const setSearchQuery = useCallback((q: string) => updateState({ searchQuery: q }), [])
  const setTimeframe = useCallback((t: 'monthly' | 'annual') => updateState({ timeframe: t }), [])
  const setSelectedYear = useCallback((y: string) => updateState({ selectedYear: y }), [])
  const setCurrentContext = useCallback((c: ContextType) => updateState({ currentContext: c }), [])
  const setSubscriptionPlan = useCallback(
    (p: 'basic' | 'medium' | 'top') => updateState({ subscriptionPlan: p }),
    [],
  )
  const setCategoryColor = useCallback(
    (cat: string, color: string) =>
      updateState({ categoryColors: { ...state.categoryColors, [cat]: color } }),
    [],
  )

  // Return a memoized object so components don't re-render unless relevant state changes
  return useMemo(
    () => ({
      ...store,
      profiles,
      accounts,
      creditCards,
      assets,
      goals,
      transactions,
      alerts,
      setProfiles,
      setProfilesFromDB,
      setTransactionsFromDB,
      setAccounts,
      setCreditCards,
      setAssets,
      setGoals,
      setTransactions,
      setAlerts,
      setSimulatorSettings,
      setLogoUrl,
      setSearchQuery,
      setTimeframe,
      setSelectedYear,
      setCurrentContext,
      setSubscriptionPlan,
      setCategoryColor,
    }),
    [
      store,
      profiles,
      accounts,
      creditCards,
      assets,
      goals,
      transactions,
      alerts,
      setProfiles,
      setProfilesFromDB,
      setTransactionsFromDB,
      setAccounts,
      setCreditCards,
      setAssets,
      setGoals,
      setTransactions,
      setAlerts,
      setSimulatorSettings,
      setLogoUrl,
      setSearchQuery,
      setTimeframe,
      setSelectedYear,
      setCurrentContext,
      setSubscriptionPlan,
      setCategoryColor,
    ],
  )
}
