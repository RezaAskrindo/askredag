'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type CMSStore, createCMSStore } from '@/stores/cms-store'

export type CMSStoreApi = ReturnType<typeof createCMSStore>

export const CMSStoreContext = createContext<CMSStoreApi | undefined>(
  undefined,
)

export interface CMSStoreProviderProps {
  children: ReactNode
}

export const CMSStoreProvider = ({
  children,
}: CMSStoreProviderProps) => {
  const storeRef = useRef<CMSStoreApi | null>(null)
  
  if (storeRef.current === null) {
    storeRef.current = createCMSStore()
  }

  return (
    <CMSStoreContext.Provider value={storeRef.current}>
      {children}
    </CMSStoreContext.Provider>
  )
}

export const useCMSStore = <T,>(
  selector: (store: CMSStore) => T,
): T => {
  const cMSStoreContext = useContext(CMSStoreContext)

  if (!cMSStoreContext) {
    throw new Error(`useCounterStore must be used within CMSStoreProvider`)
  }

  return useStore(cMSStoreContext, selector)
}