/**
 * Karigra - Speech Recognition, Audio Recording, Waveform Visualizer & Speech Synthesis
 * Genuinely functional speech-to-text supporting Telugu, Hindi, English, Bengali, Marathi, Tamil, Kannada, and Gujarati.
 */

export const BCP47_LANGUAGE_MAP = {
  'te': 'te-IN', // Telugu
  'hi': 'hi-IN', // Hindi
  'en': 'en-IN', // English (Indian)
  'bn': 'bn-IN', // Bengali
  'mr': 'mr-IN', // Marathi
  'ta': 'ta-IN', // Tamil
  'kn': 'kn-IN', // Kannada
  'gu': 'gu-IN'  // Gujarati
};

export const LANGUAGE_NAMES = {
  'te': 'Telugu (తెలుగు)',
  'hi': 'Hindi (हिन्दी)',
  'en': 'English',
  'bn': 'Bengali (বাংলা)',
  'mr': 'Marathi (मराठी)',
  'ta': 'Tamil (தமிழ்)',
  'kn': 'Kannada (ಕನ್ನಡ)',
  'gu': 'Gujarati (ગુજરાતી)'
};

export class SpeechHandler {
  constructor(canvasOrContainerEl = null) {
    this.visualizerEl = canvasOrContainerEl;
    this.mediaStream = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.animationId = null;
    this.audioContext = null;
    this.analyser = null;
    this.recognition = null;
    this.accumulatedTranscript = '';
    this.lastInterim = '';
    this.manualStop = false;
    this.activeLangCode = 'te';
  }

  static isSupported() {
    return Boolean(
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)
    );
  }

  /**
   * Start live speech-to-text recognition and audio waveform visualization
   */
  async startRecording(options = {}) {
    const {
      languageCode = 'te',
      onInterim = null,
      onFinal = null,
      onError = null,
      onStart = null,
      onEnd = null,
      waveformEl = null
    } = options;

    if (waveformEl) {
      this.visualizerEl = waveformEl;
    }

    this.isRecording = true;
    this.manualStop = false;
    this.activeLangCode = languageCode;
    this.accumulatedTranscript = '';
    this.lastInterim = '';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const err = new Error("Web Speech Recognition is not supported on this browser.");
      if (onError) onError(err.message);
      this.isRecording = false;
      return false;
    }

    // 1. Request microphone stream for live audio analysis & waveform
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.startLiveAudioVisualizer(this.mediaStream);
      }
    } catch (micErr) {
      console.warn("Microphone hardware stream permission notice:", micErr);
      // Fallback to synthetic waveform animation if getUserMedia is denied
      this.startSyntheticVisualizer();
    }

    // 2. Initialize and configure Web Speech API Recognition
    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = BCP47_LANGUAGE_MAP[languageCode] || 'en-IN';

      this.recognition.onstart = () => {
        if (onStart) onStart();
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalSegment = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalSegment += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        if (finalSegment.trim()) {
          this.accumulatedTranscript = (this.accumulatedTranscript + ' ' + finalSegment.trim()).trim();
          this.lastInterim = '';
          if (onFinal) {
            onFinal(this.accumulatedTranscript, finalSegment.trim());
          }
        }

        this.lastInterim = interimTranscript;
        const currentFull = (this.accumulatedTranscript + (interimTranscript ? ' ' + interimTranscript : '')).trim();

        if (onInterim) {
          onInterim({
            fullText: currentFull,
            interimText: interimTranscript,
            finalText: this.accumulatedTranscript
          });
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition event:", event.error);
        if (event.error === 'no-speech') {
          // Normal gap during speaking, do not abort
          return;
        }
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          if (onError) onError("Microphone permission denied. Please allow microphone access in your browser to speak.");
          this.stopRecording();
          return;
        }
        if (onError && event.error !== 'aborted') {
          onError(`Speech recognition notice: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        // If recognition stopped unexpectedly without user clicking stop (e.g. continuous gap timeout), restart automatically
        if (this.isRecording && !this.manualStop) {
          try {
            this.recognition.start();
          } catch (e) {
            // If restart fails, close cleanly
            this.isRecording = false;
            this.stopVisualizer();
            if (onEnd) onEnd(this.accumulatedTranscript);
          }
        } else {
          this.isRecording = false;
          this.stopVisualizer();
          if (onEnd) onEnd(this.accumulatedTranscript);
        }
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      this.isRecording = false;
      this.stopVisualizer();
      if (onError) onError(err.message || "Failed to initialize speech recognition.");
      return false;
    }
  }

  /**
   * Stop active speech recognition and clean up audio resources
   */
  stopRecording() {
    this.manualStop = true;
    this.isRecording = false;

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.recognition = null;
    }

    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach(track => track.stop());
      } catch (e) {}
      this.mediaStream = null;
    }

    this.stopVisualizer();
    const finalVal = (this.accumulatedTranscript + (this.lastInterim ? ' ' + this.lastInterim : '')).trim();
    return finalVal || this.accumulatedTranscript.trim();
  }

  /**
   * Connect live Web Audio API Analyser to microphone stream for responsive waveforms
   */
  startLiveAudioVisualizer(stream) {
    if (!this.visualizerEl) return;
    this.stopVisualizer();

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        this.startSyntheticVisualizer();
        return;
      }

      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Check if target is DOM container with .waveform-bar elements or a canvas
      const bars = this.visualizerEl.querySelectorAll('.waveform-bar');
      const isCanvas = this.visualizerEl.tagName === 'CANVAS';
      const ctx = isCanvas ? this.visualizerEl.getContext('2d') : null;

      const render = () => {
        if (!this.isRecording) return;
        this.analyser.getByteFrequencyData(dataArray);

        if (bars && bars.length > 0) {
          const step = Math.max(1, Math.floor(dataArray.length / bars.length));
          bars.forEach((bar, index) => {
            const val = dataArray[index * step] || 0;
            // Scale bar height between 6px and 36px based on real voice decibels
            const height = Math.max(6, Math.min(38, Math.round((val / 255) * 36) + 6));
            bar.style.height = `${height}px`;
            bar.style.opacity = val > 15 ? '1.0' : '0.45';
          });
        } else if (ctx) {
          ctx.clearRect(0, 0, this.visualizerEl.width, this.visualizerEl.height);
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#944B00';
          ctx.beginPath();
          const sliceWidth = this.visualizerEl.width / bufferLength;
          let x = 0;
          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * this.visualizerEl.height) / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += sliceWidth;
          }
          ctx.stroke();
        }

        this.animationId = requestAnimationFrame(render);
      };

      render();
    } catch (e) {
      console.warn("AudioContext visualizer notice:", e);
      this.startSyntheticVisualizer();
    }
  }

  /**
   * Fallback visualizer animation when AudioContext is inactive
   */
  startSyntheticVisualizer() {
    if (!this.visualizerEl) return;
    const bars = this.visualizerEl.querySelectorAll('.waveform-bar');
    let phase = 0;

    const draw = () => {
      if (!this.isRecording) return;

      if (bars && bars.length > 0) {
        bars.forEach((bar, i) => {
          const wave = Math.abs(Math.sin(phase + i * 0.45));
          const h = Math.round(8 + wave * 26);
          bar.style.height = `${h}px`;
          bar.style.opacity = '0.9';
        });
        phase += 0.18;
      }
      this.animationId = requestAnimationFrame(draw);
    };

    draw();
  }

  stopVisualizer() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
    if (this.visualizerEl) {
      const bars = this.visualizerEl.querySelectorAll('.waveform-bar');
      bars.forEach(bar => {
        bar.style.height = '6px';
        bar.style.opacity = '0.4';
      });
      if (this.visualizerEl.tagName === 'CANVAS') {
        const ctx = this.visualizerEl.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, this.visualizerEl.width, this.visualizerEl.height);
      }
    }
  }

  /**
   * Text-to-speech reader in Indian and regional languages
   */
  speakText(text, langCode = 'te') {
    if (!('speechSynthesis' in window)) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = BCP47_LANGUAGE_MAP[langCode] || 'en-IN';

    window.speechSynthesis.speak(utterance);
  }
}

/**
 * Universal waveform animation helper
 */
export function startWaveformAnimation(containerOrCanvas, stream = null) {
  const handler = new SpeechHandler(containerOrCanvas);
  handler.isRecording = true;
  if (stream) {
    handler.startLiveAudioVisualizer(stream);
  } else {
    handler.startSyntheticVisualizer();
  }
  return () => {
    handler.isRecording = false;
    handler.stopVisualizer();
  };
}

export const AudioRecorder = SpeechHandler;
