// Sistema de sonidos usando Web Audio API
class SoundManager {
  private audioContext: AudioContext | null = null;

  private getContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Disparo de revólver - sonido seco y explosivo
  playShot() {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Ruido blanco filtrado para el disparo
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filtro paso bajo para el boom
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.1);

    // Ganancia con envelope
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.15);
  }

  // Disparo que falla - sonido más débil
  playShotMiss() {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015)) * 0.3;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.1);
  }

  // Clic vacío - cuando no tienes balas
  playEmpty() {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.03);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  // Recarga - clic metálico
  playReload() {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Oscilador para el clic metálico
    const osc1 = ctx.createOscillator();
    osc1.type = "square";
    osc1.frequency.setValueAtTime(1200, now);
    osc1.frequency.exponentialRampToValueAtTime(800, now + 0.05);

    const osc2 = ctx.createOscillator();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(400, now);
    osc2.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.2, now + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.05);
    
    osc2.start(now + 0.03);
    osc2.stop(now + 0.08);
  }

  // Escudo - golpe de madera
  playShield() {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Ruido para simular impacto de madera
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (ctx.sampleRate * 0.03));
      data[i] = (Math.random() * 2 - 1) * decay * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filtro para darle tono de madera
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(400, now);
    filter.Q.value = 5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.2);
  }

  // Cuenta atrás - golpe seco
  playCountdown() {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.1);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Fuego (último countdown) - más intenso
  playFire() {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Victoria - fanfarria
  playVictory() {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.15 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.3);
    });
  }

  // Derrota - sonido descendente
  playDefeat() {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Campanada - victoria de ronda
  playBell() {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Fundamental y armónicos para simular campana
    const frequencies = [800, 1200, 1600];
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      const amplitude = 0.2 / (i + 1);
      gain.gain.setValueAtTime(amplitude, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.5);
    });
  }

  // Viento del desierto (ambiente de fondo)
  playWind(duration: number = 3) {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const envelope = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.5);
    gain.gain.linearRampToValueAtTime(0.15, now + duration - 0.5);
    gain.gain.linearRampToValueAtTime(0, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }
}

export const soundManager = new SoundManager();