import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// Schema will be defined in next phase
// For now, creating minimal schema to pass setup tests

export default defineSchema({
  // Placeholder tables - will be properly defined in next phase
  players: defineTable({
    username: v.string(),
    deviceId: v.string(),
    statsId: v.id('stats'),
    createdAt: v.number(),
    lastSeen: v.number(),
  })
    .index('by_deviceId', ['deviceId']),

  rooms: defineTable({
    code: v.string(),
    hostId: v.id('players'),
    status: v.string(),
    difficulty: v.string(),
    createdAt: v.number(),
  })
    .index('by_code', ['code']),

  participants: defineTable({
    roomId: v.id('rooms'),
    playerId: v.id('players'),
    isHost: v.boolean(),
    isReady: v.boolean(),
    bullets: v.number(),
    roundsWon: v.number(),
  })
    .index('by_roomId', ['roomId']),

  moves: defineTable({
    roomId: v.id('rooms'),
    roundNumber: v.number(),
    playerId: v.id('players'),
    action: v.string(),
    timestamp: v.number(),
  })
    .index('by_room_round', ['roomId', 'roundNumber']),

  stats: defineTable({
    playerId: v.optional(v.id('players')),
    multiplayerWins: v.number(),
    multiplayerLosses: v.number(),
    bestStreak: v.number(),
    totalRounds: v.number(),
  })
    .index('by_playerId', ['playerId']),
})
