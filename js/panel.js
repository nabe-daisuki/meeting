class Panel {
  static init(){
    this.setEditorPanelH();
  }

  static setEditorPanelH(){
    editorPanel.style.height = `calc(100vh - ${Header.getHeight()}px)`;
  }

  static getRightPanelH(){
    const totalH = rPanel.clientHeight;
    const paddingT = Elem.getStyleNum(rPanel, "padding-top");
    const paddingB = Elem.getStyleNum(rPanel, "padding-top");
    const h = Calc.sub(totalH, [paddingT, paddingB]);
    return h;
  }
}