import { convexAuth } from '@convex-dev/auth/server'
import { GitHub } from '@convex-dev/auth/providers/github'

export const { auth, mutation, query } = convexAuth({
  providers: [GitHub],
})
