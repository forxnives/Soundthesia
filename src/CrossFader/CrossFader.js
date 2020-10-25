function CrossFader(deck1Gain, deck2Gain) {


    // this.deck1GainNode = deck1WaveSurfer.backend.createVolumeNode();
    // this.deck2GainNode = deck2WaveSurfer.backend.createVolumeNode();

    // console.log(deck1Gain.gain.value);



    // createVolumeNode() {
    //     // Create gain node using the AudioContext

    //     if (this.ac.createGain) {
    //         this.gainNode = this.ac.createGain();
    //     } else {
    //         this.gainNode = this.ac.createGainNode();
    //     }

    //     // Add the gain node to the graph


    //     this.gainNode.connect(this.ac.destination);
    // }


    //  Methods     //

    this.positionCalc = function (position) {
        // position will be between 0 and 100
        var minp = 0;
        var maxp = 90;
      
        // The result should be between 100 an 10000000
        var minv = Math.log(1);
        var maxv = Math.log(100);
      
        // calculate adjustment factor
        var scale = (maxv-minv) / (maxp-minp);
      
        return Math.exp(minv + scale*(position-minp));

      }



    this.crossFadeFunc = function(evt) {


        // console.log(1 - this.positionCalc(evt.target.value)/100);

        if (evt.target.value > 89) {
            // console.log(deck1Gain.gain.value)
            // console.log((1 - evt.target.value/100)/2)


            deck1Gain.gain.value = (1 - evt.target.value/100)/2
            deck2Gain.gain.value = 1 - this.positionCalc(100 - evt.target.value)/100;
            // console.log(1 - this.positionCalc(100 - evt.target.value)/100)
            // console.log(deck2Gain.gain.value)


        }else if(evt.target.value < 11){
            
            deck1Gain.gain.value = 1 - this.positionCalc(evt.target.value)/100;
            deck2Gain.gain.value = (1 - (100 -evt.target.value)/100)/2;
            


        }else{
            deck1Gain.gain.value = 1 - this.positionCalc(evt.target.value)/100;
            deck2Gain.gain.value = 1 - this.positionCalc(100 - evt.target.value)/100;

        }






            // console.log(deck1Gain.gain.value)
    }



    this.crossFadeDblClick = function(evt) {
        // console.log(evt.target.value);
        evt.target.value = 50;
        this.crossFadeFunc(evt);
    }


    //  selectors   //

    this.crossFadeSlider = document.getElementById('crossfader');

    //  event Handlers  //

    this.crossFadeSlider.addEventListener('input', this.crossFadeFunc.bind(this), false); 

    this.crossFadeSlider.addEventListener('dblclick', this.crossFadeDblClick.bind(this), false);




}


export default CrossFader;