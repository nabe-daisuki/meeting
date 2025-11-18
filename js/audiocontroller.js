class AudioController {
  static getPlaybackSliderW(){
    return playbackSlider.offsetWidth;
  }
  static getPlaybackSliderMarginLeft(){
    return parseFloat(getComputedStyle(playbackSlider).margin);
  }

  static init(){
    playbackBox.addEventListener("wheel", e => {
      e.preventDefault();
      const delta = KeyBoard.hasCtrl ? KeyBoard.hasShift ? 5 : 3 : KeyBoard.hasShift ? 5 : 1;
      const pos = AudioState.getTime() + (e.deltaY < 0 ? delta : -delta);
      this.setTime(pos);
      this.setPlaybackLabel(pos);
    });
    volumeBox.addEventListener("wheel", e => {
      e.preventDefault();
      const delta = KeyBoard.hasCtrl ? KeyBoard.hasShift ? 5 : 3 : KeyBoard.hasShift ? 5 : 1;
      const v = AudioState.getVolume() + (e.deltaY < 0 ? delta : -delta);
      this.volume(v);
    });
    speedBox.addEventListener("wheel", e => {
      e.preventDefault();
      const delta = 0.05;
      const v = AudioState.getSpeed() + (e.deltaY < 0 ? delta : -delta);
      this.speed(v);
    });

    currentTime.addEventListener("wheel", e => {
      e.preventDefault();
      const delta = KeyBoard.hasCtrl ? KeyBoard.hasShift ? 5 : 3 : KeyBoard.hasShift ? 5 : 1;
      const pos = AudioState.getTime() + (e.deltaY < 0 ? delta : -delta);
      this.setTime(pos);
      this.setPlaybackLabel(pos);
    });

    playbackSlider.addEventListener("input", e => {
      const v = e.target.value;
      const sec = Convert.percentToSec(v, AudioFile.getDuration());
      this.setTime(sec);
      this.setPlaybackLabel(sec);
    });
    playbackSlider.addEventListener("mouseover", e => {
      e.target.style.setProperty("--sub-theme", Theme.subThemeColor.hover);
      e.target.style.setProperty("--thumb-scale", "1.2");
    });
    playbackSlider.addEventListener("mouseout", e => {
      e.target.style.setProperty("--sub-theme", Theme.subThemeColor.normal);
      e.target.style.setProperty("--thumb-scale", "1.0");
    });

    volumeSlider.addEventListener("input", e => {
      const v = e.target.value;
      this.volume(v);
    });
    volumeSlider.addEventListener("mouseover", e => {
      e.target.style.setProperty("--sub-theme", Theme.subThemeColor.hover);
      e.target.style.setProperty("--thumb-scale", "1.2");
    });
    volumeSlider.addEventListener("mouseout", e => {
      e.target.style.setProperty("--sub-theme", Theme.subThemeColor.normal);
      e.target.style.setProperty("--thumb-scale", "1.0");
    });

    speedSlider.addEventListener("input", e => {
      const v = e.target.value;
      this.speed(v);
    });
    speedSlider.addEventListener("mouseover", e => {
      e.target.style.setProperty("--sub-theme", Theme.subThemeColor.hover);
      e.target.style.setProperty("--thumb-scale", "1.2");
    });
    speedSlider.addEventListener("mouseout", e => {
      e.target.style.setProperty("--sub-theme", Theme.subThemeColor.normal);
      e.target.style.setProperty("--thumb-scale", "1.0");
    });

    playBtn.addEventListener("click", () => this.play());
    pauseBtn.addEventListener("click", () => this.pause());
    stopBtn.addEventListener("click", () => this.stop());

    unmuteBtn.addEventListener("click", () => this.mute());
    muteBtn.addEventListener("click", () => this.unmute());

    normalSpeedBtn.addEventListener("click", () => {
      const normalSpeed = 1.00;
      this.speed(normalSpeed);
    });

    const initVolume = AudioState.getInitVolume();
    const initSpeed = AudioState.getInitSpeed();

    this.volume(initVolume);
    this.speed(initSpeed);
  }
  
  static updatePlaybackSlider(v){
    if(isNaN(v)) v = 0;
    playbackSlider.value = v;
    playbackSlider.style.setProperty("--value", v);
  }
  static updateVolumeSlider(v){
    volumeSlider.value = v;
    volumeSlider.style.setProperty("--value", v);
  }
  static updateSpeedSlider(v){
    speedSlider.value = v;
    speedSlider.style.setProperty("--value", v * 50);
  }

  static setPlaybackLabel(sec){
    currentTime.textContent = Convert.secToStr(sec);
  }
  static setVolumeLabel(v){
    volumeLabel.textContent = v + "%";
  }
  static setSpeedLabel(v){
    speedLabel.textContent = "x" + Number(v).toFixed(2);
  }

  static setTime(s){
    audio.currentTime = s;
  }
  static setDuration(sec){
    durationTime.textContent = `/${Convert.secToStr(sec)}`;
  }
  static setVolume(v){
    audio.volume = v * 0.01;
  }  
  static setSpeed(v){
    audio.playbackRate = v <= 0.1 ? 0.1 : v;
  }

  static play(){
    audio.play();
    playBtn.classList.add("hide");
    pauseBtn.classList.remove("hide");
  }
  static pause(){
    audio.pause();
    playBtn.classList.remove("hide");
    pauseBtn.classList.add("hide");
  }
  static stop(){
    audio.pause();
    this.setTime(0);
    this.setPlaybackLabel(0);
    playBtn.classList.remove("hide");
    pauseBtn.classList.add("hide");
  }

  static mute(){
    audio.muted = true;
    unmuteBtn.classList.add("hide");
    muteBtn.classList.remove("hide");
    volumeSlider.disabled = true;
    volumeSlider.style.setProperty("--thumb-color", "#505050");
  }
  static unmute(){
    audio.muted = false;
    unmuteBtn.classList.remove("hide");
    muteBtn.classList.add("hide");
    volumeSlider.disabled = false;
    volumeSlider.style.setProperty("--thumb-color", "#fffb0a");
  }

  static seek(v){
    const pos = Math.max(0, AudioState.getTime() + v);
    this.setTime(pos);
    this.setPlaybackLabel(pos);
    AudioState.setPos(pos);
  }
  static volume(v){
    this.setVolumeLabel(v);
    this.updateVolumeSlider(v);
    this.setVolume(v);
    AudioState.setVolume(v);
  }
  static speed(v){
    this.setSpeedLabel(v);
    this.updateSpeedSlider(v);
    this.setSpeed(v);
    AudioState.setSpeed(v);
  }
}