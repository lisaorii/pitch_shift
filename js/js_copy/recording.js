//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording
var url;

var au = document.createElement('audio');
var li = document.createElement('li');
var link = document.createElement('a');


// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

// const recordButton = document.querySelector('.record');
// const stopButton = document.querySelector('.stop');
// const pauseButton = document.querySelector('.pause');
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
    console.log("recordButton clicked");
    recordButton.style.background = "red";
    stopButton.style.background = "";
    pauseButton.style.background = "";

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/

    var constraints = { audio: true, video:false }

 	/*
    	Disable the record button until we get a success or fail from getUserMedia()
	*/

	recordButton.disabled = true;
	stopButton.disabled = false;
	pauseButton.disabled = false

	/*
    	We're using the standard promise based getUserMedia()
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		//update the format
		document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

		/*  assign to gumStream for later use  */
		gumStream = stream;

		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);

		/*
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
		rec = new Recorder(input,{numChannels:1})

		//start the recording process
		rec.record()

		console.log("Recording started");

	}).catch(function(err) {
	  	//enable the record button if getUserMedia() fails
    	recordButton.disabled = false;
    	stopButton.disabled = true;
    	pauseButton.disabled = true
	});
}

function pauseRecording(){
	console.log("pauseButton clicked rec.recording=",rec.recording );
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
    console.log("stopButton clicked");
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

	// var arrayBuffer = new ArrayBuffer(100);
	// var uint8Array = new Uint8Array(arrayBuffer);
	// for (var i = 0; i < 100; i++) {
	// 	uint8Array[i] = i;
	// }


	// blob = new Blob([uint8Array], {  type: 'audio/ogg; codecs=opus'  });
	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {

	url = URL.createObjectURL(blob);
	// $('div').html(blobVal);


	//name of .wav file to use during upload and download (without extendion)
	var filename = new Date().toISOString();

	console.log(url);


	// Recorder.setupDownload = function(blob, filename) {
	// 	var fd = new FormData();
	// 	fd.append('fname', filename);
	// 	fd.append('data', blob);
	// 	$.ajax({
	// 	  type: 'POST',
	// 	  url: '/upload.php',
	// 	  data: fd,
	// 	  processData: false,
	// 	  contentType: false
	// 	}).done(function(data) {
	// 	  console.log(data);
	// 	  console.log(url);
	// 	});
	//   }


	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//save to disk link
    link.href = url;
    // console.log(link.href);
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
          var xhr = new XMLHttpRequest();
          console.log("request");
		  xhr.onload = function(e) {
              console.log("on load");
		      if(this.readyState === 4) {
		          console.log("Server returned: ",e.target.responseText);
		      }
          };
          console.log("done");
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
// console.log("start pitch");
audio = new Tone.Player(upload).connect(pitchShift);

  const pitchShift = new Tone.PitchShift().toDestination(); //Connect the output to the context's destination node.
//   const player = audio.connect(pitchShift); //connect to pitchShift node
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
}
