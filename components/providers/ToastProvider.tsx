"use client"

import * as React from "react"
import { ToastProvider as BaseToastProvider } from "@/hooks/use-toast"

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <BaseToastProvider>{children}</BaseToastProvider>
}
