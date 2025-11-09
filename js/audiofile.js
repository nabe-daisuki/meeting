class AudioFile {
  static data = {
    bytes: null,
    name: "",
    b: "",
    kb: 0,
    mb: 0,
    length: "",
    duration: 0.000000
  }

  static set(obj){
    this.data = {...obj};
  }
  static setLen(v){
    this.data.length = v;
  }
  static getBytes(){
    return this.data.bytes;
  }
  static getName(){
    return this.data.name;
  }
  static setDuration(v){
    this.data.duration = v;
  }
  static getDuration(){
    return this.data.duration;
  }
}