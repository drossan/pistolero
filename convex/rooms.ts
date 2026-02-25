import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// ==================== ROOMS ====================

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No ambiguous chars
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export const createRoom = mutation({
  args: {
    hostId: v.id('players'),
    difficulty: v.string(),
  },
  handler: async (ctx, args) => {
    const code = generateRoomCode()

    const roomId = await ctx.db.insert('rooms', {
      code,
      hostId: args.hostId,
      status: 'waiting',
      difficulty: args.difficulty,
      createdAt: Date.now(),
    })

    await ctx.db.insert('participants', {
      roomId,
      playerId: args.hostId,
      isHost: true,
      isReady: false,
      bullets: 0,
      roundsWon: 0,
    })

    return { roomId, code }
  },
})

export const joinRoom = mutation({
  args: {
    code: v.string(),
    playerId: v.id('players'),
  },
  handler: async (ctx, args) => {
    // Buscar sala por código
    const rooms = await ctx.db
      .query('rooms')
      .withIndex('by_code', q => q.eq('code', args.code))
      .collect()

    if (rooms.length === 0) {
      throw new Error('Sala no encontrada')
    }

    const room = rooms[0]
    if (room.status !== 'waiting') {
      throw new Error('La sala no está disponible')
    }

    // Verificar si el jugador ya está en la sala
    const existingParticipants = await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', room._id))
      .collect()

    if (existingParticipants.length >= 2) {
      throw new Error('La sala está llena')
    }

    const alreadyInRoom = existingParticipants.find(p => p.playerId === args.playerId)
    if (alreadyInRoom) {
      throw new Error('Ya estás en esta sala')
    }

    // Unir jugador a la sala
    await ctx.db.insert('participants', {
      roomId: room._id,
      playerId: args.playerId,
      isHost: false,
      isReady: false,
      bullets: 0,
      roundsWon: 0,
    })

    return { roomId: room._id, code: room.code }
  },
})

export const leaveRoom = mutation({
  args: {
    roomId: v.id('rooms'),
    playerId: v.id('players'),
  },
  handler: async (ctx, args) => {
    const participants = await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', args.roomId))
      .collect()

    const participant = participants.find(p => p.playerId === args.playerId)
    if (!participant) {
      throw new Error('No estás en esta sala')
    }

    await ctx.db.delete(participant._id)

    // Si el host se va, eliminar la sala
    const room = await ctx.db.get(args.roomId)
    if (room && room.hostId === args.playerId) {
      await ctx.db.delete(args.roomId)
    }
  },
})

export const setPlayerReady = mutation({
  args: {
    roomId: v.id('rooms'),
    playerId: v.id('players'),
    isReady: v.boolean(),
  },
  handler: async (ctx, args) => {
    const participants = await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', args.roomId))
      .collect()

    const participant = participants.find(p => p.playerId === args.playerId)
    if (!participant) {
      throw new Error('No estás en esta sala')
    }

    await ctx.db.patch(participant._id, {
      isReady: args.isReady,
    })

    // Si ambos están listos, cambiar estado de la sala
    const allParticipants = await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', args.roomId))
      .collect()

    if (allParticipants.length === 2 && allParticipants.every(p => p.isReady)) {
      await ctx.db.patch(args.roomId, {
        status: 'playing',
      })
    }
  },
})

export const getRoomByCode = query({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const rooms = await ctx.db
      .query('rooms')
      .withIndex('by_code', q => q.eq('code', args.code))
      .collect()

    return rooms[0] || null
  },
})

export const getRoomWithParticipants = query({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId)
    if (!room) {
      return null
    }

    const participants = await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', args.roomId))
      .collect()

    const players = await Promise.all(
      participants.map(async p => {
        const player = await ctx.db.get(p.playerId)
        return {
          ...p,
          username: player?.username || 'Unknown',
        }
      })
    )

    return {
      ...room,
      participants: players,
    }
  },
})
