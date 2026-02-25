import { v } from 'convex/values'
import { mutation } from '../_generated/server'

export const makeMove = mutation({
  args: {
    roomId: v.id('rooms'),
    playerId: v.id('players'),
    action: v.string(),
    roundNumber: v.number(),
  },
  handler: async (ctx, args) => {
    // Validar reglas del juego (anti-cheat)
    const participant = await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', args.roomId))
      .filter(q => q.eq(q.field('playerId'), args.playerId))
      .first()

    if (!participant) {
      throw new Error('Player not in room')
    }

    // Validar balas para shoot
    if (args.action === 'shoot' && participant.bullets < 1) {
      throw new Error('Cannot shoot with 0 bullets')
    }

    // Validar max balas para reload
    if (args.action === 'reload' && participant.bullets >= 5) {
      throw new Error('Cannot reload at 5 bullets')
    }

    // Guardar acción
    await ctx.db.insert('moves', {
      roomId: args.roomId,
      roundNumber: args.roundNumber,
      playerId: args.playerId,
      action: args.action,
      timestamp: Date.now(),
    })

    // Actualizar balas
    const newBullets =
      args.action === 'shoot'
        ? participant.bullets - 1
        : args.action === 'reload'
        ? participant.bullets + 1
        : participant.bullets

    await ctx.db.patch(participant._id, {
      bullets: newBullets,
    })

    return { success: true, newBullets }
  },
})

export const resolveRound = mutation({
  args: {
    roomId: v.id('rooms'),
    roundNumber: v.number(),
  },
  handler: async (ctx, args) => {
    // Obtener acciones de ambos jugadores
    const moves = await ctx.db
      .query('moves')
      .withIndex('by_room_round', q =>
        q.eq('roomId', args.roomId).eq('roundNumber', args.roundNumber)
      )
      .collect()

    if (moves.length !== 2) {
      throw new Error('Both players must make a move')
    }

    const [move1, move2] = moves
    const winner = determineWinner(move1.action, move2.action)

    // Actualizar rounds won
    const participants = await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', args.roomId))
      .collect()

    for (const participant of participants) {
      if (
        (winner === 'player1' && participant.playerId === move1.playerId) ||
        (winner === 'player2' && participant.playerId === move2.playerId)
      ) {
        await ctx.db.patch(participant._id, {
          roundsWon: participant.roundsWon + 1,
        })
      }
    }

    // Actualizar estado de sala si alguien ganó
    const updatedParticipants = await ctx.db
      .query('participants')
      .withIndex('by_roomId', q => q.eq('roomId', args.roomId))
      .collect()

    if (updatedParticipants.some((p) => p.roundsWon >= 3)) {
      await ctx.db.patch(args.roomId, {
        status: 'finished',
      })
    }

    return { winner, move1: move1.action, move2: move2.action }
  },
})

function determineWinner(action1: string, action2: string): 'player1' | 'player2' | 'tie' {
  if (action1 === action2) {
    return 'tie'
  }

  // shoot beats reload
  if (action1 === 'shoot' && action2 === 'reload') return 'player1'
  if (action2 === 'shoot' && action1 === 'reload') return 'player2'

  // shield beats shoot
  if (action1 === 'shield' && action2 === 'shoot') return 'player1'
  if (action2 === 'shield' && action1 === 'shoot') return 'player2'

  // reload beats shield
  if (action1 === 'reload' && action2 === 'shield') return 'player1'
  if (action2 === 'reload' && action1 === 'shield') return 'player2'

  return 'tie'
}

export const recordGameResult = mutation({
  args: {
    winnerId: v.id('players'),
    loserId: v.id('players'),
    roundsPlayed: v.number(),
  },
  handler: async (ctx, args) => {
    // Update winner stats
    const winner = await ctx.db.get(args.winnerId)
    if (!winner) {
      throw new Error('Winner not found')
    }

    const winnerStats = await ctx.db.get(winner.statsId)
    if (winnerStats) {
      const currentStreak = winnerStats.multiplayerWins + 1
      await ctx.db.patch(winner.statsId, {
        multiplayerWins: winnerStats.multiplayerWins + 1,
        bestStreak: Math.max(winnerStats.bestStreak, currentStreak),
        totalRounds: winnerStats.totalRounds + args.roundsPlayed,
      })
    }

    // Update loser stats
    const loser = await ctx.db.get(args.loserId)
    if (!loser) {
      throw new Error('Loser not found')
    }

    const loserStats = await ctx.db.get(loser.statsId)
    if (loserStats) {
      await ctx.db.patch(loser.statsId, {
        multiplayerLosses: loserStats.multiplayerLosses + 1,
        bestStreak: 0, // Reset streak on loss
        totalRounds: loserStats.totalRounds + args.roundsPlayed,
      })
    }
  },
})
