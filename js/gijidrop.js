class GijiDrop {
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
      console.log(`ファイル名: ${file.name}, 拡張子: ${ext}`);

      const buffer = await file.arrayBuffer();
      const view = new DataView(buffer);
      const decoder = new TextDecoder("utf-8");
      const STRLEN = 10;

      let offset = buffer.byteLength;
      const sections = {};

      while(true){
        offset -= 8;
        const end = Number(view.getBigUint64(offset, true));

        offset -= 8;
        const start = Number(view.getBigUint64(offset, true));

        offset -= STRLEN;
        const nameBytes = new Uint8Array(buffer, offset, STRLEN);
        const name = decoder.decode(nameBytes).replace(/\0+$/, "");

        sections[name] = { start, end };
        if(name === "end")break;
      }

      console.log("📘 セクション情報:", sections);

      const nameBytes = new Uint8Array(buffer, 0, sections.audio.start);
      const name = decoder.decode(nameBytes);
      console.log(name);

      AudioInput.inputAudio(buffer, sections);
      TextInput.inputText(name);

      // JSON (replace_historys) 抽出
      if (sections.rephist) {
        const { start, end } = sections.rephist;
        const jsonStr = decoder.decode(new Uint8Array(buffer, start, end - start));
        const json = JSON.parse(jsonStr);
        console.log("🧩 replace_historys:", json);

        const pre = document.createElement("pre");
        pre.textContent = JSON.stringify(json, null, 2);
        document.body.appendChild(pre);
        lSide.rephists.push(json);
      }


      fileDropOverlay.style.display = "none";
    });
  }
}