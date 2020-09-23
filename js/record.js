//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream;            //stream from getUserMedia()
var rec;              //Recorder.js object
var input;              //MediaStreamAudioSourceNode we'll be recording
var url;

var au = document.createElement('audio');
var li = document.createElement('li');
var link = document.createElement('a');


// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
  recordButton.style.background = "red";
  stopButton.style.background = "";
  pauseButton.style.background = "";

  var constraints = { audio: true, video:false }

  recordButton.disabled = true;
  stopButton.disabled = false;
  pauseButton.disabled = false

  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    audioContext = new AudioContext();

    //update the format
    document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

    /*  assign to gumStream for later use  */
    gumStream = stream;

    /* use the stream */
    input = audioContext.createMediaStreamSource(stream);
    rec = new Recorder(input,{numChannels:1})

    //start the recording process
    rec.record()
  }).catch(function(err) {
    //enable the record button if getUserMedia() fails
    recordButton.disabled = false;
    stopButton.disabled = true;
    pauseButton.disabled = true
  });
}

function pauseRecording(){
  if (rec.recording){
    //pause
    rec.stop();
    pauseButton.innerHTML="Resume";

  }else{
    //resume
    rec.record()
    pauseButton.innerHTML="Pause";

  }
  recordButton.style.background = "";
  stopButton.style.background = "";
  pauseButton.style.background = "red";
}

function stopRecording() {
  recordButton.style.background = "";
  stopButton.style.background = "red";
  pauseButton.style.background = "";

  //disable the stop button, enable the record too allow for new recordings
  stopButton.disabled = true;
  recordButton.disabled = false;
  pauseButton.disabled = true;

  //reset button just in case the recording is stopped while paused
  pauseButton.innerHTML="Pause";

  //tell the recorder to stop the recording
  rec.stop();

  //stop microphone access
  gumStream.getAudioTracks()[0].stop();

  //create the wav blob and pass it on to createDownloadLink
  rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
  url = URL.createObjectURL(blob);
  // $('div').html(blobVal);
  //name of .wav file to use during upload and download (without extendion)
  var filename = new Date().toISOString();

  //add controls to the <audio> element
  au.controls = true;
  au.src = url;

  //save to disk link
  link.href = url;
  link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
  link.innerHTML = "Save to disk";

  //add the new audio element to li
  li.appendChild(au);

  //add the filename to the li
  li.appendChild(document.createTextNode(filename+".wav "))

  //add the save to disk link to li
  li.appendChild(link);

  //upload link
  var upload = document.createElement('a');
  upload.href="#";
  upload.innerHTML = "Upload";
  upload.addEventListener("click", function(event){
    var xhr = new XMLHttpRequest(); //HAVING ISSUES WITH XMLHTTPREQUEST
    xhr.onload = function(e) {
      if(this.readyState === 4) {
        console.log("Server returned: ",e.target.responseText);
      }
    };
    var fd=new FormData();
    fd.append("audio_data",blob, filename);
    xhr.open("POST","upload.php",true);
    xhr.send(fd);
  })
  li.appendChild(document.createTextNode (" "))//add a space in between
  li.appendChild(upload)//add the upload link to li

  //add the li element to the ol
  recordingsList.appendChild(li);

}

function pitchshifter(upload) {
  audio = new Tone.Player(url).connect(pitchShift); //ここがうまくいきません

  const pitchShift = new Tone.PitchShift().toDestination(); //Connect the output to the context's destination node.
  player.loop = true; //creates a looped callback at the specified interval

  const toneFFT = new Tone.FFT(); //Get the current frequency data of the connected audio source using a fast Fourier transform.
  pitchShift.connect(toneFFT); //connect to toneFFT
  fft({
    parent: document.querySelector("#content"),
    tone: toneFFT,
  });

  // bind the interface
  document.querySelector("tone-play-toggle").addEventListener("start", () => player.start());
  document.querySelector("tone-play-toggle").addEventListener("stop", () => player.stop());
  document.querySelector("tone-slider").addEventListener("input", e => {
    pitchShift.pitch = parseFloat(e.target.value);
  });
}
