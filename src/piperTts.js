// Standalone copy of the TTS engine already inlined in App.jsx (SpeakButton's
// synthesizeSpeechWav, ~line 14254 onward) — extracted so LessonReel.jsx and
// LessonMentor.jsx can reuse the exact same free, self-hosted voice without
// creating a circular import back into App.jsx. App.jsx's own SpeakButton is
// left untouched; this is a parallel copy, not a refactor, to avoid any risk
// to the existing working feature.

// eSpeak-NG compiled to WASM, self-hosted at /espeak/ — same reasoning as
// Pyodide/TypeScript/SQL.js/React: the browser's own Web Speech API only
// works if the learner's OS happens to have a Ukrainian voice installed,
// which silently fails for a lot of real machines. Running a real speech
// engine client-side via WASM works identically for every learner, with no
// OS dependency, no network call at runtime, and no cost.
let __espeakModulePromise = null;
function loadEspeakOnce() {
  if (!__espeakModulePromise) {
    __espeakModulePromise = new Promise((resolve, reject) => {
      const url = import.meta.env.BASE_URL + "espeak/espeak-ng.js";
      const eventName = "espeak-ng-ready";
      const onReady = () => {
        window.removeEventListener(eventName, onReady);
        resolve(window.__espeakNgCtor);
      };
      window.addEventListener(eventName, onReady);
      const script = document.createElement("script");
      script.type = "module";
      script.textContent = `import ESpeakNG from ${JSON.stringify(url)}; window.__espeakNgCtor = ESpeakNG; window.dispatchEvent(new Event(${JSON.stringify(eventName)}));`;
      script.onerror = () => reject(new Error("Не вдалося завантажити локальний файл озвучення (eSpeak)."));
      document.head.appendChild(script);
    }).catch((err) => {
      __espeakModulePromise = null;
      throw err instanceof Error ? err : new Error("Не вдалося завантажити локальний файл озвучення (eSpeak): " + String(err));
    });
  }
  return __espeakModulePromise;
}

async function synthesizeEspeakWav(text) {
  const ESpeakNG = await loadEspeakOnce();
  const outFile = "out.wav";
  const mod = await ESpeakNG({
    arguments: ["-w", outFile, "-s", "155", "-v", "uk", text],
    print: () => {},
    printErr: () => {},
  });
  const data = mod.FS.readFile(outFile);
  return new Blob([data], { type: "audio/wav" });
}

// Piper (a real neural voice, uk_UA-lada-x_low) — self-hosted at /piper/.
let __ortPromise = null;
function loadOnnxRuntimeOnce() {
  if (!__ortPromise) {
    __ortPromise = new Promise((resolve, reject) => {
      if (window.ort) { resolve(window.ort); return; }
      const script = document.createElement("script");
      script.src = import.meta.env.BASE_URL + "piper/ort/ort.wasm.min.js";
      script.onload = () => resolve(window.ort);
      script.onerror = () => reject(new Error("Не вдалося завантажити рушій ONNX."));
      document.head.appendChild(script);
    }).catch((err) => {
      __ortPromise = null;
      throw err instanceof Error ? err : new Error(String(err));
    });
  }
  return __ortPromise;
}

let __piperPhonemizeCtorPromise = null;
function loadPiperPhonemizeCtorOnce() {
  if (!__piperPhonemizeCtorPromise) {
    __piperPhonemizeCtorPromise = new Promise((resolve, reject) => {
      if (window.createPiperPhonemize) { resolve(window.createPiperPhonemize); return; }
      const script = document.createElement("script");
      script.src = import.meta.env.BASE_URL + "piper/phonemize/piper_phonemize.js";
      script.onload = () => resolve(window.createPiperPhonemize);
      script.onerror = () => reject(new Error("Не вдалося завантажити фонемізатор."));
      document.head.appendChild(script);
    }).catch((err) => {
      __piperPhonemizeCtorPromise = null;
      throw err instanceof Error ? err : new Error(String(err));
    });
  }
  return __piperPhonemizeCtorPromise;
}

async function phonemizeForPiper(text) {
  const createPiperPhonemize = await loadPiperPhonemizeCtorOnce();
  const base = import.meta.env.BASE_URL + "piper/phonemize/";
  const input = JSON.stringify([{ text: text.trim() }]);
  const lines = [];
  const mod = await createPiperPhonemize({
    print: (data) => { lines.push(data); },
    printErr: (msg) => { throw new Error(msg); },
    locateFile: (url) => {
      if (url.endsWith(".wasm")) return base + "piper_phonemize.wasm";
      if (url.endsWith(".data")) return base + "piper_phonemize.data";
      return url;
    },
    noInitialRun: true,
  });
  mod.callMain(["-l", "uk", "--input", input, "--espeak_data", "/espeak-ng-data"]);
  if (lines.length === 0) throw new Error("Фонемізатор не повернув результат.");
  return lines.flatMap((line) => JSON.parse(line).phonemes);
}

let __piperModelPromise = null;
function loadPiperModelOnce() {
  if (!__piperModelPromise) {
    const base = import.meta.env.BASE_URL + "piper/models/";
    __piperModelPromise = Promise.all([
      fetch(base + "uk_UA-lada-x_low.onnx").then((r) => r.arrayBuffer()),
      fetch(base + "uk_UA-lada-x_low.onnx.json").then((r) => r.json()),
    ])
      .then(([modelBytes, config]) => ({ modelBytes, config }))
      .catch((err) => {
        __piperModelPromise = null;
        throw new Error("Не вдалося завантажити голосову модель: " + String(err.message || err));
      });
  }
  return __piperModelPromise;
}

let __piperSessionPromise = null;
function loadPiperSessionOnce() {
  if (!__piperSessionPromise) {
    __piperSessionPromise = (async () => {
      const ort = await loadOnnxRuntimeOnce();
      const { modelBytes, config } = await loadPiperModelOnce();
      ort.env.wasm.wasmPaths = import.meta.env.BASE_URL + "piper/ort/";
      ort.env.wasm.numThreads = 1;
      const session = await ort.InferenceSession.create(new Uint8Array(modelBytes), { executionProviders: ["wasm"] });
      return { session, config, ort };
    })().catch((err) => {
      __piperSessionPromise = null;
      throw err instanceof Error ? err : new Error(String(err));
    });
  }
  return __piperSessionPromise;
}

function phonemesToIds(phonemes, phonemeIdMap) {
  const pad = phonemeIdMap["_"][0];
  const ids = [phonemeIdMap["^"][0]];
  for (const ph of phonemes) {
    const mapped = phonemeIdMap[ph];
    if (!mapped) continue;
    ids.push(pad, mapped[0]);
  }
  ids.push(pad, phonemeIdMap["$"][0]);
  return ids;
}

function pcmToWavBlob(pcm, sampleRate) {
  const headerLength = 44;
  const view = new DataView(new ArrayBuffer(pcm.length * 2 + headerLength));
  view.setUint32(0, 0x46464952, true);
  view.setUint32(4, view.buffer.byteLength - 8, true);
  view.setUint32(8, 0x45564157, true);
  view.setUint32(12, 0x20746d66, true);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, 2 * sampleRate, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x61746164, true);
  view.setUint32(40, 2 * pcm.length, true);
  let p = headerLength;
  for (let i = 0; i < pcm.length; i++) {
    const v = pcm[i];
    if (v >= 1) view.setInt16(p, 32767, true);
    else if (v <= -1) view.setInt16(p, -32768, true);
    else view.setInt16(p, (v * 32768) | 0, true);
    p += 2;
  }
  return new Blob([view.buffer], { type: "audio/wav" });
}

const __piperAudioCache = new Map();

async function synthesizePiperWav(text) {
  const cached = __piperAudioCache.get(text);
  if (cached) return cached;
  const [{ session, config, ort }, phonemes] = await Promise.all([
    loadPiperSessionOnce(),
    phonemizeForPiper(text),
  ]);
  const ids = phonemesToIds(phonemes, config.phoneme_id_map);
  const lengthScale = config.inference.length_scale * 2.0;
  const noiseScale = config.inference.noise_scale * 0.35;
  const noiseW = config.inference.noise_w * 0.4;
  const feeds = {
    input: new ort.Tensor("int64", BigInt64Array.from(ids.map(BigInt)), [1, ids.length]),
    input_lengths: new ort.Tensor("int64", BigInt64Array.from([BigInt(ids.length)])),
    scales: new ort.Tensor("float32", Float32Array.from([noiseScale, lengthScale, noiseW])),
  };
  const results = await session.run(feeds);
  const blob = pcmToWavBlob(results.output.data, config.audio.sample_rate);
  __piperAudioCache.set(text, blob);
  return blob;
}

// Tries the higher-quality neural voice first; falls back to eSpeak so
// narration never simply breaks.
export async function synthesizeSpeechWav(text) {
  try {
    return await synthesizePiperWav(text);
  } catch (err) {
    console.warn("Piper TTS failed, falling back to eSpeak:", err);
    return synthesizeEspeakWav(text);
  }
}
