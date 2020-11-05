import { millisecondConvert } from '../utils';

function PlayList (deck, state) {


    //  state   //

    this.selectedTrack = null;


    //  Selectors   //


    this.searchInput = document.querySelector('.search-input');

    this.addBtn = document.querySelector('.addbtn');

    this.clearAllBtn = document.querySelector('.clearbtn');

    this.tableBodySelect = document.querySelector('.tablebody');





    //  Methods //



    this.addTrackFunc = function(url) {

        const self = this;

        deck.scPlayer.resolve(url, function(scObj){


            if (scObj.kind === 'playlist' ){

                scObj.tracks.forEach((trk)=>{
                    self.trCreateFunc(trk)
                });


            }else {

                self.trCreateFunc(scObj)
            }

            } )

        this.searchInput.value = '';

    }


    this.dragStartFunc = function(e, track){

        state.selectedTrack = track
        // e.dataTransfer.setData("track", track);
    }



    this.trCreateFunc = function(track) {

        const self = this;

        const tableRow = document.createElement('tr');

        tableRow.setAttribute('draggable', true);

        tableRow.id =document.querySelectorAll('tr').length - 1;

        tableRow.addEventListener('dragstart', function(e){

            self.dragStartFunc (e, track)

        })

        tableRow.addEventListener('click', function(e){

            self.selectTrFunc(e, track);

        });
        
        tableRow.innerHTML =`
        
        <td> <img style="max-height: 40px;" src=${track.artwork_url}></img> </td>
        <td>${track.title}</td>
        <td>${track.user.username}</td>
        <td>${track.genre}</td>
        <td>${millisecondConvert(track.duration)}</td>
        <td>${track.release_year}</td>
        
        `;

        this.tableBodySelect.appendChild(tableRow);

    }



    this.selectTrFunc = function(evt, track) {


        // console.log(track)


        if (this.selectedTrack){

            if (evt.target.parentElement.id === this.selectedTrack.id){

                this.selectedTrack.classList.remove('anotherclass')
                this.selectedTrack = null;
                state.selectedTrack = null;
                
            }else {
                this.selectedTrack.classList.remove('anotherclass')
                this.selectedTrack = evt.target.parentElement;
                this.selectedTrack.classList.add('anotherclass')
                state.selectedTrack = track;
            }

        }else{

            evt.target.parentElement.classList.add("anotherclass");
            this.selectedTrack = evt.target.parentElement;
            state.selectedTrack = track;

        }

    }



    this.clearAllFunc = function(tableBody){

        tableBody.innerHTML = '';
    }


    //  event listeners //


    // this.addBtn.addEventListener('click', () => this.addTrackFunc(this.searchInput.value));
    this.addBtn.addEventListener('click', () => this.addTrackFunc(this.searchInput.value));
    this.clearAllBtn.addEventListener('click', () => this.clearAllFunc(this.tableBodySelect));


}




export default PlayList;