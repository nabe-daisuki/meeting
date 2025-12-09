class Save {
  static init(){
    saveBtn.addEventListener("click", async () => this.defaultSave());
    saveBtn.addEventListener("focus", () => saveBtn.blur());

    namedSaveBtn.addEventListener("click", async() => this.namedSave());
    namedSaveBtn.addEventListener("focus", () => namedSaveBtn.blur());
  }

  static enable(){
    saveBtn.classList.remove("btn-disabled");
    saveBtn.disabled = false;
    namedSaveBtn.classList.remove("btn-disabled");
    namedSaveBtn.disabled = false;
  }

  static defaultSave(){
    let answer = confirm("現状を保存しますか？");
    if(!answer)return;  

    this.save(this.getTimestampFileName(), this.createGiji());
  }

  static getTimestampFileName() {
    const now = new Date();
    
    // ゼロ埋め用関数
    const pad = (n) => n.toString().padStart(2, '0');

    const yy = now.getFullYear() % 100;
    const MM = pad(now.getMonth() + 1); // 月は0始まり
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());

    const textFilename = TextFile.getName();
    const audioFilename = AudioFile.getName();
    let filename = textFilename || audioFilename;
    if(filename.includes("__")) filename = filename.split("__")[0];
    else filename = filename.split(".")[0];

    return `${filename}__${yy}${MM}${dd}-${hh}${mm}${ss}.txt`;
  }

  static save(fileName, giji, isExport = false){
    const blob = new Blob([giji], { type: isExport ? "text/plain" : "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  }

  // static save(fileName, content){
  //   const blob = new Blob([content], { type: 'text/plain' });
  //   const url = URL.createObjectURL(blob);

  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = fileName;
  //   a.click();

  //   URL.revokeObjectURL(url);
  // }

//   static stateToText(){
//     let text = "";
//     Doc.getLines().forEach(line => {
//       text += `[${Convert.secToStr(line.startSec)} -> ${Convert.secToStr(line.endSec)}]
// ${line.text.split("\n").join("|||")}
// ${line.editedText === null ? "null" : line.editedText.split("\n").join("|||")}
// ${line.disabled}
// ${line.color}
// ${line.hided}
// ${line.checked}
// ${line.badges}
// ${line.charsPerPara.join("|||")}
// ${line.paraHeights.join("|||")}
// ${line.comments.map(b => +b).join("|||")}
// ${line.responses.map(b => +b).join("|||")}
// @@@@@
// `;
//     });
//     text += "%%%%%\n";

//     if(audioInfo.fileName === ""){
//       text += "no audio\n";
//     }else{
//       text += `${audioInfo.fileName}
// ${audioInfo.length}
// ${audioInfo.bytes}
// ${audioInfo.KB}
// ${audioInfo.MB}
// `;
//     }
//     text += "&&&&&";

//     return text;
//   }

  static createGiji(){
    const data = [
      {
        tag: "giji",
        data: Doc.getLines().map( l => `[${Convert.secToStr(l.startSec)} -> ${Convert.secToStr(l.endSec)}] ${l.text}` + "\n" ),
        type: "json"
      },
      {
        tag: "audio",
        data: AudioFile.getBytes(),
        type: "raw"
      },
      {
        tag: "repinfos",
        data: structuredClone(Doc.getRepInfos()),
        type: "json"
      },
      {
        tag: "reptbl",
        data: structuredClone(Replace.get()),
        type: "json"
      },
      {
        tag: "speaker",
        data: structuredClone(Speaker.get()),
        type: "json"
      },
      {
        tag: "savedoc",
        data: structuredClone(Doc.getLines()),
        type: "json"
      },
      // {
      //   tag: "crlist",
      //   data: {
      //     list: structuredClone(CRList.get()),
      //     select: caseIds.selectedIndex,
      //     paths: structuredClone(CaseCategorizing.paths.map(p => ({
      //       color: p.color,
      //       points: p.points,
      //       hovered: p.hovered
      //     }))),
      //     group: structuredClone(CRList.getGroup()),
      //     compressCaseTitles: structuredClone(CRList.getCompressCaseTitles())
      //   },
      //   type: "json"
      // },
      {
        tag: "pdfviewer",
        data: {
          prevPdf: {
            caseid: PDFViewer.prevPdf.caseid,
            name: PDFViewer.prevPdf.name,
            size: PDFViewer.prevPdf.size,
          },
          scroll: {
            top: PDFViewer.scroll.top,
            left: PDFViewer.scroll.left
          },
          scale: PDFViewer.scale,
          show: PDFViewer.isEnabled
        },
        type: "json"
      },
      {
        tag: "saveother",
        data: {
          scroll: {
            isAuto: Scroll.isAuto,
            scrollTop: Scroll.getPos()
          },
          audio: {
            volume: AudioState.getVolume(),
            speed: AudioState.getSpeed(),
            pos: AudioState.getPos()
          },
          highlight: {
            idx: Selection.idx
          },
          selection: {
            start: TextBody.selection.start,
            end: TextBody.selection.end,
            paras: [...TextBody.selection.paras]
          },
          activeTag: SubTools.activeTag
        },
        type: "json"
      }
    ];

    const currConfig = Config.getConfigData();
    if(!Config.isSameConfig(currConfig)){
      User.add({
        name: User.createUserName(),
        config: currConfig
      });
    }
    data.push({
      tag: "userdata",
      data: structuredClone(User.getList()),
      type: "json"
    });
    console.log(User.getList());

    if(CRList.isValid){
      data.push({
        tag: "crlist",
        data: {
          list: structuredClone(CRList.get()),
          select: caseIds.selectedIndex,
          paths: structuredClone(CaseCategorizing.paths.map(p => ({
            color: p.color,
            points: p.points,
            hovered: p.hovered
          }))),
          group: structuredClone(CRList.getGroup()),
          compressCaseTitles: structuredClone(CRList.getCompressCaseTitles())
        },
        type: "json"
      });
    }

    let offset = 0;
    const gijiParts = [];
    for(const d of data){
      const gijiPart = new GijiPart(d.tag, d.data, offset, d.type);
      offset = gijiPart.endPos;
      gijiParts.push(gijiPart);
    }

    return GijiEncoder.encode(gijiParts);
  }

  static namedSave(){
    let answer = confirm("現状を名前を付けて保存しますか？");
    if(!answer)return;

    let fileName = "";
    while(true){
      fileName = prompt(`ファイル名を入力ください。
また、以下の文字は無効です。
（改行、タブ、\\、/、*、<、>、?、"、.）`);

      if(fileName === null){
        alert("\"名前を付けて保存\"の処理を中断します。");
        return;
      }else if(fileName === ""){
        continue;
      }else{
        fileName = fileName.trim();
        const invalidChars = /[\t\r\n\\\/\*\<\>\?\|\"\.]/;
        if(invalidChars.test(fileName)){
          alert(`無効な入力文字を確認しました。以下はファイル名として利用できません。
（改行、タブ、\\、/、*、<、>、?、"、.）`);
        }else{
          break;
        }
      }
    }

    this.save(`${fileName}.txt`, this.createGiji());
  }
}