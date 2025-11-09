class Export {
  static init(){
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
    Save.save("コメント部のみ.txt", arranged.join("\n\n\n"), true);
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
        console.log(l);
        console.log(typeof l === "string");
        if(line.comments[j] && !l.startsWith("・")) return `・${l}`;
        else if(line.responses[j] && !l.startsWith("→")) return `→${l}`;
        else return l;
      }).join("\n"));
      console.log(transcriptions);
    }
  }

  static edited(transcriptions, times){
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
      console.log(text);
      transcriptions.push(text.split("\n").map( (l, j) => {
        if(line.comments[j] && !l.startsWith("・")) return `・${l}`;
        else if(line.responses[j] && !l.startsWith("→")) return `→${l}`;
        else return l;
      }).join("\n"));
      console.log(transcriptions);
    }
  }

  static formatSec(startSec, endSec){
    return `[${Convert.secToStr(startSec)} -> ${Convert.secToStr(endSec)}]`;
  }

  static arrange(transcriptions, times){

    const result = [];

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

        result.push(
          this.formatSec(startSec, endSec) + "\n" +
          buffer.join("\n").replaceAll(/\n(?![・→])/g, "")
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
      result.push(
        this.formatSec(startSec, endSec) + "\n" +
        buffer.join("\n").replaceAll(/\n(?![・→])/g, "")
      );
    }

    return result;
  }
}