import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// ==================== PLAYERS ====================

export const createAnonymousPlayer = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    // Generar un deviceId único usando timestamp y random
    const deviceId = `${Date.now()}-${Math.random().toString(36).substring(7)}`

    const playerId = await ctx.db.insert('players', {
      username: args.username,
      deviceId: deviceId,
      statsId: await ctx.db.insert('stats', {
        multiplayerWins: 0,
        multiplayerLosses: 0,
        bestStreak: 0,
        totalRounds: 0,
      }),
      createdAt: Date.now(),
      lastSeen: Date.now(),
    })

    // Actualizar el stats con el playerId correcto
    const player = await ctx.db.get(playerId)
    if (player) {
      await ctx.db.patch(player.statsId, {
        playerId: playerId,
      })
    }

    return playerId
  },
})

export const updateLastSeen = mutation({
  args: {
    playerId: v.id('players'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerId, {
      lastSeen: Date.now(),
    })
  },
})

export const getPlayer = query({
  args: {
    playerId: v.id('players'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.playerId)
  },
})

export const getPlayerStats = query({
  args: {
    playerId: v.id('players'),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId)
    if (!player) {
      return null
    }
    return await ctx.db.get(player.statsId)
  },
})
