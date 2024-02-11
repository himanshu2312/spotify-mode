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
const hamburger = document.getElementById("hamburger");
const currentSong = new Audio("/assets/drive-breakbeat.mp3");
const left = document.getElementById("left");
const close = document.getElementById("close");
const previous = document.getElementById("previous");
const next = document.getElementById("next");

// function to fetch the songs
const getSongs = async () => {
      const response = await fetch(baseUrl);
      const result = await response.text();
      const div = document.createElement("div");
      div.innerHTML = result;
      const songList = Array.from(div.getElementsByTagName("a"));
      const songs = [];
      songList.map((song) => {
            if (song.href.endsWith(".mp3") || song.href.endsWith(".m4a")) {
                  songs.push(song.href);
            }
      })
      // console.log(songs)
      return songs;
}

const handlePlayPause = () => {

      btnPlayPause.addEventListener("click", () => {
            try {
                  if (currentSong.paused) {
                        playMusic();
                  } else {
                        pauseMusic();
                  }
            } catch (e) {
                  // console.error(e.message);
                  console.log("Unabe to handle play and pause clicks")
            }
      })
}

// this function displays the song list to user on web
const displaySongs = (songs) => {
      if (songs.length !== 0) {
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
}

// this function adds click listner to each music item
const addListners = () => {
      Array.from(songUl.getElementsByTagName("li")).forEach((li) => {
            // updating current song if music item is clicked
            li.addEventListener("click", () => {
                  updateCurrentSong(li.getElementsByTagName("b")[0].innerHTML);
                  playMusic();
            })
      })
}

// play music function
const playMusic = () => {
      try {
            pauseMusic();
            currentSong.play();
            btnPlayPause.src = "assets/pause.svg";
      }
      catch (e) {
            // console.error(e.message)
            console.log("Sorry, Unable to play the music");
      }
}

// play music function
const pauseMusic = () => {
      try {
            if (!currentSong.paused) {
                  currentSong.pause();
                  btnPlayPause.src = "assets/play.svg";
            }
      }
      catch (e) {
            // console.error(e.message)
            console.log("Sorry, Unable to pause the music");
      }
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

// this function changes the song files
const updateCurrentSong = async (trackName) => {
      if (trackName === "Drive-breakbeat.mp3") {
            currentSong.src = "/assets/drive-breakbeat.mp3";
      } else {
            currentSong.src = "/songs/" + encodeURIComponent(trackName);
      }
      songName.innerHTML = trackName
      // console.log(currentSong)
      // songTime.innerHTML = `00:00 / ${convertSecondsToMinutesAndSeconds(currentSong.duration)}`
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

// this function open the left menu pannel on the click of hamburger icon
const handleOpenPannel = () => {
      hamburger.addEventListener("click", () => {
            try {
                  left.style.backgroundColor = "black";
                  left.style.width = "min(400px,100vw)"
                  left.style.zIndex = 1
                  left.style.left = 0;
            }
            catch (e) {
                  // console.error(e.message);
                  console.log("Sorry, Unable to open the side menu drawer");
            }
      })
}

// this function close the left menu pannel on the click of hamburger icon
const handleClosePannel = () => {
      close.addEventListener("click", () => {
            try {
                  left.style.left = "-100%";
                  left.style.zIndex = 0
                  left.style.width = "25vw"
            }
            catch (e) {
                  // console.log(e.message)
                  console.log("Sorry, Unable to close the side menu drawer");
            }
      })
}

// this function handles the previous song click and change song accordingly
const handlePrevious = (songs) => {
      previous.addEventListener("click", () => {
            const ind = songs.indexOf(`${baseUrl}${encodeURIComponent(songName.innerHTML)}`)
            if (songName.innerHTML === "Drive-breakbeat.mp3") {
                  updateCurrentSong(`${decodeURIComponent(songs[(songs.length) - 1].split("/songs/")[1])}`)
            }
            else if (ind !== 0) {
                  updateCurrentSong(`${decodeURIComponent(songs[ind - 1].split("/songs/")[1])}`)
            } else {
                  updateCurrentSong("Drive-breakbeat.mp3")
            }
            playMusic();
      })
}

// this function handles the next song click and change song accordingly
const handleNext = (songs) => {
      next.addEventListener("click", () => {
            const ind = songs.indexOf(`${baseUrl}${encodeURIComponent(songName.innerHTML)}`)
            if (songName.innerHTML === "Drive-breakbeat.mp3") {
                  updateCurrentSong(`${decodeURIComponent(songs[0].split("/songs/")[1])}`)
            }
            else if (ind === songs.length - 1) {
                  updateCurrentSong("Drive-breakbeat.mp3")
            } else {
                  updateCurrentSong(`${decodeURIComponent(songs[ind + 1].split("/songs/")[1])}`)
            }
            playMusic();
      })
}

// function main
async function main() {
      try {
            // getting songs list
            var songs = await getSongs();

            // display songs list to user
            displaySongs(songs);
      }
      catch (e) {
            // console.log(e.message);
            console.log("unable to fetch songs and display them in cart")
      }

      // adding event listners to each music item
      addListners();

      // this is a custom function that takes a btn
      // whenever any user hit the btn this will automaticaly play current audio and will pause it on another click
      handlePlayPause()

      try {
            // this function handles the next song click and change song accordingly
            handleNext(songs)
            // this function handles the previous song click and change song accordingly
            handlePrevious(songs)
      }
      catch (e) {
            // console.log(e.message);
            console.log("unable to handle next and previous clicks")
      }

      // this function changes the song timing and duration according to music
      handleTimeUpdate();

      // this function handles the handle seekbar click and change song time accordingly
      handleSeekbarClick();

      // this function add click listener to hamburger icon
      handleOpenPannel();

      // this function add click listener to close icon
      handleClosePannel();
}

// calling function main
main();