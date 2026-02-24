// Componente para mostrar estadísticas del jugador

import { GameStats } from "../utils/stats";

interface StatsModalProps {
  stats: GameStats;
  onClose: () => void;
  onReset?: () => void;
}

export function StatsModal({ stats, onClose, onReset }: StatsModalProps) {
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.totalWins / stats.gamesPlayed) * 100) 
    : 0;

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case "easy": return "FÁCIL";
      case "normal": return "NORMAL";
      case "hard": return "DIFÍCIL";
      default: return "NORMAL";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="max-w-lg w-full">
        <div className="border-4 sm:border-6 border-black bg-[#e8d5a3] p-6 sm:p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] paper-texture">
          {/* Header */}
          <div className="border-3 border-black p-3 mb-6 bg-[#d4c5a0]">
            <h2 
              className="text-center text-2xl sm:text-3xl tracking-wide"
              style={{ fontFamily: "'Rye', serif" }}
            >
              ESTADÍSTICAS
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="space-y-4 mb-6">
            <div className="border-2 border-black p-4 bg-[#d4c5a0]">
              <div className="flex justify-between items-center">
                <span 
                  className="text-sm sm:text-base"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  DUELOS JUGADOS
                </span>
                <span 
                  className="text-2xl sm:text-3xl"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  {stats.gamesPlayed}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-black p-4 bg-green-100">
                <p 
                  className="text-xs sm:text-sm mb-1"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  VICTORIAS
                </p>
                <p 
                  className="text-3xl sm:text-4xl text-green-800"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  {stats.totalWins}
                </p>
              </div>

              <div className="border-2 border-black p-4 bg-red-100">
                <p 
                  className="text-xs sm:text-sm mb-1"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  DERROTAS
                </p>
                <p 
                  className="text-3xl sm:text-4xl text-red-800"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  {stats.totalLosses}
                </p>
              </div>
            </div>

            <div className="border-2 border-black p-4 bg-[#d4c5a0]">
              <div className="flex justify-between items-center">
                <span 
                  className="text-sm sm:text-base"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  % VICTORIAS
                </span>
                <span 
                  className="text-2xl sm:text-3xl"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  {winRate}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-black p-4 bg-[#d4c5a0]">
                <p 
                  className="text-xs sm:text-sm mb-1"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  RACHA ACTUAL
                </p>
                <p 
                  className="text-2xl sm:text-3xl"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  {stats.currentStreak}
                </p>
              </div>

              <div className="border-2 border-black p-4 bg-yellow-100">
                <p 
                  className="text-xs sm:text-sm mb-1"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  MEJOR RACHA
                </p>
                <p 
                  className="text-2xl sm:text-3xl text-yellow-800"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  {stats.bestStreak}
                </p>
              </div>
            </div>

            <div className="border-2 border-black p-4 bg-[#d4c5a0]">
              <div className="flex justify-between items-center">
                <span 
                  className="text-sm sm:text-base"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  RONDAS TOTALES
                </span>
                <span 
                  className="text-xl sm:text-2xl"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  {stats.totalRounds}
                </span>
              </div>
            </div>

            <div className="border-2 border-black p-4 bg-[#d4c5a0]">
              <div className="flex justify-between items-center">
                <span 
                  className="text-sm sm:text-base"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  ÚLTIMA DIFICULTAD
                </span>
                <span 
                  className="text-xl sm:text-2xl"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  {getDifficultyLabel(stats.lastDifficulty)}
                </span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            {onReset && (
              <button
                onClick={onReset}
                className="flex-1 border-3 border-black bg-red-200 p-3 text-sm sm:text-base hover:bg-red-300 active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Special Elite', monospace" }}
              >
                RESET
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 border-3 border-black bg-[#e8d5a3] p-3 text-base sm:text-lg hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)]"
              style={{ fontFamily: "'Rye', serif" }}
            >
              CERRAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
