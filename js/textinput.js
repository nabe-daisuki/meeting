class TextInput {
  static init(){
    textFileInput.onchange = async(e) => {
      const files = e.target.files;
      if(files.length != 1){
        alert("1つのテキストファイルを選択してください");
        return;
      }

      await this.input(files[0]);
    }
  }

  static setTextFileName(){
    const fileName = TextFile.getName();
    if(fileName === ""){
      alert("テキストファイルの名前が取得できません。");
      return;
    }
    textFileName.innerHTML = fileName;
  }

  static async input(file){
    TextFile.setData(file);
    TextFile.setName(file.name);

    Doc.clearLines();
    await FileParser.parse();

    // this.setTextFileName();
    Meta.resetTitle();

    DocHeader.init();
    Render.render();
    Save.enable();
  }
}