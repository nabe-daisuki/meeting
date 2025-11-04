class Meta {
  static firstTitle = "";

  static init(){
    this.firstTitle = document.title;
  }

  static resetTitle(isEdited = false){
    document.title = this.createTitle(isEdited);
  }

  static createTitle(isEdited = false){
    const textFilename = TextFile.getName();
    const audioFilename = audioInfo.fileName;
    const parts = [];

    if(isEdited) parts.push("⚠️");

    if(isWindowBlur) parts.push("💤");
    else parts.push("🎧");

    let text = "";
    if(textFilename){
      text += "📝";
    }
    if(audioFilename){
      text += "🎵";
    }

    const filename = textFilename || audioFilename;
    if(filename){
      text += filename.split("__")[0];
    }
    if(text) parts.push(text);

    if(!isWindowBlur && parts.length === 1) return this.firstTitle;
    else return parts.join("|");
  }
}