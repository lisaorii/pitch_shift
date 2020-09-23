const mic = new Tone.UserMedia();
// const record = document.querySelector('.record');
// const stop = document.querySelector('.stop');

		const micFFT = new Tone.FFT();
		mic.connect(micFFT);

		fft({
			tone: micFFT,
			parent: document.querySelector("#content")
        });
        
        const audio = document.createElement('audio');
        const synth = new Tone.Synth();
        const actx  = Tone.context;
        const dest  = actx.createMediaStreamDestination();
        const recorder = new MediaRecorder(dest.stream);

		// bind the interface
		const micButton = document.querySelector("tone-mic-button");
		micButton.supported = Tone.UserMedia.supported;
		micButton.addEventListener("open", () => {
            mic.open();
  

            recorder.start();

            synth.connect(dest);
            synth.toMaster();

            const chunks = [];

            // const notes = 'CDEFGAB'.split('').map(n => `${n}4`);
            let note = 0;
            Tone.Transport.scheduleRepeat(time => {
                recorder.start();
                if (note > notes.length) {
                synth.triggerRelease(time)
                recorder.stop();
                Tone.Transport.stop();
                } else synth.triggerAttack(notes[note], time);
                note++;
            }, '4n');
        });

		micButton.addEventListener("close", () => {
            mic.close();
            recorder.stop();

            recorder.ondataavailable = evt => chunks.push(evt.data);
            let blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
            audio.src = URL.createObjectURL(blob);
            

        });
        Tone.Transport.start();
