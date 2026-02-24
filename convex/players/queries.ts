import { query } from '../_generated/server'
import { v } from 'convex/values'

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
