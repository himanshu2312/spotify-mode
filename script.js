// accesding DOM Elements to manipulate them on user interaction
const songDiv = document.getElementById("divCurrentSong");
const songName = songDiv.firstElementChild.firstElementChild;
const songTime = songDiv.lastElementChild.firstElementChild;
const btnPlay = songDiv.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling;
const songUl = document.querySelector(".songs");
var currentSong = {};

// function to fetch the songs
const getSongs = async () => {
      const response = await fetch("http://192.168.43.59:3000/songs/");
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

const handlePlayPause = (audio, btnPlay) => {

      // initialising counter to keep track of play and pause
      var count = 0;

      btnPlay.addEventListener("click", () => {
            try {
                  console.log("click")
                  if (count === 0) {
                        count++;
                        audio.play();
                        console.log(audio.duration);
                        console.log(audio.currentTime);
                  } else {
                        count--;
                        audio.pause();
                        console.log(audio.duration);
                        console.log(audio.currentTime);
                  }
            } catch (e) {
                  console.log(e.message)
            }
      })

}

// this function displays the song list to user on web
const displaySongs = (songs) => {
      songs?.map((song)=>{
            songUl.innerHTML = songUl.innerHTML + `<li>${decodeURIComponent(song.split("/songs/")[1])}</li>`;
            // songItem.addEventListener("click",()=>{
            //       console.log("assigning current to " + song)
            //       currentSong = song;
            // })
      })
}

// function main
async function main() {
      // getting songs list
      const songs = await getSongs();

      // current song file
      currentSong = songs[0];

      // display songs list to user
      displaySongs(songs);

      // initialising a audio type object to play and pause the song in backend
      var audio = new Audio(currentSong);

      // this is a custom function that takes and sudio file & a btn
      // whenever any user hit the btn this will automaticaly play that audio and will pause it on another click
      handlePlayPause(audio, btnPlay)

}

// calling function main
main();