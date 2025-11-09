class AudioState {
  static init = {
    volume: 10,
    speed: 1.0
  }
  static volume = 0;
  static speed = 0.0;
  static pos = 0;
  static _isPlaying = false;
  static _isMuted = false;

  static init(){
    this.setVolume(this.getInitVolume());
    this.setSpeed(this.getInitSpeed());
  }

  static getInitVolume(){
    return this.init.volume;
  }
  static getInitSpeed(){
    return this.init.speed;
  }
  static getTime(){
    return audio.currentTime;
  }
  static getVolume(){
    return this.volume;
  }
  static setVolume(v){
    this.volume = v;
  }
  static getSpeed(){
    return this.speed;
  }
  static setSpeed(v){
    this.speed = v;
  }
  static getPos(){
    return this.pos;
  }
  static setPos(v){
    this.pos = v;
  }

  static isPlaying(){
    return this._isPlaying;
  }
  static play(){
    this._isPlaying = true;
  }
  static pause(){
    this._isPlaying = false;
  }

  static isMuted(){
    return this._isMuted;
  }
  static mute(){
    this._isMuted = true;
  }
  static unmute(){
    this._isMuted =false;
  }
}