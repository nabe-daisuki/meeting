class TextFile {
  static data = null;
  static name = "";

  static setData(_data){
    this.data = _data;
  }
  static getData(){
    return this.data;
  }

  static setName(_name){
    this.name = _name;
  }
  static getName(){
    return this.name;
  }

  static defaults = {
    data: null,
    name: "",
    side: ""
  }
  constructor( options = {} ){
    const settings = {...TextFile.defaults, ...options};

    this.data = settings.data;
    this.name = settings.name;
    this.side = settings.side;
  }
}