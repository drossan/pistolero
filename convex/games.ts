import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// ==================== GAME LOGIC ====================

function determineWinner(action1: string, action2: string): 'player1' | 'player2' | 'tie' {
  if (action1 === action2) return 'tie'
  if (action1 === 'shoot' && action2 === 'reload') return 'player1'
  if (action2 === 'shoot' && action1 === 'reload') return 'player2'
  if (action1 === 'shield' && action2 === 'shoot') return 'player1'
  if (action2 === 'shield' && action1 === 'shoot') return 'player2'
  if (action1 === 'reload' && action2 === 'shield') return 'player1'
  if (action2 === 'reload' && action1 === 'shield') return 'player2'
  return 'tie'
}

export const makeMove = mutation({
  args: {
    roomId: v.id('rooms'),
    playerId: v.id('players'),
    action: v.string(),
    roundNumber: v.number(),
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

    // ANTI-CHEAT: Cannot shoot without bullets
    if (args.action === 'shoot' && participant.bullets < 1) {
      throw new Error('Cannot shoot with 0 bullets')
    }

    // ANTI-CHEAT: Cannot reload at max bullets
    if (args.action === 'reload' && participant.bullets >= 5) {
      throw new Error('Cannot reload at 5 bullets')
    }

    // Save the move
    await ctx.db.insert('moves', {
      roomId: args.roomId,
      roundNumber: args.roundNumber,
      playerId: args.playerId,
      action: args.action,
      timestamp: Date.now(),
    })

    // Update bullets immediately
    let newBullets = participant.bullets
    if (args.action === 'reload') {
      newBullets = Math.min(5, participant.bullets + 1)
    } else if (args.action === 'shoot') {
      newBullets = participant.bullets - 1
    }

    await ctx.db.patch(participant._id, {
      bullets: newBullets,
    })
  },
})

export const resolveRound = mutation({
  args: {
    roomId: v.id('rooms'),
    roundNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const moves = await ctx.db
      .query('moves')
      .withIndex('by_room_round', q =>
        q.eq('roomId', args.roomId).eq('roundNumber', args.roundNumber)
      )
      .collect()

    if (moves.length !== 2) {
      throw new Error('Esperando a que ambos jugadores elijan')
    }

    const participants = await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', args.roomId))
      .collect()

    const move1 = moves.find(m => m.playerId === participants[0].playerId)
    const move2 = moves.find(m => m.playerId === participants[1].playerId)

    if (!move1 || !move2) {
      throw new Error('Error al resolver la ronda')
    }

    const winner = determineWinner(move1.action, move2.action)

    // Update rounds won
    if (winner === 'player1') {
      await ctx.db.patch(participants[0]._id, {
        roundsWon: participants[0].roundsWon + 1,
      })
    } else if (winner === 'player2') {
      await ctx.db.patch(participants[1]._id, {
        roundsWon: participants[1].roundsWon + 1,
      })
    }

    // Check for game over
    const maxRounds = Math.max(
      participants[0].roundsWon + (winner === 'player1' ? 1 : 0),
      participants[1].roundsWon + (winner === 'player2' ? 1 : 0)
    )

    if (maxRounds >= 3) {
      await ctx.db.patch(args.roomId, {
        status: 'finished',
      })

      // Update stats
      const winningPlayer = winner === 'player1' ? participants[0] : participants[1]
      const losingPlayer = winner === 'player1' ? participants[1] : participants[0]

      const winnerStats = await ctx.db.get(winningPlayer.statsId)
      const loserStats = await ctx.db.get(losingPlayer.statsId)

      if (winnerStats && loserStats) {
        await ctx.db.patch(winningPlayer.statsId, {
          multiplayerWins: winnerStats.multiplayerWins + 1,
          bestStreak: Math.max(winnerStats.bestStreak, winnerStats.bestStreak + 1),
          totalRounds: winnerStats.totalRounds + args.roundNumber,
        })

        await ctx.db.patch(losingPlayer.statsId, {
          multiplayerLosses: loserStats.multiplayerLosses + 1,
          bestStreak: 0,
          totalRounds: loserStats.totalRounds + args.roundNumber,
        })
      }
    }

    return {
      move1: move1.action,
      move2: move2.action,
      winner,
    }
  },
})

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

export const getLeaderboard = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const allStats = await ctx.db.query('stats').collect()
    return allStats
      .sort((a, b) => b.multiplayerWins - a.multiplayerWins)
      .slice(0, args.limit ?? 10)
      .map((stats) => ({
        stats,
        playerId: stats.playerId,
      }))
  },
})
