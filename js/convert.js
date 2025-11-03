class Convert {
  static secToStr(sec){
    const h = String(Math.floor(sec/3600)).padStart(2,'0');
    const m = String(Math.floor(sec%3600/60)).padStart(2,'0');
    const s = String(Math.floor(sec%60)).padStart(2,'0');
    return `${h}:${m}:${s}`;
  }

  static bytesToBlob(bytes){
    return new Blob([bytes], {type: "audio/mpeg"});
  }

  static bytesToArray(bytes){
    const decoder = new TextDecoder("utf-8");
    const arrayWithJSON = decoder.decode(bytes);
    return JSON.parse(arrayWithJSON);
  }

  static bytesToTag(bytes){
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(bytes).replace(/\0+$/, "");
  }
}