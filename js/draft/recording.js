// set up basic variables for app

const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
// const soundClips = document.querySelector('.sound-clips');
// const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');
let audioURL = null;
let audio = null;
buffer =  new Tone.Buffer(audioURL); 
var a = document.createElement("a");

// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

// let audioCtx;
// const canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    // visualize(stream);

    record.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      // console.log("recorder START");
      record.style.background = "red";
      stop.style.background = "";

      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      // console.log("recorder STOP");
      record.style.background = "";
      stop.style.background = "red";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
      // console.log("chunks push");
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      // const clipName = prompt('Name for audio clip','audio.mp3');
      //
      // const clipContainer = document.createElement('article');
      // const clipLabel = document.createElement('p');
      // const audio = document.createElement('audio');
      // const deleteButton = document.createElement('button');

      // clipContainer.classList.add('clip');
      // audio.setAttribute('controls', '');
      // deleteButton.textContent = 'Delete';
      // deleteButton.className = 'delete';

      // if(clipName === null) {
      //   clipLabel.textContent = 'My unnamed clip';
      // } else {
      //   clipLabel.textContent = clipName;
      // }

      // clipContainer.appendChild(audio);
      // clipContainer.appendChild(clipLabel);
      // clipContainer.appendChild(deleteButton);
      // soundClips.appendChild(clipContainer);
    

      // function loadAudioUrl() {
        var audio = document.createElement('audio');
        audio.controls = true;
        // const blob = new Blob(chunks, { 'type' : 'audio/webm; codecs=opus' });
        let blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        audio.src = URL.createObjectURL(blob);
        console.log(audio.src);
        chunks = [];

        // audioURL = window.URL.createObjectURL(blob);
        buffer = new Tone.Buffer(audio.src);
        // audio.src = audioURL;
        // console.log(audioURL);
        // audioURL.click();
        console.log("URL loaded");

        
        // // console.log("recorder stopped");
        // var a = document.createElement("a");
        // a.download = "test.webm";

        // a.href = audioURL;

      

      // loadAudioUrl();

      // function fetchUrl() {
      //   return audioURL;
      // }


      // var audio = document.createElement('audio');
      // audio.controls = true;
      // const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      // chunks = [];
      // const audioURL = window.URL.createObjectURL(blob);
      // audio.src = audioURL;
      // console.log("recorder stopped");
      
      // document.body.appendChild(a);
      // a.style = "display: none";
      // a.href = audioURL;
      // a.download = "sound/audio.wbm";
      // a.click();
      // window.URL.revokeObjectURL(url);

      // deleteButton.onclick = function(e) {
      //   let evtTgt = e.target;
      //   evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      // }

      // clipLabel.onclick = function() {
      //   const existingName = clipLabel.textContent;
      //   const newClipName = prompt('Enter a new name for your sound clip?');
      //   if(newClipName === null) {
      //     clipLabel.textContent = existingName;
      //   } else {
      //     clipLabel.textContent = newClipName;
      //   }
      // }
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} 

else {
   console.log('getUserMedia not supported on your browser!');
}


audio = new Tone.Player(buffer, function() {
  console.log("audio loaded");
});

const pitchShift = new Tone.PitchShift().toDestination(); //Connect the output to the context's destination node.

console.log("do pitchShift");
const player = audio.connect(pitchShift); //connect to pitchShift node
console.log("pitchShift");

player.loop = true; //creates a looped callback at the specified interval

const toneFFT = new Tone.FFT(); //Get the current frequency data of the connected audio source using a fast Fourier transform.
pitchShift.connect(toneFFT); //connect to toneFFT
fft({
  	parent: document.querySelector("#content"),
    tone: toneFFT,
});


// bind the interface
document.querySelector("tone-play-toggle").addEventListener("start", () => player.start());
// console.log("play");
document.querySelector("tone-play-toggle").addEventListener("stop", () => player.stop());
// console.log("stop");
// document.querySelector("tone-play-toggle").addEventListener('start', () => {
// 	debugger;
// });

document.querySelector("tone-slider").addEventListener("input", e => {
	pitchShift.pitch = parseFloat(e.target.value);
});

console.log("stuff");

// function visualize(stream) {
//   if(!audioCtx) {
//     audioCtx = new AudioContext();
//   }
//
//   const source = audioCtx.createMediaStreamSource(stream);
//
//   const analyser = audioCtx.createAnalyser();
//   analyser.fftSize = 2048;
//   const bufferLength = analyser.frequencyBinCount;
//   const dataArray = new Uint8Array(bufferLength);
//
//   source.connect(analyser);
//   //analyser.connect(audioCtx.destination);
//
//   draw()
//
//   function draw() {
//     const WIDTH = canvas.width
//     const HEIGHT = canvas.height;
//
//     requestAnimationFrame(draw);
//
//     analyser.getByteTimeDomainData(dataArray);
//
//     canvasCtx.fillStyle = 'rgb(200, 200, 200)';
//     canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
//
//     canvasCtx.lineWidth = 2;
//     canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
//
//     canvasCtx.beginPath();
//
//     let sliceWidth = WIDTH * 1.0 / bufferLength;
//     let x = 0;
//
//
//     for(let i = 0; i < bufferLength; i++) {
//
//       let v = dataArray[i] / 128.0;
//       let y = v * HEIGHT/2;
//
//       if(i === 0) {
//         canvasCtx.moveTo(x, y);
//       } else {
//         canvasCtx.lineTo(x, y);
//       }
//
//       x += sliceWidth;
//     }
//
//     canvasCtx.lineTo(canvas.width, canvas.height/2);
//     canvasCtx.stroke();
//
//   }
// }
//
// window.onresize = function() {
//   canvas.width = mainSection.offsetWidth;
// }
//
// window.onresize();
