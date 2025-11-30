class GijiDecoder {
  static SECTION_TAG_BYTES = 10;
  static SECTION_INDEX_BYTES = 8;

  static async decode(file){
    const result = {};

    const buf = await file.arrayBuffer();
    const view = new DataView(buf);

    let offset = buf.byteLength;

    while(true){
      offset -= this.SECTION_INDEX_BYTES;
      const end = Number(view.getBigUint64(offset, true));

      offset -= this.SECTION_INDEX_BYTES;
      const start = Number(view.getBigUint64(offset, true));
      
      offset -= this.SECTION_TAG_BYTES;
      const tagBytes = new Uint8Array(buf, offset, this.SECTION_TAG_BYTES);
      const tag = Convert.bytesToTag(tagBytes);

      if(tag === "end") break;

      const contentBytes = new Uint8Array(buf, start, end - start);
      result[tag] = {bytes: contentBytes};
    }

    return result;
  }
}