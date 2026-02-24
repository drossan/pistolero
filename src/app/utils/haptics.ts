// Sistema de vibración háptica para móviles

export const haptics = {
  // Vibración ligera para botones y feedback básico
  light() {
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  },

  // Vibración media para acciones importantes
  medium() {
    if ("vibrate" in navigator) {
      navigator.vibrate(30);
    }
  },

  // Vibración fuerte para disparos
  shot() {
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  },

  // Patrón para victoria
  victory() {
    if ("vibrate" in navigator) {
      navigator.vibrate([50, 50, 50, 50, 100]);
    }
  },

  // Patrón para derrota
  defeat() {
    if ("vibrate" in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  },

  // Impacto cuando recibes disparo
  hit() {
    if ("vibrate" in navigator) {
      navigator.vibrate([30, 20, 60]);
    }
  },

  // Clic seco cuando no tienes balas
  empty() {
    if ("vibrate" in navigator) {
      navigator.vibrate(15);
    }
  },
};
