
import SoundCloudAudio from 'soundcloud-audio';
import { FLStandardKnob } from '../../node_modules/precision-inputs/common/precision-inputs.fl-controls';
import KnobCreate from '../KnobCreate/KnobCreate';

// SCKEY1 = 'a3dd183a357fcff9a6943c0d65664087';
// SCKEY2 = '72e56a72d70b611ec8bcab7b2faf1015';



function Deck (deckNumberString) {

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





    //routing nodes

    this.startNode.connect(this.lowShelf);
    this.lowShelf.connect(this.audioContext.destination);





    // Methods

    this.playFunc = function () {


        this.audioContext.resume().then(() => {

        this.scPlayer.play({
            streamUrl: 'https://api.soundcloud.com/tracks/185533328/stream'
            });
        });

    }



    // instantiating knobs

    this.highKnob = new KnobCreate(`.deck${deckNumberString}-eq-high`)
    this.midKnob = new KnobCreate(`.deck${deckNumberString}-eq-mid`);
    this.lowShelfKnob = new KnobCreate(`.deck${deckNumberString}-eq-low`, this.lowShelf);
    this.filterKnob = new KnobCreate(`.deck${deckNumberString}-eq-filter`);


    // Selectors

    this.playBtn = document.querySelector(`.deck${deckNumberString}-transport-play`)


    //  event listeners

    this.playBtn.addEventListener('click', this.playFunc.bind(this), false);



}

export default Deck;