import { convexAuth } from '@convex-dev/auth/server'

// Configuración inicial con autenticación anónima
// GitHub OAuth se puede agregar más adelante si se necesita
export const { auth, mutation, query } = convexAuth({
  providers: [],
})
