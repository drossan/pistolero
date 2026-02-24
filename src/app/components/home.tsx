import { Link } from "react-router";
import { PistolaIcon, EscudoIcon, RecargaIcon } from "./icons";
import { useState, useEffect } from "react";
import { getStats, resetStats as resetStatsUtil } from "../utils/stats";
import { isTutorialCompleted, resetTutorial } from "../utils/tutorial";
import { StatsModal } from "./stats-modal";

export function Home() {
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(getStats());
  const [showTutorialReset, setShowTutorialReset] = useState(false);

  useEffect(() => {
    // Reproducir sonido de viento al cargar
    setStats(getStats());
  }, []);

  const handleResetStats = () => {
    if (confirm("¿Estás seguro de que quieres resetear todas las estadísticas?")) {
      resetStatsUtil();
      setStats(getStats());
    }
  };

  const handleResetTutorial = () => {
    resetTutorial();
    alert("Tutorial reseteado. Se mostrará la próxima vez que juegues.");
  };

  return (
    <div className="min-h-screen bg-[#e8d5a3] flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl">
        {/* Cartel Wanted principal */}
        <div className="border-4 sm:border-8 border-black bg-[#e8d5a3] p-4 sm:p-8 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] paper-texture torn-edge">
          {/* Header WANTED */}
          <div className="border-2 sm:border-4 border-black p-3 sm:p-4 mb-4 sm:mb-6">
            <h1 
              className="text-center text-5xl sm:text-7xl tracking-widest"
              style={{ fontFamily: "'Rye', serif" }}
            >
              WANTED
            </h1>
          </div>

          {/* Subtítulo */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 
              className="text-3xl sm:text-4xl mb-2"
              style={{ fontFamily: "'Rye', serif" }}
            >
              EL PISTOLERO
            </h2>
            <p 
              className="text-xs sm:text-sm tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              Dead or Alive
            </p>
          </div>

          {/* Estadísticas rápidas */}
          {stats.gamesPlayed > 0 && (
            <div className="border-2 border-black p-3 sm:p-4 mb-4 sm:mb-6 bg-[#d4c5a0]">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p 
                    className="text-xs"
                    style={{ fontFamily: "'Special Elite', monospace" }}
                  >
                    DUELOS
                  </p>
                  <p 
                    className="text-xl sm:text-2xl"
                    style={{ fontFamily: "'Rye', serif" }}
                  >
                    {stats.gamesPlayed}
                  </p>
                </div>
                <div>
                  <p 
                    className="text-xs"
                    style={{ fontFamily: "'Special Elite', monospace" }}
                  >
                    VICTORIAS
                  </p>
                  <p 
                    className="text-xl sm:text-2xl text-green-800"
                    style={{ fontFamily: "'Rye', serif" }}
                  >
                    {stats.totalWins}
                  </p>
                </div>
                <div>
                  <p 
                    className="text-xs"
                    style={{ fontFamily: "'Special Elite', monospace" }}
                  >
                    RACHA
                  </p>
                  <p 
                    className="text-xl sm:text-2xl text-yellow-800"
                    style={{ fontFamily: "'Rye', serif" }}
                  >
                    {stats.currentStreak}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reglas del duelo */}
          <div className="border-2 border-black p-4 sm:p-6 mb-6 sm:mb-8 bg-[#d4c5a0]">
            <h3 
              className="text-center text-lg sm:text-xl mb-3 sm:mb-4 tracking-wide"
              style={{ fontFamily: "'Rye', serif" }}
            >
              REGLAS DEL DUELO
            </h3>
            <div 
              className="space-y-2 text-xs sm:text-sm"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                  <PistolaIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span>PISTOLA vence a RECARGA</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                  <EscudoIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span>ESCUDO vence a PISTOLA</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                  <RecargaIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span>RECARGA vence a ESCUDO</span>
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-black">
                <p className="text-xs">* Empiezas con 0 balas. Debes recargar antes de disparar.</p>
                <p className="text-xs">* Cada recarga suma 1 bala (máx. 5 balas).</p>
                <p className="text-xs">* El primero en 3 victorias gana el duelo.</p>
              </div>
            </div>
          </div>

          {/* Botones de modo de juego */}
          <div className="space-y-3 sm:space-y-4">
            <Link to="/vs-machine">
              <button 
                className="w-full border-3 sm:border-4 border-black bg-[#e8d5a3] p-3 sm:p-4 text-xl sm:text-2xl tracking-wide hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Rye', serif" }}
              >
                VS MÁQUINA
              </button>
            </Link>
            <Link to="/multiplayer">
              <button 
                className="w-full border-3 sm:border-4 border-black bg-[#e8d5a3] p-3 sm:p-4 text-xl sm:text-2xl tracking-wide hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Rye', serif" }}
              >
                MULTIJUGADOR
              </button>
            </Link>
          </div>

          {/* Botones de utilidad */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setShowStats(true)}
              className="flex-1 border-2 border-black bg-[#d4c5a0] p-2 text-sm hover:bg-[#c4b590] active:translate-x-1 active:translate-y-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              ESTADÍSTICAS
            </button>
            <button
              onClick={handleResetTutorial}
              className="flex-1 border-2 border-black bg-[#d4c5a0] p-2 text-sm hover:bg-[#c4b590] active:translate-x-1 active:translate-y-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              VER TUTORIAL
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-black text-center">
            <p 
              className="text-[10px] sm:text-xs tracking-widest"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              REWARD: $500 • APPROACH WITH CAUTION
            </p>
          </div>
        </div>
      </div>

      {/* Modal de estadísticas */}
      {showStats && (
        <StatsModal
          stats={stats}
          onClose={() => {
            setShowStats(false);
            setStats(getStats());
          }}
          onReset={handleResetStats}
        />
      )}
    </div>
  );
}