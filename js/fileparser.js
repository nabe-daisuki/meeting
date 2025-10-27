class FileParser {
  static parse(){
    return new Promise((resolve, reject) => {
      const textFile = TextFile.getData();
      if(textFile === null){
        alert("テキストデータがありません。");
        return reject();
      }
      const reader = new FileReader();

      reader.onload = e => {
        const lines = e.target.result
          .split('\n')
          .map( l => this.parseLine(l))
          .filter(Boolean);
        
        Doc.insertLines(lines);
        resolve();
      };
      reader.onerror = e => reject(e);
      reader.readAsText(textFile);
    });   
  }

  static parseFromText(text, Side){
    const lines = (text + "\n")
      .split('\n')
      .map( (line, i) => this.parseLine(line, i, Side.side))
      .filter(Boolean);
    
      console.log(lines);
    Side.insertLines(lines);
  }

  static parseLine(preline) {
    const match = preline.match(/\[(\d+):(\d+):(\d+) -> (\d+):(\d+):(\d+)\] (.*)/);
    if (!match) return null;
    const [, sh, sm, ss, eh, em, es, text] = match;
    const line = {...Line.default};
    line.index = -1; // 後に削除
    line.side = "none"; // 後に削除
    line.startSec = +sh*3600 + +sm*60 + +ss;
    line.endSec = +eh*3600 + +em*60 + +es;
    line.text = text.replaceAll("/", "\n");
    line.charsPerPara = text.split("\n");
    line.comments = new Array(line.charsPerPara.length).fill(false);
    line.responses = new Array(line.charsPerPara.length).fill(false);
    return line;
  }
}