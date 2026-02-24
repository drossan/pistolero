# Convex Backend - Western Pistolero Game

## Overview

Este backend implementa la lógica del multijugador en tiempo real para Western Pistolero Game usando Convex.

## Database Schema

### Entities

#### 1. **players**
Jugadores registrados en el sistema.

```typescript
{
  username: string,
  deviceId: string,        // Identificador único del dispositivo
  statsId: id<stats>,      // Referencia a estadísticas
  createdAt: number,       // Timestamp de creación
  lastSeen: number         // Última actividad
}
```

**Indexes**:
- `by_deviceId`: Búsqueda rápida por dispositivo

---

#### 2. **rooms**
Salas de juego donde ocurren los duelos.

```typescript
{
  code: string,            // Código de 5 caracteres (ej: "ABCDE")
  hostId: id<players>,     // Jugador que creó la sala
  status: string,          // 'waiting' | 'playing' | 'finished'
  difficulty: string,      // 'easy' | 'normal' | 'hard'
  createdAt: number
}
```

**Indexes**:
- `by_code`: Búsqueda por código de sala

---

#### 3. **participants**
Jugadores que están en una sala específica.

```typescript
{
  roomId: id<rooms>,       // Sala a la que pertenece
  playerId: id<players>,   // Jugador
  isHost: boolean,         // Si es el creador de la sala
  isReady: boolean,        // Si está listo para jugar
  bullets: number,         // Balas actuales (0-5)
  roundsWon: number        // Rondas ganadas (0-3)
}
```

**Indexes**:
- `by_roomId`: Obtener todos los participantes de una sala

---

#### 4. **moves**
Acciones realizadas en cada ronda.

```typescript
{
  roomId: id<rooms>,
  roundNumber: number,     // Número de ronda (1-3)
  playerId: id<players>,
  action: string,          // 'shoot' | 'shield' | 'reload'
  timestamp: number        // Cuándo se hizo la acción
}
```

**Indexes**:
- `by_room_round`: Obtener acciones de una ronda específica

---

#### 5. **stats**
Estadísticas multijugador de cada jugador.

```typescript
{
  playerId: id<players>,
  multiplayerWins: number,   // Victorias
  multiplayerLosses: number, // Derrotas
  bestStreak: number,        // Mejor racha de victorias
  totalRounds: number       // Total de rondas jugadas
}
```

**Indexes**:
- `by_playerId`: Buscar estadísticas de un jugador

---

## Entity Relationships

```
players (1) ----< (1) stats
  |
  | (host)
  v
rooms (1) ----< (2) participants
  |
  | (each round)
  v
moves (0-*)  (por ronda)
```

### Flow

1. **Crear Sala**:
   - `players` → `rooms` (hostId → player)
   - Se crea `participant` para el host

2. **Unirse a Sala**:
   - Se busca `room` por `code`
   - Se crea `participant` para el nuevo jugador

3. **Durante el Juego**:
   - Cada ronda se guardan 2 `moves` (1 por jugador)
   - Se actualiza `bullets` y `roundsWon` en `participants`

4. **Fin del Juego**:
   - Se actualiza `stats` del ganador y perdedor
   - `room.status` cambia a 'finished'

---

## Anti-Cheat Validations

Toda la lógica del juego se valida en el servidor (mutations):

1. **No puedes disparar sin balas**
   ```typescript
   if (action === 'shoot' && participant.bullets < 1) {
     throw new Error('Cannot shoot with 0 bullets')
   }
   ```

2. **No puedes recargar al máximo**
   ```typescript
   if (action === 'reload' && participant.bullets >= 5) {
     throw new Error('Cannot reload at 5 bullets')
   }
   ```

3. **Solo 2 jugadores por sala**
   ```typescript
   const participants = await ctx.db.query('participants')
     .withIndex('by_roomId', q => q.eq('roomId', roomId))
     .collect()

   if (participants.length >= 2) {
     throw new Error('Room is full')
   }
   ```

---

## Realtime Features

Convex provides automatic realtime subscriptions via `useQuery`:

```typescript
// En el frontend
const participants = useQuery(api.rooms.getParticipants, { roomId })
// Se actualiza automáticamente cuando cambia
```

**Ventajas**:
- ✅ Sin configuración manual de WebSockets
- ✅ Sincronización optimista por defecto
- ✅ Queries vectorizadas (1 HTTP request para múltiples queries)
- ✅ Edge computing global (baja latencia)

---

## Development Commands

```bash
# Iniciar desarrollo local
npx convex dev

# Ver datos en dashboard local
# Se abre automáticamente en http://localhost:6277

# Ejecutar migrations (convex las hace automáticamente)
npx convex dev

# Deploy a producción
npx convex deploy
```

---

## Deployment (Vercel)

### Pre-requisitos

1. Instalar CLI de Convex:
   ```bash
   npm install -D convex
   ```

2. Login en Convex:
   ```bash
   npx convex login
   ```

### Configuración

El archivo `.env.local` contiene:
```env
CONVEX_DEPLOYMENT_URL=https://your-project.convex.cloud
VITE_CONVEX_URL=https://your-project.convex.cloud
```

### Build Process

Para Vercel, Convex se configura automáticamente. El proyecto se deploya en dos partes:

1. **Frontend (Vercel)**: React + Vite + PWA
2. **Backend (Convex)**: Base de datos + funciones serverless

Convex maneja automáticamente la conexión entre ambos.

---

## Testing

Los tests validan:
- ✅ Estructura de carpetas correcta
- ✅ Schema válido de Convex
- ✅ Client initialization correcto
- ✅ Configuración de environment variables

```bash
npm test -- tests/convex/
```

---

## Next Steps

- [ ] Implementar mutations para crear y unir salas
- [ ] Implementar mutation para acciones de juego
- [ ] Implementar mutation para resolver rondas
- [ ] Implementar queries para leaderboard
- [ ] Configurar Convex Auth para autenticación
- [ ] Implementar sincronización de estado
- [ ] Tests E2E con Playwright

---

## Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Convex Auth](https://docs.convex.dev/auth)
- [Convex Realtime](https://docs.convex.dev/realtime)
- [Convex Deployment](https://docs.convex.dev/deployment)
