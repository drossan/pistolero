import { Action } from "./multiplayer";

interface ChoosePhaseProps {
  timeLeft: number;
  roundNumber: number;
  getCurrentParticipant: () => any;
  handleActionSubmit: (action: "shoot" | "shield" | "reload") => void;
  participants: any[];
  playerId: string;
}

export function ChoosePhase({ timeLeft, roundNumber, getCurrentParticipant, handleActionSubmit, participants, playerId }: ChoosePhaseProps) {
  return (
    <div className="border-4 sm:border-4 border-black p-4 sm:p-6 bg-[#d4c5a0]">
      {/* Timer bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm" style={{ fontFamily: "'Special Elite', monospace" }}>
            RONDA {roundNumber}
          </span>
          <span
            className={`text-xl font-bold ${
              timeLeft <= 3 ? "text-red-700 animate-pulse" : ""
            }`}
            style={{ fontFamily: "'Rye', serif" }}
          >
            {timeLeft}s
          </span>
        </div>
        <div className="w-full bg-black rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ${
              timeLeft <= 3 ? "bg-red-600" : timeLeft <= 6 ? "bg-yellow-500" : "bg-green-600"
            }`}
            style={{ width: `${(timeLeft / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Current bullets */}
      {getCurrentParticipant() && (
        <div className="mb-4 p-3 border-2 border-black bg-[#e8d5a3] text-center">
          <p className="text-sm" style={{ fontFamily: "'Special Elite', monospace" }}>
            BALAS:{" "}
            {Array.from({ length: getCurrentParticipant()!.bullets }).map((_, i) => (
              <span key={i} className="text-lg mx-0.5">
                💍
              </span>
            ))}
            {getCurrentParticipant()!.bullets === 0 && <span className="text-red-700">SIN BALAS</span>}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <button
          onClick={() => handleActionSubmit("shoot")}
          disabled={!getCurrentParticipant() || getCurrentParticipant()!.bullets < 1}
          className={`border-4 border-black p-4 sm:p-6 text-xl sm:text-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] ${
            !getCurrentParticipant() || getCurrentParticipant()!.bullets < 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1"
          } bg-[#e8d5a3]`}
          style={{ fontFamily: "'Rye', serif" }}
        >
          🤠 PISTOLA
          <p className="text-xs mt-1 font-normal" style={{ fontFamily: "'Special Elite', monospace" }}>
            {getCurrentParticipant() && getCurrentParticipant()!.bullets < 1 ? "Necesitas balas" : "Gasta 1 bala"}
          </p>
        </button>

        <button
          onClick={() => handleActionSubmit("shield")}
          className="w-full border-4 border-black bg-[#e8d5a3] p-4 sm:p-6 text-xl sm:text-2xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
          style={{ fontFamily: "'Rye', serif" }}
        >
          🛡️ ESCUDO
          <p className="text-xs mt-1 font-normal" style={{ fontFamily: "'Special Elite', monospace" }}>
            Defensa pasiva
          </p>
        </button>

        <button
          onClick={() => handleActionSubmit("reload")}
          disabled={!getCurrentParticipant() || getCurrentParticipant()!.bullets >= 5}
          className={`border-4 border-black p-4 sm:p-6 text-xl sm:text-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] ${
            !getCurrentParticipant() || getCurrentParticipant()!.bullets >= 5
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1"
          } bg-[#e8d5a3]`}
          style={{ fontFamily: "'Rye', serif" }}
        >
          🔄 RECARGA
          <p className="text-xs mt-1 font-normal" style={{ fontFamily: "'Special Elite', monospace" }}>
            {getCurrentParticipant() && getCurrentParticipant()!.bullets >= 5 ? "Máximo alcanzado" : "+1 bala (max 5)"}
          </p>
        </button>
      </div>

      {/* Score display */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {participants.map((p) => (
          <div
            key={p._id}
            className={`border-2 border-black p-3 text-center ${
              p.playerId === playerId ? "bg-[#e8d5a3]" : "bg-[#d4c5a0]"
            }`}
          >
            <p className="text-xs" style={{ fontFamily: "'Special Elite', monospace" }}>
              {p.playerId === playerId ? "Tú" : p.isHost ? "Anfitrión" : "Invitado"}
            </p>
            <p className="text-xl font-bold" style={{ fontFamily: "'Rye', serif" }}>
              {p.roundsWon} RONDAS
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RevealPhaseProps {
  roundNumber: number;
  lastRoundResult: any;
  participants: any[];
  playerId: string;
  roomStatus: string;
  handleLeaveRoom: () => void;
  onNextRound: () => void;
}

export function RevealPhase({ roundNumber, lastRoundResult, participants, playerId, roomStatus, handleLeaveRoom, onNextRound }: RevealPhaseProps) {
  return (
    <div className="border-4 sm:border-4 border-black p-6 sm:p-8 bg-[#d4c5a0]">
      <h2 className="text-2xl sm:text-3xl mb-6 text-center" style={{ fontFamily: "'Rye', serif" }}>
        {roomStatus === "finished" ? "¡JUEGO TERMINADO!" : `RONDA ${roundNumber}`}
      </h2>

      {/* Round result */}
      <div className="border-4 border-black p-4 sm:p-6 bg-[#e8d5a3] mb-6">
        <p className="text-center text-lg sm:text-xl mb-4" style={{ fontFamily: "'Special Elite', monospace" }}>
          ACCIONES
        </p>
        <div className="grid grid-cols-2 gap-4">
          {participants.map((p) => {
            const action = p.playerId === participants[0].playerId ? lastRoundResult.move1 : lastRoundResult.move2;
            return (
              <div
                key={p._id}
                className={`text-center p-3 border-2 border-black ${
                  p.playerId === playerId ? "bg-[#d4c5a0]" : "bg-[#e8d5a3]"
                }`}
              >
                <p className="text-xs mb-2" style={{ fontFamily: "'Special Elite', monospace" }}>
                  {p.playerId === playerId ? "Tú" : p.isHost ? "Anfitrión" : "Invitado"}
                </p>
                <p className="text-3xl sm:text-4xl" style={{ fontFamily: "'Rye', serif" }}>
                  {action === "shoot" && "🤠"}
                  {action === "shield" && "🛡️"}
                  {action === "reload" && "🔄"}
                </p>
                <p className="text-sm mt-2" style={{ fontFamily: "'Special Elite', monospace" }}>
                  {action === "shoot" && "PISTOLA"}
                  {action === "shield" && "ESCUDO"}
                  {action === "reload" && "RECARGA"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Winner announcement */}
      {lastRoundResult.winner && lastRoundResult.winner !== "tie" && (
        <div className="border-4 border-black p-4 sm:p-6 bg-[#e8d5a3] mb-6">
          <p className="text-center text-xl sm:text-2xl" style={{ fontFamily: "'Rye', serif" }}>
            {lastRoundResult.winner === "player1" && (participants[0].playerId === playerId ? "¡GANASTE!" : "PERDISTE")}
            {lastRoundResult.winner === "player2" && (participants[1].playerId === playerId ? "¡GANASTE!" : "PERDISTE")}
          </p>
        </div>
      )}

      {lastRoundResult.winner === "tie" && (
        <div className="border-4 border-black p-4 sm:p-6 bg-[#e8d5a3] mb-6">
          <p className="text-center text-xl sm:text-2xl" style={{ fontFamily: "'Rye', serif" }}>
            ¡EMPATE!
          </p>
        </div>
      )}

      {/* Final score */}
      <div className="border-4 border-black p-4 sm:p-6 bg-[#e8d5a3] mb-6">
        <p className="text-center text-lg sm:text-xl mb-4" style={{ fontFamily: "'Special Elite', monospace" }}>
          MARCADOR FINAL
        </p>
        <div className="grid grid-cols-2 gap-4">
          {participants.map((p) => (
            <div
              key={p._id}
              className={`text-center p-4 border-2 border-black ${
                p.playerId === playerId ? "bg-[#d4c5a0]" : "bg-[#e8d5a3]"
              }`}
            >
              <p className="text-xs mb-2" style={{ fontFamily: "'Special Elite', monospace" }}>
                {p.playerId === playerId ? "Tú" : p.isHost ? "Anfitrión" : "Invitado"}
              </p>
              <p className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: "'Rye', serif" }}>
                {p.roundsWon}
              </p>
              <p className="text-xs mt-1" style={{ fontFamily: "'Special Elite', monospace" }}>
                RONDAS GANADAS
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Game over message */}
      {roomStatus === "finished" && (
        <div className="mb-6 text-center">
          {participants.find((p) => p.roundsWon >= 3)?.playerId === playerId ? (
            <p className="text-2xl sm:text-3xl text-green-700" style={{ fontFamily: "'Rye', serif" }}>
              🏆 ¡VICTORIA! 🏆
            </p>
          ) : (
            <p className="text-2xl sm:text-3xl text-red-700" style={{ fontFamily: "'Rye', serif" }}>
              💀 DERROTA 💀
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {roomStatus === "finished" ? (
          <button
            onClick={handleLeaveRoom}
            className="flex-1 border-4 border-black bg-[#e8d5a3] p-4 text-lg hover:bg-[#d4c5a0] shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            style={{ fontFamily: "'Rye', serif" }}
          >
            VOLVER AL MENÚ
          </button>
        ) : (
          <button
            onClick={onNextRound}
            className="flex-1 border-4 border-black bg-[#e8d5a3] p-4 text-lg hover:bg-[#d4c5a0] shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            style={{ fontFamily: "'Rye', serif" }}
          >
            SIGUIENTE RONDA
          </button>
        )}
      </div>
    </div>
  );
}
