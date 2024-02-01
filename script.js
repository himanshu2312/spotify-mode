// declaring base url or address of songs
const baseUrl = "http://192.168.43.59:3000/songs/";

// accesding DOM Elements to manipulate them on user interaction
const playbar = document.getElementById("playbar");
const songName = playbar.firstElementChild.firstElementChild;
const songTime = playbar.lastElementChild.previousElementSibling.firstElementChild;
const btnPlayPause = document.getElementById("play/pause")
const songUl = document.querySelector(".songs");
const pointer = document.getElementById("pointer");
const seekbar = document.getElementById("seekbar");
var currentSong = new Audio("/assets/drive-breakbeat.mp3");

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

const handlePlayPause = (btnPlayPause) => {

      btnPlayPause.addEventListener("click", () => {
            try {
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
      btnPlayPause.src = "assets/pause.svg"
}

// play music function
const pauseMusic = () => {
      if (!currentSong.paused) {
            currentSong.pause();
            btnPlayPause.src = "assets/play.svg"
      }
}

const updateCurrentSong = (trackName) => {
      if (trackName === "Drive-breakbeat.mp3") {
            currentSong.src = "/assets/drive-breakbeat.mp3";
      } else {
            currentSong.src = "/songs/" + encodeURIComponent(trackName);
      }
      songName.innerHTML = trackName
}

// this function converts seconds to m:s formate
function convertSecondsToMinutesAndSeconds(seconds) {
      if (isNaN(seconds) || seconds < 0) {
            return "00:00";
      }

      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);

      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(remainingSeconds).padStart(2, "0");

      return `${formattedMinutes}:${formattedSeconds}`;
}

// function to update song duration and time
const handleTimeUpdate = () => {
      currentSong.addEventListener("timeupdate", () => {
            songTime.innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)} / ${convertSecondsToMinutesAndSeconds(currentSong.duration)}`
            pointer.style.width = `${(currentSong.currentTime / currentSong.duration) * 100}%`;
            if (currentSong.currentTime === currentSong.duration) {
                  btnPlayPause.src = "assets/play.svg";
                  pointer.style.width = `0%`;
            }
      })
}

// this function handles the handle seekbar click andchange song time accordingly
const handleSeekbarClick = () => {
      seekbar.addEventListener("click", (e) => {
            const base = e.target.getBoundingClientRect().width;
            const percent = (e.offsetX / base) * 100;
            currentSong.currentTime = (percent * currentSong.duration) / 100;
            pointer.style.width = `${percent}%`;
      })
}

// function main
async function main() {
      // getting songs list
      const songs = await getSongs();

      // display songs list to user
      displaySongs(songs);

      // adding event listners to each music item
      addListners();

      // this is a custom function that takes a btn
      // whenever any user hit the btn this will automaticaly play current audio and will pause it on another click
      handlePlayPause(btnPlayPause)

      // this function changes the song timing and duration according to music
      handleTimeUpdate();

      // this function handles the handle seekbar click andchange song time accordingly
      handleSeekbarClick();

}

// calling function main
main();