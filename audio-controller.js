(function (root) {
  class AudioController {
    constructor() {
      this.enabled = true;
      this.requestId = 0;
      this.activeAudio = null;
      this.activeAudioFinish = null;
      this.activeSpeechFinish = null;
      this.activeContext = null;
      this.voices = [];
      this.refreshVoices = this.refreshVoices.bind(this);
      this.refreshVoices();
      root.speechSynthesis?.addEventListener?.('voiceschanged', this.refreshVoices);
    }

    refreshVoices() { this.voices = root.speechSynthesis?.getVoices?.() || []; }

    stop() {
      this.requestId += 1;
      if (this.activeAudio) {
        this.activeAudio.pause();
        this.activeAudio.removeAttribute('src');
        this.activeAudio.load();
        this.activeAudio = null;
      }
      this.activeAudioFinish?.(false);
      this.activeAudioFinish = null;
      root.speechSynthesis?.cancel?.();
      this.activeSpeechFinish?.(false);
      this.activeSpeechFinish = null;
      if (this.activeContext) {
        this.activeContext.close().catch(() => {});
        this.activeContext = null;
      }
    }

    setEnabled(enabled) {
      this.enabled = Boolean(enabled);
      if (!this.enabled) this.stop();
    }

    async playSequence(items, locale) {
      this.stop();
      if (!this.enabled) return;
      const id = this.requestId;
      for (const item of items) {
        if (!this.enabled || id !== this.requestId) return;
        const played = item.audio ? await this.playAsset(item.audio, id) : false;
        if (!played && item.allowTts !== false && item.fallbackText) {
          await this.speakText(item.fallbackText, locale, id);
        }
        if (!this.enabled || id !== this.requestId) return;
        await this.pause(item.pause ?? 180, id);
      }
    }

    playAsset(src, id) {
      return new Promise(resolve => {
        if (!this.enabled || id !== this.requestId || typeof root.Audio !== 'function') return resolve(false);
        const audio = new root.Audio();
        this.activeAudio = audio;
        let settled = false;
        const finish = result => {
          if (settled) return;
          settled = true;
          audio.onended = audio.onerror = null;
          if (this.activeAudio === audio) this.activeAudio = null;
          if (this.activeAudioFinish === finish) this.activeAudioFinish = null;
          resolve(result);
        };
        this.activeAudioFinish = finish;
        audio.preload = 'auto';
        audio.onended = () => finish(true);
        audio.onerror = () => finish(false);
        audio.src = src;
        audio.play().catch(() => finish(false));
      });
    }

    speakText(text, locale, id) {
      return new Promise(resolve => {
        if (!this.enabled || id !== this.requestId || !root.speechSynthesis || !root.SpeechSynthesisUtterance) return resolve(false);
        this.refreshVoices();
        root.speechSynthesis.cancel();
        const utterance = new root.SpeechSynthesisUtterance(text);
        const base = locale.split('-')[0].toLowerCase();
        utterance.lang = locale;
        utterance.voice = this.voices.find(v => v.lang.toLowerCase() === locale.toLowerCase()) ||
          this.voices.find(v => v.lang.toLowerCase().startsWith(base)) || null;
        utterance.rate = base === 'ar' ? 0.62 : 0.76;
        utterance.pitch = 1.02;
        utterance.volume = 0.95;
        let settled = false;
        const finish = result => {
          if (!settled) {
            settled = true;
            if (this.activeSpeechFinish === finish) this.activeSpeechFinish = null;
            resolve(result);
          }
        };
        this.activeSpeechFinish = finish;
        utterance.onend = () => finish(true);
        utterance.onerror = () => finish(false);
        root.speechSynthesis.speak(utterance);
      });
    }

    pause(ms, id) {
      return new Promise(resolve => root.setTimeout(() => resolve(id === this.requestId), ms));
    }

    playTone(kind = 'tap') {
      this.stop();
      if (!this.enabled) return;
      const Context = root.AudioContext || root.webkitAudioContext;
      if (!Context) return;
      const context = new Context();
      this.activeContext = context;
      const notes = kind === 'good' ? [523,659,784] : kind === 'try' ? [260] : [440];
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = context.currentTime + index * 0.1;
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.08, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.13);
      });
      root.setTimeout(() => {
        if (this.activeContext === context) this.activeContext = null;
        context.close().catch(() => {});
      }, 500);
    }
  }

  root.LittleStepsAudioController = AudioController;
})(globalThis);
