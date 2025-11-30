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
    const buf = new ArrayBuffer(GijiDecoder.SECTION_INDEX_BYTES);
    const view = new DataView(buf);
    view.setBigUint64(0, BigInt(num), true);
    return new Uint8Array(buf);
  }

  static strToSectionTag(str){
    const encoder = new TextEncoder();
    const u8arr = new Uint8Array(GijiDecoder.SECTION_TAG_BYTES);
    u8arr.set(encoder.encode(str));
    return u8arr;
  }

  static secToPercent(sec, base){
    return (sec / base) * 100;
  }
  static percentToSec(percent, base){
    return (percent/ 100) * base;
  }

  static hexToRgba(hex, alpha) {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    const h = hex.replace("#", "");
    if (h.length === 3) {
      const r = parseInt(h[0]+h[0],16);
      const g = parseInt(h[1]+h[1],16);
      const b = parseInt(h[2]+h[2],16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    const r = parseInt(h.slice(0,2),16);
    const g = parseInt(h.slice(2,4),16);
    const b = parseInt(h.slice(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  static rgbSyntaxToRGB(rgbSyntax){
    return rgbSyntax
      .match(/\d+/g)
      .slice(0, 3)
      .map(Number);
  }

  static rgbToHex(r, g, b) {
    // 0〜255の範囲をチェック
    if (
      r < 0 || r > 255 ||
      g < 0 || g > 255 ||
      b < 0 || b > 255
    ) {
      throw new RangeError("RGB values must be in 0-255");
    }

    // 16進数に変換して2桁に揃える
    const hex = (n) => n.toString(16).padStart(2, "0");

    return `#${hex(r)}${hex(g)}${hex(b)}`;
  }

  static numToPx(num){
    return `${num}px`;
  }


  static arrBufToBlob(arrBuf){
    const arrayBuffer = new Uint8Array(arrBuf).buffer;
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });
    return blob;
  }
  static arrBufToBase64(arrBuf) {
    let binary = "";
    const bytes = new Uint8Array(arrBuf);
    const chunkSize = 0x8000; // 32KB
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk);
    }
    // const len = bytes.byteLength;

    // for (let i = 0; i < len; i++) {
    //   binary += String.fromCharCode(bytes[i]);
    // }

    return btoa(binary);
  }

  static base64ToArrBuf(base64) {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
  }




  static async blobToArrBuf(blob){
    return await blob.arrayBuffer();
  }
}