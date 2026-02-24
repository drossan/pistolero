import { useState } from "react";
import { Link } from "react-router";

type Action = "pistola" | "escudo" | "recarga" | null;
type GamePhase = "menu" | "create" | "join" | "waiting" | "ready" | "countdown" | "choose" | "reveal";

export function Multiplayer() {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [playerRole, setPlayerRole] = useState<"host" | "guest" | null>(null);

  const generateRoomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const createRoom = () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setPlayerRole("host");
    setPhase("waiting");
    // Aquí conectarás con Convex para crear la sala
  };

  const joinRoom = () => {
    if (inputCode.length !== 5) {
      alert("El código debe tener 5 caracteres");
      return;
    }
    setRoomCode(inputCode.toUpperCase());
    setPlayerRole("guest");
    setPhase("waiting");
    // Aquí conectarás con Convex para unirte a la sala
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode);
    alert("Código copiado al portapapeles");
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
            <p 
              className="text-center text-base sm:text-xl mb-6 sm:mb-8"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              Elige una opción para comenzar el duelo
            </p>
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={createRoom}
                className="w-full border-3 sm:border-4 border-black bg-[#e8d5a3] p-4 sm:p-6 text-xl sm:text-2xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Rye', serif" }}
              >
                CREAR SALA
              </button>
              <button
                onClick={() => setPhase("join")}
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
                onClick={joinRoom}
                className="flex-1 border-3 sm:border-4 border-black bg-[#e8d5a3] p-3 sm:p-4 text-lg sm:text-xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Rye', serif" }}
              >
                UNIRSE
              </button>
            </div>
          </div>
        )}

        {/* Esperando jugador */}
        {phase === "waiting" && (
          <div className="border-3 sm:border-4 border-black p-6 sm:p-8 bg-[#d4c5a0]">
            {playerRole === "host" ? (
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
                <p 
                  className="text-center animate-pulse text-sm sm:text-base"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  Esperando al oponente...
                </p>
              </>
            ) : (
              <>
                <h2 
                  className="text-2xl sm:text-3xl mb-4 sm:mb-6 text-center"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  CONECTANDO
                </h2>
                <p 
                  className="text-center mb-3 sm:mb-4 text-sm sm:text-base"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  Sala: {roomCode}
                </p>
                <p 
                  className="text-center animate-pulse text-sm sm:text-base"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  Buscando sala...
                </p>
              </>
            )}
            <button
              onClick={() => {
                setPhase("menu");
                setRoomCode("");
                setPlayerRole(null);
              }}
              className="w-full mt-4 sm:mt-6 border-3 sm:border-4 border-black bg-[#e8d5a3] p-3 sm:p-4 text-lg sm:text-xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
              style={{ fontFamily: "'Rye', serif" }}
            >
              CANCELAR
            </button>
          </div>
        )}

        {/* Información de backend */}
        <div className="mt-6 sm:mt-8 border-2 border-black p-4 sm:p-6 bg-[#e8d5a3]">
          <h3 
            className="text-lg sm:text-xl mb-3 sm:mb-4 text-center"
            style={{ fontFamily: "'Rye', serif" }}
          >
            NOTA TÉCNICA
          </h3>
          <p 
            className="text-xs sm:text-sm mb-2"
            style={{ fontFamily: "'Special Elite', monospace" }}
          >
            El multijugador online requiere conexión a un backend (Convex o Supabase) para:
          </p>
          <ul 
            className="text-xs sm:text-sm space-y-1 ml-4 sm:ml-6"
            style={{ fontFamily: "'Special Elite', monospace" }}
          >
            <li>• Crear y gestionar salas de juego</li>
            <li>• Sincronizar acciones entre jugadores</li>
            <li>• Mantener el estado del juego en tiempo real</li>
          </ul>
          <p 
            className="text-xs sm:text-sm mt-3 sm:mt-4"
            style={{ fontFamily: "'Special Elite', monospace" }}
          >
            La interfaz está preparada para conectar tu backend de elección.
          </p>
        </div>
      </div>
    </div>
  );
}