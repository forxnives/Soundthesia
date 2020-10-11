import './scss/index.scss';
import SoundCloudAudio from 'soundcloud-audio';

import KnobCreate from './KnobCreate/KnobCreate.js';

import Deck from './Deck/Deck.js';


// SCKEY1 = 'a3dd183a357fcff9a6943c0d65664087';
// SCKEY2 = '72e56a72d70b611ec8bcab7b2faf1015';


document.addEventListener('DOMContentLoaded', init, false);



function init(){


  const deck1 = new Deck('1');

  const deck2 = new Deck('2');

  // const lowShelfKnob = new KnobCreate('.deck1-eq-low');

  

};






console.log('it works mofo');