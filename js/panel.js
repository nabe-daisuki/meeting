class Panel {
  static init(){
    this.setEditorPanelH();
  }

  static setEditorPanelH(){
    editorPanel.style.height = `calc(100vh - ${Header.getHeight()}px)`;
  }

  static getRightPanelH(){
    const padding = parseFloat(getComputedStyle(rPanel).padding);
    const borderW = parseFloat(getComputedStyle(rPanel).borderWidth);
    return rPanel.clientHeight - padding * 2 - borderW * 2;
  }
}