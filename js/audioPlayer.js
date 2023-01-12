import helpers from './helpers.js'

const {create, secToTime} = helpers

class Player {
    constructor (path) {
        this.player = create('audio')
        this.player.src = path

        this.player.addEventListener('timeupdate', this.updateProgress)

        this.controlBtn = create('div')
        this.progressLabel = create('div')
        this.currentTime = create('span')
        this.duration = create('span')
        this.volumeLabel = create('div')

        this.isPlaying = false
    }

    play() {
        this.switchButton()
        this.player.play()
    }
    _play() {  //for service sounds
        this.setVolume()
        this.player.play()
    }
    setVolume() {
        const volume = localStorage.getItem('volume')
        if(volume) {
            this.player.volume = volume
        } else {
            localStorage.setItem('volume', '0.6')
        }
    }
    pause() {
        this.switchButton()
        this.player.pause()
    }
    switchButton() {
        const  [play, pause] = this.controlBtn.childNodes
        play.className = this.isPlaying ? 'hide' : ''
        pause.className = this.isPlaying ? '' : 'hide'
        this.isPlaying = !this.isPlaying
    }
    init() {
        return this.player
    }
    getNode() {
        this.player.loop = true

        const playerContainer = create('div')
        playerContainer.className = 'sound-player'

        this.controlBtn.className = 'sound-player__play'
        const imgPlay = create('img')
        imgPlay.src = 'assets/svg/play.png'
        imgPlay.alt = 'play button'
        imgPlay.onclick = () => this.play()
        const imgPause = create('img')
        imgPause.src = 'assets/svg/pause.png'
        imgPause.alt = 'pause button'
        imgPause.onclick = () => this.pause()
        this.controlBtn.replaceChildren(imgPlay, imgPause)

        const progressContainer = create('div')
        progressContainer.className = 'sound-player__progress'
        this.progressLabel.className = 'sound-player__progress-label'
        progressContainer.appendChild(this.progressLabel)
        progressContainer.addEventListener('click', this.changeProgress)


        const timeContainer = create('div')
        timeContainer.className = 'sound-player__time'
        timeContainer.replaceChildren(this.currentTime, '/', this.duration)
        this.currentTime.innerText = '0:00'
        this.duration.innerText = '0:00'

        const volumeContainer = create('div')
        volumeContainer.className = 'sound-player__volume'
        this.volumeLabel.className = 'sound-player__volume-label'
        volumeContainer.appendChild(this.volumeLabel)
        volumeContainer.addEventListener('click', this.updateVolume)

        const soundIcon = create('div')
        soundIcon.className = 'sound-player__icon'
        const iconImage = create('img')
        iconImage.className = 'sound-player__icon-image'
        iconImage.src = 'assets/svg/sound.png'
        iconImage.alt = 'sound icon'
        soundIcon.append(iconImage)

        playerContainer.append(this.controlBtn)
        playerContainer.append(progressContainer)
        playerContainer.append(timeContainer)
        playerContainer.append(volumeContainer)
        playerContainer.append(soundIcon)
        this.switchButton()
        this.updateVolume()

        return playerContainer
    }
    updateProgress = () => {
        const {duration, currentTime} = this.player
        const currentTimeRounded = Math.ceil(currentTime),
            durationRounded = Math.ceil(duration)
        this.currentTime.innerText = secToTime(currentTimeRounded)
        this.duration.innerText = secToTime(durationRounded)
        const percent = (currentTime / duration) * 100
        this.progressLabel.style.width = `${percent}%`
        //if (currentTimeRounded === durationRounded) this.pause()
    } 
    changeProgress = (e) => {
        if(e) {
            const {duration} = this.player
            const widthBlock = e.currentTarget.clientWidth
            const clickX = e.offsetX
            const progress = clickX / widthBlock
            this.player.currentTime = duration * progress
        }
    }
    updateVolume = (e) => {
        if(e) {
            const widthBlock = e.currentTarget.clientWidth
            const clickX = e.offsetX
            const volume = clickX / widthBlock
            this.player.volume = volume
            this.volumeLabel.style.width = `${volume * 100}%`
            localStorage.setItem('volume', volume)
        } else {
            const volume = localStorage.getItem('volume')
            if(volume) {
                this.player.volume = volume
                this.volumeLabel.style.width = `${volume * 100}%`
            } else {
                localStorage.setItem('volume', '0.6')
            }
        }
    }
}

export default Player