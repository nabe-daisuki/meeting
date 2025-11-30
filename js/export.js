class Export {
  static init(){
    configToExport.addEventListener("click", () => this.exportConfig());
    configToExport.addEventListener("focus", () => configToExport.blur());

    hatchToExport.addEventListener("click", () => this.export("hatch"));
    hatchToExport.addEventListener("focus", () => hatchToExport.blur());

    editedToExport.addEventListener("click", () => this.export("edited"));
    editedToExport.addEventListener("focus", () => editedToExport.blur());
  }

  static export(type){
    const transcriptions = [];
    const times = [];

    switch(type){
      case "hatch":
        this.hatch(transcriptions, times);
        break;
      case "edited":
        this.edited(transcriptions, times);
        break;
      default:
        alert(`無効な出力タイプ(${type})です。処理を中断します。`)
        return;
    }

    if(transcriptions.every(t => t === null)){
      alert("出力対象の行はありません。処理を中断します。");
      return;
    }

    const arranged = this.arrange(transcriptions, times);
    Save.save("コメント部のみ.txt", arranged.join("\n".repeat(4)), true);
  }

  static hatch(transcriptions, times) {
    for(const line of Doc.getLines()){
      times.push({
        startSec: line.startSec,
        endSec: line.endSec
      });
      if(line.color !== "g") {
        transcriptions.push(null);
        continue;
      }
      
      const text = line.editedText || line.text;
      console.log(text);
      transcriptions.push(text.split("\n").map( (l, j) => {
        if(line.miniBadges[j] === "c" && !l.startsWith("・")) return `・${l}`;
        else if(line.miniBadges[j] === "r" && !l.startsWith("→")) return `→${l}`;
        else return l;
      }).join("\n"));
    }
  }

  static edited(transcriptions, times){
    const tagged = new Array(CRList.getGroup().length).fill(false);
    for(const line of Doc.getLines()){
      times.push({
        startSec: line.startSec,
        endSec: line.endSec
      });
      if(line.editedText === null &&
        line.comments.every(c => !c) &&
        line.responses.every(r => !r)
      ) {
        transcriptions.push(null);
        continue;
      }
      
      const text = line.editedText || line.text;
      transcriptions.push(text.split("\n").map( (l, j) => {
        if(line.miniBadges[j] === "c" && !l.startsWith("・")) return `・${l}`;
        else if(line.miniBadges[j] === "r" && !l.startsWith("→")) return `→${l}`;
        else if(l.startsWith("『")
          && l.endsWith("』")
          && /20\d{2}-\d{3}/.test(l)){
          const addLines = [];
          const caseId = l.replace(/[『』]/g, "");
          const groupIndex = CRList.getCompressCaseTitles().findIndex(c => c.includes(caseId));

          if(tagged[groupIndex]){
            return `ー${caseId}ー`;
          }

          addLines.push(l);
          const caseIds = CRList.getGroup()[groupIndex];
          if(Array.isArray(caseIds)){
            const caseData = CRList.get();
            caseIds.forEach(id => {
              for(let k = 0; k < caseData.length; k++){
                if(caseData[k].case_id !== id) continue;
                addLines.push(`└管理番号：${id}`);
                addLines.push(`　件名：${caseData[k].case_name}`);
                addLines.push("-".repeat(40));
                break;
              }
            });
          }else{
            CRList.get().some(c => {
              if(c.case_id !== caseIds) return;
              addLines.push(`件名：${c.case_name}`);
              addLines.push("-".repeat(40));
              return true;
            });
          }

          tagged[groupIndex] = true;

          return addLines.join("\n");
        }
        else return l;
      }).join("\n"));
    }
  }

  static formatSec(startSec, endSec){
    return `[${Convert.secToStr(startSec)} -> ${Convert.secToStr(endSec)}]`;
  }

  static arrange(transcriptions, times){

    const composeTimes = [];

    let nullCount = 0;
    let startSec = -1;
    let endSec = -1;
    let buffer = [];

    transcriptions.forEach( (t, j) => {
      if(t === null){
        if(startSec === -1) return;
        
        nullCount += 1;
        if(nullCount < 3) return;
        nullCount = 0;

        composeTimes.push(
          this.formatSec(startSec, endSec) + "\n" +
          buffer.join("\n").replaceAll(/\n(?![・→『└\sー【]|件名：|管理番号：|---)/g, "")
        );
        buffer.length = 0;

        startSec = -1;
      }else{
        nullCount = 0;
        if(startSec === -1) startSec = times[j].startSec;
        endSec = times[j].endSec;
        buffer.push(t);
      }
    });

    if(startSec !== -1) {
      composeTimes.push(
        this.formatSec(startSec, endSec) + "\n" +
        buffer.join("\n").replaceAll(/\n(?![・→『└\sー【]|件名：|管理番号：|---)/g, "")
      );
    }

    const separateCase = composeTimes
      .join("\n".repeat(3))
      .replaceAll(/(?<![\]])\n(?=[『ー【])/g, "\n".repeat(3))
      .split("\n".repeat(3));

    return separateCase;
  }

  static exportConfig(){
    let fileName = "";
    while(true){
      fileName = prompt(`ファイル名を入力ください。
また、以下の文字は無効です。
（改行、タブ、\\、/、*、<、>、?、"、.）`);

      if(fileName === null){
        return System.fail("\"設定の保存\"の処理を中断します。");
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
    
    const config = {
      name: fileName,
      config: Config.getConfigData()
    };
    const gijiParts = [new GijiPart("config", config, 0, "json")];

    // const now = new Date();
    
    // ゼロ埋め用関数
    // const pad = (n) => n.toString().padStart(2, '0');

    // const yy = now.getFullYear() % 100;
    // const MM = pad(now.getMonth() + 1); // 月は0始まり
    // const dd = pad(now.getDate());
    // const hh = pad(now.getHours());
    // const mm = pad(now.getMinutes());
    // const ss = pad(now.getSeconds());

    // const fileName = `config__${yy}${MM}${dd}-${hh}${mm}${ss}.gijiconf`;
    
    Save.save(`${fileName}.gijiconf`, GijiEncoder.encode(gijiParts));
  }
}