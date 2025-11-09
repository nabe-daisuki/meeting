class GijiInput {
  static SECTION_TAG_BYTES = 10;
  static SECTION_INDEX_BYTES = 8;

  static init(){
    if(isGijiTest){
      fileDropOverlay.style.display = "none";
    }else{
      fileDropOverlay.style.display = "flex";
    }

    gijiFileInput.addEventListener("change", async(e) => {
      const files = e.target.files;
      if(files.length != 1){
        alert("1つのファイル(.giji)を選択してください。");
        return;
      }

      await this.input(files[0], false);
    });

    // ドラッグが画面に入ったとき
    fileDropOverlay.addEventListener("dragenter", e => {
      e.preventDefault();
      fileDropOverlay.classList.add("active");
    });

    // ドラッグが画面から出たとき
    fileDropOverlay.addEventListener("dragleave", e => {
      e.preventDefault();
      // relatedTargetがnullまたはbodyなら外に出たと判断
      if (!e.relatedTarget || e.relatedTarget === document.body) {
        fileDropOverlay.classList.remove("active");
      }
    });

    // ドラッグオーバー（ドロップを許可）
    fileDropOverlay.addEventListener("dragover", e => {
      e.preventDefault();
    });

    // ドロップされたとき
    fileDropOverlay.addEventListener("drop", async(e) => {
      e.preventDefault();
      fileDropOverlay.classList.remove("active");

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

      await this.input(file);
    });
  }

  static async input(file, byDrop = true){
    const ext = file.name.split(".").pop().toLowerCase();
    if(ext !== "giji"){
      alert(`ドロップされた拡張子は「.${ext}」です。ファイル(.giji)をドロップ下さい。`);
      return;
    }

    if(byDrop){
      document.getElementById("load-by-selection-img").classList.add("hide");
      document.getElementById("load-neutral-img").classList.add("hide");
    }

    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);

    let offset = buffer.byteLength;
    const sections = {};

    while(true){
      offset -= this.SECTION_INDEX_BYTES;
      const end = Number(view.getBigUint64(offset, true));

      offset -= this.SECTION_INDEX_BYTES;
      const start = Number(view.getBigUint64(offset, true));

      offset -= this.SECTION_TAG_BYTES;
      const tagBytes = new Uint8Array(buffer, offset, this.SECTION_TAG_BYTES);
      const tag = Convert.bytesToTag(tagBytes);

      if(tag === "end")break;
      
      const contentBytes = new Uint8Array(buffer, start, end - start);

      sections[tag] = {bytes: contentBytes};
    }

    const basename = file.name.split(".").shift();
    let otherInfo = null;
    Object.keys(sections).forEach(k => {
      switch(k){
        case "giji":
          if(Object.keys(sections).includes("savedoc")) {
            TextFile.setName(`${basename}.txt`);
            return;
          }
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
          break;
        case "savedoc":
          const lines = Convert.bytesToArray(sections[k]["bytes"]);
          Doc.insertLines(structuredClone(lines));
          break;
        case "saveother":
          otherInfo = Convert.bytesToArray(sections[k]["bytes"]);
          break;
        case "config":
          const config = Convert.bytesToArray(sections[k]["bytes"]);
          Config.set(config.general);
          Config.setShortCuts(config.shortCut);
          break;
        default:
          alert(`.gijiファイルに有効でないタグ(${k})が登録されています。`);
          break;
      }
    });

    Theme.set("dark");
    if(Object.keys(sections).includes("speaker")){
      Render.speaker();
    }
    if(Object.keys(sections).includes("savedoc")){
      Meta.resetTitle();
      DocHeader.init();
      Render.render();
      Save.enable();
    }
    if(Object.keys(sections).includes("saveother")){
      Scroll.setScrollTop(otherInfo.scroll.scrollTop);
      if(otherInfo.scroll.isAuto) Scroll.setAuto();
      
      AudioController.setVolumeLabel(otherInfo.audio.volume);
      AudioController.setSpeedLabel(otherInfo.audio.speed);
      AudioController.updateVolumeSlider(otherInfo.audio.volume);
      AudioController.updateSpeedSlider(otherInfo.audio.speed);
      AudioController.setVolume(otherInfo.audio.volume);
      AudioController.setSpeed(otherInfo.audio.speed);
      AudioController.setTime(otherInfo.audio.pos);
      AudioController.setPlaybackLabel(otherInfo.audio.pos);
      if(otherInfo.highlight.idx !== -1){
        Selection.relocateHighlight(otherInfo.highlight.idx);
        TextBody.select(otherInfo.highlight.idx, otherInfo.selection.start, otherInfo.selection.end);
      }
    }
    if(Object.keys(sections).includes("config")){
      Render.mainTool();
      const theme = Theme.jpnToCode(Config.get().find(s => s.key === "theme").value[0]);
      Theme.set(theme);
    }
    Theme.apply();

    fileDropOverlay.classList.add("hide");
    setTimeout(() => {
      fileDropOverlay.style.display = "none";
    }, 2000);
  }

}