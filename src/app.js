import './scss/index.scss';
import SoundCloudAudio from 'soundcloud-audio';

import KnobCreate from './KnobCreate/KnobCreate.js';

import Deck from './Deck/Deck.js';
import PlayList from './PlayList/PlayList.js';
import State from './State/State.js';
import WaveSurfer from 'wavesurfer.js';
import CrossFader from './CrossFader/CrossFader';



// SCKEY1 = 'a3dd183a357fcff9a6943c0d65664087';
// SCKEY2 = '72e56a72d70b611ec8bcab7b2faf1015';





document.addEventListener('DOMContentLoaded', init, false);





function init(){

  const state = new State();

  const deck1 = new Deck('1', state);

  const deck2 = new Deck('2', state);

  const playlist = new PlayList(deck2, state);

  const crossfader = new CrossFader (deck1.crossFaderGain, deck2.crossFaderGain)

  // console.log(deck1.wavesurfer.backend.createVolumeNode)




};






console.log('it works mofo');