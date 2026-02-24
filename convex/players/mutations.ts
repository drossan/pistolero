import { v } from 'convex/values'
import { mutation } from '../_generated/server'

export const createAnonymousPlayer = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const playerId = await ctx.db.insert('players', {
      username: args.username,
      deviceId: crypto.randomUUID(),
      statsId: await ctx.db.insert('stats', {
        playerId: undefined, // Se actualizará después
        multiplayerWins: 0,
        multiplayerLosses: 0,
        bestStreak: 0,
        totalRounds: 0,
      }),
      createdAt: Date.now(),
      lastSeen: Date.now(),
    })

    // Actualizar el statsId con el playerId correcto
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
