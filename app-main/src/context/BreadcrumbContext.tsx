"use client"

import { createContext, useContext, ReactNode } from "react"

interface BreadcrumbContextType {
  setCategoryName: (name: string) => void
  setTagName: (name: string) => void
  setFolderName: (name: string) => void
  setUserName: (name: string) => void
  setProjectName: (name: string) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | null>(null)

interface BreadcrumbProviderProps {
  children: ReactNode
  categoryName?: string
  tagName?: string
  folderName?: string
  userName?: string
  projectName?: string
}

export const BreadcrumbProvider = ({ children }: BreadcrumbProviderProps) => {
  const setCategoryName = () => {}
  const setTagName = () => {}
  const setFolderName = () => {}
  const setUserName = () => {}
  const setProjectName = () => {}

  return (
    <BreadcrumbContext.Provider value={{
      setCategoryName,
      setTagName,
      setFolderName,
      setUserName,
      setProjectName
    }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export const useBreadcrumbContext = () => {
  const context = useContext(BreadcrumbContext)
  if (!context) {
    throw new Error("useBreadcrumbContext must be used within a BreadcrumbProvider")
  }
  return context
}
