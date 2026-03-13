import { useSyncExternalStore } from 'react'
import { MOCK_PROFILES } from '@/lib/mockData'

export type Profile = (typeof MOCK_PROFILES)[0]

interface AppState {
  profiles: Profile[]
  logoUrl: string
}

const getInitialState = (): AppState => {
  try {
    const savedProfiles = localStorage.getItem('finflow_profiles')
    const savedLogo = localStorage.getItem('finflow_logo')
    return {
      profiles: savedProfiles ? JSON.parse(savedProfiles) : MOCK_PROFILES,
      logoUrl: savedLogo || '',
    }
  } catch (error) {
    return {
      profiles: MOCK_PROFILES,
      logoUrl: '',
    }
  }
}

let state: AppState = getInitialState()

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export default function useAppStore() {
  const store = useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => state,
  )

  const setProfiles = (profiles: Profile[]) => {
    state = { ...state, profiles }
    localStorage.setItem('finflow_profiles', JSON.stringify(profiles))
    emit()
  }

  const setLogoUrl = (logoUrl: string) => {
    state = { ...state, logoUrl }
    localStorage.setItem('finflow_logo', logoUrl)
    emit()
  }

  return {
    ...store,
    setProfiles,
    setLogoUrl,
  }
}
