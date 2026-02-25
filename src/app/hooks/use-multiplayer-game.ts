import { useEffect, useState } from 'react'
import { useMutation, useQuery, useAction } from 'convex/react'
import { api } from 'convex/_generated/api'
import { Id } from 'convex/_generated/dataModel'

export interface Participant {
  _id: Id<'participants'>
  playerId: Id<'players'>
  isHost: boolean
  isReady: boolean
  bullets: number
  roundsWon: number
}

export interface RoomData {
  _id: Id<'rooms'>
  code: string
  hostId: Id<'players'>
  status: 'waiting' | 'playing' | 'finished'
  difficulty: string
  participants: Participant[]
}

export function useMultiplayerGame() {
  const [playerId, setPlayerId] = useState<Id<'players'> | null>(null)
  const [currentRoomId, setCurrentRoomId] = useState<Id<'rooms'> | null>(null)

  // Mutations
  const createAnonymousPlayer = useMutation(api.players.createAnonymousPlayer)
  const createRoom = useMutation(api.rooms.createRoom)
  const joinRoom = useMutation(api.rooms.joinRoom)
  const leaveRoom = useMutation(api.rooms.leaveRoom)
  const setPlayerReady = useMutation(api.rooms.setPlayerReady)
  const makeMove = useMutation(api.games.makeMove)
  const resolveRound = useMutation(api.games.resolveRound)

  // Queries
  const roomWithParticipants = useQuery(
    api.rooms.getRoomWithParticipants,
    currentRoomId ? { roomId: currentRoomId } : 'skip'
  )

  // Initialize player from localStorage
  useEffect(() => {
    const storedPlayerId = localStorage.getItem('western_pistolero_player_id')
    if (storedPlayerId) {
      setPlayerId(storedPlayerId as Id<'players'>)
    }
  }, [])

  const login = async (username: string) => {
    try {
      const newPlayerId = await createAnonymousPlayer({ username })
      setPlayerId(newPlayerId)
      localStorage.setItem('western_pistolero_player_id', newPlayerId)
      return newPlayerId
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const createGameRoom = async (difficulty: string) => {
    if (!playerId) throw new Error('Not logged in')

    try {
      const result = await createRoom({
        hostId: playerId,
        difficulty,
      })
      setCurrentRoomId(result.roomId)
      return result
    } catch (error) {
      console.error('Create room error:', error)
      throw error
    }
  }

  const joinGameRoom = async (code: string) => {
    if (!playerId) throw new Error('Not logged in')

    try {
      const result = await joinRoom({ code, playerId })
      setCurrentRoomId(result.roomId)
      return result.roomId
    } catch (error) {
      console.error('Join room error:', error)
      throw error
    }
  }

  const leaveGameRoom = async () => {
    if (currentRoomId && playerId) {
      try {
        await leaveRoom({ roomId: currentRoomId, playerId })
        setCurrentRoomId(null)
      } catch (error) {
        console.error('Leave room error:', error)
        throw error
      }
    }
  }

  const togglePlayerReady = async () => {
    if (!currentRoomId || !playerId) throw new Error('Not in a room')

    try {
      // Get current participant to find their ready state
      const participant = roomWithParticipants?.participants.find(p => p.playerId === playerId)
      if (!participant) throw new Error('Participant not found')

      // Toggle the ready state
      await setPlayerReady({
        roomId: currentRoomId,
        playerId,
        isReady: !participant.isReady,
      })
    } catch (error) {
      console.error('Toggle ready error:', error)
      throw error
    }
  }

  const submitAction = async (action: 'shoot' | 'shield' | 'reload', roundNumber: number) => {
    if (!currentRoomId || !playerId) throw new Error('Not in a room')

    try {
      const result = await makeMove({
        roomId: currentRoomId,
        playerId,
        action,
        roundNumber,
      })
      return result
    } catch (error) {
      console.error('Make move error:', error)
      throw error
    }
  }

  const resolveGameRound = async (roundNumber: number) => {
    if (!currentRoomId) throw new Error('Not in a room')

    try {
      const result = await resolveRound({
        roomId: currentRoomId,
        roundNumber: roundNumber,
      })
      return result
    } catch (error) {
      console.error('Resolve round error:', error)
      throw error
    }
  }

  const logout = () => {
    setPlayerId(null)
    setCurrentRoomId(null)
    localStorage.removeItem('western_pistolero_player_id')
  }

  return {
    // State
    playerId,
    currentRoomId,
    roomData: roomWithParticipants,

    // Actions
    login,
    logout,
    createGameRoom,
    joinGameRoom,
    leaveGameRoom,
    togglePlayerReady,
    submitAction,
    resolveGameRound,

    // Computed
    isAuthenticated: !!playerId,
    isInRoom: !!currentRoomId,
    roomCode: roomWithParticipants?.code || null,
    roomStatus: roomWithParticipants?.status || null,
    participants: roomWithParticipants?.participants || [],
    isHost: roomWithParticipants?.hostId === playerId,
  }
}
