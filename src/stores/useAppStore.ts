import { useSyncExternalStore, useMemo, useCallback } from 'react'

export type ContextType = 'personal' | 'business'

export type Category = {
  id: string
  name: string
  type: string
  icon: string
  context?: ContextType
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'def-1', name: 'Renda Principal', type: 'Revenue', icon: 'Wallet' },
  { id: 'def-2', name: 'Alimentação', type: 'Expense', icon: 'Utensils' },
  { id: 'def-3', name: 'Moradia', type: 'Expense', icon: 'Home' },
  { id: 'def-4', name: 'Transporte', type: 'Expense', icon: 'Car' },
  { id: 'def-5', name: 'Saúde', type: 'Expense', icon: 'HeartPulse' },
  { id: 'def-6', name: 'Lazer', type: 'Expense', icon: 'Tv' },
  { id: 'def-7', name: 'Outros', type: 'Expense', icon: 'CircleDashed' },
]

export type Profile = {
  id: string
  name: string
  email?: string
  role: string
  limit: number
  avatar?: string | null
  isArchived?: boolean
  context?: ContextType
  currentAge?: number
  birthDate?: string
  retirementPlanDuration?: number
  profile_id?: string | null
}

export type Account = {
  id: string
  name: string
  balance: number
  type?: string | null
  agency?: string | null
  account_number?: string | null
  color?: string | null
  connected?: boolean | null
  context?: ContextType
}

export type CreditCard = {
  id: string
  name: string
  bank?: string
  totalLimit: number
  availableLimit: number
  dueDate?: string | number
  lastDigits?: string
  isArchived?: boolean
  context?: ContextType
  accountId?: string
}

export type Asset = {
  id: string
  name: string
  value: number
  type: string
  category?: string
  bankBroker?: string
  context?: ContextType
}

export type Goal = {
  id: string
  name: string
  targetValue: number
  currentValue: number
  targetDate: string
  monthlyDeposit: number
  icon?: string
  context?: ContextType
  color?: string
}

export type Alert = {
  id: string
  title: string
  amount: number
  dueDate: string
  type: string
  context?: ContextType
}

export type Transaction = {
  id: string
  date: string
  description: string
  amount: number
  category: string
  type: string
  account: string
  recurrence: string
  installments?: number
  hasAttachment?: boolean
  profile?: string
  expenseType?: 'fixed' | 'variable'
  cardId?: string
  goalId?: string
  bankBroker?: string
  assetName?: string
  context?: ContextType
}

interface SimulatorSettings {
  aporte: number
  retorno: number
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
  categories: Category[]
  logoUrl: string
  searchQuery: string
  timeframe: 'monthly' | 'annual'
  selectedYear: string
  selectedMonth: number
  simulatorSettings: SimulatorSettings
  currentContext: ContextType
  subscriptionPlan: 'basic' | 'medium' | 'top' | 'master'
  categoryColors: Record<string, string>
}

const loadData = <T>(key: string, defaultData: T): T => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultData
  } catch {
    return defaultData
  }
}

const defaultSimulator: SimulatorSettings = {
  aporte: 2000,
  retorno: 8.5,
  rendaDesejada: 10000,
}

const getInitialState = (): AppState => ({
  profiles: loadData('finforce_profiles', [] as Profile[]),
  accounts: loadData('finforce_accounts', [] as Account[]),
  creditCards: loadData('finforce_credit_cards', [] as CreditCard[]),
  assets: loadData('finforce_assets', [] as Asset[]),
  goals: loadData('finforce_goals', [] as Goal[]),
  transactions: loadData('finforce_transactions', [] as Transaction[]),
  alerts: loadData('finforce_alerts', [] as Alert[]),
  categories: loadData('finforce_categories', []),
  simulatorSettings: loadData('finforce_simulator', defaultSimulator),
  logoUrl: localStorage.getItem('finforce_logo') || '',
  searchQuery: '',
  timeframe: 'monthly',
  selectedYear: new Date().getFullYear().toString(),
  selectedMonth: parseInt(
    localStorage.getItem('finforce_month') || new Date().getMonth().toString(),
    10,
  ),
  currentContext: (localStorage.getItem('finforce_context') as ContextType) || 'personal',
  subscriptionPlan: (localStorage.getItem('finforce_plan') as any) || 'basic',
  categoryColors: loadData('finforce_category_colors', {}),
})

let state: AppState = getInitialState()

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function updateState(partial: Partial<AppState>) {
  state = { ...state, ...partial }
  if (partial.profiles) localStorage.setItem('finforce_profiles', JSON.stringify(partial.profiles))
  if (partial.accounts) localStorage.setItem('finforce_accounts', JSON.stringify(partial.accounts))
  if (partial.creditCards)
    localStorage.setItem('finforce_credit_cards', JSON.stringify(partial.creditCards))
  if (partial.assets) localStorage.setItem('finforce_assets', JSON.stringify(partial.assets))
  if (partial.goals) localStorage.setItem('finforce_goals', JSON.stringify(partial.goals))
  if (partial.transactions)
    localStorage.setItem('finforce_transactions', JSON.stringify(partial.transactions))
  if (partial.alerts) localStorage.setItem('finforce_alerts', JSON.stringify(partial.alerts))
  if (partial.categories)
    localStorage.setItem('finforce_categories', JSON.stringify(partial.categories))
  if (partial.simulatorSettings)
    localStorage.setItem('finforce_simulator', JSON.stringify(partial.simulatorSettings))
  if (partial.logoUrl !== undefined) localStorage.setItem('finforce_logo', partial.logoUrl)
  if (partial.currentContext) localStorage.setItem('finforce_context', partial.currentContext)
  if (partial.subscriptionPlan) localStorage.setItem('finforce_plan', partial.subscriptionPlan)
  if (partial.categoryColors)
    localStorage.setItem('finforce_category_colors', JSON.stringify(partial.categoryColors))
  if (partial.selectedMonth !== undefined)
    localStorage.setItem('finforce_month', partial.selectedMonth.toString())
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
  const categories = useMemo(
    () => store.categories.filter((a) => (a.context || 'personal') === ctx),
    [store.categories, ctx],
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
  const setGoalsFromDB = useCallback((g: Goal[]) => updateState({ goals: g }), [])
  const setCategoriesFromDB = useCallback((c: Category[]) => updateState({ categories: c }), [])
  const setAccountsFromDB = useCallback((a: Account[]) => updateState({ accounts: a }), [])
  const setCreditCardsFromDB = useCallback((c: CreditCard[]) => updateState({ creditCards: c }), [])
  const setAssetsFromDB = useCallback((a: Asset[]) => updateState({ assets: a }), [])

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
  const setCategories = useCallback(
    (c: Category[]) => updateState({ categories: mergeCtx(state.categories, c, ctx) }),
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
  const setSelectedMonth = useCallback((m: number) => updateState({ selectedMonth: m }), [])
  const setCurrentContext = useCallback((c: ContextType) => updateState({ currentContext: c }), [])
  const setSubscriptionPlan = useCallback(
    (p: 'basic' | 'medium' | 'top' | 'master') => updateState({ subscriptionPlan: p }),
    [],
  )
  const setCategoryColor = useCallback(
    (cat: string, color: string) =>
      updateState({ categoryColors: { ...state.categoryColors, [cat]: color } }),
    [],
  )

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
      categories,
      setProfiles,
      setProfilesFromDB,
      setTransactionsFromDB,
      setGoalsFromDB,
      setCategoriesFromDB,
      setAccountsFromDB,
      setCreditCardsFromDB,
      setAssetsFromDB,
      setAccounts,
      setCreditCards,
      setAssets,
      setGoals,
      setTransactions,
      setAlerts,
      setCategories,
      setSimulatorSettings,
      setLogoUrl,
      setSearchQuery,
      setTimeframe,
      setSelectedYear,
      selectedMonth: store.selectedMonth,
      setSelectedMonth,
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
      categories,
      setProfiles,
      setProfilesFromDB,
      setTransactionsFromDB,
      setGoalsFromDB,
      setCategoriesFromDB,
      setAccountsFromDB,
      setCreditCardsFromDB,
      setAssetsFromDB,
      setAccounts,
      setCreditCards,
      setAssets,
      setGoals,
      setTransactions,
      setAlerts,
      setCategories,
      setSimulatorSettings,
      setLogoUrl,
      setSearchQuery,
      setTimeframe,
      setSelectedYear,
      setSelectedMonth,
      setCurrentContext,
      setSubscriptionPlan,
      setCategoryColor,
    ],
  )
}
