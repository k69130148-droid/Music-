// Web Audio API tone generator for DTMF and Phone Sound Effects

class AudioToneService {
  private ctx: AudioContext | null = null;
  private currentRingtoneOscillators: { stop: () => void }[] = [];
  private ringtoneInterval: number | null = null;
  private isSoundEnabled: boolean = true;
  private isHapticsEnabled: boolean = true;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
  }

  public setHapticsEnabled(enabled: boolean) {
    this.isHapticsEnabled = enabled;
  }

  public triggerHaptic(duration = 25) {
    if (!this.isHapticsEnabled) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(duration);
      } catch {
        // Ignored if browser prevents vibrate without user gesture
      }
    }
  }

  // DTMF Standard dual-frequency matrix
  private dtmfFrequencies: Record<string, [number, number]> = {
    '1': [697, 1209],
    '2': [697, 1336],
    '3': [697, 1477],
    '4': [770, 1209],
    '5': [770, 1336],
    '6': [770, 1477],
    '7': [852, 1209],
    '8': [852, 1336],
    '9': [852, 1477],
    '*': [941, 1209],
    '0': [941, 1336],
    '#': [941, 1477],
  };

  /**
   * Play DTMF tone when keypad button is tapped
   */
  public playDtmf(key: string, duration = 0.16) {
    this.triggerHaptic(20);
    if (!this.isSoundEnabled) return;

    try {
      const ctx = this.initContext();
      const freqs = this.dtmfFrequencies[key] || [770, 1336];

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(freqs[0], ctx.currentTime);
      osc2.frequency.setValueAtTime(freqs[1], ctx.currentTime);

      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + duration);
      osc2.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone play error', e);
    }
  }

  /**
   * Play dial tone when initiating a call
   */
  public playDialTone(duration = 1.0) {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.initContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.setValueAtTime(350, ctx.currentTime);
      osc2.frequency.setValueAtTime(440, ctx.currentTime);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + duration);
      osc2.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Play call ringback tone (waiting for answer)
   */
  public playRingbackTone(): () => void {
    if (!this.isSoundEnabled) return () => {};
    try {
      const ctx = this.initContext();
      let isPlaying = true;

      const scheduleBurst = () => {
        if (!isPlaying || !this.ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(425, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
        gain.gain.setValueAtTime(0.05, now + 1.2);
        gain.gain.linearRampToValueAtTime(0.001, now + 1.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.3);
      };

      scheduleBurst();
      const timer = window.setInterval(scheduleBurst, 3000);

      return () => {
        isPlaying = false;
        clearInterval(timer);
      };
    } catch {
      return () => {};
    }
  }

  /**
   * Start Incoming Call Ringtone loop with melody
   */
  public startIncomingRingtone(theme = 'marimba'): () => void {
    this.stopIncomingRingtone();
    if (!this.isSoundEnabled) return () => {};

    try {
      const ctx = this.initContext();
      let active = true;

      // Haptic cadence for incoming call
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([600, 400, 600, 400, 1000]);
        } catch {}
      }

      // Marimba melody notes
      const notes = theme === 'cosmic'
        ? [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25]
        : [659.25, 587.33, 523.25, 659.25, 783.99, 880.00, 783.99, 659.25];

      const playMelodyPass = () => {
        if (!active || !this.ctx) return;
        const start = ctx.currentTime;

        notes.forEach((freq, idx) => {
          const noteStart = start + idx * 0.18;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = theme === 'cosmic' ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, noteStart);

          gain.gain.setValueAtTime(0.08, noteStart);
          gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(noteStart);
          osc.stop(noteStart + 0.38);
        });
      };

      playMelodyPass();
      const interval = window.setInterval(() => {
        if (active) {
          playMelodyPass();
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try { navigator.vibrate([500, 300, 500]); } catch {}
          }
        }
      }, 2500);

      this.ringtoneInterval = interval;

      return () => {
        active = false;
        clearInterval(interval);
      };
    } catch {
      return () => {};
    }
  }

  public stopIncomingRingtone() {
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(0);
      } catch {}
    }
  }

  /**
   * Sound effect when call is connected
   */
  public playConnectedTone() {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  /**
   * Sound effect when call ends
   */
  public playCallEndTone() {
    this.stopIncomingRingtone();
    this.triggerHaptic(60);
    if (!this.isSoundEnabled) return;

    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      [0, 0.2, 0.4].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(425, now + delay);
        gain.gain.setValueAtTime(0.06, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.12);
      });
    } catch {}
  }
}

export const audioToneService = new AudioToneService();
