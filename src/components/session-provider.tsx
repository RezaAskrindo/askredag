"use client"

import * as React from "react"
import { SessionProvider as SessionProviderAuth } from "next-auth/react";

export function SessionProvider({
  children,
  ...props
}: React.ComponentProps<typeof SessionProviderAuth>) {
  return <SessionProviderAuth {...props}>{children}</SessionProviderAuth>
}
