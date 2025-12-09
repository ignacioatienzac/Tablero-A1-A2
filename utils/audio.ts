// Simple synth for game sounds to avoid external asset dependencies

let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const initAudio = () => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
};

export const playSound = (type: 'move' | 'correct' | 'wrong' | 'timeout' | 'click') => {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'move':
        // Soft wooden pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;

      case 'correct':
        // Happy major chord arpeggio
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, t); // A4
        osc.frequency.setValueAtTime(554.37, t + 0.1); // C#5
        osc.frequency.setValueAtTime(659.25, t + 0.2); // E5
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
        
        osc.start(t);
        osc.stop(t + 0.6);
        
        // Add a second harmonic layer for richness
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(880, t);
        gain2.gain.setValueAtTime(0.1, t);
        gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        osc2.start(t);
        osc2.stop(t + 0.4);
        break;

      case 'wrong':
        // Sad descending slide
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.3);
        
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.3);
        
        osc.start(t);
        osc.stop(t + 0.3);
        break;
        
      case 'timeout':
        // Alarm beep
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.setValueAtTime(0, t + 0.1);
        osc.frequency.setValueAtTime(800, t + 0.2);
        
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.setValueAtTime(0, t + 0.1);
        gain.gain.setValueAtTime(0.1, t + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

        osc.start(t);
        osc.stop(t + 0.4);
        break;
    }
  } catch (e) {
    console.warn("Audio play failed", e);
  }
};