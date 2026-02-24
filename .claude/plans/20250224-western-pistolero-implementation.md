# Plan de Implementación - Western Pistolero Game

**Fecha**: Febrero 24, 2026
**Proyecto**: Western Pistolero Game (React + TypeScript + Vite)
**Objetivo**: Implementar PWA + Multijugador con Convex usando TDD

---

## 📋 Resumen Ejecutivo

Este plan detalla la implementación de dos características principales:

1. **PWA (Progressive Web App)**: Offline support, instalación en home screen, caché de assets
2. **Multijugador Online con Convex**: Realtime synchronization, anti-cheat, estadísticas

**Enfoque**: Todo el desarrollo seguirá **TDD (Test-Driven Development)** con commits después de cada tarea completada.

---

## 🎯 Agentes y Responsabilidades

### Framework RACI Adaptado para React/TypeScript

| Fase | Responsible (R) | Accountable (A) | Consulted (C) | Informed (I) |
|------|----------------|----------------|---------------|--------------|
| **Setup Testing** | general-purpose | technical-writer | - | - |
| **PWA Config** | general-purpose | technical-writer | - | - |
| **Convex Setup** | general-purpose | technical-writer | - | - |
| **Schema Design** | general-purpose | technical-writer | - | - |
| **Auth Implementation** | general-purpose | technical-writer | - | - |
| **Room Logic** | general-purpose | technical-writer | implement-design* | - |
| **Game Logic** | general-purpose | technical-writer | - | - |
| **Testing E2E** | general-purpose | technical-writer | - | - |

*\* implement-design solo si hay UI en Figma*

### Justificación de Selección

- **general-purpose**: Proyecto es React/TypeScript, NO Flutter. Los agentes flutter-* no aplican.
- **technical-writer**: Para documentación y validación de calidad de código
- **implement-design**: Solo si hay diseños Figma para UI de multijugador

---

## 📦 Parte 1: PWA Implementation (8-10 horas)

### Fase 1: Configuración Base de PWA (2-3 horas)

**Responsable**: general-purpose
**Accountable**: technical-writer

#### Tareas

1. **Crear manifest.json**
   - Ubicación: `/public/manifest.json`
   - Contenido: Nombre, iconos, tema western
   - Iconos: 192x192 y 512x512 (usar existing assets)

2. **Instalar vite-plugin-pwa**
   ```bash
   npm install -D vite-plugin-pwa
   ```

3. **Configurar vite.config.ts**
   - Agregar plugin VitePWA
   - Configurar workbox para caché
   - Estrategia: autoUpdate

4. **Actualizar index.html**
   - Agregar link rel="manifest"
   - Agregar meta tags para PWA

#### Tests Requeridos (TDD)

```typescript
// tests/pwa/manifest.test.ts
describe('PWA Manifest', () => {
  test('manifest.json exists and has required fields', () => {
    // Validar: name, short_name, start_url, display, icons
  })

  test('manifest has western theme colors', () => {
    // Validar: background_color: #e8d5a3, theme_color: #d4c5a0
  })
})

// tests/pwa/service-worker.test.ts
describe('Service Worker', () => {
  test('service worker registers successfully', async () => {
    // Mock navigator.serviceWorker.register
    // Validar registro sin errores
  })
})
```

#### Criterios de Aceptación

- [ ] Manifest válido en Chrome DevTools
- [ ] Service worker se registra sin errores
- [ ] Lighthouse PWA score > 90
- [ ] Instalable en móvil Android
- [ ] Tests pasan

#### Commit Message

```
feat(pwa): add PWA base configuration

- Create manifest.json with western theme
- Install and configure vite-plugin-pwa
- Add PWA meta tags to index.html
- Setup service worker with auto-update strategy

Tests: PWA manifest validation, SW registration
```

---

### Fase 2: Service Worker y Estrategia de Caché (3-4 horas)

**Responsable**: general-purpose
**Accountable**: technical-writer
**Dependencias**: Fase 1 completada

#### Tareas

1. **Implementar estrategia de caché**
   - Cache First: Assets estáticos (imágenes, fuentes, sonidos)
   - Network First: API calls (Convex backend)
   - Stale While Revalidate: HTML y JS updates

2. **Crear componente UpdateBanner**
   - Ubicación: `/src/app/components/update-banner.tsx`
   - Detecta nueva versión del service worker
   - Botón "Actualizar ahora"

3. **Crear offline fallback page**
   - Ubicación: `/public/offline.html`
   - Mensaje western: "Conexión perdida, vaquero"
   - Configurar SW para servir offline.html

4. **Implementar actualización de SW**
   - Función `updateSW()` en `/src/utils/service-worker.ts`
   - Skip waiting en SW update

#### Tests Requeridos (TDD)

```typescript
// tests/pwa/cache-strategy.test.ts
describe('Cache Strategy', () => {
  test('assets are cached on first load', async () => {
    // Mock fetch y verificar cache.put()
  })

  test('offline page shows when network fails', async () => {
    // Mock navigator.offline = true
    // Validar serving de offline.html
  })

  test('new version triggers update banner', async () => {
    // Mock SW skipWaiting event
    // Validar que UpdateBanner se muestra
  })
})
```

#### Criterios de Aceptación

- [ ] Juego funciona offline (VS Máquina)
- [ ] Assets se cargan de caché en segunda visita
- [ ] Banner de actualización aparece al deployar nueva versión
- [ ] Offline page se muestra al perder conexión
- [ ] Tests pasan

#### Commit Message

```
feat(pwa): implement cache strategy and offline support

- Add cache-first for static assets
- Add network-first for API calls
- Create UpdateBanner component for new versions
- Add offline fallback page with western theme
- Implement SW update detection

Tests: cache strategy, offline mode, update flow
```

---

### Fase 3: Testing y Optimización de PWA (2-3 horas)

**Responsable**: general-purpose
**Accountable**: technical-writer
**Dependencias**: Fase 2 completada

#### Tareas

1. **Instalar Lighthouse CI**
   ```bash
   npm install -D @lhci/cli
   ```

2. **Configurar lhci.yml**
   - Preset: lighthouse:recommended
   - Assertions: pwa-installable (error), pwa-offline (error)

3. **Optimizar bundle size**
   - Code split de routes
   - Lazy load de animaciones
   - Tree shake de iconos

4. **Testing manual en dispositivos**
   - Android Chrome
   - iOS Safari
   - Verificar instalación en home screen

#### Tests Requeridos (TDD)

```typescript
// tests/pwa/performance.test.ts
describe('PWA Performance', () => {
  test('PWA Lighthouse score > 90', async () => {
    // Integrar Lighthouse CI
  })

  test('bundle size < 200KB gzipped', () => {
    // Mock de build result
  })

  test('time to interactive < 3s on 3G', () => {
    // Mock de network throttling
  })
})
```

#### Criterios de Aceptación

- [ ] Lighthouse PWA score > 90
- [ ] Bundle size < 200KB gzipped
- [ ] TTI < 3s en conexión 3G
- [ ] Funciona en Android e iOS
- [ ] Tests pasan

#### Commit Message

```
test(pwa): add performance testing and optimization

- Setup Lighthouse CI for PWA validation
- Implement code splitting for routes
- Lazy load animations for smaller bundle
- Optimize bundle size to < 200KB gzipped

Tests: Lighthouse PWA score, bundle size, TTI
```

---

## 🌐 Parte 2: Multijugador con Convex (32-40 horas)

### Fase 4: Configuración Inicial de Convex (1-2 horas)

**Responsable**: general-purpose
**Accountable**: technical-writer

#### Tareas

1. **Crear proyecto Convex**
   ```bash
   npx convex dev
   ```

2. **Instalar dependencias**
   ```bash
   npm install convex
   npm install -D @types/node
   ```

3. **Estructura de carpetas**
   ```
   convex/
   ├── schema.ts
   ├── messages/
   ├── auth/
   └── games/
       ├── mutations.ts
       ├── queries.ts
       └── actions.ts
   ```

4. **Inicializar ConvexClient en frontend**
   - Crear `/src/app/convex.tsx`
   - Wrap App con ConvexProvider

#### Tests Requeridos (TDD)

```typescript
// tests/convex/setup.test.ts
describe('Convex Setup', () => {
  test('Convex client initializes with valid URL', () => {
    // Mock de environment variables
  })

  test('ConvexProvider wraps app without errors', () => {
    // Render test con ConvexProvider
  })
})
```

#### Criterios de Aceptación

- [ ] `npx convex dev` corre sin errores
- [ ] Dashboard local funciona
- [ ] Frontend conecta sin errores
- [ ] Tests pasan

#### Commit Message

```
feat(convex): initialize Convex backend

- Create Convex project and configure deployment
- Install convex dependencies
- Setup convex/ folder structure
- Initialize ConvexClient and ConvexProvider in app
- Add CONVEX_DEPLOYMENT_URL to .env.local

Tests: Convex client initialization
```

---

### Fase 5: Diseño de Schema de Base de Datos (2-3 horas)

**Responsable**: general-purpose
**Accountable**: technical-writer
**Dependencias**: Fase 4 completada

#### Tareas

1. **Definir schema.ts**
   ```typescript
   // Tablas: players, rooms, participants, moves, stats
   // Índices para queries frecuentes
   ```

2. **Validar schema**
   ```bash
   npx convex dev
   ```

3. **Documentar schema**
   - Crear `/convex/README.md`
   - Diagrama ER
   - Explicar relaciones

#### Tests Requeridos (TDD)

```typescript
// tests/convex/schema.test.ts
describe('Database Schema', () => {
  test('schema has all required tables', () => {
    // Validar: players, rooms, participants, moves, stats
  })

  test('players table has required indexes', () => {
    // Validar índice by_deviceId
  })

  test('rooms table code field is unique', () => {
    // Validar código único
  })
})
```

#### Criterios de Aceptación

- [ ] Schema compila sin errores
- [ ] Todas las relaciones definidas
- [ ] Índices creados
- [ ] Dashboard muestra tablas
- [ ] Tests pasan

#### Commit Message

```
feat(convex): define database schema for multiplayer

- Define tables: players, rooms, participants, moves, stats
- Add indexes for common queries (roomId, deviceId)
- Create relationships between tables
- Add schema documentation in convex/README.md

Tests: schema validation, index verification
```

---

### Fase 6: Autenticación con Convex Auth (3-4 horas)

**Responsable**: general-purpose
**Accountable**: technical-writer
**Dependencias**: Fase 5 completada

#### Tareas

1. **Instalar Convex Auth**
   ```bash
   npm install @convex-dev/auth
   ```

2. **Configurar auth/config.ts**
   - GitHub provider
   - Auth anónimo

3. **Crear mutation de login anónimo**
   - `createAnonymousPlayer`
   - Generar deviceId
   - Crear stats entry

4. **Crear UI de login**
   - Opción "Jugar como invitado"
   - Opción "Iniciar sesión con GitHub"
   - Guardar playerId en localStorage

#### Tests Requeridos (TDD)

```typescript
// tests/convex/auth.test.ts
describe('Authentication', () => {
  test('anonymous player can be created', async () => {
    // Mock de ctx.db.insert
    // Validar playerId válido
  })

  test('GitHub login redirects correctly', () => {
    // Mock de window.location
    // Validar redirect a GitHub OAuth
  })

  test('playerId persists in localStorage', () => {
    // Mock de localStorage
    // Validar persistencia
  })
})
```

#### Criterios de Aceptación

- [ ] Login anónimo funciona
- [ ] Login con GitHub redirige correctamente
- [ ] PlayerId se guarda y recupera
- [ ] Dashboard muestra jugadores
- [ ] Tests pasan

#### Commit Message

```
feat(auth): implement authentication with Convex Auth

- Setup Convex Auth with GitHub provider
- Implement anonymous player creation
- Add login UI in multiplayer screen (guest + GitHub)
- Persist playerId in localStorage

Tests: anonymous login, GitHub auth redirect, localStorage
```

---

### Fase 7: Lógica de Salas (Lobby) (4-5 horas)

**Responsable**: general-purpose
**Accountable**: technical-writer
**Dependencias**: Fase 6 completada

#### Tareas

1. **Crear mutations para salas**
   - `createRoom`: Generar código único de 5 chars
   - `joinRoom`: Validar max 2 jugadores

2. **Crear queries para salas**
   - `getRoomByCode`
   - `getParticipants`

3. **Actualizar UI de multiplayer.tsx**
   - Mostrar sala creada con código
   - Lista de participantes en tiempo real
   - Botón "Start game" (solo host)

4. **Implementar subscription**
   - `useQuery(api.rooms.getParticipants, { roomId })`

#### Tests Requeridos (TDD)

```typescript
// tests/convex/rooms.test.ts
describe('Room Logic', () => {
  test('createRoom generates unique 5-char code', async () => {
    // Validar formato y unicidad
  })

  test('joinRoom fails when room is full', async () => {
    // Mock de 2 participantes
    // Esperar error
  })

  test('getParticipants returns players in room', async () => {
    // Mock de datos
    // Validar retorno
  })
})
```

#### Criterios de Aceptación

- [ ] Crear sala genera código único
- [ ] Unirse valida que no esté llena
- [ ] Lista de participantes se actualiza en tiempo real
- [ ] Host puede iniciar juego
- [ ] Tests pasan

#### Commit Message

```
feat(multiplayer): implement room creation and joining

- Add createRoom mutation with unique 5-char code
- Add joinRoom mutation with max 2 players validation
- Add queries for room lookup and participants
- Update multiplayer UI with real-time participant list
- Add ready toggle for each player

Tests: room creation, join validation, real-time updates
```

---

### Fase 8: Lógica del Juego en Tiempo Real (6-8 horas)

**Responsable**: general-purpose
**Accountable**: technical-writer
**Dependencias**: Fase 7 completada

#### Tareas

1. **Crear mutation makeMove**
   - Validar reglas (anti-cheat)
   - No shoot sin balas
   - No reload en max balas
   - Guardar acción en DB

2. **Crear mutation resolveRound**
   - Obtener acciones de ambos
   - Determinar ganador
   - Actualizar rounds won
   - Actualizar estado de sala

3. **Crear componente multiplayer-game.tsx**
   - Reutilizar lógica de vs-machine.tsx
   - Adaptar para 2 humanos
   - Sincronizar estado en tiempo real

4. **Implementar fases de juego**
   - waiting → playing → finished

#### Tests Requeridos (TDD)

```typescript
// tests/convex/game-logic.test.ts
describe('Game Logic', () => {
  test('makeMove validates bullet count for shoot', async () => {
    // Bullets = 0, action = 'shoot' → Error
  })

  test('makeMove validates max bullets for reload', async () => {
    // Bullets = 5, action = 'reload' → Error
  })

  test('resolveRound correctly determines winner', async () => {
    // shoot vs reload → shoot wins
    // shield vs shoot → shield wins
    // reload vs shield → reload wins
  })

  test('game ends when player reaches 3 rounds', async () => {
    // Rounds won = 3 → status = 'finished'
  })
})
```

#### Criterios de Aceptación

- [ ] Ambos jugadores pueden hacer acciones
- [ ] Validaciones de servidor previenen cheats
- [ ] Round se resuelve correctamente
- [ ] Juego termina a los 3 rounds
- [ ] UI se actualiza en tiempo real
- [ ] Tests pasan

#### Commit Message

```
feat(multiplayer): implement real-time game logic

- Add makeMove mutation with server-side validation
- Add resolveRound mutation with winner determination
- Update room status through game phases
- Create multiplayer-game component with real-time sync
- Reuse vs-machine UI adapted for 2 human players

Tests: move validation, round resolution, anti-cheat
```

---

### Fase 9: Sincronización de Estado y Reconexión (3-4 horas)

**Responsable**: general-purpose
**Accountable**: technical-writer
**Dependencias**: Fase 8 completada

#### Tareas

1. **Implementar detección de desconexiones**
   - Verificar lastSeen
   - Marcar inactivo después de 30s

2. **Manejo de reconexión**
   - Recuperar estado de sala
   - Mostrar resultado si está en medio de round

3. **Sistema de heartbeat**
   - Cliente envía cada 10s
   - Servidor actualiza lastSeen

4. **UI de estados excepcionales**
   - "Oponente desconectado"
   - "Esperando reconexión..."

#### Tests Requeridos (TDD)

```typescript
// tests/convex/sync.test.ts
describe('Sync and Reconnection', () => {
  test('heartbeat updates player lastSeen', async () => {
    // Mock de heartbeat
  })

  test('disconnection detected after 30s', async () => {
    // Mock de lastSeen antiguo
  })

  test('reconnection recovers room state', async () => {
    // Mock de reconexión
  })
})
```

#### Criterios de Aceptación

- [ ] Heartbeat funciona
- [ ] Desconexión se detecta en 30s
- [ ] Reconexión recupera estado
- [ ] UI muestra mensajes claros
- [ ] Tests pasan

#### Commit Message

```
feat(multiplayer): implement sync and reconnection handling

- Add heartbeat system (10s interval)
- Detect disconnections after 30s of inactivity
- Implement reconnection state recovery
- Add UI for connection states (disconnected, reconnecting)
- Resolve timing conflicts with server timestamps

Tests: heartbeat, disconnection detection, reconnection
```

---

### Fase 10: Estadísticas Multijugador y Leaderboard (2-3 horas)

**Responsable**: general-purpose
**Accountable**: technical-writer
**Dependencias**: Fase 9 completada

#### Tareas

1. **Actualizar mutations para stats**
   - `recordGameResult`: Actualizar winner/loser stats
   - Actualizar bestStreak
   - Actualizar totalRounds

2. **Crear query getLeaderboard**
   - Top 10 por wins
   - Retornar ranking absoluto

3. **Crear vista de leaderboard**
   - Mostrar top 10 en home.tsx
   - Indicar "tú" si estás en top 10
   - Mostrar ranking absoluto

4. **Actualizar stats-modal.tsx**
   - Métricas de multijugador

#### Tests Requeridos (TDD)

```typescript
// tests/convex/stats.test.ts
describe('Statistics', () => {
  test('recordGameResult updates winner and loser stats', async () => {
    // Validar incremento de wins/losses
  })

  test('getLeaderboard returns top 10 sorted by wins', async () => {
    // Validar ordenamiento
  })

  test('bestStreak updates correctly', async () => {
    // Validar cálculo de streak
  })
})
```

#### Criterios de Aceptación

- [ ] Stats se actualizan al terminar juego
- [ ] Leaderboard muestra top 10
- [ ] Jugador puede ver su ranking
- [ ] Stats modal muestra métricas
- [ ] Tests pasan

#### Commit Message

```
feat(multiplayer): add statistics and leaderboard

- Record game results in player stats
- Add getLeaderboard query (top 10 by wins)
- Show leaderboard in home screen with player ranking
- Update stats-modal with multiplayer metrics

Tests: stats recording, leaderboard sorting, ranking display
```

---

### Fase 11: Testing E2E con Playwright (4-5 horas)

**Responsable**: general-purpose
**Accountable**: technical-writer
**Dependencias**: Fase 10 completada

#### Tareas

1. **Configurar Playwright**
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```

2. **Crear test de flujo completo**
   - Jugador 1 crea sala
   - Jugador 2 se une
   - Ambos marcan ready
   - Juegan 3 rounds
   - Validar game over

3. **Tests de edge cases**
   - Desconexión mid-game
   - Acciones concurrentes
   - Intento de unirse a sala llena

4. **Tests de performance**
   - Latencia < 100ms
   - No bloqueos de UI
   - Bundle size check

#### Tests Requeridos (TDD)

```typescript
// tests/e2e/multiplayer.spec.ts
import { test } from '@playwright/test'

test('complete multiplayer game flow', async ({ browser }) => {
  // Simular 2 jugadores
  // Validar flujo completo
})

test('disconnection mid-game is handled', async ({ browser }) => {
  // Cerrar contexto de un jugador
  // Validar mensaje de desconexión
})

test('concurrent actions are resolved correctly', async ({ browser }) => {
  // Ambos click al mismo tiempo
  // Validar orden determinístico
})
```

#### Criterios de Aceptación

- [ ] Todos los E2E tests pasan
- [ ] Edge cases cubiertos
- [ ] Latencia < 100ms
- [ ] No memory leaks
- [ ] Tests pasan

#### Commit Message

```
test(multiplayer): add end-to-end integration tests

- Setup Playwright for E2E testing
- Test complete multiplayer flow (create → join → play → finish)
- Test edge cases (disconnection, concurrency, invalid actions)
- Add performance benchmarks for realtime latency

Tests: E2E flow, edge cases, performance
```

---

## 🧪 Parte 3: Estrategia TDD Integral

### Framework de Testing

**Stack**:
- **Unit Tests**: Vitest
- **Component Tests**: Vitest + @testing-library/react
- **E2E Tests**: Playwright
- **Coverage**: v8 (built-in)

### Instalación Inicial

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test
```

### Configuración

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
  },
})
```

### Estructura de Tests

```
tests/
├── setup.ts
├── unit/
│   ├── utils/
│   │   ├── ai.test.ts
│   │   ├── stats.test.ts
│   │   └── haptics.test.ts
├── components/
│   ├── home.test.tsx
│   ├── vs-machine.test.tsx
│   └── multiplayer.test.tsx
├── convex/
│   ├── schema.test.ts
│   ├── auth.test.ts
│   ├── rooms.test.ts
│   └── game-logic.test.ts
├── pwa/
│   ├── manifest.test.ts
│   ├── service-worker.test.ts
│   └── performance.test.ts
└── e2e/
    ├── vs-machine.spec.ts
    └── multiplayer.spec.ts
```

### Workflow TDD

1. **Red**: Escribir test que falla
2. **Green**: Escribir código mínimo para pasar
3. **Refactor**: Mejorar código
4. **Commit**: Commitear con tests

---

## 📊 Resumen de Cronograma

| Fase | Descripción | Horas | Dependencies |
|------|-------------|-------|--------------|
| **PWA** | | **8-10h** | |
| 1 | PWA Config Base | 2-3h | - |
| 2 | SW y Offline | 3-4h | 1 |
| 3 | Testing PWA | 2-3h | 2 |
| **Multijugador** | | **32-40h** | |
| 4 | Convex Setup | 1-2h | - |
| 5 | Schema DB | 2-3h | 4 |
| 6 | Auth | 3-4h | 5 |
| 7 | Room Logic | 4-5h | 6 |
| 8 | Game Logic | 6-8h | 7 |
| 9 | Sync/Reconnection | 3-4h | 8 |
| 10 | Stats/Leaderboard | 2-3h | 9 |
| 11 | E2E Tests | 4-5h | 10 |
| **TDD Setup** | Framework | 2h | - |
| **TOTAL** | | **42-52h** | |

### Recomendación de Ejecución

**Secuencial (Recomendado)**:
1. PWA completo (8-10h)
2. Multijugador completo (32-40h)
3. Total: ~2 semanas a 25-30h/semana

---

## ✅ Checklist General

### Setup Inicial
- [ ] Instalar Vitest y Testing Library
- [ ] Configurar vitest.config.ts
- [ ] Crear tests/setup.ts con mocks
- [ ] Instalar Playwright para E2E

### PWA
- [ ] Manifest creado y validado
- [ ] Service worker registrado
- [ ] Estrategia de caché implementada
- [ ] Offline fallback funciona
- [ ] Lighthouse score > 90
- [ ] Testing en dispositivos reales

### Convex Backend
- [ ] Proyecto Convex creado
- [ ] Schema definido y validado
- [ ] Auth configurado (GitHub + anónimo)
- [ ] Mutations de salas funcionando
- [ ] Mutations de juego funcionando
- [ ] Queries de leaderboard funcionando
- [ ] Realtime subscriptions funcionando

### Multijugador Frontend
- [ ] Login UI funciona
- [ ] Crear sala funciona
- [ ] Unirse a sala funciona
- [ ] Juego en tiempo real funciona
- [ ] Reconexión funciona
- [ ] Leaderboard se muestra
- [ ] Stats se actualizan

### Testing
- [ ] Unit tests pasan
- [ ] Component tests pasan
- [ ] E2E tests pasan
- [ ] Cobertura > 70%
- [ ] Lighthouse CI pasa

---

## 🎁 Entregables Finales

1. **PWA Funcional**
   - Instalable en home screen
   - Offline support
   - Performance optimizado

2. **Multijugador Online**
   - Salas con códigos de 5 letras
   - Realtime synchronization
   - Anti-cheat en servidor
   - Estadísticas y leaderboard

3. **Suite de Tests Completa**
   - Cobertura > 70%
   - Tests E2E automatizados
   - Performance benchmarks

4. **Documentación**
   - README actualizado
   - Schema documentado
   - Tests documentados

---

**¿Listo para comenzar, vaquero?** 🤠🔫
