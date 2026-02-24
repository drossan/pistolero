import { query } from '../_generated/server'
import { v } from 'convex/values'

export const getMoves = query({
  args: {
    roomId: v.id('rooms'),
    roundNumber: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('moves')
      .withIndex('by_room_round', q =>
        q.eq('roomId', args.roomId).eq('roundNumber', args.roundNumber)
      )
      .collect()
  },
})

export const getCurrentRound = query({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId)
    if (!room) {
      return null
    }

    // Contar rondas existentes
    const moves = await ctx.db
      .query('moves')
      .withIndex('by_room_round', q => q.eq('roomId', args.roomId))
      .collect()

    const roundNumbers = [...new Set(moves.map((m) => m.roundNumber))]
    const currentRound = roundNumbers.length > 0 ? Math.max(...roundNumbers) : 0

    return {
      currentRound,
      roomStatus: room.status,
    }
  },
})
