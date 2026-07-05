/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;
let beepInterval: any = null;
let isBeeping = false;

export function startAlarmBuzzer() {
  if (isBeeping) return;
  isBeeping = true;

  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Resume context if suspended (browser security policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    beepInterval = setInterval(() => {
      if (!audioCtx) return;
      
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      // Distinct pulse alarm: sawtooth frequency alternating between 880Hz and 1000Hz
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(now % 0.8 < 0.4 ? 880 : 1000, now);
      
      gain.gain.setValueAtTime(0, now);
      // Fast attack
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      // Decay to zero
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.28);
    }, 300);
  } catch (err) {
    console.error("Failed to start Web Audio Alarm:", err);
  }
}

export function stopAlarmBuzzer() {
  isBeeping = false;
  if (beepInterval) {
    clearInterval(beepInterval);
    beepInterval = null;
  }
}
