

import '../../node_modules/precision-inputs/css/precision-inputs.fl-controls.css';
import { FLStandardKnob } from 'precision-inputs/common/precision-inputs.fl-controls';


function KnobCreate (knobContainerClass, eqNode, eqNode2) {


    this.knobContainer = document.querySelector(knobContainerClass);


    this.knob = new FLStandardKnob(this.knobContainer);

    eqNode.Q.value = 5;
    

    if (eqNode2) {
        eqNode2.frequency.value = 0;
        eqNode2.Q.value = 5;
    }

    this.knob.addEventListener('dblclick', function(evt) {
        if (eqNode2) {
            eqNode.frequency.value = 24000;
            eqNode2.frequency.value = 0;
        }else {
            eqNode.gain.value = 0;
        }

    })

    this.knob.addEventListener('change', function(evt) {

        if (eqNode2) {
        

            if (evt.target.value <= -30){

                // console.log('less than -30');

                // console.log(840 + (evt.target.value*20));

                eqNode.frequency.value = 840 + (evt.target.value*20);


            }else if (evt.target.value <= -20){

                // console.log('-30 to -20');

                // console.log(1139 + (evt.target.value*30));

                eqNode.frequency.value = 1139 + (evt.target.value*30);


            }else if (evt.target.value <= -10){

                // console.log('-20 to -10');

                // console.log(2517 + (evt.target.value*100));

                eqNode.frequency.value = 2517 + (evt.target.value*100);


            }else if (evt.target.value <= 0){

                // console.log('-10 to 0');

                // console.log(24000 + (evt.target.value*2280));

                eqNode.frequency.value = 24000 + (evt.target.value*2280);

                eqNode2.frequency.value = 0;



            }else if (evt.target.value <= 10){

                // console.log('0 to 10');

                
                // console.log((evt.target.value*20));

                eqNode2.frequency.value = (evt.target.value*20);




            }else if (evt.target.value <= 20){

                // console.log('10 to 20');

                // console.log((evt.target.value*30) - 97);

                eqNode2.frequency.value = (evt.target.value*30) - 97;


            }else if (evt.target.value <= 30){


                // console.log('20 to 30');

                // console.log((evt.target.value*100) - 1503);

                eqNode2.frequency.value = (evt.target.value*100) - 1503;



            }else if (evt.target.value <= 40){

                // console.log('30 to 40');


                // console.log((evt.target.value*2280) - 67193);

                eqNode2.frequency.value = (evt.target.value*2280) - 67193;

            }

        }else {

            eqNode.gain.value = evt.target.value;

        }

    });

    
}

export default KnobCreate;