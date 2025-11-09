class GijiPart {
  static encoder = new TextEncoder();
  
  constructor(_tag, _data, _offset, _type = "json"){
    this.tag = Convert.strToSectionTag(_tag);
    switch(_type){
      case "raw":
        this.bytes = _data;
        break;
      case "json":
        this.bytes = GijiPart.encoder.encode(JSON.stringify(_data));
        break;
      default:
        this.bytes = GijiPart.encoder.encode(JSON.stringify(_data));
        break;
    }
    this.startPos = _offset;
    this.start = Convert.numToSectionIdx(_offset);
    this.endPos = _offset + this.bytes.length;
    this.end = Convert.numToSectionIdx(this.endPos); 
  }
}