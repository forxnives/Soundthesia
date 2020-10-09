

import '../../node_modules/precision-inputs/css/precision-inputs.fl-controls.css';
import { FLStandardKnob } from 'precision-inputs/common/precision-inputs.fl-controls';


function KnobCreate (knobContainerClass, eqNode) {


    // this.knobContainer = document.querySelector(`${knobContainerClass}`);
    this.knobContainer = document.querySelector(knobContainerClass);


    // setTimeout(function() {console.log(this.knobContainer)}, 3000);

    this.knob = new FLStandardKnob(this.knobContainer);

    // console.log(callback)



        // retrieve value
    // const currentValue = myKnob.value;



    // // set value
    // this.knob.value = 0.5;

    // watch for changes


    this.knob.addEventListener('change', function(evt) {

        eqNode.gain.value = evt.target.value;

    });

    
}

export default KnobCreate;