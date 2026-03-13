import { useSyncExternalStore } from 'react'
import {
  MOCK_PROFILES,
  MOCK_ACCOUNTS,
  MOCK_CREDIT_CARDS,
  MOCK_ASSETS,
  MOCK_GOALS,
  MOCK_TRANSACTIONS,
  MOCK_ALERTS,
} from '@/lib/mockData'

export type ContextType = 'personal' | 'business'
export type Profile = (typeof MOCK_PROFILES)[0] & { isArchived?: boolean; context?: ContextType }
export type Account = (typeof MOCK_ACCOUNTS)[0] & { context?: ContextType }
export type CreditCard = (typeof MOCK_CREDIT_CARDS)[0] & {
  isArchived?: boolean
  context?: ContextType
}
export type Asset = (typeof MOCK_ASSETS)[0] & { context?: ContextType }
export type Goal = (typeof MOCK_GOALS)[0] & { context?: ContextType }
export type Alert = (typeof MOCK_ALERTS)[0] & { context?: ContextType }
export type Transaction = (typeof MOCK_TRANSACTIONS)[0] & {
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
  simulatorSettings: SimulatorSettings
  currentContext: ContextType
  subscriptionPlan: 'basic' | 'medium' | 'master'
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
  profiles: loadData('finflow_profiles', MOCK_PROFILES),
  accounts: loadData('finflow_accounts', MOCK_ACCOUNTS),
  creditCards: loadData('finflow_credit_cards', MOCK_CREDIT_CARDS),
  assets: loadData('finflow_assets', MOCK_ASSETS),
  goals: loadData('finflow_goals', MOCK_GOALS),
  transactions: loadData('finflow_transactions', MOCK_TRANSACTIONS),
  alerts: loadData('finflow_alerts', MOCK_ALERTS),
  simulatorSettings: loadData('finflow_simulator', defaultSimulator),
  logoUrl: localStorage.getItem('finflow_logo') || '',
  searchQuery: '',
  timeframe: 'monthly',
  currentContext: (localStorage.getItem('finflow_context') as ContextType) || 'personal',
  subscriptionPlan: (localStorage.getItem('finflow_plan') as any) || 'basic',
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
  emit()
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

  // Helper to get only items for the current context
  const filterCtx = <T extends { context?: string }>(arr: T[]) =>
    arr.filter((a) => (a.context || 'personal') === ctx)

  // Helper to merge updated contextual items with items from other contexts
  const mergeCtx = <T extends { context?: string }>(all: T[], updated: T[]) => {
    const others = all.filter((a) => (a.context || 'personal') !== ctx)
    const ctxUpdated = updated.map((a) => ({ ...a, context: a.context || ctx }))
    return [...others, ...ctxUpdated] as T[]
  }

  return {
    ...store,
    // Return filtered state
    profiles: filterCtx(store.profiles),
    accounts: filterCtx(store.accounts),
    creditCards: filterCtx(store.creditCards),
    assets: filterCtx(store.assets),
    goals: filterCtx(store.goals),
    transactions: filterCtx(store.transactions),
    alerts: filterCtx(store.alerts),

    // Override setters to merge data contextually
    setProfiles: (profiles: Profile[]) => {
      const filteredProfiles = filterCtx(state.profiles)
      const deletedProfiles = filteredProfiles.filter((p) => !profiles.some((np) => np.id === p.id))
      let newTx = filterCtx(state.transactions)

      if (deletedProfiles.length > 0) {
        const deletedNames = deletedProfiles.map((p) => p.name)
        newTx = newTx.filter((t) => !t.profile || !deletedNames.includes(t.profile))
      }

      const renamedProfiles = profiles.filter((p) => {
        const old = filteredProfiles.find((op) => op.id === p.id)
        return old && old.name !== p.name
      })

      if (renamedProfiles.length > 0) {
        newTx = newTx.map((t) => {
          const matchedRenamed = renamedProfiles.find((rp) => {
            const old = filteredProfiles.find((op) => op.id === rp.id)
            return old?.name === t.profile
          })
          if (matchedRenamed) return { ...t, profile: matchedRenamed.name }
          return t
        })
      }

      updateState({
        profiles: mergeCtx(state.profiles, profiles),
        transactions: mergeCtx(state.transactions, newTx),
      })
    },

    setAccounts: (accounts: Account[]) =>
      updateState({ accounts: mergeCtx(state.accounts, accounts) }),

    setCreditCards: (creditCards: CreditCard[]) => {
      const filteredCards = filterCtx(state.creditCards)
      const deletedCardIds = filteredCards
        .filter((c) => !creditCards.some((nc) => nc.id === c.id))
        .map((c) => c.id)

      if (deletedCardIds.length > 0) {
        const remainingTx = filterCtx(state.transactions).filter(
          (t) => !t.cardId || !deletedCardIds.includes(t.cardId),
        )
        const remainingAlerts = filterCtx(state.alerts).filter(
          (a) => !a.cardId || !deletedCardIds.includes(a.cardId),
        )
        updateState({
          creditCards: mergeCtx(state.creditCards, creditCards),
          transactions: mergeCtx(state.transactions, remainingTx),
          alerts: mergeCtx(state.alerts, remainingAlerts),
        })
      } else {
        updateState({ creditCards: mergeCtx(state.creditCards, creditCards) })
      }
    },

    setAssets: (assets: Asset[]) => updateState({ assets: mergeCtx(state.assets, assets) }),
    setGoals: (goals: Goal[]) => updateState({ goals: mergeCtx(state.goals, goals) }),
    setTransactions: (transactions: Transaction[]) =>
      updateState({ transactions: mergeCtx(state.transactions, transactions) }),
    setAlerts: (alerts: Alert[]) => updateState({ alerts: mergeCtx(state.alerts, alerts) }),

    // Global setters
    setSimulatorSettings: (simulatorSettings: SimulatorSettings) =>
      updateState({ simulatorSettings }),
    setLogoUrl: (logoUrl: string) => updateState({ logoUrl }),
    setSearchQuery: (searchQuery: string) => updateState({ searchQuery }),
    setTimeframe: (timeframe: 'monthly' | 'annual') => updateState({ timeframe }),
    setCurrentContext: (currentContext: ContextType) => updateState({ currentContext }),
    setSubscriptionPlan: (subscriptionPlan: 'basic' | 'medium' | 'master') =>
      updateState({ subscriptionPlan }),
  }
}
