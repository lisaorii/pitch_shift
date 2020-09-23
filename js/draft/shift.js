const pitchShift = new Tone.PitchShift().toDestination(); //Connect the output to the context's destination node.
const player = new Tone.Player("https://tonejs.github.io/audio/berklee/groovin_analogsynth1.mp3").connect(pitchShift); //connect to pitchShift node
player.loop = true; //creates a looped callback at the specified interval

const toneFFT = new Tone.FFT(); //Get the current frequency data of the connected audio source using a fast Fourier transform.
pitchShift.connect(toneFFT); //connect to toneFFT
fft({
  	parent: document.querySelector("#content"),
    tone: toneFFT,
});
console.log("play sound");

// bind the interface
document.querySelector("tone-play-toggle").addEventListener("start", () => player.start());
document.querySelector("tone-play-toggle").addEventListener("stop", () => player.stop());
// document.querySelector("tone-play-toggle").addEventListener('start', () => {
// 	debugger;
// });

document.querySelector("tone-slider").addEventListener("input", e => {
	pitchShift.pitch = parseFloat(e.target.value);
});