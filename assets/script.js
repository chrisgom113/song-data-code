//music match api key:    '2951db04af2babfa9b673302d170b3e1'
var songEl = document.getElementById("left-container");
var searchbtnEl = document.getElementById("search-btn");
var inputEl = document.getElementById("lyric");
var musicMatchAPIKey = "2951db04af2babfa9b673302d170b3e1";
var imgEls = document.querySelectorAll("#gif");
var resetBtnEl = document.getElementById("resetBtnEl");
var displaySongInfo;
var modalContainerEl = document.querySelector(".modal")


function getSong(lyricText) {



    fetch(
        "https://stormy-hollows-86205.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=" +
        lyricText +
        "&s_track_rating=DESC&s_track_release_date=DESC&country=US&page_size=10&apikey=" +
        musicMatchAPIKey
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {


            var searchHitContainerEl = document.querySelectorAll("#searchHit");
            for (i = 0; i < searchHitContainerEl.length; i++) {
                searchHitContainerEl[i].innerHTML = '';
                var tracksList = data.message.body.track_list;
                for (let i = 0; i < tracksList.length; i++) {
                    const trackLoop = tracksList[i];
                    var songTitle = trackLoop.track.track_name;
                    var artistName = trackLoop.track.artist_name;
                    var albumId = trackLoop.track.album_id;
                    var displaySongInfo = document.createElement("p");
                    displaySongInfo.setAttribute(
                        "class",
                        "card-header-title is-centered"
                    );
                    displaySongInfo.innerHTML = ' "' + songTitle + '" by ' + artistName;
                    displaySongInfo.addEventListener("click", function (event) {
                        var selected = event.target.innerText
                        modalContainerEl.classList.add('is-active');
                        displayGif(selected);
                    });
                    searchHitContainerEl[i].append(displaySongInfo);
                      
                }
            }


        });
}

// function runModal (songTitle) {
//     modalContainerEl.classList.add('is-active');

//     displayGif(songTitle);
// }



function displayGif(selected) {
    fetch('https://api.giphy.com/v1/gifs/search?api_key=nsaxiRBo6n5X0Io8kwVxtfJCkPtL0V2U&q=' + selected + '&limit=6&offset=0&rating=g&lang=en')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            var gifResults = data.data

            for (let i = 0; i < gifResults.length; i++) {
                const gifUrl = gifResults[i].images.downsized.url;
                console.log(gifUrl);
                for (let i = 0; i < imgEls.length; i++) {
                    imgEls[i].setAttribute('src', gifUrl);

                }
            }
        })

}



searchbtnEl.addEventListener("click", function () {

    if(!displaySongInfo === undefined) {
       songEl.innerHTML = ''; 
    }
    

    var lyricText = inputEl.value;
    getSong(lyricText);
});

