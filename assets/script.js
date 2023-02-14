// Wrapped code in init function in order to have search history rendered on page load
function initPage() {
    // Element reference variables
    var songEl = document.getElementById("left-container");
    var searchbtnEl = document.getElementById("search-btn");
    var inputEl = document.getElementById("lyric");
    var imgEls = document.querySelectorAll("#gif");
    var modalContainerEl = document.querySelector(".modal");
    var closeModalBtn = document.getElementById("closeModal");
    var modalTitleEl = document.getElementById("modal-title");
    var modalAlbumEl = document.getElementById("modal-album");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    var historyEl = document.getElementById("history");
    var closeModalBtn2 = document.getElementById("closeModal2");
    var clearBtn = document.getElementById("clear-history");
    var viewTracksBtn = document.getElementById("viewTracks");
    var searchHitEl = document.querySelectorAll("#searchHit");
    // API KEY
    var musicMatchAPIKey = "2951db04af2babfa9b673302d170b3e1";

    // Functions
    // Fetch URL for lyrics API
    function getSong(lyricText) {
        fetch("https://stormy-hollows-86205.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=" + lyricText + "&s_track_rating=desc&page_size=10&apikey=" + musicMatchAPIKey)
            .then(function (response) {
                return response.json();
            })
            // Pull data
            .then(function (data) {
                songEl.classList.remove("is-hidden");
                songEl.innerHTML = '';
                // Traverse API data to single out specific object (tracklist)
                var tracksList = data.message.body.track_list;
                // Create for loop for tracklist
                for (let i = 0; i < tracksList.length; i++) {
                    const trackLoop = tracksList[i];
                    // assign variables to different aspects of track data
                    var songTitle = trackLoop.track.track_name;
                    var artistName = trackLoop.track.artist_name;
                    var albumName = trackLoop.track.album_name;

                    // Below code is saved as commented for future feature develeopment
                    // var albumId = trackLoop.track.album_id;

                    // create elements for appending to HTML container, modify class and set attribute to store data for event listener
                    var displaySongHeader = document.createElement("header");
                    displaySongHeader.classList.add("card-header");
                    var displaySongInfo = document.createElement("p");
                    displaySongInfo.setAttribute("class", "card-header-title");
                    displaySongInfo.setAttribute("data-id", albumName);
                    displaySongInfo.innerHTML = ' "' + songTitle + '" by ' + artistName;
                    // Event Listener activates modal and passes target data
                    displaySongInfo.addEventListener("click", function (event) {
                        var selected = event.target.innerText;
                        var album = event.target.getAttribute("data-id");
                        modalContainerEl.classList.add('is-active');
                        modalTitleEl.textContent = selected;
                        modalAlbumEl.textContent = "Album: " + album;
                        // Run Display gif with event target passed
                        displayGif(selected);

                        // Below commented code is saved for future feature development
                        // viewTracksBtn.addEventListener("click", function (event) {
                        //     fetch("https://stormy-hollows-86205.herokuapp.com/https://api.musixmatch.com/ws/1.1/album.tracks.get?album_id=" + album + "&page_size=10&apikey=" + musicMatchAPIKey)
                        //         .then(function (response) {
                        //             return response.json();
                        //         })
                        //         .then(function (data) {
                        //         })
                        // });

                    });

                    // Displays results dynamically
                    displaySongHeader.append(displaySongInfo);
                    songEl.append(displaySongHeader);
                };
            });
    };
    // Fetch URL for GIF image while passing through data stored in event.target from getSong fetch
    function displayGif(selected) {
        fetch('https://api.giphy.com/v1/gifs/search?api_key=nsaxiRBo6n5X0Io8kwVxtfJCkPtL0V2U&q=' + selected + '&limit=20&offset=0&rating=pg-13&lang=en')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var gifResults = data.data;
                for (let i = 0; i < gifResults.length; i++) {
                    const gifUrl = gifResults[i].images.downsized.url;
                    for (let i = 0; i < imgEls.length; i++) {
                        imgEls[i].setAttribute('src', gifUrl);
                    };
                };
            });
    };
    // Dynamically add elements and append looped local storage items
    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");

            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control  column has-text-centered my-2 button is-rounded");
            historyItem.setAttribute("value", searchHistory[i]);
            // Event listeners for history elements to run getSong
            historyItem.addEventListener("click", function () {
                for (let i = 0; i < searchHitEl.length; i++) {
                    searchHitEl[i].innerHTML = '';
                };
                getSong(historyItem.value);
            });
            historyEl.append(historyItem);
        };
    };

    // Run renderSearchHistory on Page Load (if any)
    renderSearchHistory();
    if (searchHistory.length > 0) {
        getSong(searchHistory[searchHistory.length - 1]);
    };
    
    // Button Event Listeners
    // Main Event to run getSong function, push items to local storage, and render
    searchbtnEl.addEventListener("click", function () {
        // Clear previous results load before intiating next
        for (let i = 0; i < searchHitEl.length; i++) {
            searchHitEl[i].innerHTML = '';
        }
        const lyricText = inputEl.value;
        getSong(lyricText);
        searchHistory.push(lyricText);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    });
    // Close modal by clicking 'X'
    closeModalBtn.addEventListener('click', function () {
        modalContainerEl.classList.remove('is-active');
    })
    // Close modal by clicking "Close" button
    closeModalBtn2.addEventListener('click', function () {
        modalContainerEl.classList.remove('is-active');
    })
    // Clears local storage, and displays empty array
    clearBtn.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    })
}
// Run Code on page load
initPage();