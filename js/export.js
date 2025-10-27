class Export {
  static init(){
    exportGreen.onclick = () => this.exportGreenText();
    exportGreen.addEventListener("focus", () => exportGreen.blur());
  }

  static exportGreenText() {
    const output = [];

    console.log("fffd")

    for(let i=0; i<Doc.getLines().length; i++){
      const line = Doc.getLine(i);
      if(line.color !== "g") continue;
      // output.push(this.formatLine(lLine));
      
      const text = line.editedText || line.text;
      console.log(text);
      text.split("\n").forEach( (l, j) => {
        if(line.comments[j]) output.push(`・${l}`);
        else if(line.responses[j]) output.push(`→${l}`);
        else output.push(l);
      });
      console.log(output)
    }

    console.log("fdfdfddddddd")
    console.log(output.join('\n'));
    console.log("kdjfdjgdfiojoi")

    if(output.length === 0){
      alert("出力対象の行はありません。");
      return;
    }

    console.log("sfdfd");

    // Save.save("green-line_文字起こし整理結果(時間あり).txt", output.join('\n'));
    
    // const timeless = output.map(line => {
    //   let match = line.match(/(\[\d{2}:\d{2}:\d{2} -> \d{2}:\d{2}:\d{2}\]) (.*)/);
    //   return match ? match[2] : line;
    // });
    Save.save("コメント部のみ.txt", output.join("\n").replaceAll(/\n(?![・→])/g, ""));
  }

  static formatLine(line){
    return `[${Convert.secToStr(line.startSec)} -> ${Convert.secToStr(line.endSec)}] ${line.editedText || line.text}`;
  }
}