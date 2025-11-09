class KeyBoard {
  static hasShift = false;
  static hasCtrl = false;
  static hasAlt = false;

  static otherKeyPressed = false;

  static shortCut = [
    "F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12", //"F1"
    "Ctrl+1","Ctrl+2","Ctrl+3","Ctrl+4","Ctrl+5","Ctrl+6","Ctrl+7","Ctrl+8","Ctrl+9","Ctrl+0",
    "Ctrl+D","Ctrl+E","Ctrl+F","Ctrl+S", //"Ctrl+Q", "Ctrl+R"
    "Ctrl+F1","Ctrl+F2","Ctrl+F3","Ctrl+F4","Ctrl+F5","Ctrl+F6","Ctrl+F7","Ctrl+F8","Ctrl+F9","Ctrl+F10","Ctrl+F11","Ctrl+F12",
    "Ctrl+Shift+1","Ctrl+Shift+2","Ctrl+Shift+3","Ctrl+Shift+4","Ctrl+Shift+5","Ctrl+Shift+6","Ctrl+Shift+7","Ctrl+Shift+8","Ctrl+Shift+9",
    "Ctrl+Shift+A","Ctrl+Shift+C","Ctrl+Shift+D","Ctrl+Shift+E","Ctrl+Shift+F","Ctrl+Shift+Q","Ctrl+Shift+R","Ctrl+Shift+V","Ctrl+Shift+X","Ctrl+Shift+Z",
    "Ctrl+Shift+F1","Ctrl+Shift+F2","Ctrl+Shift+F3","Ctrl+Shift+F4","Ctrl+Shift+F5","Ctrl+Shift+F6","Ctrl+Shift+F7","Ctrl+Shift+F8","Ctrl+Shift+F9","Ctrl+Shift+F10","Ctrl+Shift+F11","Ctrl+Shift+F12",
  ];

  static shiftMap = {
    key:   ["1", "2",  "3", "4", "5", "6", "7", "8", "9"],
    shift: ["!", "\"", "#", "$", "%", "&", "'", "(", ")"]
  }

  static getKeyString(e){
    const keys = [];
    if(e.ctrlKey) keys.push("Ctrl");
    if(e.shiftKey) keys.push("Shift");
    if(e.altKey) keys.push("Alt");
    if(this.shiftMap.shift.includes(e.key)){
      const idx = this.shiftMap.shift.findIndex(s => s === e.key);
      keys.push(this.shiftMap.key[idx]);
    }else{
      keys.push(e.key);
    }

    return keys.join("+");
  }
}


let ctrlTimer = null;

document.addEventListener("keydown", e => {
  if(e.shiftKey) KeyBoard.hasShift = true;
  if(e.ctrlKey){
    KeyBoard.hasCtrl = true;
    if(!ctrlTimer){
      ctrlTimer = setTimeout(() => {
        if(KeyBoard.otherKeyPressed) return;
        console.log("2000");
        ShortCutHelper.show();
      }, 2000);
    }
  }
  if(e.altKey) KeyBoard.hasAlt = true;

  if(e.key !== "Control") KeyBoard.otherKeyPressed = true;

  const keyString = KeyBoard.getKeyString(e);
  const shortCuts = Config.getShortCuts().find(s => keyString === s.value.at(-1));
  
  if(!shortCuts) return;

  const type = shortCuts.type;
  switch(type){
    case "seek-forward":
      if(AudioFile.getBytes()) AudioController.seek(Number(shortCuts.value[0]));
      break;
    case "seek-backward":
      if(AudioFile.getBytes()) AudioController.seek(Number(shortCuts.value[0]) * -1);
      break;
    case "speed":
      if(AudioFile.getBytes()) AudioController.speed(Number(shortCuts.value[0]));
      break;
    case "save":
      if(!saveBtn.disabled) Save.defaultSave();
      break;
    case "named-save":
      if(!namedSaveBtn.disabled) Save.namedSave();
      break;
    case "play-pause":
      if(AudioFile.getBytes()) {
        if(AudioState.isPlaying()) AudioController.pause();
        else AudioController.play();
      }
      break;
    default:
      alert("キー操作に対する処理がプログラムされていません。");
      return;
  }
  e.preventDefault();
  
});

document.addEventListener("keyup", e => {
  if(!e.shiftKey){
    KeyBoard.hasShift = false;
  }

  if(!e.ctrlKey){
    KeyBoard.hasCtrl = false;

    clearTimeout(ctrlTimer);
    ctrlTimer = null;
    KeyBoard.otherKeyPressed = false;
    setTimeout(() => {
      ShortCutHelper.hide();
      console.log("1000");
    }, 1000);
  }
});