class GijiInput {
  static init(){
    fileDropOverlay.style.display = "flex"
    // ドラッグが画面に入ったとき
    fileDropOverlay.addEventListener('dragenter', (e) => {
      e.preventDefault();
      fileDropOverlay.classList.add('active');
    });

    // ドラッグが画面から出たとき
    fileDropOverlay.addEventListener('dragleave', (e) => {
      e.preventDefault();
      // relatedTargetがnullまたはbodyなら外に出たと判断
      if (!e.relatedTarget || e.relatedTarget === document.body) {
        fileDropOverlay.classList.remove('active');
      }
    });

    // ドラッグオーバー（ドロップを許可）
    fileDropOverlay.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    // ドロップされたとき
    fileDropOverlay.addEventListener('drop', async (e) => {
      e.preventDefault();
      fileDropOverlay.classList.remove('active');

      const files = e.dataTransfer.files;
      if(files.length >= 2){
        alert("1つのファイル(.giji)をドロップ下さい。");
        return;
      }

      const file = files[0];
      const item = e.dataTransfer.items[0];
      
      if(item.webkitGetAsEntry().isDirectory){
        alert("フォルダではなくファイル(.giji)をドロップ下さい。");
        return;
      }

      const ext = file.name.split('.').pop().toLowerCase();
      if(ext !== "giji"){
        alert(`ドロップされた拡張子は「.${ext}」です。ファイル(.giji)をドロップ下さい。`);
        return;
      }

      const buffer = await file.arrayBuffer();
      const view = new DataView(buffer);
      const STRLEN = 10;

      let offset = buffer.byteLength;
      const sections = {};

      while(true){
        offset -= 8;
        const end = Number(view.getBigUint64(offset, true));

        offset -= 8;
        const start = Number(view.getBigUint64(offset, true));

        offset -= STRLEN;
        const tagBytes = new Uint8Array(buffer, offset, STRLEN);
        const tag = Convert.bytesToTag(tagBytes);

        if(tag === "end")break;
        
        const contentBytes = new Uint8Array(buffer, start, end - start);

        sections[tag] = {bytes: contentBytes};
      }

      const basename = file.name.split('.').shift();
      Object.keys(sections).forEach(k => {
        switch(k){
          case "giji":
            const giji = Convert.bytesToArray(sections[k]["bytes"]).join("") + "\n";
            const blob = new Blob([giji], { type: "text/plain" });
            const textFilename = `${basename}.txt`;
            const textFile = new File([blob], textFilename, { type: "text/plain" });

            TextInput.input(textFile);
            break;
          case "audio":
            const audioFilename = `${basename}.mp3`;
            AudioInput.input(audioFilename, sections[k]["bytes"]);
            break;
          case "repinfos":
            const repInfos = Convert.bytesToArray(sections[k]["bytes"]);
            Doc.setRepInfos(structuredClone(repInfos));
            break;
          case "reptbl":
            const repTbl = Convert.bytesToArray(sections[k]["bytes"]);
            Replace.set(structuredClone(repTbl));
            break;
          case "speaker":
            const speaker = Convert.bytesToArray(sections[k]["bytes"]);
            Speaker.set(structuredClone(speaker));
            Render.speaker();
            break;
          default:
            alert(`.gijiファイルに有効でないタグ(${k})が登録されています。`);
            break;
        }
      });

      fileDropOverlay.style.display = "none";
    });
  }

  static getContent(tag, bytes){
    switch(tag){
      case "giji":
        return Convert.bytesToArray(bytes);
      case "audio":
        return Convert.bytesToBlob(bytes);
      case "repinfos":
        return Convert.bytesToArray(bytes);
      default:
        alert(`.gijiファイルに有効でないタグ(${tag})が登録されています。`);
        return null;
    }
  }
}