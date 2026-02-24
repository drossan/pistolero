import { useState, useEffect } from "react";
import { Link } from "react-router";
import { PistolaIcon, EscudoIcon, RecargaIcon, BalaIcon } from "./icons";
import { soundManager } from "./sounds";
import { haptics } from "../utils/haptics";
import { aiEngine } from "../utils/ai";
import { recordWin, recordLoss, recordRound } from "../utils/stats";
import { isTutorialCompleted, markTutorialCompleted } from "../utils/tutorial";
import { Tutorial } from "./tutorial";
import { FloatingIndicator, ShakeWrapper, MuzzleFlash, VintageConfetti } from "./effects";
import { GameOverAnimation } from "./game-over-animation";

type Action = "pistola" | "escudo" | "recarga" | null;
type GamePhase = "idle" | "countdown" | "choose" | "reveal" | "gameOver";
type Difficulty = "easy" | "normal" | "hard";

interface Round {
  player: Action;
  machine: Action;
  result: "win" | "lose" | "draw";
}

export function VsMachine() {
  // Estados del juego
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [countdown, setCountdown] = useState<string>("");
  const [playerBullets, setPlayerBullets] = useState(0);
  const [machineBullets, setMachineBullets] = useState(0);
  const [playerAction, setPlayerAction] = useState<Action>(null);
  const [machineAction, setMachineAction] = useState<Action>(null);
  const [playerWins, setPlayerWins] = useState(0);
  const [machineWins, setMachineWins] = useState(0);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [message, setMessage] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [playerHistory, setPlayerHistory] = useState<Action[]>([]);
  
  // Estados de efectos visuales
  const [shake, setShake] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [floatingIndicator, setFloatingIndicator] = useState<{
    show: boolean;
    text: string;
    type: "bullet-add" | "bullet-remove" | "hit" | "miss";
  }>({ show: false, text: "", type: "bullet-add" });
  
  // Estados de tutorial
  const [showTutorial, setShowTutorial] = useState(false);

  // Estados de timer
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const TIME_LIMIT = 10; // segundos para decidir

  // Mostrar tutorial en la primera vez
  useEffect(() => {
    if (!isTutorialCompleted()) {
      setShowTutorial(true);
    }
  }, []);

  // Cuenta atrás con sonidos y animaciones
  useEffect(() => {
    if (phase === "countdown") {
      const sequence = ["¡LISTO!", "¡APUNTA!", "¡FUEGO!"];
      let index = 0;
      
      const interval = setInterval(() => {
        if (index < sequence.length) {
          setCountdown(sequence[index]);
          haptics.medium();
          if (index < 2) {
            soundManager.playCountdown();
          } else {
            soundManager.playFire();
            soundManager.playWind(2);
          }
          index++;
        } else {
          clearInterval(interval);
          setPhase("choose");
          setCountdown("");
          // Iniciar timer cuando empieza la fase de elección
          setIsTimerActive(true);
          setTimeLeft(TIME_LIMIT);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [phase]);

  // Timer de decisión
  useEffect(() => {
    if (phase === "choose" && isTimerActive) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerActive(false);
            handleTimeout();
            return 0;
          }
          
          // Sonido de tensión cuando quedan 3 segundos
          if (prev === 4) {
            soundManager.playCountdown();
            haptics.medium();
          } else if (prev === 3 || prev === 2) {
            soundManager.playCountdown();
            haptics.medium();
          }
          
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [phase, isTimerActive]);

  const handleTimeout = () => {
    // Si se acaba el tiempo, pierdes automáticamente la ronda
    setMessage("¡Se acabó el tiempo! Perdiste la ronda.");
    soundManager.playDefeat();
    haptics.defeat();
    setShake(true);
    setTimeout(() => setShake(false), 500);

    // La máquina hace su jugada
    const machineChoice = getMachineAction();
    setMachineAction(machineChoice);
    
    // Actualizar balas de la máquina
    let newMachineBullets = machineBullets;
    if (machineChoice === "pistola") {
      newMachineBullets--;
      soundManager.playShot();
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 300);
    }
    if (machineChoice === "escudo") soundManager.playShield();
    if (machineChoice === "recarga") {
      newMachineBullets = Math.min(5, newMachineBullets + 1);
      soundManager.playReload();
    }
    setMachineBullets(newMachineBullets);

    // El jugador pierde automáticamente
    const newMachineWins = machineWins + 1;
    setMachineWins(newMachineWins);
    
    // No hay acción del jugador, se marca como null
    const newRound = { player: null, machine: machineChoice, result: "lose" as const };
    setRounds([...rounds, newRound]);
    recordRound();
    
    setPhase("reveal");

    // Verificar fin del juego
    if (newMachineWins === 3) {
      setTimeout(() => {
        setPhase("gameOver");
        soundManager.playDefeat();
        haptics.defeat();
        recordLoss(difficulty);
      }, 2000);
    }
  };

  const startRound = () => {
    setPhase("countdown");
    setPlayerAction(null);
    setMachineAction(null);
    setMessage("");
    haptics.light();
    setIsTimerActive(true);
    setTimeLeft(TIME_LIMIT);
  };

  const getMachineAction = (): Action => {
    return aiEngine.getMove(difficulty, {
      bullets: machineBullets,
      playerBullets,
      playerHistory: playerHistory.filter(a => a !== null) as Action[],
      roundsPlayed: rounds.length,
    });
  };

  const determineWinner = (player: Action, machine: Action): "win" | "lose" | "draw" => {
    if (player === machine) return "draw";
    
    if (player === "pistola" && machine === "recarga") return "win";
    if (player === "escudo" && machine === "pistola") return "win";
    if (player === "recarga" && machine === "escudo") return "win";
    
    return "lose";
  };

  const getActionName = (action: Action): string => {
    if (action === "pistola") return "PISTOLA";
    if (action === "escudo") return "ESCUDO";
    if (action === "recarga") return "RECARGA";
    return "";
  };

  const getActionIcon = (action: Action, large = false) => {
    const className = large ? "w-16 h-16 sm:w-24 sm:h-24" : "w-12 h-12 sm:w-16 sm:h-16";
    if (action === "pistola") return <PistolaIcon className={className} />;
    if (action === "escudo") return <EscudoIcon className={className} />;
    if (action === "recarga") return <RecargaIcon className={className} />;
    return null;
  };

  const handleAction = (action: Action) => {
    if (phase !== "choose" || !action) return;

    // Detener el timer cuando el jugador hace una acción válida
    setIsTimerActive(false);

    haptics.light();

    // Validar si el jugador puede disparar
    if (action === "pistola" && playerBullets === 0) {
      setMessage("¡Sin balas! Debes recargar primero.");
      soundManager.playEmpty();
      haptics.empty();
      return;
    }

    // Validar si puede recargar más
    if (action === "recarga" && playerBullets === 5) {
      setMessage("Ya tienes el máximo de balas.");
      soundManager.playEmpty();
      haptics.empty();
      return;
    }

    setPlayerAction(action);
    const machineChoice = getMachineAction();
    setMachineAction(machineChoice);

    // Actualizar historial
    setPlayerHistory([...playerHistory, action]);

    // Actualizar balas y mostrar indicadores
    let newPlayerBullets = playerBullets;
    let newMachineBullets = machineBullets;

    if (action === "pistola") {
      newPlayerBullets--;
      setFloatingIndicator({ show: true, text: "-1", type: "bullet-remove" });
      soundManager.playShot();
      haptics.shot();
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 300);
    }
    if (action === "escudo") {
      soundManager.playShield();
      haptics.medium();
    }
    if (action === "recarga") {
      newPlayerBullets = Math.min(5, newPlayerBullets + 1);
      setFloatingIndicator({ show: true, text: "+1", type: "bullet-add" });
      soundManager.playReload();
      haptics.light();
    }
    
    if (machineChoice === "pistola") {
      newMachineBullets--;
      soundManager.playShot();
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 300);
    }
    if (machineChoice === "escudo") soundManager.playShield();
    if (machineChoice === "recarga") {
      newMachineBullets = Math.min(5, newMachineBullets + 1);
      soundManager.playReload();
    }

    setPlayerBullets(newPlayerBullets);
    setMachineBullets(newMachineBullets);

    // Determinar ganador
    const result = determineWinner(action, machineChoice);
    
    let newPlayerWins = playerWins;
    let newMachineWins = machineWins;

    if (result === "win") {
      newPlayerWins++;
      setPlayerWins(newPlayerWins);
      setMessage("¡Victoria en esta ronda!");
      soundManager.playBell();
      haptics.victory();
      
      // Shake cuando pierdes
      if (machineChoice === "pistola" && action === "recarga") {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        haptics.hit();
      }
    } else if (result === "lose") {
      newMachineWins++;
      setMachineWins(newMachineWins);
      setMessage("Derrota en esta ronda.");
      soundManager.playDefeat();
      
      // Shake cuando te disparan
      if (action === "pistola" && machineChoice === "escudo") {
        soundManager.playShotMiss();
      } else if (machineChoice === "pistola" && (action === "recarga" || action === "escudo")) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        haptics.hit();
      }
    } else {
      setMessage("Empate.");
      if (action === "pistola" && machineChoice === "pistola") {
        soundManager.playBell();
      }
    }

    const newRound = { player: action, machine: machineChoice, result };
    setRounds([...rounds, newRound]);
    recordRound();
    
    setPhase("reveal");

    // Verificar fin del juego
    if (newPlayerWins === 3 || newMachineWins === 3) {
      setTimeout(() => {
        setPhase("gameOver");
        if (newPlayerWins === 3) {
          soundManager.playVictory();
          haptics.victory();
          setShowConfetti(true);
          recordWin(difficulty);
          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          soundManager.playDefeat();
          haptics.defeat();
          recordLoss(difficulty);
        }
      }, 2000);
    }
  };

  const resetGame = () => {
    setPhase("idle");
    setPlayerBullets(0);
    setMachineBullets(0);
    setPlayerAction(null);
    setMachineAction(null);
    setPlayerWins(0);
    setMachineWins(0);
    setRounds([]);
    setMessage("");
    setPlayerHistory([]);
    haptics.light();
  };

  const handleTutorialComplete = () => {
    markTutorialCompleted();
    setShowTutorial(false);
  };

  const handleTutorialSkip = () => {
    markTutorialCompleted();
    setShowTutorial(false);
  };

  return (
    <>
      {showTutorial && (
        <Tutorial onComplete={handleTutorialComplete} onSkip={handleTutorialSkip} />
      )}

      {/* Animación de fin de juego */}
      {phase === "gameOver" && (
        <GameOverAnimation 
          type={playerWins === 3 ? "victory" : "defeat"}
        />
      )}

      <div className="min-h-screen bg-[#e8d5a3] p-3 sm:p-4 paper-texture">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6 flex justify-between items-center">
            <Link to="/">
              <button 
                className="border-2 border-black bg-[#e8d5a3] px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-[#d4c5a0] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Special Elite', monospace" }}
                onClick={() => haptics.light()}
              >
                ← VOLVER
              </button>
            </Link>

            {/* Selector de dificultad */}
            {phase === "idle" && (
              <div className="flex gap-2">
                {(["easy", "normal", "hard"] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setDifficulty(diff);
                      haptics.light();
                    }}
                    className={`border-2 border-black px-3 py-1 text-xs ${
                      difficulty === diff 
                        ? "bg-black text-[#e8d5a3]" 
                        : "bg-[#e8d5a3] hover:bg-[#d4c5a0]"
                    } shadow-[2px_2px_0px_rgba(0,0,0,1)]`}
                    style={{ fontFamily: "'Special Elite', monospace" }}
                  >
                    {diff === "easy" ? "FÁCIL" : diff === "normal" ? "NORMAL" : "DIFÍCIL"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Título */}
          <div className="border-3 sm:border-4 border-black p-3 sm:p-4 mb-4 sm:mb-6 text-center bg-[#e8d5a3] shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_rgba(0,0,0,1)] torn-edge">
            <h1 
              className="text-3xl sm:text-5xl tracking-wide"
              style={{ fontFamily: "'Rye', serif" }}
            >
              VS MÁQUINA
            </h1>
            <p 
              className="text-xs mt-1"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              Dificultad: {difficulty === "easy" ? "Fácil" : difficulty === "normal" ? "Normal" : "Difícil"}
            </p>
          </div>

          {/* Marcador */}
          <div className="border-3 sm:border-4 border-black p-4 sm:p-6 mb-4 sm:mb-6 bg-[#d4c5a0]">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div>
                <p 
                  className="text-xs sm:text-sm mb-1 sm:mb-2"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  TÚ
                </p>
                <p 
                  className="text-5xl sm:text-6xl"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  {playerWins}
                </p>
                <p 
                  className="text-xs mt-1 sm:mt-2"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  BALAS: {playerBullets}
                </p>
                <div className="mt-2 flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <BalaIcon key={i} filled={i < playerBullets} />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <p 
                  className="text-3xl sm:text-4xl"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  VS
                </p>
              </div>

              <div>
                <p 
                  className="text-xs sm:text-sm mb-1 sm:mb-2"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  MÁQUINA
                </p>
                <p 
                  className="text-5xl sm:text-6xl"
                  style={{ fontFamily: "'Rye', serif" }}
                >
                  {machineWins}
                </p>
                <p 
                  className="text-xs mt-1 sm:mt-2"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  BALAS: {machineBullets}
                </p>
                <div className="mt-2 flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <BalaIcon key={i} filled={i < machineBullets} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Área de juego con efectos */}
          <ShakeWrapper shake={shake}>
            <div className="border-3 sm:border-4 border-black p-4 sm:p-8 mb-4 sm:mb-6 bg-[#e8d5a3] min-h-[250px] sm:min-h-[300px] flex flex-col items-center justify-center relative">
              {/* Efectos visuales */}
              <MuzzleFlash show={showFlash} />
              <VintageConfetti show={showConfetti} />
              
              <FloatingIndicator
                {...floatingIndicator}
                onComplete={() => setFloatingIndicator({ ...floatingIndicator, show: false })}
              />

              {phase === "idle" && (
                <div className="text-center animate-zoom-in">
                  <p 
                    className="text-xl sm:text-2xl mb-4 sm:mb-6"
                    style={{ fontFamily: "'Rye', serif" }}
                  >
                    PREPARADO PARA EL DUELO
                  </p>
                  <button
                    onClick={startRound}
                    className="border-3 sm:border-4 border-black bg-[#e8d5a3] px-6 sm:px-8 py-3 sm:py-4 text-xl sm:text-2xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                    style={{ fontFamily: "'Rye', serif" }}
                  >
                    INICIAR RONDA
                  </button>
                </div>
              )}

              {phase === "countdown" && (
                <div className="text-center animate-pulse">
                  <p 
                    className="text-5xl sm:text-7xl animate-zoom-in"
                    style={{ fontFamily: "'Rye', serif" }}
                  >
                    {countdown}
                  </p>
                </div>
              )}

              {phase === "choose" && (
                <div className="w-full">
                  {/* Barra de tiempo */}
                  <div className="mb-4 sm:mb-6">
                    <div className="border-2 border-black bg-[#d4c5a0] p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span 
                          className="text-xs sm:text-sm"
                          style={{ fontFamily: "'Special Elite', monospace" }}
                        >
                          TIEMPO:
                        </span>
                        <span 
                          className={`text-xl sm:text-2xl ${timeLeft <= 3 ? "text-red-800 animate-pulse" : ""}`}
                          style={{ fontFamily: "'Rye', serif" }}
                        >
                          {timeLeft}s
                        </span>
                      </div>
                      {/* Barra de progreso */}
                      <div className="w-full h-3 sm:h-4 border-2 border-black bg-[#e8d5a3]">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            timeLeft <= 3 ? "bg-red-800" : "bg-green-800"
                          }`}
                          style={{ width: `${(timeLeft / TIME_LIMIT) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p 
                    className="text-center text-xl sm:text-2xl mb-4 sm:mb-8"
                    style={{ fontFamily: "'Rye', serif" }}
                  >
                    ELIGE TU ACCIÓN
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <button
                      onClick={() => handleAction("pistola")}
                      disabled={playerBullets === 0}
                      className={`border-3 sm:border-4 border-black p-3 sm:p-6 hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] ${
                        playerBullets === 0 ? "opacity-50 cursor-not-allowed bg-gray-300" : "bg-[#e8d5a3]"
                      }`}
                    >
                      <div className="flex justify-center mb-1 sm:mb-2">
                        <PistolaIcon className="w-12 h-12 sm:w-16 sm:h-16" />
                      </div>
                      <p 
                        className="text-xs sm:text-sm"
                        style={{ fontFamily: "'Special Elite', monospace" }}
                      >
                        PISTOLA
                      </p>
                    </button>
                    <button
                      onClick={() => handleAction("escudo")}
                      className="border-3 sm:border-4 border-black bg-[#e8d5a3] p-3 sm:p-6 hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="flex justify-center mb-1 sm:mb-2">
                        <EscudoIcon className="w-12 h-12 sm:w-16 sm:h-16" />
                      </div>
                      <p 
                        className="text-xs sm:text-sm"
                        style={{ fontFamily: "'Special Elite', monospace" }}
                      >
                        ESCUDO
                      </p>
                    </button>
                    <button
                      onClick={() => handleAction("recarga")}
                      disabled={playerBullets === 5}
                      className={`border-3 sm:border-4 border-black p-3 sm:p-6 hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] ${
                        playerBullets === 5 ? "opacity-50 cursor-not-allowed bg-gray-300" : "bg-[#e8d5a3]"
                      }`}
                    >
                      <div className="flex justify-center mb-1 sm:mb-2">
                        <RecargaIcon className="w-12 h-12 sm:w-16 sm:h-16" />
                      </div>
                      <p 
                        className="text-xs sm:text-sm"
                        style={{ fontFamily: "'Special Elite', monospace" }}
                      >
                        RECARGA
                      </p>
                    </button>
                  </div>
                  {message && (
                    <p 
                      className="text-center mt-3 sm:mt-4 text-sm sm:text-base text-red-800"
                      style={{ fontFamily: "'Special Elite', monospace" }}
                    >
                      {message}
                    </p>
                  )}
                </div>
              )}

              {phase === "reveal" && (
                <div className="text-center w-full">
                  <div className="grid grid-cols-2 gap-3 sm:gap-8 mb-4 sm:mb-6">
                    <div className="border-2 border-black p-3 sm:p-6 bg-[#d4c5a0] animate-flip">
                      <p 
                        className="text-xs sm:text-sm mb-2"
                        style={{ fontFamily: "'Special Elite', monospace" }}
                      >
                        TÚ
                      </p>
                      <div className="flex justify-center mb-1 sm:mb-2">
                        {getActionIcon(playerAction, true)}
                      </div>
                      <p 
                        className="text-base sm:text-xl"
                        style={{ fontFamily: "'Rye', serif" }}
                      >
                        {getActionName(playerAction)}
                      </p>
                    </div>
                    <div className="border-2 border-black p-3 sm:p-6 bg-[#d4c5a0] animate-flip" style={{ animationDelay: "0.2s" }}>
                      <p 
                        className="text-xs sm:text-sm mb-2"
                        style={{ fontFamily: "'Special Elite', monospace" }}
                      >
                        MÁQUINA
                      </p>
                      <div className="flex justify-center mb-1 sm:mb-2">
                        {getActionIcon(machineAction, true)}
                      </div>
                      <p 
                        className="text-base sm:text-xl"
                        style={{ fontFamily: "'Rye', serif" }}
                      >
                        {getActionName(machineAction)}
                      </p>
                    </div>
                  </div>
                  <p 
                    className={`text-xl sm:text-2xl mb-4 sm:mb-6 ${
                      message.includes("Victoria") ? "text-green-800" : 
                      message.includes("Derrota") ? "text-red-800" : ""
                    }`}
                    style={{ fontFamily: "'Rye', serif" }}
                  >
                    {message}
                  </p>
                  {phase !== "gameOver" && (
                    <button
                      onClick={startRound}
                      className="border-3 sm:border-4 border-black bg-[#e8d5a3] px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                      style={{ fontFamily: "'Rye', serif" }}
                    >
                      SIGUIENTE RONDA
                    </button>
                  )}
                </div>
              )}
            </div>
          </ShakeWrapper>

          {/* Historial de rondas */}
          {rounds.length > 0 && (
            <div className="border-3 sm:border-4 border-black p-4 sm:p-6 bg-[#d4c5a0]">
              <h3 
                className="text-xl sm:text-2xl mb-3 sm:mb-4 text-center"
                style={{ fontFamily: "'Rye', serif" }}
              >
                HISTORIAL
              </h3>
              <div className="space-y-2">
                {rounds.map((round, index) => (
                  <div 
                    key={index}
                    className="border-2 border-black p-2 sm:p-3 bg-[#e8d5a3] flex items-center justify-between text-xs sm:text-sm"
                    style={{ fontFamily: "'Special Elite', monospace" }}
                  >
                    <span>Ronda {index + 1}</span>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                        {round.player === "pistola" && <PistolaIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                        {round.player === "escudo" && <EscudoIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                        {round.player === "recarga" && <RecargaIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </div>
                      <span className="text-xs">vs</span>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                        {round.machine === "pistola" && <PistolaIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                        {round.machine === "escudo" && <EscudoIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                        {round.machine === "recarga" && <RecargaIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </div>
                    </div>
                    <span 
                      className={`${
                        round.result === "win" ? "text-green-800" : 
                        round.result === "lose" ? "text-red-800" : ""
                      }`}
                    >
                      {round.result === "win" ? "VICTORIA" : 
                       round.result === "lose" ? "DERROTA" : "EMPATE"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}