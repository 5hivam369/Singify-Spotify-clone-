let currentsong = new Audio()
let songs
let currfolder

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currfolder=folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                                <img class="invert" src="music.svg" >
                                <div class="info">
                                    <div>${song.replaceAll("%20", " ")}</div>
                                    <div>Artist Name</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="play.svg">
                                </div>

          </li>`
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
}

const playMusic = (track, pause = false) => {
    let audio = new Audio(`http://127.0.0.1:5500/${currfolder}/` + track)
    currentsong.src = `http://127.0.0.1:5500/${currfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayAlbumbs(){
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    let card_container=document.querySelector(".card_container")
    div.innerHTML = response
    let anchors= div.getElementsByTagName("a")
    let array= Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
        if(e.href.includes("/songs/")){
           let folder =e.href.split("/").slice(-1)[0]
           //metadata of folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json()
            console.log(response)
            card_container.innerHTML=card_container.innerHTML + `<div data-folder="Weeknd" class="card">
                        <div  class="playbtn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"
                                    stroke-linejoin="round" fill="#000" />
                            </svg>
                        </div>
                        <img src="http://127.0.0.1:5500/songs/${folder}/cover.jpg">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }
    //card click
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{ 
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            
        })
    })
}

async function main() {

    await getsongs("songs/Weeknd")
    console.log(songs)
    playMusic(songs[0], true)

    //Display albums
    displayAlbumbs()
    
    //play pause
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })
    //timeupdate
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })
    //seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
    //hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    //previous & next
    prev.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
    //volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100
    })
    
}
main()

