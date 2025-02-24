"use client"

import * as React from "react"

import type { DashboardData } from "~/types/dashboard"

export const DashboardContext = React.createContext<DashboardData | null>(null)

export function useDashboardContext(): DashboardData
export function useDashboardContext(
  noThrow?: boolean,
): DashboardData | undefined

export function useDashboardContext(noThrow?: boolean) {
  const dashboardContext = React.use(DashboardContext)

  if (!dashboardContext) {
    if (noThrow) return undefined

    throw new Error(
      "useDashboardContext has to be used within <DashboardContext.Provider>",
    )
  }

  return dashboardContext
}
