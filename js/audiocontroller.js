class AudioController {
  static initVolume = 10;
  static initSpeed = 50;

  static init(){
    volumeSlider.addEventListener("input", e => {
      const v = e.target.value;
      this.setVolumeLabel(v);
      this.updateVolumeSlider(v);
      this.setVolume(v);
    });
    speedSlider.addEventListener("input", e => {
      const v = e.target.value;
      this.setSpeedLabel(v);
      this.updateSpeedSlider(v);
      this.setSpeed(v);
    });
    this.setVolumeLabel(this.initVolume);
    this.setSpeedLabel(this.initSpeed);

    this.updateVolumeSlider(this.initVolume);
    this.updateSpeedSlider(this.initSpeed);

    this.setVolume(this.initVolume);
    this.setSpeed(this.initSpeed);
  }
  
  static updateVolumeSlider(v){
    volumeSlider.value = v;
  }

  static updateSpeedSlider(v){
    speedSlider.value = v;
  }

  static setVolumeLabel(v){
    volumeLabel.textContent = v + "%";
  }
  static setSpeedLabel(v){
    speedLabel.textContent = v * 2 + "%";
    console.log(v);
  }

  static getTime(){
    return audio.currentTime;
  }
  static setTime(s){
    audio.currentTime = s;
  }

  static setVolume(v){
    audio.volume = v * 0.01;
  }
  
  static setSpeed(v){
    audio.playbackRate = v / 50;
  }
}