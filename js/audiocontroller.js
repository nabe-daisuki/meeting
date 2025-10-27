class AudioController {
  static init(){
    volumeSlider.addEventListener("input", e => {
      const value = e.target.value;
      volumeLabel.textContent = value + "%";
      this.updateSliderBackground();
    });
    this.updateSliderBackground();
  }
  
  static updateSliderBackground() {
    const v = volumeSlider.value;
    volumeSlider.style.setProperty("--value", v + "%");
    this.setVolume(v)
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
}