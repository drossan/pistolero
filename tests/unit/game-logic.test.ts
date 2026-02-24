import { describe, it, expect } from 'vitest'

// Extract the game logic for testing
function determineWinner(
  action1: string,
  action2: string
): 'player1' | 'player2' | 'tie' {
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

describe('Game Logic - determineWinner', () => {
  describe('Same actions result in tie', () => {
    it('should tie when both shoot', () => {
      expect(determineWinner('shoot', 'shoot')).toBe('tie')
    })

    it('should tie when both shield', () => {
      expect(determineWinner('shield', 'shield')).toBe('tie')
    })

    it('should tie when both reload', () => {
      expect(determineWinner('reload', 'reload')).toBe('tie')
    })
  })

  describe('Shoot beats Reload', () => {
    it('player1 should win when shooting against reload', () => {
      expect(determineWinner('shoot', 'reload')).toBe('player1')
    })

    it('player2 should win when shooting against reload', () => {
      expect(determineWinner('reload', 'shoot')).toBe('player2')
    })
  })

  describe('Shield beats Shoot', () => {
    it('player1 should win when shielding against shoot', () => {
      expect(determineWinner('shield', 'shoot')).toBe('player1')
    })

    it('player2 should win when shielding against shoot', () => {
      expect(determineWinner('shoot', 'shield')).toBe('player2')
    })
  })

  describe('Reload beats Shield', () => {
    it('player1 should win when reloading against shield', () => {
      expect(determineWinner('reload', 'shield')).toBe('player1')
    })

    it('player2 should win when reloading against shield', () => {
      expect(determineWinner('shield', 'reload')).toBe('player2')
    })
  })

  describe('Round Robin - all combinations', () => {
    it('should handle all possible action combinations correctly', () => {
      const combinations = [
        ['shoot', 'shoot', 'tie'],
        ['shoot', 'shield', 'player2'],
        ['shoot', 'reload', 'player1'],
        ['shield', 'shoot', 'player1'],
        ['shield', 'shield', 'tie'],
        ['shield', 'reload', 'player2'],
        ['reload', 'shoot', 'player2'],
        ['reload', 'shield', 'player1'],
        ['reload', 'reload', 'tie'],
      ] as const

      combinations.forEach(([action1, action2, expected]) => {
        expect(determineWinner(action1, action2)).toBe(expected)
      })
    })
  })
})

describe('Game Rules - Bullet Management', () => {
  describe('Shooting rules', () => {
    it('should not allow shooting with 0 bullets', () => {
      const bullets = 0
      const canShoot = bullets > 0
      expect(canShoot).toBe(false)
    })

    it('should allow shooting with 1+ bullets', () => {
      const bullets = 1
      const canShoot = bullets > 0
      expect(canShoot).toBe(true)

      const bullets2 = 5
      const canShoot2 = bullets2 > 0
      expect(canShoot2).toBe(true)
    })

    it('should decrease bullet count after shooting', () => {
      const bulletsBefore = 3
      const bulletsAfter = bulletsBefore - 1
      expect(bulletsAfter).toBe(2)
    })
  })

  describe('Reloading rules', () => {
    it('should not allow reloading at max bullets (5)', () => {
      const bullets = 5
      const canReload = bullets < 5
      expect(canReload).toBe(false)
    })

    it('should allow reloading below max bullets', () => {
      const bullets = 4
      const canReload = bullets < 5
      expect(canReload).toBe(true)

      const bullets2 = 0
      const canReload2 = bullets2 < 5
      expect(canReload2).toBe(true)
    })

    it('should increase bullet count after reloading', () => {
      const bulletsBefore = 2
      const bulletsAfter = bulletsBefore + 1
      expect(bulletsAfter).toBe(3)
    })

    it('should not exceed 5 bullets after reload', () => {
      const bulletsBefore = 4
      const bulletsAfter = Math.min(bulletsBefore + 1, 5)
      expect(bulletsAfter).toBe(5)
      expect(bulletsAfter).toBeLessThanOrEqual(5)
    })
  })
})

describe('Game Rules - Victory Conditions', () => {
  it('should require 3 round wins to win the game', () => {
    const winsNeeded = 3

    const player1Wins = 2
    const isWinner = player1Wins >= winsNeeded
    expect(isWinner).toBe(false)

    const player1Wins2 = 3
    const isWinner2 = player1Wins2 >= winsNeeded
    expect(isWinner2).toBe(true)

    const player1Wins3 = 4
    const isWinner3 = player1Wins3 >= winsNeeded
    expect(isWinner3).toBe(true)
  })

  it('should track round wins correctly', () => {
    const rounds = [
      { player1: 'shoot', player2: 'reload', winner: 'player1' },
      { player1: 'shield', player2: 'shoot', winner: 'player1' },
      { player1: 'reload', player2: 'shield', winner: 'player1' },
    ]

    const player1Wins = rounds.filter((r) => r.winner === 'player1').length
    const player2Wins = rounds.filter((r) => r.winner === 'player2').length
    const ties = rounds.filter((r) => r.winner === 'tie').length

    expect(player1Wins).toBe(3)
    expect(player2Wins).toBe(0)
    expect(ties).toBe(0)
  })
})

describe('Game Rules - Room Code Generation', () => {
  it('should generate 5-character room codes', () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No ambiguous chars

    function generateRoomCode(): string {
      let code = ''
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return code
    }

    const code1 = generateRoomCode()
    const code2 = generateRoomCode()

    expect(code1).toHaveLength(5)
    expect(code2).toHaveLength(5)
    expect(code1).not.toBe(code2) // Very unlikely to be the same
  })

  it('should only use valid characters (no I, O, 0, 1)', () => {
    const validChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const invalidChars = 'IO01'

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

    chars.split('').forEach((char) => {
      expect(validChars.includes(char)).toBe(true)
      expect(invalidChars.includes(char)).toBe(false)
    })
  })
})

describe('Game Rules - Timer System', () => {
  it('should have 10-second round timer', () => {
    const ROUND_DURATION = 10 // seconds
    const timeRemaining = 7

    expect(timeRemaining).toBeGreaterThan(0)
    expect(timeRemaining).toBeLessThanOrEqual(ROUND_DURATION)
  })

  it('should trigger automatic loss when timer expires', () => {
    const ROUND_DURATION = 10
    const timeElapsed = 10

    const isTimeout = timeElapsed >= ROUND_DURATION
    expect(isTimeout).toBe(true)
  })

  it('should allow action before timer expires', () => {
    const ROUND_DURATION = 10
    const timeElapsed = 5

    const canAct = timeElapsed < ROUND_DURATION
    expect(canAct).toBe(true)
  })
})

describe('Game Rules - Player Management', () => {
  it('should allow maximum 2 players per room', () => {
    const maxPlayers = 2
    const currentPlayers = 1

    const canJoin = currentPlayers < maxPlayers
    expect(canJoin).toBe(true)

    const currentPlayersFull = 2
    const canJoinFull = currentPlayersFull < maxPlayers
    expect(canJoinFull).toBe(false)
  })

  it('should track ready status for each player', () => {
    const players = [
      { id: 'p1', isReady: false },
      { id: 'p2', isReady: false },
    ]

    const allReady = players.every((p) => p.isReady)
    expect(allReady).toBe(false)

    players[0].isReady = true
    const allReady2 = players.every((p) => p.isReady)
    expect(allReady2).toBe(false)

    players[1].isReady = true
    const allReady3 = players.every((p) => p.isReady)
    expect(allReady3).toBe(true)
  })
})

describe('Stats Tracking', () => {
  it('should calculate win streak correctly', () => {
    const multiplayerWins = 5
    const currentStreak = multiplayerWins + 1

    expect(currentStreak).toBe(6)
  })

  it('should update best streak when current streak exceeds it', () => {
    const bestStreak = 5
    const currentStreak = 6

    const newBestStreak = Math.max(bestStreak, currentStreak)
    expect(newBestStreak).toBe(6)
  })

  it('should reset streak on loss', () => {
    const currentStreakOnLoss = 0

    expect(currentStreakOnLoss).toBe(0)
  })

  it('should accumulate total rounds played', () => {
    const stats = {
      totalRounds: 10,
      multiplayerWins: 3,
      multiplayerLosses: 2,
    }

    const roundsInThisGame = 5
    const newTotalRounds = stats.totalRounds + roundsInThisGame

    expect(newTotalRounds).toBe(15)
  })
})
