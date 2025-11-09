class GijiEncoder {
  static encode(gijiParts){
    const buffers = [];

    for(const p of gijiParts){
      buffers.push(p.bytes);
    }

    buffers.push(...this.createEnd());

    for(const p of gijiParts){
      buffers.push(p.tag, p.start, p.end);
    }

    const totalSize = buffers.reduce((sum, b) => sum + b.length, 0);
    const result = new Uint8Array(totalSize);
    let pos = 0;
    for (const b of buffers) {
      result.set(b, pos);
      pos += b.length;
    }

    return result;
  }

  static createEnd(){
    const tag = Convert.strToSectionTag("end");
    const idx = Convert.numToSectionIdx(0);
    return [tag, idx, idx];
  }
}