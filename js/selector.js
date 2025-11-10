class Selector {
  static preSide = "";
  static preCheckedIdx = -1;

  static initPreCheckedIdx(){
    this.preSelectedIdx = -1;
  }
  static setPreCheckedIdx(i){
    this.preSelectedIdx = i
  }

  static create(i){
    const lbl = Elem.create("label", {cl: "selector-box"});
    lbl.addEventListener("dragover", e => e.preventDefault());

    const selector = Elem.create("input", {cl: "selector dark_theme_yellow"});
    selector.type = "checkbox";
    selector.addEventListener("focus", e => e.target.blur());
    if(Doc.getDisabled(i)) selector.disabled = true;
    if(Doc.getChecked(i)){
      selector.checked = true;
      DocHeader.check();
    }
    selector.addEventListener("click", e => {
      const isChecked = e.target.checked;
      Doc.setChecked(i, isChecked);
      if(isChecked){
        DocHeader.check();
        Selectors.multiCheck(i);
      }else{
        Selectors.initPreCheckedIdx();
        if(Selectors.hasCheck()) return;
        DocHeader.uncheck();
      }
    });

    lbl.appendChild(selector);

    return lbl;
  }

  static check(i){
    Doc.getSelector(i).checked = true;
  }

  static enable(i){
    Doc.getSelector(i).disabled = false;
  }

  static disable(i){
    Doc.getSelector(i).disabled = true;
  }

  static uncheck(i){
    Doc.getSelector(i).checked = false;
  }
}