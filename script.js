async function getsongs() {
    
    let a=await fetch("http://127.0.0.1:5500/songs/")
    let response= await a.text()
    console.log(response)
    let div= document.createElement("div")
    div.innerHTML=response
    let as=div.getElementsByTagName("a")
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
        
    }
    return songs
}
async function main(){
    let songs= await getsongs()
    console.log(songs)

    let songul= document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML=songul.innerHTML +`<li>
                                <img class="invert" src="music.svg" >
                                <div class="info">
                                    <div>${song.replaceAll("%20"," ")}</div>
                                    <div>Artist Name</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="play.svg">
                                </div>

          </li>`
    }
    var audio=new Audio(songs[0])
    audio.play()
    
    audio.addEventListener("loadeddata",()=>{
        console.log(audio.duration, audio.currentSrc, audio.currentTime)
    })
}
main()

// 2.10