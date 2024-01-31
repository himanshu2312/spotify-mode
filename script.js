// declaring base url or address of songs
const baseUrl = "http://192.168.43.59:3000/songs/";

// accesding DOM Elements to manipulate them on user interaction
const songDiv = document.getElementById("divCurrentSong");
const songName = songDiv.firstElementChild.firstElementChild;
const songTime = songDiv.lastElementChild.firstElementChild;
const btnPlay = document.getElementById("play/pause")
const songUl = document.querySelector(".songs");
var currentSong = new Audio();

// function to fetch the songs
const getSongs = async () => {
      const response = await fetch(baseUrl);
      const result = await response.text()
      const div = document.createElement("div")
      div.innerHTML = result;
      const songList = Array.from(div.getElementsByTagName("a"));
      const songs = [];
      songList.map((song) => {
            if (song.href.endsWith(".mp3") || song.href.endsWith(".m4a")) {
                  songs.push(song.href);
            }
      })
      return songs;
}

const handlePlayPause = (btnPlay) => {

      btnPlay.addEventListener("click", () => {
            try {
                  console.log("click")
                  if (currentSong.paused) {
                        playMusic();
                  } else {
                        pauseMusic();
                  }
            } catch (e) {
                  console.log(e.message)
            }
      })

}

// this function displays the song list to user on web
const displaySongs = (songs) => {
      songs?.map((song) => {
            songUl.innerHTML = songUl.innerHTML + `<li class="my-2">
                  <img class="invert" src="assets/music.svg" alt="music">
                  <div class="info">
                        <div><b>${decodeURIComponent(song.split("/songs/")[1])}</b></div>
                        <div>Music Artist</div>
                  </div>
                  <div class="play-now flex items-center">
                        <span>play now</span>
                        <img class="invert" src="assets/play.svg" alt="">
                  </div>
            </li>`;
      })
}

// this function adds click listner to each music item
const addListners = () => {
      Array.from(songUl.getElementsByTagName("li")).forEach((li) => {
            // updating current song if music item is clicked
            li.addEventListener("click", () => {
                  
                  updateCurrentSong(li.querySelector(".info").firstElementChild.firstElementChild.innerHTML)
                  playMusic();
            })
      })
}

// play music function
const playMusic = () => {
      pauseMusic();
      currentSong.play();
      btnPlay.src="assets/pause.svg"
}

// play music function
const pauseMusic = () => {
      if (!currentSong.paused) {
            currentSong.pause();
            btnPlay.src="assets/play.svg"
      }
}

const updateCurrentSong = (trackName) => {
      console.log(trackName)
      currentSong.src = "/songs/" + encodeURIComponent(trackName);
      songName.innerHTML = trackName
}

// function main
async function main() {
      // getting songs list
      const songs = await getSongs();

      // current song file
      // currentSong = songs[0]

      // display songs list to user
      displaySongs(songs);

      // adding event listners to each music item
      addListners();

      // this is a custom function that takes a btn
      // whenever any user hit the btn this will automaticaly play current audio and will pause it on another click
      handlePlayPause(btnPlay)

}

// calling function main
main();