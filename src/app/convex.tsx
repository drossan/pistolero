import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ReactNode } from 'react'

// Initialize Convex client
const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL || 'https://western-pistolero-game.convex.cloud'
)

interface ConvexClientProviderProps {
  children: ReactNode
}

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  )
}
