class Header {
  static isClosedMainTools = false;
  static getHeight(){
    return header.offsetHeight;
  }

  static init(){
    mainToolOpenCloseBtn.addEventListener("click", () => {
      if(!this.isClosedMainTools){
        inputerArea.classList.add("hide");
        effectArea.classList.add("hide");
        saveArea.classList.add("hide");
        exportArea.classList.add("hide");

        mainToolOpenCloseBtn.querySelector("img").src = `img/theme/${Theme.get()}/open.png`;
        mainToolsArea.style.height = "25px";
        this.isClosedMainTools = true;
      }else{
        Render.mainTool();
        effectArea.classList.remove("hide");
        saveArea.classList.remove("hide");
        exportArea.classList.remove("hide");

        mainToolOpenCloseBtn.querySelector("img").src = `img/theme/${Theme.get()}/close.png`;
        mainToolsArea.style.height = "auto";
        this.isClosedMainTools = false;
      }
      setEditorPanelH();
    });
  }
}