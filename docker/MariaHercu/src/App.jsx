import React from "react";

function App() {
  const playDemonicScream = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const distortion = context.createWaveShaper();

    // Cria uma curva de distorção agressiva
    function makeDistortionCurve(amount) {
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] =
          ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
      }
      return curve;
    }

    distortion.curve = makeDistortionCurve(666); // bem demoníaco
    distortion.oversample = "4x";

    oscillator.type = "square"; // som áspero
    oscillator.frequency.setValueAtTime(900, context.currentTime); // começa bem agudo
    oscillator.frequency.exponentialRampToValueAtTime(80, context.currentTime + 1); // cai grave

    gain.gain.setValueAtTime(1, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1); // fade out

    oscillator.connect(distortion);
    distortion.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 1);
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <button
        onClick={playDemonicScream}
        className="bg-red-700 hover:bg-red-900 text-white text-2xl font-bold py-4 px-8 rounded-xl shadow-xl animate-pulse hover:scale-110 transform transition"
      >
        👹 Grito Demoníaco
      </button>
    </div>
  );
}

export default App;
