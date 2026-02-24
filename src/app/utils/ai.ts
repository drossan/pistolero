// IA mejorada con diferentes niveles de dificultad

type Action = "pistola" | "escudo" | "recarga";
type Difficulty = "easy" | "normal" | "hard";

interface AIState {
  bullets: number;
  playerBullets: number;
  playerHistory: Action[];
  roundsPlayed: number;
}

class AIEngine {
  // Fácil: Totalmente aleatoria (pero respeta lógica de balas)
  private getEasyMove(state: AIState): Action {
    if (state.bullets === 0) {
      // Sin balas, solo puede recargar o escudo
      return Math.random() > 0.5 ? "recarga" : "escudo";
    }

    // Con balas, hace cualquier cosa aleatoria
    const rand = Math.random();
    if (rand > 0.66) return "pistola";
    if (rand > 0.33) return "escudo";
    return "recarga";
  }

  // Normal: Estrategia básica
  private getNormalMove(state: AIState): Action {
    if (state.bullets === 0) {
      return Math.random() > 0.5 ? "recarga" : "escudo";
    }

    const rand = Math.random();
    if (rand > 0.6) return "pistola";
    if (rand > 0.3) return "escudo";
    return "recarga";
  }

  // Difícil: Analiza patrones y cuenta balas del jugador
  private getHardMove(state: AIState): Action {
    const { bullets, playerBullets, playerHistory, roundsPlayed } = state;

    // Sin balas, recarga agresivamente
    if (bullets === 0) {
      // Si el jugador tampoco tiene balas, recarga
      if (playerBullets === 0) return "recarga";
      // Si el jugador tiene balas, usa escudo
      return "escudo";
    }

    // Analizar patrón reciente del jugador (últimas 3 jugadas)
    const recentHistory = playerHistory.slice(-3);
    const lastMove = playerHistory[playerHistory.length - 1];

    // Contador de patrones
    const pistolCount = recentHistory.filter(m => m === "pistola").length;
    const escudoCount = recentHistory.filter(m => m === "escudo").length;
    const recargaCount = recentHistory.filter(m => m === "recarga").length;

    // Si el jugador no tiene balas, dispara agresivamente
    if (playerBullets === 0 && bullets > 0) {
      // El jugador tendrá que recargar, así que disparo o espero con escudo
      if (lastMove === "recarga") {
        // Si acaba de recargar, probablemente dispare
        return "escudo";
      }
      return Math.random() > 0.7 ? "pistola" : "recarga";
    }

    // Si el jugador tiene muchas balas y yo también, duelo táctico
    if (playerBullets >= 2 && bullets >= 2) {
      if (pistolCount >= 2) {
        // Jugador está disparando mucho, usa escudo
        return Math.random() > 0.3 ? "escudo" : "pistola";
      }
      if (escudoCount >= 2) {
        // Jugador está defendiendo, recarga o dispara
        return Math.random() > 0.5 ? "recarga" : "pistola";
      }
    }

    // Detección de patrones
    if (recentHistory.length >= 2) {
      const pattern = recentHistory.slice(-2);
      
      // Si repite pistola, usa escudo
      if (pattern[0] === "pistola" && pattern[1] === "pistola") {
        return Math.random() > 0.4 ? "escudo" : "pistola";
      }
      
      // Si alterna, trata de predecir
      if (pattern[0] === "pistola" && pattern[1] === "escudo") {
        return Math.random() > 0.5 ? "recarga" : "pistola";
      }
    }

    // Estrategia por defecto agresiva
    if (bullets >= 3) {
      // Con muchas balas, es agresivo
      const rand = Math.random();
      if (rand > 0.5) return "pistola";
      if (rand > 0.3) return "escudo";
      return "recarga";
    } else {
      // Con pocas balas, más conservador
      const rand = Math.random();
      if (rand > 0.6) return "escudo";
      if (rand > 0.3) return "recarga";
      return "pistola";
    }
  }

  // Método principal
  getMove(difficulty: Difficulty, state: AIState): Action {
    switch (difficulty) {
      case "easy":
        return this.getEasyMove(state);
      case "normal":
        return this.getNormalMove(state);
      case "hard":
        return this.getHardMove(state);
      default:
        return this.getNormalMove(state);
    }
  }
}

export const aiEngine = new AIEngine();
