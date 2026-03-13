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

export type Profile = (typeof MOCK_PROFILES)[0] & { isArchived?: boolean }
export type Account = (typeof MOCK_ACCOUNTS)[0]
export type CreditCard = (typeof MOCK_CREDIT_CARDS)[0] & { isArchived?: boolean }
export type Asset = (typeof MOCK_ASSETS)[0]
export type Goal = (typeof MOCK_GOALS)[0]
export type Alert = (typeof MOCK_ALERTS)[0]
export type Transaction = (typeof MOCK_TRANSACTIONS)[0] & {
  profile?: string
  expenseType?: 'fixed' | 'variable'
  cardId?: string
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

  return {
    ...store,
    setProfiles: (profiles: Profile[]) => {
      const deletedProfiles = state.profiles.filter((p) => !profiles.some((np) => np.id === p.id))
      let newTx = state.transactions

      if (deletedProfiles.length > 0) {
        const deletedNames = deletedProfiles.map((p) => p.name)
        newTx = newTx.filter((t) => !t.profile || !deletedNames.includes(t.profile))
      }

      const renamedProfiles = profiles.filter((p) => {
        const old = state.profiles.find((op) => op.id === p.id)
        return old && old.name !== p.name
      })

      if (renamedProfiles.length > 0) {
        newTx = newTx.map((t) => {
          const matchedRenamed = renamedProfiles.find((rp) => {
            const old = state.profiles.find((op) => op.id === rp.id)
            return old?.name === t.profile
          })
          if (matchedRenamed) return { ...t, profile: matchedRenamed.name }
          return t
        })
      }

      updateState({ profiles, transactions: newTx })
    },
    setAccounts: (accounts: Account[]) => updateState({ accounts }),
    setCreditCards: (creditCards: CreditCard[]) => {
      const deletedCardIds = state.creditCards
        .filter((c) => !creditCards.some((nc) => nc.id === c.id))
        .map((c) => c.id)

      if (deletedCardIds.length > 0) {
        // Cascade delete transactions and alerts when a card is deleted
        const remainingTx = state.transactions.filter(
          (t) => !t.cardId || !deletedCardIds.includes(t.cardId),
        )
        const remainingAlerts = state.alerts.filter(
          (a) => !a.cardId || !deletedCardIds.includes(a.cardId),
        )
        updateState({ creditCards, transactions: remainingTx, alerts: remainingAlerts })
      } else {
        updateState({ creditCards })
      }
    },
    setAssets: (assets: Asset[]) => updateState({ assets }),
    setGoals: (goals: Goal[]) => updateState({ goals }),
    setTransactions: (transactions: Transaction[]) => updateState({ transactions }),
    setAlerts: (alerts: Alert[]) => updateState({ alerts }),
    setSimulatorSettings: (simulatorSettings: SimulatorSettings) =>
      updateState({ simulatorSettings }),
    setLogoUrl: (logoUrl: string) => updateState({ logoUrl }),
    setSearchQuery: (searchQuery: string) => updateState({ searchQuery }),
    setTimeframe: (timeframe: 'monthly' | 'annual') => updateState({ timeframe }),
  }
}
