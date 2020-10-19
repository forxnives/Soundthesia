import './scss/index.scss';
import SoundCloudAudio from 'soundcloud-audio';

import KnobCreate from './KnobCreate/KnobCreate.js';

import Deck from './Deck/Deck.js';
import PlayList from './PlayList/PlayList.js';
import State from './State/State.js';
import WaveSurfer from 'wavesurfer.js';


// SCKEY1 = 'a3dd183a357fcff9a6943c0d65664087';
// SCKEY2 = '72e56a72d70b611ec8bcab7b2faf1015';





document.addEventListener('DOMContentLoaded', init, false);





function init(){

  const state = new State();

  // this.functiontest = function(){


  //   // var wavesurfer = WaveSurfer.create({

  //   //     container: '#waveform',
  //   //     waveColor: 'violet',
  //   //     progressColor: 'purple'

  //   // });


  // }


  // const wavesurfer = WaveSurfer.create({
  //   container: '#waveform',
  //   waveColor: 'red',
  //   progressColor: 'purple'
  // });
  
  // wavesurfer.load('https://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');

  


//   var wavesurfer = WaveSurfer.create({
//     container: '#waveform',
//     waveColor: 'violet',
//     progressColor: 'purple'
// });
  
  
  const deck1 = new Deck('1', state);

  const deck2 = new Deck('2', state);

  const playlist = new PlayList(deck2, state);

  

  // const lowShelfKnob = new KnobCreate('.deck1-eq-low');


  

};






console.log('it works mofo');