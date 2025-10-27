class TextInput {
  static init(){
    textFileInput.onchange = async(e) => {
      const files = e.target.files;
      if(files.length != 1){
        alert("1つのテキストファイルを選択してください");
        return;
      }
      
      TextFile.setData(files[0]);
      TextFile.setName(files[0].name);

      Doc.clearLines();
      await FileParser.parse();

      this.setTextFileName();

      DocHeader.init();
      Render.render();
      Save.enable();
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

  static async inputText(text){
    const lFile = new TextFile({
      data: null,
      name: "kakikukeko",
      side: "left"
    });
    await FileParser.parseFromText(text, lSide);
    textFileNames.innerHTML = lFile.name;

    // Render.render(lFile, rFile);
    Render.render(lFile);
    Save.enable();
  }
}