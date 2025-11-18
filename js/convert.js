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

  static numToSectionIdx(num){
    const buf = new ArrayBuffer(GijiInput.SECTION_INDEX_BYTES);
    const view = new DataView(buf);
    view.setBigUint64(0, BigInt(num), true);
    return new Uint8Array(buf);
  }

  static strToSectionTag(str){
    const encoder = new TextEncoder();
    const u8arr = new Uint8Array(GijiInput.SECTION_TAG_BYTES);
    u8arr.set(encoder.encode(str));
    return u8arr;
  }

  static secToPercent(sec, base){
    return (sec / base) * 100;
  }
  static percentToSec(percent, base){
    return (percent/ 100) * base;
  }
}