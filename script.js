
console.log("Hello")
let currentsong = new Audio()
let songs;
let currfolder;
//get songs from local server
async function getSongs(folder) {
    currfolder = folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let a_link = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < a_link.length; index++) {
        const element = a_link[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    //show all songs in the playlist
    let songul = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                            <img class="invert" src="SVGs/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                            </div>
                            <div class="playnow">
                                <span>PlayNow</span>
                                <img class="invert" src="SVGs/play.svg" alt="">
                            </div> </li>`
    }
    //Attach an event listener to each song
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            PlayMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
}
const PlayMusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track

    if (!pause) {
        currentsong.play()
        play.src = "SVGs/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}

async function main() {

    //get the list of songs
    await getSongs("songs/Alan_Walker")
    PlayMusic(songs[0], true)

    //atttach an event listener to play,previous and next
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "SVGs/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "SVGs/play.svg"
        }
    })
    // get the songs list when a card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            song = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        })
    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            PlayMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            PlayMusic(songs[index + 1])
        }

    })

    //function to convert seconds to minutes and seconds
    function secondsToMinutesSeconds(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    //listen for time update event
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentsong.currentTime)}/
        ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    //listen for song end event
    currentsong.addEventListener("ended", () => {
        play.src = "SVGs/play.svg"
    })
    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
    //add event listener to menu image
    document.querySelector(".menu").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
        document.querySelector(".footer").style.display = "none"
        document.querySelector(".playbar").style.display = "none"
    })
    //add event listener to cross image
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
        document.querySelector(".footer").style.display = "flex"
        document.querySelector(".playbar").style.display = "flex"
    })
    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100
    })
    //add an event to mute the volume
    document.querySelector(".volume>img").addEventListener("click", e => {

        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "Mute.svg")
            currentsong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else {
            e.target.src = e.target.src.replace("Mute.svg", "volume.svg")
            currentsong.volume = 1
            document.querySelector(".range").getElementsByTagName("input")[0].value = 100
        }
    })

}

main() 
