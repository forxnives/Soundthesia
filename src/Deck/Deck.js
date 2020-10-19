
import SoundCloudAudio from 'soundcloud-audio';
import { FLStandardKnob } from '../../node_modules/precision-inputs/common/precision-inputs.fl-controls';
import KnobCreate from '../KnobCreate/KnobCreate';
import WaveSurfer from 'wavesurfer.js';
// import RealTimeBPMAnalyzer from 'realtime-bpm-analyzer';
import detect from 'bpm-detective';



// SCKEY1 = 'a3dd183a357fcff9a6943c0d65664087';
// SCKEY2 = '72e56a72d70b611ec8bcab7b2faf1015';



function Deck (deckNumberString, state) {

    this.SCKEY2 = '72e56a72d70b611ec8bcab7b2faf1015';

    //  Internal state   //
    this.loadedTrack = null;
    this.detectedBPM = null;

    //  instantiating wavesurfer    //

    this.wavesurfer = WaveSurfer.create({
        container: `#waveform${deckNumberString}`,
        waveColor: 'violet',
        progressColor: 'purple'
    });

    this.wavesurfer.zoom(200)

    


    //using soundcloud dependancy 
    this.scPlayer = new SoundCloudAudio('72e56a72d70b611ec8bcab7b2faf1015');


    //instantiating web audio API audioContext
    this.audioContext = new AudioContext();

    //avoiding CORS error
    this.scPlayer.audio.crossOrigin = 'anonymous';

    //connecting soundcloud player html element to audioContext
    // this.startNode = this.audioContext.createMediaElementSource(this.scPlayer.audio);




    //instantiating eq nodes


    this.lowShelf = this.wavesurfer.backend.ac.createBiquadFilter();
    this.lowShelf.type = 'lowshelf';
    this.lowShelf.frequency.value = 300;

    this.midBand = this.wavesurfer.backend.ac.createBiquadFilter();
    this.midBand.type = 'peaking';
    this.midBand.frequency.value = 1000;

    this.highBand = this.wavesurfer.backend.ac.createBiquadFilter();
    this.highBand.type = 'highshelf';
    this.highBand.frequency.value = 1000;


    this.lowPass = this.wavesurfer.backend.ac.createBiquadFilter();
    this.lowPass.type = 'lowpass';
    this.lowPass.frequency.value = 24000;
    this.lowPass.Q.value = 0

    this.highPass = this.wavesurfer.backend.ac.createBiquadFilter();
    this.highPass.type = 'highpass';

    this.filterArray = [this.lowShelf, this.midBand, this.highBand, this.lowPass, this.highPass];


    //routing nodes

    // this.wavesurfer.backend.setFilter(this.lowShelf);
    // this.wavesurfer.backend.setFilter(this.midBand);
    // this.wavesurfer.backend.setFilter(this.highBand);
    // this.wavesurfer.backend.setFilter(this.lowPass);
    // this.wavesurfer.backend.setFilter(this.highPass);

    this.wavesurfer.backend.setFilters(this.filterArray);

    this.audioCtx = this.wavesurfer.backend.getAudioContext();




    //     // Fetch some audio file
    // fetch('https://api.soundcloud.com/tracks/388802322/stream?client_id=72e56a72d70b611ec8bcab7b2faf1015')
    // // Get response as ArrayBuffer
    // .then(response => response.arrayBuffer())
    // .then(buffer => {
    // // Decode audio into an AudioBuffer
    // return new Promise((resolve, reject) => {
    //     this.audioContext.decodeAudioData(buffer, resolve, reject);
    // });
    // })
    // // Run detection
    // .then(buffer => {
    // try {
    //     const bpm = detect(buffer);
    //     alert(`Detected BPM: ${ bpm }`);
    // } catch (err) {
    //     console.error(err);
    // }}
    // );




    this.source = this.audioCtx.createBufferSource();




    // console.log(this.source);

    // this.scriptNode = this.audioCtx.createScriptProcessor(4096, 1, 1);
    // console.log(this.scriptNode.bufferSize);

    // this.scriptNode.connect(this.audioCtx.destination);
    // this.source.connect(this.scriptNode);
    // this.source.connect(this.audioCtx.destination);


    // Set the scriptProcessorNode to get PCM data in real time
    // this.scriptProcessorNode = this.wavesurfer.backend.createScriptNode(4096, 1, 1);

    // console.log(this.wavesurfer.backend.getAudioContext())

    // Connect everythings together


    // this.onAudioProcess = new RealTimeBPMAnalyzer({
    //     scriptNode: {
    //         bufferSize: 4096,
    //         numberOfInputChannels: 1,
    //         numberOfOutputChannels: 1
    //     },
    //     pushTime: 2000,
    //     pushCallback: (err, bpm) => {
    //         console.log('bpm', bpm);
    //     }
    // });


    // Attach realTime function to audioprocess event.inputBuffer (AudioBuffer)

    // console.log(this.scriptNode)


    // this.scriptNode.onaudioprocess = (e) => {
    //     this.onAudioProcess.analyze(e);

    // };


    // this.startNode.connect(this.lowShelf);
    // this.lowShelf.connect(this.midBand);
    // this.midBand.connect(this.highBand);

    // this.highBand.connect(this.lowPass);

    // this.lowPass.connect(this.highPass);
    // this.highPass.connect(this.audioContext.destination);



    // Methods

    this.playFunc = function () {


        this.audioContext.resume().then(() => {


            // this.scPlayer.play({
            //     // streamUrl: 'https://api.soundcloud.com/tracks/185533328/stream'
            //     // streamUrl: "https://api.soundcloud.com/tracks/774880408/stream"
            //     streamUrl: `${this.loadedTrack.uri}/stream`
            //     });

            this.wavesurfer.play()
            
        });

    }


    this.pauseFunc = function () {

        this.wavesurfer.pause()

        // this.startNode.mediaElement.playbackRate = 2

    };

    this.stopFunc = function () {

        this.wavesurfer.stop()
        console.log('stoppressed')
    };

    this.updateBPM = function(bpm) {
        
        this.bpmTxt.innerText = bpm;
        this.detectedBPM = bpm;

    }


    this.loadTrackFunc = function() {

        this.loadedTrack = state.selectedTrack;

        const mp3Link = `${this.loadedTrack.stream_url}?client_id=${this.SCKEY2}`

        console.log(mp3Link)

        this.wavesurfer.load(mp3Link);



        let ctx = this.wavesurfer.backend.getAudioContext();
        // console.log(ctx);


                // Fetch some audio file
        fetch(mp3Link)
        // Get response as ArrayBuffer
        .then(response => response.arrayBuffer())
        .then(buffer => {
        // Decode audio into an AudioBuffer
        return new Promise((resolve, reject) => {
            ctx.decodeAudioData(buffer, resolve, reject);
        });
        })
        // Run detection
        .then(buffer => {
        try {
            const bpm = detect(buffer);
            // alert(`Detected BPM: ${ bpm }`);
            // this.detectedBPM = bpm;
            this.updateBPM(bpm)
        } catch (err) {
            console.error(err);
        }}
        );

    };


    this.tempoFunc = function(e) {
        // console.log(e.target.value/1000);

        let newBPM = e.target.value/1000 * this.detectedBPM;

        this.wavesurfer.backend.setPlaybackRate(e.target.value/1000);
        this.bpmTxt.innerText= newBPM.toFixed(2);
    }

    this.onDragFunc = function(e) {
        console.log('dragging')
        e.preventDefault()
    }

    this.onDropFunc = function(e) {
        e.preventDefault();
        // let data = e.dataTransfer.getData("track");
        // ev.target.appendChild(document.getElementById(data));
        this.loadTrackFunc()
      }


    // instantiating knobs

    this.highKnob = new KnobCreate(`.deck${deckNumberString}-eq-high`, this.highBand)
    this.midKnob = new KnobCreate(`.deck${deckNumberString}-eq-mid`, this.midBand);
    this.lowShelfKnob = new KnobCreate(`.deck${deckNumberString}-eq-low`, this.lowShelf);
    this.filterKnob = new KnobCreate(`.deck${deckNumberString}-eq-filter`, this.lowPass, this.highPass );


    // Selectors

    this.playBtn = document.querySelector(`.deck${deckNumberString}-transport-play`);

    this.pauseBtn = document.querySelector(`.deck${deckNumberString}-transport-pause`);

    this.stopBtn = document.querySelector(`.deck${deckNumberString}-transport-stop`);

    this.loadTrackBtn = document.querySelector(`.deck${deckNumberString}-panel .loadBtn`)

    this.bpmTxt = document.getElementById(`bpm${deckNumberString}`);

    this.tempoSLider = document.getElementById(`tempo${deckNumberString}`);

    this.container = document.querySelector(`.deck${deckNumberString}-container`);

    // this.container.setAttribute('ondragover', this.onDragFunc )


    


    //  event listeners

    this.playBtn.addEventListener('click', this.playFunc.bind(this), false);

    this.pauseBtn.addEventListener('click', this.pauseFunc.bind(this), false);

    this.loadTrackBtn.addEventListener('click', this.loadTrackFunc.bind(this), false);

    this.stopBtn.addEventListener('click', this.stopFunc.bind(this), false);

    this.tempoSLider.addEventListener('input', this.tempoFunc.bind(this), false);

    this.container.addEventListener('dragover', this.onDragFunc.bind(this), false);

    this.container.addEventListener('drop', this.onDropFunc.bind(this), false);



}

export default Deck;