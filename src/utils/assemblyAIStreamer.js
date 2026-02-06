const API_URL = import.meta.env.VITE_API_URL || '';
const WS_URL = "wss://streaming.assemblyai.com/v3/ws";
const TARGET_SAMPLE_RATE = 16000;

// Token cache to avoid repeated requests
let cachedToken = null;
let tokenExpiry = 0;

async function getVoiceToken() {
    const now = Date.now();
    if (cachedToken && now < tokenExpiry) return cachedToken;

    try {
        const response = await fetch(`${API_URL}/api/voice/token`);
        if (!response.ok) throw new Error('Failed to fetch voice token');
        const data = await response.json();
        
        cachedToken = data.token;
        tokenExpiry = now + (50 * 60 * 1000); // Cache for 50 minutes (expires in 60)
        return cachedToken;
    } catch (err) {
        console.error("Voice Token Error:", err);
        return null;
    }
}


export class AssemblyAIStreamer {
    constructor({ onTranscript, onStateChange, onError }) {
        this.callbacks = { onTranscript, onStateChange, onError };
        this.state = "idle"; // idle | connecting | listening
        this.ws = null;
        this.audioContext = null;
        this.mediaStream = null;
        this.sourceNode = null;
        this.processorNode = null;
    }

    async start() {
        if (this.state !== "idle") return;
        this._setState("connecting");

        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true }
            });

            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: TARGET_SAMPLE_RATE,
                latencyHint: "interactive"
            });

            // If browser ignored our sample rate hint, we'll resample manually
            this.nativeSampleRate = this.audioContext.sampleRate;
            this.needsResample = this.nativeSampleRate !== TARGET_SAMPLE_RATE;

            this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
            const bufferSize = this.needsResample ? 2048 : 1024;
            this.processorNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

            this.processorNode.onaudioprocess = (e) => {
                if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

                let float32 = e.inputBuffer.getChannelData(0);

                if (this.needsResample) {
                    float32 = this._downsample(float32, this.nativeSampleRate, TARGET_SAMPLE_RATE);
                }

                const pcm16 = this._float32ToPcm16(float32);
                this.ws.send(pcm16.buffer);
            };

            this.sourceNode.connect(this.processorNode);
            this.processorNode.connect(this.audioContext.destination);

            await this._connectWebSocket();
        } catch (err) {
            this._cleanup();
            this._setState("idle");
            this.callbacks.onError?.(err);
        }
    }

    stop() {
        if (this.state === "idle") return;

        // Disconnect audio processing first (stop sending)
        try {
            this.processorNode?.disconnect();
            this.sourceNode?.disconnect();
        } catch (e) { /* already disconnected */ }

        // Tell AssemblyAI to finalize
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: "Terminate" }));
        }

        this._cleanup();
        this._setState("idle");
    }

    destroy() {
        this.stop();
        this.callbacks = {};
    }

    async _connectWebSocket() {
        const token = await getVoiceToken();
        if (!token) throw new Error("Could not acquire voice authentication token.");

        return new Promise((resolve, reject) => {
            const url = new URL(WS_URL);
            url.searchParams.set("sample_rate", String(TARGET_SAMPLE_RATE));
            url.searchParams.set("encoding", "pcm_s16le");
            url.searchParams.set("format_turns", "true");
            url.searchParams.set("token", token);

            this.ws = new WebSocket(url.toString());
            this.ws.binaryType = "arraybuffer";

            this.ws.onopen = () => {
                // We wait for the "Begin" message before setting state to listening
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === "Begin") {
                        this._setState("listening");
                        resolve();
                    } else if (data.type === "Turn") {
                        this.callbacks.onTranscript?.(data.transcript || "", data.end_of_turn);
                    } else if (data.type === "Termination") {
                        // Server acknowledged session end
                    }
                } catch (e) {
                    // Non-JSON message, ignore
                }
            };

            this.ws.onerror = (err) => {
                this.callbacks.onError?.(err);
                reject(err);
            };

            this.ws.onclose = () => {
                // If we're still in connecting/listening state, clean up
                if (this.state !== "idle") {
                    this._cleanup();
                    this._setState("idle");
                }
            };
        });
    }

    _cleanup() {
        try { this.processorNode?.disconnect(); } catch (e) {}
        try { this.sourceNode?.disconnect(); } catch (e) {}

        if (this.audioContext && this.audioContext.state !== "closed") {
            this.audioContext.close().catch(() => {});
        }

        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(t => t.stop());
        }

        if (this.ws) {
            if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
                this.ws.close();
            }
        }

        this.ws = null;
        this.audioContext = null;
        this.mediaStream = null;
        this.sourceNode = null;
        this.processorNode = null;
    }

    _setState(state) {
        this.state = state;
        this.callbacks.onStateChange?.(state);
    }

    _float32ToPcm16(float32) {
        const pcm16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
            const s = Math.max(-1, Math.min(1, float32[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return pcm16;
    }

    _downsample(float32, fromRate, toRate) {
        const ratio = fromRate / toRate;
        const newLength = Math.round(float32.length / ratio);
        const result = new Float32Array(newLength);
        for (let i = 0; i < newLength; i++) {
            result[i] = float32[Math.round(i * ratio)];
        }
        return result;
    }
}
