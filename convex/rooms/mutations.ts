import { v } from 'convex/values'
import { mutation } from '../_generated/server'

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
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
    const room = await ctx.db
      .query('rooms')
      .withIndex('by_code', q => q.eq('code', args.code.toUpperCase()))
      .first()

    if (!room) {
      throw new Error('Room not found')
    }

    if (room.status !== 'waiting') {
      throw new Error('Room is not available')
    }

    // Verificar si ya está en la sala
    const existingParticipant = await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', room._id))
      .filter(q => q.eq(q.field('playerId'), args.playerId))
      .first()

    if (existingParticipant) {
      throw new Error('Already in room')
    }

    // Verificar que no esté llena (max 2)
    const participants = await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', room._id))
      .collect()

    if (participants.length >= 2) {
      throw new Error('Room is full')
    }

    // Unirse a la sala
    await ctx.db.insert('participants', {
      roomId: room._id,
      playerId: args.playerId,
      isHost: false,
      isReady: false,
      bullets: 0,
      roundsWon: 0,
    })

    // Si hay 2 jugadores, cambiar estado a playing
    if (participants.length === 1) {
      await ctx.db.patch(room._id, {
        status: 'playing',
      })
    }

    return room._id
  },
})

export const toggleReady = mutation({
  args: {
    roomId: v.id('rooms'),
    playerId: v.id('players'),
  },
  handler: async (ctx, args) => {
    const participant = await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', args.roomId))
      .filter(q => q.eq(q.field('playerId'), args.playerId))
      .first()

    if (!participant) {
      throw new Error('Not in room')
    }

    await ctx.db.patch(participant._id, {
      isReady: !participant.isReady,
    })
  },
})

export const leaveRoom = mutation({
  args: {
    roomId: v.id('rooms'),
    playerId: v.id('players'),
  },
  handler: async (ctx, args) => {
    const participant = await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', args.roomId))
      .filter(q => q.eq(q.field('playerId'), args.playerId))
      .first()

    if (participant) {
      await ctx.db.delete(participant._id)
    }

    // Si no hay más participantes, eliminar la sala
    const remainingParticipants = await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', args.roomId))
      .collect()

    if (remainingParticipants.length === 0) {
      await ctx.db.delete(args.roomId)
    }
  },
})
