

function PlayList (deck) {


    //  state   //

    this.selectedTrack = null;


    //  Selectors   //


    this.searchInput = document.querySelector('.search-input');

    this.addBtn = document.querySelector('.addbtn');

    this.clearAllBtn = document.querySelector('.clearbtn');

    this.tableBodySelect = document.querySelector('.tablebody');

    console.log(this.tableBodySelect)





    //  Methods //

    this.addTrackFunc = function(url) {

        const self = this;

        deck.scPlayer.resolve(url, function(track){

            self.trCreateFunc(track)

            } )

    }




    this.trCreateFunc = function(track) {

        const self = this;

        const tableRow = document.createElement('tr');

        tableRow.id =document.querySelectorAll('tr').length - 1;

        tableRow.addEventListener('click', function(e){

            self.selectTrFunc(e);

        });
        
        tableRow.innerHTML =`
        
        <td> <img style="max-height: 40px;" src=${track.artwork_url}></img> </td>
        <td>${track.title}</td>
        <td>${track.user.username}</td>
        <td>${track.genre}</td>
        <td>${this.millisecondConvert(track.duration)}</td>
        <td>${track.release_year}</td>
        
        `;

        this.tableBodySelect.appendChild(tableRow);

    }





    this.millisecondConvert = function (millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
      }






    this.selectTrFunc = function(evt) {


        if (this.selectedTrack){

            if (evt.target.parentElement.id === this.selectedTrack.id){

                this.selectedTrack.classList.remove('anotherclass')
                this.selectedTrack = null;
                
            }else {
                this.selectedTrack.classList.remove('anotherclass')
                this.selectedTrack = evt.target.parentElement;
                this.selectedTrack.classList.add('anotherclass')
            }

        }else{

            evt.target.parentElement.classList.add("anotherclass");
            this.selectedTrack = evt.target.parentElement;

        }

    }




    this.clearAllFunc = function(tableBody){

        tableBody.innerHTML = '';
    }






    //  event listeners //


    this.addBtn.addEventListener('click', () => this.addTrackFunc(this.searchInput.value));

    this.clearAllBtn.addEventListener('click', () => this.clearAllFunc(this.tableBodySelect));


}




export default PlayList;