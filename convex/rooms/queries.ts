import { query } from '../_generated/server'
import { v } from 'convex/values'

export const getRoomByCode = query({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('rooms')
      .withIndex('by_code', q => q.eq('code', args.code.toUpperCase()))
      .first()
  },
})

export const getParticipants = query({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', args.roomId))
      .collect()
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

    return {
      ...room,
      participants,
    }
  },
})
