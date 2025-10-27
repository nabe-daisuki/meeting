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
    const elem = Elem.create("input", {cl: "selector"});
    elem.type = "checkbox";
    elem.style.width = "20px";
    elem.style.cursor = "pointer";
    elem.addEventListener("focus", e => e.target.blur());
    if(Doc.getDisabled(i)) elem.disabled = true;
    if(Doc.getChecked(i)) elem.checked = true;

    elem.addEventListener("click", e => {
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

    return elem;
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