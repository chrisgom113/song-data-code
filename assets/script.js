//music match api key:    '2951db04af2babfa9b673302d170b3e1'
function initPage () {
    var songEl = document.getElementById("left-container");
    var searchbtnEl = document.getElementById("search-btn");
    var inputEl = document.getElementById("lyric");
    var musicMatchAPIKey = "2951db04af2babfa9b673302d170b3e1";
    var imgEls = document.querySelectorAll("#gif");
    var modalContainerEl = document.querySelector(".modal");
    var closeModalBtn = document.getElementById("closeModal");
    var modalTitleEl = document.getElementById("modal-title");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    var historyEl = document.getElementById("history");
    var closeModalBtn2 = document.getElementById("closeModal2");
    var clearBtn = document.getElementById("clear-history");
    
    function getSong(lyricText) {
    
        fetch(
            "https://stormy-hollows-86205.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=" +
            lyricText +
            "&s_track_rating=desc&page_size=10&apikey=" +
            musicMatchAPIKey
        )
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                songEl.classList.remove("is-hidden");
                var searchHitContainerEl = document.querySelectorAll("#searchHit");
                for (i = 0; i < searchHitContainerEl.length; i++) {
                    searchHitContainerEl[i].innerHTML = '';
                    var tracksList = data.message.body.track_list;
                    for (let i = 0; i < tracksList.length; i++) {
                        const trackLoop = tracksList[i];
                        var songTitle = trackLoop.track.track_name;
                        var artistName = trackLoop.track.artist_name;
                        var albumId = trackLoop.track.album_id;
                        var albumName = trackLoop.track.album_name;
                        var displaySongInfo = document.createElement("p");
                        displaySongInfo.setAttribute(
                            "class",
                            "card-header-title is-centered"
                        );
                        displaySongInfo.innerHTML = ' "' + songTitle + '" by ' + artistName;
                        displaySongInfo.addEventListener("click", function (event) {
                            var selected = event.target.innerText;
                            modalContainerEl.classList.add('is-active');
                            modalTitleEl.textContent = selected;
                            displayGif(selected);
                        });
                        searchHitContainerEl[i].append(displaySongInfo);
                    }
                }
            });
    }
    
    
    
    function displayGif(selected) {
        fetch('https://api.giphy.com/v1/gifs/search?api_key=nsaxiRBo6n5X0Io8kwVxtfJCkPtL0V2U&q=' + selected + '&limit=3&offset=0&rating=pg-13&lang=en')
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
    
    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
                getSong(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }
    
    renderSearchHistory();
    if (searchHistory.length > 0) {
        getSong(searchHistory[searchHistory.length - 1]);
    }
    
    searchbtnEl.addEventListener("click", function () {
        const lyricText = inputEl.value;
        getSong(lyricText);
        searchHistory.push(lyricText);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    });
    
    closeModalBtn.addEventListener('click', function () {
        modalContainerEl.classList.remove('is-active');
    
    })

    closeModalBtn2.addEventListener('click', function () {
        modalContainerEl.classList.remove('is-active');
    
    })

    clearBtn.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    })
}
initPage();