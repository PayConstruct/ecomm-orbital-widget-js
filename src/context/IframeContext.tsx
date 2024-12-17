import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { InitOptions } from '../types'

interface IframeContextType {
  isOpen: boolean
  isLoading: boolean
  setIsOpen: (value: boolean) => void
  setIsLoading: (value: boolean) => void
  options: InitOptions
  signature: string
}

interface IframeProviderProps {
  children: ReactNode
  initialOptions: InitOptions
  signature: string
}

const IframeContext = createContext<IframeContextType | undefined>(undefined)

export const IframeProvider: React.FC<IframeProviderProps> = ({ children, initialOptions, signature }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Memoize the context value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({
      isOpen,
      isLoading,
      setIsLoading,
      setIsOpen,
      options: {
        ...initialOptions,
        button: { ...initialOptions?.button, color: initialOptions?.button?.color || 'white-black' },
      },
      signature,
    }),
    [isOpen, isLoading, initialOptions, signature]
  )

  return <IframeContext.Provider value={value}>{children}</IframeContext.Provider>
}

export const useIframeContext = () => {
  const context = useContext(IframeContext)
  if (!context) {
    throw new Error('useIframeContext must be used within an IframeProvider')
  }
  return context
}
