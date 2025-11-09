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

  static async input(file){
    TextFile.setData(file);
    TextFile.setName(file.name);

    Doc.clearRepInfos();
    Doc.clearLines();
    await FileParser.parse();

    Meta.resetTitle();

    DocHeader.init();
    Render.render();
    Save.enable();
  }
}