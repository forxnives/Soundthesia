
import SoundCloudAudio from 'soundcloud-audio';
import { FLStandardKnob } from '../../node_modules/precision-inputs/common/precision-inputs.fl-controls';
import KnobCreate from '../KnobCreate/KnobCreate';

// SCKEY1 = 'a3dd183a357fcff9a6943c0d65664087';
// SCKEY2 = '72e56a72d70b611ec8bcab7b2faf1015';



function Deck (deckNumberString, state) {

    //  State   //
    this.loadedTrack = null;


    //using soundcloud dependancy 
    this.scPlayer = new SoundCloudAudio('72e56a72d70b611ec8bcab7b2faf1015');


    //instantiating web audio API audioContext
    this.audioContext = new AudioContext();

    //avoiding CORS error
    this.scPlayer.audio.crossOrigin = 'anonymous';

    //connecting soundcloud player html element to audioContext
    this.startNode = this.audioContext.createMediaElementSource(this.scPlayer.audio);

    //instantiating eq nodes


    this.lowShelf = this.audioContext.createBiquadFilter();
    this.lowShelf.type = 'lowshelf';
    this.lowShelf.frequency.value = 300;

    this.midBand = this.audioContext.createBiquadFilter();
    this.midBand.type = 'peaking';
    this.midBand.frequency.value = 1000;

    this.highBand = this.audioContext.createBiquadFilter();
    this.highBand.type = 'highshelf';
    this.highBand.frequency.value = 1000;


    this.lowPass = this.audioContext.createBiquadFilter();
    this.lowPass.type = 'lowpass';
    this.lowPass.frequency.value = 24000;
    this.lowPass.Q.value = 0

    this.highPass = this.audioContext.createBiquadFilter();
    this.highPass.type = 'highpass';

    


    //routing nodes

    this.startNode.connect(this.lowShelf);
    this.lowShelf.connect(this.midBand);
    this.midBand.connect(this.highBand);

    this.highBand.connect(this.lowPass);

    this.lowPass.connect(this.highPass);
    this.highPass.connect(this.audioContext.destination);



    // Methods

    this.playFunc = function () {


        this.audioContext.resume().then(() => {


            this.scPlayer.play({
                // streamUrl: 'https://api.soundcloud.com/tracks/185533328/stream'
                // streamUrl: "https://api.soundcloud.com/tracks/774880408/stream"
                streamUrl: `${this.loadedTrack.uri}/stream`
                });
            
        });

    }


    this.pauseFunc = function () {


        this.scPlayer.pause()

        // this.startNode.mediaElement.playbackRate = 2

    }

    this.loadTrackFunc = function() {

        this.loadedTrack = state.selectedTrack;
        

        
        
    }




    // instantiating knobs

    this.highKnob = new KnobCreate(`.deck${deckNumberString}-eq-high`, this.highBand)
    this.midKnob = new KnobCreate(`.deck${deckNumberString}-eq-mid`, this.midBand);
    this.lowShelfKnob = new KnobCreate(`.deck${deckNumberString}-eq-low`, this.lowShelf);
    this.filterKnob = new KnobCreate(`.deck${deckNumberString}-eq-filter`, this.lowPass, this.highPass );


    // Selectors

    this.playBtn = document.querySelector(`.deck${deckNumberString}-transport-play`);

    this.pauseBtn = document.querySelector(`.deck${deckNumberString}-transport-pause`);

    this.loadTrackBtn = document.querySelector(`.deck${deckNumberString}-panel .loadBtn`)




    //  event listeners

    this.playBtn.addEventListener('click', this.playFunc.bind(this), false);

    this.pauseBtn.addEventListener('click', this.pauseFunc.bind(this), false);

    this.loadTrackBtn.addEventListener('click', this.loadTrackFunc.bind(this), false);



}

export default Deck;