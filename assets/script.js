//OMDB Fetch URL code
// fetch('https://www.omdbapi.com/?r=json&t=superman&apikey=7c3e482d')
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         console.log(data);
//     })


//music match api key:    '2951db04af2babfa9b673302d170b3e1'
var songEl = document.getElementById('test');
var searchbtnEl = document.getElementById('search-btn');
var inputEl = document.getElementById('lyric');


function getSong(lyricText) {
    fetch('https://stormy-hollows-86205.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=' + lyricText + '&s_track_rating=DESC&s_track_release_date=DESC&country=US&page_size=20&apikey=2951db04af2babfa9b673302d170b3e1')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var tracksList = data.message.body.track_list;

            for (let i = 0; i < tracksList.length; i++) {
                const trackLoop = tracksList[i];
                var songTitle = trackLoop.track.track_name;
                var artistName = trackLoop.track.artist_name;
                var displaySongInfo = document.createElement('p');
                displaySongInfo.innerHTML = songTitle + ' by ' + artistName;
                songEl.append(displaySongInfo);
                displaySongInfo.setAttribute('style', 'margin-top: 10px', 'margin-bottom: 10px');
                console.log(trackLoop);
            }
        })
}

searchbtnEl.addEventListener('click', function () {
    var lyricText = inputEl.value;
    getSong(lyricText);
   
})