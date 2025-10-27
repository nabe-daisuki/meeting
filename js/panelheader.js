class PanelHeader {
  static height = 0;
  static getHeight(){
    return this.height;
  }
  static setHeight(val){
    this.height = val;
  }

  static create(){
    const elem = Elem.create("div", {cl: "panel-header"});

    const allSelector = Elem.create("input", {id: "all-selector"});
    allSelector.type = "checkbox";
    allSelector.style.width = "20px";
    allSelector.onclick = e => {
      if(e.target.checked){
        Doc.divs.forEach( ( _, i ) => {
          if(Doc.lines[i].disabled) return;
          Doc.getSelector(i).checked = true;
        });
      }else{
        Doc.divs.forEach( ( _, i ) => Doc.getSelector(i).checked = false);
      }
    }

    const fileName = Elem.create("span");
    fileName.textContent = TextFile.getName();

    elem.appendChild(allSelector);
    elem.appendChild(fileName);
    return elem;
  }
}