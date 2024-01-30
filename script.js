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

// function main
async function main() {
      // getting songs list
      const songs = await getSongs();
      // console.log(songs);


      // audio.addEventListener("loadedData",()=>{
      //       console.log(audio.duration())
      // })

      const songDiv = document.getElementById("divCurrentSong");
      songDiv.firstElementChild.firstElementChild.innerHTML = "Name";
      songDiv.lastElementChild.innerHTML = "Song time"
      console.log(songDiv);

      var count = 0;
      var audio = null;

      // songDiv.addEventListener("click",()=>{
      //       if(count%2==0){
      //             // playing first song 
      //             console.log(songs[0]);
      //             audio = new Audio(songs[0]);
      //             audio.play();
      //       }else{
      //             audio.pause();
      //       }
      // })

}

// calling function main
main();