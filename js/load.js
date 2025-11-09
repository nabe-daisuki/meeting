class Load {
  static init(){
    reloadFileInput.addEventListener("change", this.load);
  }

  static load(e){

    const file = e.target.files[0];
    
    const reader = new FileReader();
    reader.onload = e => {
      const lines = [];

      let stateNum = 0;
      let text = [];
      let lineInfo = {};
      let hasEnteredAudioBlock = false;
      let noAudio = false;
      let isFileEnd = false;
      e.target.result.split('\n').forEach( line => {
        if(isFileEnd) return;
        
        if(line === "&&&&&"){
          isFileEnd = true;
          return;
        }
          
        if(hasEnteredAudioBlock){
          switch(stateNum){
            case 0:
              noAudio = line === "no audio"; 
              text.push(`ファイル名：${line}`);
              break;
            case 1:
              text.push(`長さ：${line}`);
              break;
            case 2:
              text.push(`データサイズ：${line} B`);
              break;
            case 3:
              text.push(`→　${line} KB`);
              break;
            case 4:
              text.push(`→　${line} MB`);
              break;
          }
          stateNum+=1;
          return;
        }

        if(line === "%%%%%"){
          hasEnteredAudioBlock = true;
          return;
        }

        if(line === "@@@@@"){
          lines.push(lineInfo);

          stateNum = 0;
          lineInfo = {};
          return;
        }

        switch(stateNum){
          case 0:
            const match = line.match(/\[(\d+):(\d+):(\d+) -> (\d+):(\d+):(\d+)\]/);
            const [, sh, sm, ss, eh, em, es] = match;
            lineInfo.startSec = +sh*3600 + +sm*60 + +ss;
            lineInfo.endSec = +eh*3600 + +em*60 + +es;
            break;
          case 1:
            lineInfo.text = line.split("|||").join("\n");
            break;
          case 2:
            lineInfo.editedText = line === "null" ? null : line.split("|||").join("\n");
            break;
          case 3:
            lineInfo.disabled = line === "true" ? true : false;
            break;
          case 4:
            lineInfo.color = line === "null" ? null : line;
            break;
          case 5:
            lineInfo.hided = line === "true" ? true : false;
            break;
          case 6:
            lineInfo.checked = line === "true" ? true : false;
            break;
          case 7:
            lineInfo.badges = line;
            break;
          case 8:
            lineInfo.charsPerPara = line.split("|||");
            break;
          case 9:
            lineInfo.paraHeights = line.split("|||");
            break;
          case 10:
            lineInfo.comments = line.split("|||").map(i => i === "1");;
            break;
          case 11:
            lineInfo.responses = line.split("|||").map(i => i === "1");;
            break;
        }
        stateNum+=1; 
      });

      if(!lines.length) return;
      lPanel.innerHTML = "";
      textFileName.innerHTML = `－`;
      
      TextFile.setData(null);
      TextFile.setName("ー");

      Doc.clearLines();

      Doc.insertLines(lines);
      
      TextInput.setTextFileName();

      DocHeader.init();
      Render.render();

      Save.enable();

      Doc.getLines().forEach( (l, i) => {
        if(l.hided){
          Doc.getTimeStamp(i).style.display = "none";
          Doc.getBadged(i).style.display = "none";
          Doc.getTextBox(i).style.display = "none";
        }
        Badged.set(i, Badged.createBadges(i));
      });
      if(Doc.getLines().every(l => l.checked)) DocHeader.check();


      if(noAudio){
        alert("前回保存時に読み込まれた音声はありませんでした。");
      }else{
        text.push("を前回保存時読み込んでいます。");
        alert(text.join("\n"));
      }
    };
    reader.readAsText(file);
  }
}