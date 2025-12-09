class GijiInput {
  static init(){
    if(isGijiTest){
      fileDropOverlay.style.display = "none";
    }else{
      fileDropOverlay.style.display = "flex";
    }

    gijiFileInput.addEventListener("change", async(e) => {
      const files = e.target.files;
      if(files.length != 1){
        alert("1つのファイル(.txt)を選択してください。");
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
        alert("1つのファイル(.txt)をドロップ下さい。");
        return;
      }

      const file = files[0];
      const item = e.dataTransfer.items[0];
      
      if(item.webkitGetAsEntry().isDirectory){
        alert("フォルダではなくファイル(.txt)をドロップ下さい。");
        return;
      }

      await this.input(file);
    });
  }

  static async input(file, byDrop = true){
    const ext = file.name.split(".").pop().toLowerCase();
    if(ext !== "txt"){
      alert(`ドロップされた拡張子は「.${ext}」です。ファイル(.txt)をドロップ下さい。`);
      return;
    }

    if(byDrop){
      document.getElementById("load-by-selection-img").classList.add("hide");
      document.getElementById("load-neutral-img").classList.add("hide");
    }

    const sections = await GijiDecoder.decode(file);
    // const buffer = await file.arrayBuffer();
    // const view = new DataView(buffer);

    // let offset = buffer.byteLength;
    // const sections = {};

    // while(true){
    //   offset -= this.SECTION_INDEX_BYTES;
    //   const end = Number(view.getBigUint64(offset, true));

    //   offset -= this.SECTION_INDEX_BYTES;
    //   const start = Number(view.getBigUint64(offset, true));

    //   offset -= this.SECTION_TAG_BYTES;
    //   const tagBytes = new Uint8Array(buffer, offset, this.SECTION_TAG_BYTES);
    //   const tag = Convert.bytesToTag(tagBytes);

    //   if(tag === "end")break;
      
    //   const contentBytes = new Uint8Array(buffer, start, end - start);

    //   sections[tag] = {bytes: contentBytes};
    // }

    const keys = Object.keys(sections);

    const basename = file.name.split(".").shift();
    let otherInfo = null;

    keys.forEach(k => {
      switch(k){
        case "giji":
          const textFilename = `${basename}.txt`;

          TextFile.setName(textFilename)
          if(keys.includes("savedoc")) return;
          
          const giji = Convert.bytesToArray(sections[k]["bytes"]).join("") + "\n";
          const blob = new Blob([giji], { type: "text/plain" });
          const textFile = new File([blob], textFilename, { type: "text/plain" });
          
          TextInput.input(textFile);
          break;
        case "audio":
          const audio = sections[k]["bytes"];
          const audioFilename = `${basename}.mp3`;
          AudioInput.input(audioFilename, audio);
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
          Doc.setLines(structuredClone(lines));
          break;
        case "saveother":
          otherInfo = Convert.bytesToArray(sections[k]["bytes"]);
          break;
        case "config":
          const configs = Convert.bytesToArray(sections[k]["bytes"]);
          if(typeof User === "function"){
            if(Type.isArr(configs)){
              for(let i = 0; i < configs.length; i++){
                User.add(configs[i]);
              }
            }else{
              User.add(configs);
            }
            return;
          }
          if(Array.isArray(configs)){
            UserSelect.add(structuredClone(configs));
          }else{
            configs.user_name = "ユーザー1";
            UserSelect.add(structuredClone([configs]));
          }
          break;
        case "userdata":
          const userdataList = Convert.bytesToArray(sections[k]["bytes"]).filter(d => d.name !== "ゲスト");
          for(let i = 0; i < userdataList.length; i++){
            User.add(userdataList[i]);
          }
          break;
        case "crlist":
          const crlist = Convert.bytesToArray(sections[k]["bytes"]);
          if("paths" in crlist){
            CaseCategorizing.restore(crlist.paths);
            CRList.set(crlist.list);
            CRList.setGroup(crlist.group);
            CRList.setCompressCaseTitles(crlist.compressCaseTitles);
            CRList.init();
            caseIds.selectedIndex = crlist.select === -1 ? 0 : crlist.select;
          }else{
            CRList.set(crlist);
          }
          CRList.isValid = true;
          break;
        case "pdfviewer":
          const pdfviewer = Convert.bytesToArray(sections[k]["bytes"]);
          PDFViewer.scale = pdfviewer.scale;
          PDFViewer.prevPdf.caseid = pdfviewer.prevPdf.caseid;
          PDFViewer.prevPdf.name = pdfviewer.prevPdf.name;
          PDFViewer.prevPdf.size = pdfviewer.prevPdf.size;
          PDFViewer.scroll.top = pdfviewer.scroll.top;
          PDFViewer.scroll.left = pdfviewer.scroll.left;
          PDFViewer.isEnabled = pdfviewer.show;
          break;
        default:
          alert(`.txtファイルに有効でないタグ(${k})が登録されています。`);
          break;
      }
    });

    Theme.set("ダーク");
    Theme.setSub("イエロー");

    if(keys.includes("speaker")){
      Render.speaker();
    }
    if(keys.includes("savedoc")){
      Meta.resetTitle();
      DocHeader.init();
      Render.render();
      Save.enable();
    }

    if(keys.includes("saveother")){
      Scroll.setScrollTop(otherInfo.scroll.scrollTop);
      if(otherInfo.scroll.isAuto) Scroll.setAuto();
      
      AudioController.volume(otherInfo.audio.volume);
      AudioController.speed(otherInfo.audio.speed);
      AudioController.seek(otherInfo.audio.pos);

      if(otherInfo.highlight.idx !== -1){
        Selection.relocateHighlight(otherInfo.highlight.idx);
        TextBody.select(otherInfo.highlight.idx, otherInfo.selection.start, otherInfo.selection.end);
      }
      if(document.querySelector(".tab-btn") && "activeTag" in otherInfo){
        SubTools.activeTag = otherInfo.activeTag;
        SubTools.activate();
      }
    }
    
    if(keys.includes("pdfviewer")){
      if(PDFViewer.isEnabled){
        await PDFViewer.loadPDF(CRList.getAttachmentBin(
          PDFViewer.prevPdf.caseid,
          PDFViewer.prevPdf.name
        ));
        PDFViewer.initScroll();
      }
    }

    if(CRList.isTest){
      CRList.isValid = true;
      // CRList.init();
    }


    Render.userSelect();
    userSelectOverlay.classList.remove("hide");
    fileDropOverlay.classList.add("hide");

  }

}