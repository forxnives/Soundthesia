
import SoundCloudAudio from 'soundcloud-audio';
import { FLStandardKnob } from '../../node_modules/precision-inputs/common/precision-inputs.fl-controls';
import KnobCreate from '../KnobCreate/KnobCreate';
import WaveSurfer from 'wavesurfer.js';
import detect from 'bpm-detective';
import { millisecondConvert, scrollCheck } from '../utils';

// import loadingSVG from '../trackloadingsvg.svg';



function Deck (deckNumberString, state) {

    this.SCKEY2 = '72e56a72d70b611ec8bcab7b2faf1015';
    this.SCKEY1 = 'a3dd183a357fcff9a6943c0d65664087';
    this.SCKEY3 = 'c92343835f607734d719d94afcb679d7';

    //  Internal state   //
    this.loadedTrack = null;
    this.detectedBPM = null;
    this.selectedZoomBool = true;
    this.readyToPlay = false;

    //  instantiating wavesurfer    //

    this.wavesurfer = WaveSurfer.create({
        container: `#waveform${deckNumberString}`,
        waveColor: '#2C2C54',
        progressColor: 'purple',
        hideScrollbar: true,
        height: 112
    });

    this.wavesurfer.zoom(200)
    
    //using soundcloud dependancy 
    this.scPlayer = new SoundCloudAudio('72e56a72d70b611ec8bcab7b2faf1015');

    //instantiating web audio API audioContext
    this.audioContext = new AudioContext();

    //avoiding CORS error
    this.scPlayer.audio.crossOrigin = 'anonymous';

    //instantiating gain nodes for crossfader 

    this.trackVolume = this.wavesurfer.backend.ac.createGain();

    this.crossFaderGain = this.wavesurfer.backend.ac.createGain();

    // console.log(this.wavesurfer.backend.gainNode)

    this.wavesurfer.backend.gainNode.disconnect(this.wavesurfer.backend.ac.destination)

    this.wavesurfer.backend.gainNode.connect(this.trackVolume);

    this.trackVolume.connect(this.crossFaderGain);

    this.crossFaderGain.connect(this.wavesurfer.backend.ac.destination);



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


    this.wavesurfer.backend.setFilters(this.filterArray);

    this.audioCtx = this.wavesurfer.backend.getAudioContext();

    this.source = this.audioCtx.createBufferSource();

    this.wavesurfer.on('loading', (e) => this.handleLoadFunc(e));

    this.wavesurfer.on('ready', (e) => this.handleReadyFunc(e))

    this.wavesurfer.on('finish', () => this.handleFinishFunc())




    // Methods

    this.playFunc = function () {

        this.audioContext.resume().then(() => {

            if (this.readyToPlay) {
                this.platterVinyl.classList.add('rotating');
                this.wavesurfer.play();
            }
            
        });

    }



    this.pauseFunc = function () {

        this.wavesurfer.pause();

        this.platterVinyl.classList.remove('rotating');

    };



    this.stopFunc = function () {

        this.wavesurfer.stop();

        this.platterVinyl.classList.remove('rotating');

        if (this.selectedZoomBool) {
            // this.wavesurfer.zoom(201);
            this.wavesurfer.zoom(200);
        }

    };



    this.updateBPM = function(bpm) {
        
        this.bpmTxt.innerText = bpm;
        this.detectedBPM = bpm;

    }



    this.loadingAnimateFunc = function() {

        this.loadingDiv.classList.remove('invisible');

    }


    this.handleLoadFunc = function (e) {

        document.getElementById(`loading-txt${deckNumberString}`).innerText = e
        
        if (this.readyToPlay = true){
            this.readyToPlay = false;
        }

    }

    this.handleReadyFunc = function(e) {
        // this.loadingDiv.classList.add('invisible');

        document.querySelector(`.waveform-loading${deckNumberString}`).classList.add('invisible');
        document.getElementById(`loading-txt${deckNumberString}`).innerText = 'Loading';

        this.readyToPlay = true
    }



    this.handleFinishFunc = function() {

        this.platterVinyl.classList.remove('rotating');

    }






    this.loadTrackFunc = function() {

        // this.waversurfer.empty()

        this.loadedTrack = state.selectedTrack;


        if (this.wavesurfer.isPlaying()) {
            this.platterVinyl.classList.remove('rotating');
        }

        const mp3Link = `${this.loadedTrack.stream_url}?client_id=${this.SCKEY2}`





        this.loadingAnimateFunc()

        this.wavesurfer.load(mp3Link);

        let ctx = this.wavesurfer.backend.getAudioContext();

        this.tempoSlider.value = 1000;

        this.platterVinyl.style.backgroundImage = `url('https://pngimg.com/uploads/vinyl/vinyl_PNG21.png')`

        this.vinylArt.style.backgroundImage = `url(${this.loadedTrack.artwork_url})`

        this.currentTrackTitle.innerText = this.loadedTrack.title;
        this.currentTrackArtist.innerText = this.loadedTrack.user.username;
        this.currentTrackGenre.innerText = this.loadedTrack.genre;
        this.currentTrackDuration.innerText = millisecondConvert(this.loadedTrack.duration);



        scrollCheck(this.currentTrackTitle);
        scrollCheck(this.currentTrackArtist);
        scrollCheck(this.currentTrackGenre);
        scrollCheck(this.currentTrackDuration);

        // if (this.currentTrackTitle.clientWidth < this.currentTrackTitle.scrollWidth) {
        //     this.currentTrackTitle.classList.add('scrolling');
        // }



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

        let newBPM = e.target.value/1000 * this.detectedBPM;

        this.wavesurfer.backend.setPlaybackRate(e.target.value/1000);
        this.bpmTxt.innerText= newBPM.toFixed(2);
    }

    this.onDragFunc = function(e) {
        
        e.preventDefault()
    }

    this.onDropFunc = function(e) {
        e.preventDefault();

        this.loadTrackFunc()
    }


    this.zoomModeFunc= function(e) {


        if (e.target.checked){
            this.wavesurfer.zoom(200);
            this.selectedZoomBool = true;
        }else {
            this.wavesurfer.zoom(0);
            this.selectedZoomBool = false;
        }
    }

    this.trackVolFunc = function (e) {

        this.trackVolume.gain.value = e.target.value;

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

    this.tempoSlider = document.getElementById(`tempo${deckNumberString}`);

    this.container = document.querySelector(`.deck${deckNumberString}-container`);

    this.loadingDiv = document.querySelector(`.waveform-loading${deckNumberString}`);

    this.zoomModeSelect = document.getElementById(`slide${deckNumberString}`);

    this.trackVolSlider = document.getElementById(`deck${deckNumberString}vol`);
    
    this.platterVinyl = document.querySelector(`.platter${deckNumberString}`);

    this.vinylArt = document.querySelector(`.disc-artwork${deckNumberString}`);

    this.currentTrackTitle = document.getElementById(`title${deckNumberString}`);

    this.currentTrackArtist = document.getElementById(`artist${deckNumberString}`);

    this.currentTrackGenre = document.getElementById(`genre${deckNumberString}`);

    this.currentTrackDuration = document.getElementById(`duration${deckNumberString}`);

    // this.titleScroll = document.querySelector(`.scroll-container${deckNumberString}`);





    //  event listeners

    this.playBtn.addEventListener('click', this.playFunc.bind(this), false);

    this.pauseBtn.addEventListener('click', this.pauseFunc.bind(this), false);

    this.loadTrackBtn.addEventListener('click', this.loadTrackFunc.bind(this), false);

    this.stopBtn.addEventListener('click', this.stopFunc.bind(this), false);

    this.tempoSlider.addEventListener('input', this.tempoFunc.bind(this), false);

    this.container.addEventListener('dragover', this.onDragFunc.bind(this), false);

    this.container.addEventListener('drop', this.onDropFunc.bind(this), false);

    this.zoomModeSelect.addEventListener('click', this.zoomModeFunc.bind(this), false);

    this.trackVolSlider.addEventListener('input', this.trackVolFunc.bind(this), false);




}

export default Deck;