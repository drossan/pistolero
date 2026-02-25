import { useState, useEffect } from "react";
import { Link } from "react-router";
import { LoginModal } from "./login-modal";
import { useMultiplayerGame } from "../hooks/use-multiplayer-game";

type Action = "pistola" | "escudo" | "recarga" | null;
type GamePhase = "menu" | "login" | "create" | "join" | "waiting" | "ready" | "countdown" | "choose" | "reveal";

export function Multiplayer() {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [showLogin, setShowLogin] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [difficulty, setDifficulty] = useState("Normal");
  const [selectedAction, setSelectedAction] = useState<Action>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [roundNumber, setRoundNumber] = useState(1);
  const [lastRoundResult, setLastRoundResult] = useState<any>(null);

  const {
    playerId,
    isAuthenticated,
    roomData,
    roomCode,
    roomStatus,
    participants,
    isHost,
    login,
    createGameRoom,
    joinGameRoom,
    leaveGameRoom,
    togglePlayerReady,
    submitAction,
    resolveGameRound,
  } = useMultiplayerGame();

  // Redirect to login if not authenticated when trying to play
  const handleCreateRoom = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    setPhase("create");
  };

  const handleJoinRoom = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    setPhase("join");
  };

  const handleLogin = async (username: string) => {
    try {
      await login(username);
      setShowLogin(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const createRoom = async () => {
    try {
      await createGameRoom(difficulty);
      setPhase("waiting");
    } catch (error) {
      console.error("Create room error:", error);
      alert("Error al crear la sala");
    }
  };

  const joinGameRoomAction = async () => {
    if (inputCode.length !== 5) {
      alert("El código debe tener 5 caracteres");
      return;
    }
    try {
      await joinGameRoom(inputCode.toUpperCase());
      setPhase("waiting");
    } catch (error: any) {
      console.error("Join room error:", error);
      alert(error.message || "Error al unirse a la sala");
    }
  };

  const copyToClipboard = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      alert("Código copiado al portapapeles");
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveGameRoom();
      setPhase("menu");
      setInputCode("");
      setRoundNumber(1);
      setLastRoundResult(null);
    } catch (error) {
      console.error("Leave room error:", error);
    }
  };

  const handleToggleReady = async () => {
    try {
      await togglePlayerReady();
    } catch (error: any) {
      console.error("Toggle ready error:", error);
      alert(error.message || "Error al cambiar estado");
    }
  };

  // Auto-start game when both players are ready
  useEffect(() => {
    if (roomStatus === "playing" && phase === "waiting") {
      setPhase("ready");
    }
  }, [roomStatus, phase]);

  // Check if room is finished
  useEffect(() => {
    if (roomStatus === "finished") {
      setPhase("reveal");
    }
  }, [roomStatus]);

  // Start countdown when both players are ready
  useEffect(() => {
    if (phase === "ready" && participants.length === 2 && participants.every((p) => p.isReady)) {
      // Start countdown after a short delay
      const timer = setTimeout(() => {
        setPhase("countdown");
        let count = 3;
        setTimeLeft(count);

        const countdownInterval = setInterval(() => {
          count -= 1;
          setTimeLeft(count);

          if (count === 0) {
            clearInterval(countdownInterval);
            setPhase("choose");
            setTimeLeft(10);
            setSelectedAction(null);
          }
        }, 1000);

        return () => clearInterval(countdownInterval);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [phase, participants]);

  // Timer for choose phase
  useEffect(() => {
    if (phase === "choose" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (phase === "choose" && timeLeft === 0) {
      // Time's up - auto submit reload as default action
      handleActionSubmit("reload");
    }
  }, [phase, timeLeft]);

  const handleActionSubmit = async (action: "shoot" | "shield" | "reload") => {
    try {
      setSelectedAction(action);

      // Submit action to Convex
      await submitAction(action, roundNumber);

      // Check if both players have submitted (this would come from Convex subscription)
      // For now, we'll use a simple timeout to simulate waiting for opponent
      setTimeout(async () => {
        // Resolve the round
        const result = await resolveGameRound(roundNumber);
        setLastRoundResult(result);

        // Check for game over
        const maxRounds = Math.max(...participants.map((p) => p.roundsWon));
        if (maxRounds >= 3) {
          setPhase("reveal");
        } else {
          // Start next round
          setRoundNumber((prev) => prev + 1);
          setPhase("ready");
        }
      }, 1000);
    } catch (error) {
      console.error("Action submit error:", error);
      alert("Error al enviar acción");
    }
  };

  const getCurrentParticipant = () => {
    return participants.find((p) => p.playerId === playerId);
  };

  return (
    <div className="min-h-screen bg-[#e8d5a3] p-3 sm:p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Link to="/">
            <button 
              className="border-2 border-black bg-[#e8d5a3] px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-[#d4c5a0] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              ← VOLVER
            </button>
          </Link>
        </div>

        {/* Título */}
        <div className="border-3 sm:border-4 border-black p-3 sm:p-4 mb-4 sm:mb-6 text-center bg-[#e8d5a3] shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_rgba(0,0,0,1)]">
          <h1 
            className="text-3xl sm:text-5xl tracking-wide"
            style={{ fontFamily: "'Rye', serif" }}
          >
            MULTIJUGADOR
          </h1>
        </div>

        {/* Menú principal */}
        {phase === "menu" && (
          <div className="border-3 sm:border-4 border-black p-6 sm:p-8 bg-[#d4c5a0]">
            {isAuthenticated && (
              <div className="mb-4 p-3 border-2 border-black bg-[#e8d5a0] text-center">
                <p
                  className="text-sm"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  Jugando como: <span className="font-bold">{playerId}</span>
                </p>
              </div>
            )}
            <p
              className="text-center text-base sm:text-xl mb-6 sm:mb-8"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              Elige una opción para comenzar el duelo
            </p>
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={handleCreateRoom}
                className="w-full border-3 sm:border-4 border-black bg-[#e8d5a3] p-4 sm:p-6 text-xl sm:text-2xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Rye', serif" }}
              >
                CREAR SALA
              </button>
              <button
                onClick={handleJoinRoom}
                className="w-full border-3 sm:border-4 border-black bg-[#e8d5a3] p-4 sm:p-6 text-xl sm:text-2xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Rye', serif" }}
              >
                UNIRSE A SALA
              </button>
            </div>
          </div>
        )}

        {/* Unirse a sala */}
        {phase === "join" && (
          <div className="border-3 sm:border-4 border-black p-6 sm:p-8 bg-[#d4c5a0]">
            <h2 
              className="text-2xl sm:text-3xl mb-4 sm:mb-6 text-center"
              style={{ fontFamily: "'Rye', serif" }}
            >
              UNIRSE A SALA
            </h2>
            <p 
              className="text-center mb-4 sm:mb-6 text-sm sm:text-base"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              Introduce el código de 5 letras
            </p>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              maxLength={5}
              placeholder="XXXXX"
              className="w-full border-3 sm:border-4 border-black p-3 sm:p-4 text-center text-2xl sm:text-3xl tracking-widest bg-[#e8d5a3] mb-4 sm:mb-6 uppercase"
              style={{ fontFamily: "'Rye', serif" }}
            />
            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setPhase("menu")}
                className="flex-1 border-3 sm:border-4 border-black bg-[#e8d5a3] p-3 sm:p-4 text-lg sm:text-xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Rye', serif" }}
              >
                CANCELAR
              </button>
              <button
                onClick={joinGameRoomAction}
                className="flex-1 border-3 sm:border-4 border-black bg-[#e8d5a3] p-3 sm:p-4 text-lg sm:text-xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Rye', serif" }}
              >
                UNIRSE
              </button>
            </div>
          </div>
        )}

        {/* Esperando jugador */}
        {phase === "waiting" && roomCode && (
          <div className="border-3 sm:border-4 border-black p-6 sm:p-8 bg-[#d4c5a0]">
            {isHost ? (
              <>
                <h2
                  className="text-2xl sm:text-3xl mb-4 sm:mb-6 text-center"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  SALA CREADA
                </h2>
                <p
                  className="text-center mb-3 sm:mb-4 text-sm sm:text-base"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  Comparte este código con tu oponente:
                </p>
                <div className="border-3 sm:border-4 border-black p-4 sm:p-6 bg-[#e8d5a3] mb-4 sm:mb-6">
                  <p
                    className="text-center text-4xl sm:text-6xl tracking-widest break-all"
                    style={{ fontFamily: "'Rye', serif" }}
                  >
                    {roomCode}
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="w-full border-3 sm:border-4 border-black bg-[#e8d5a3] p-3 sm:p-4 text-lg sm:text-xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  COPIAR CÓDIGO
                </button>

                {/* Show participants */}
                {participants.length > 0 && (
                  <div className="mb-4">
                    <p
                      className="text-center text-sm mb-2"
                      style={{ fontFamily: "'Special Elite', monospace" }}
                    >
                      Jugadores en sala ({participants.length}/2):
                    </p>
                    {participants.map((p) => (
                      <div
                        key={p._id}
                        className="flex justify-between items-center p-2 border-2 border-black bg-[#e8d5a3] mb-2"
                      >
                        <span
                          className="text-sm"
                          style={{ fontFamily: "'Special Elite', monospace" }}
                        >
                          {p.isHost ? "🤠 Anfitrión" : "🎯 Invitado"}
                        </span>
                        <span
                          className={`text-sm ${p.isReady ? "text-green-700" : "text-red-700"}`}
                          style={{ fontFamily: "'Special Elite', monospace" }}
                        >
                          {p.isReady ? "✓ LISTO" : "○ ESPERANDO"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {participants.length === 1 && (
                  <p
                    className="text-center animate-pulse text-sm sm:text-base"
                    style={{ fontFamily: "'Special Elite', monospace" }}
                  >
                    Esperando al oponente...
                  </p>
                )}

                {participants.length === 2 && (
                  <button
                    onClick={handleToggleReady}
                    className="w-full border-3 sm:border-4 border-black bg-[#e8d5a3] p-3 sm:p-4 text-lg sm:text-xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                    style={{ fontFamily: "'Rye', serif" }}
                  >
                    {participants.find((p) => p.playerId === playerId)?.isReady
                      ? "NO ESTOY LISTO"
                      : "ESTOY LISTO"}
                  </button>
                )}
              </>
            ) : (
              <>
                <h2
                  className="text-2xl sm:text-3xl mb-4 sm:mb-6 text-center"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  CONECTADO
                </h2>
                <p
                  className="text-center mb-3 sm:mb-4 text-sm sm:text-base"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  Sala: {roomCode}
                </p>

                {/* Show participants */}
                {participants.length > 0 && (
                  <div className="mb-4">
                    <p
                      className="text-center text-sm mb-2"
                      style={{ fontFamily: "'Special Elite', monospace" }}
                    >
                      Jugadores en sala ({participants.length}/2):
                    </p>
                    {participants.map((p) => (
                      <div
                        key={p._id}
                        className="flex justify-between items-center p-2 border-2 border-black bg-[#e8d5a3] mb-2"
                      >
                        <span
                          className="text-sm"
                          style={{ fontFamily: "'Special Elite', monospace" }}
                        >
                          {p.isHost ? "🤠 Anfitrión" : "🎯 Invitado"}
                        </span>
                        <span
                          className={`text-sm ${p.isReady ? "text-green-700" : "text-red-700"}`}
                          style={{ fontFamily: "'Special Elite', monospace" }}
                        >
                          {p.isReady ? "✓ LISTO" : "○ ESPERANDO"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {participants.length === 2 && (
                  <button
                    onClick={handleToggleReady}
                    className="w-full border-3 sm:border-4 border-black bg-[#e8d5a3] p-3 sm:p-4 text-lg sm:text-xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4"
                    style={{ fontFamily: "'Rye', serif" }}
                  >
                    {participants.find((p) => p.playerId === playerId)?.isReady
                      ? "NO ESTOY LISTO"
                      : "ESTOY LISTO"}
                  </button>
                )}
              </>
            )}
            <button
              onClick={handleLeaveRoom}
              className="w-full mt-4 sm:mt-6 border-3 sm:border-4 border-black bg-[#e8d5a3] p-3 sm:p-4 text-lg sm:text-xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
              style={{ fontFamily: "'Rye', serif" }}
            >
              SALIR DE LA SALA
            </button>
          </div>
        )}

        {/* Crear sala - difficulty selection */}
        {phase === "create" && (
          <div className="border-3 sm:border-4 border-black p-6 sm:p-8 bg-[#d4c5a0]">
            <h2
              className="text-2xl sm:text-3xl mb-4 sm:mb-6 text-center"
              style={{ fontFamily: "'Rye', serif" }}
            >
              DIFICULTAD
            </h2>
            <p
              className="text-center mb-6 text-sm"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              Elige la dificultad del duelo:
            </p>
            <div className="space-y-3">
              {["Easy", "Normal", "Hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`w-full border-3 sm:border-4 p-4 sm:p-6 text-xl sm:text-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] ${
                    difficulty === diff
                      ? "bg-black text-white border-black"
                      : "bg-[#e8d5a3] border-black hover:bg-[#d4c5a0]"
                  }`}
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  {diff.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setPhase("menu")}
                className="flex-1 border-3 sm:border-4 border-black bg-[#e8d5a3] p-3 sm:p-4 text-lg hover:bg-[#d4c5a0] shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Rye', serif" }}
              >
                CANCELAR
              </button>
              <button
                onClick={createRoom}
                className="flex-1 border-3 sm:border-4 border-black bg-[#e8d5a3] p-3 sm:p-4 text-lg hover:bg-[#d4c5a0] shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Rye', serif" }}
              >
                CREAR
              </button>
            </div>
          </div>
        )}

        {/* Ready phase - show waiting for next round */}
        {phase === "ready" && (
          <div className="border-4 border-black p-6 sm:p-8 bg-[#d4c5a0]">
            <h2
              className="text-2xl sm:text-3xl mb-4 text-center"
              style={{ fontFamily: "'Rye', serif" }}
            >
              LISTO PARA LA RONDA {roundNumber}
            </h2>

            {/* Score display */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              {participants.map((p) => (
                <div
                  key={p._id}
                  className={`border-3 border-black p-4 text-center ${
                    p.playerId === playerId ? "bg-[#e8d5a3]" : "bg-[#d4c5a0]"
                  }`}
                >
                  <p
                    className="text-xs mb-2"
                    style={{ fontFamily: "'Special Elite', monospace" }}
                  >
                    {p.playerId === playerId ? "Tú" : p.isHost ? "Anfitrión" : "Invitado"}
                  </p>
                  <p
                    className="text-3xl font-bold mb-1"
                    style={{ fontFamily: "'Rye', serif" }}
                  >
                    {p.roundsWon}
                  </p>
                  <p
                    className="text-xs"
                    style={{ fontFamily: "'Special Elite', monospace" }}
                  >
                    RONDAS GANADAS
                  </p>
                  <p
                    className="text-sm mt-2"
                    style={{ fontFamily: "'Special Elite', monospace" }}
                  >
                    {p.bullets}💍
                  </p>
                </div>
              ))}
            </div>

            <p
              className="text-center text-sm sm:text-base animate-pulse"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              Esperando para comenzar...
            </p>
          </div>
        )}

        {/* Login Modal */}
        {showLogin && (
          <LoginModal
            onLogin={handleLogin}
            onClose={() => setShowLogin(false)}
          />
        )}
      </div>
    </div>
  );
}