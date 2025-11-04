class DocHeader {
  static elem = null;

  static height = 0;
  static getHeight(){
    return this.height;
  }
  static calcHeight(){
    this.height = this.elem.offsetHeight;
  }

  static init(){
    const elem = Elem.create("div", {cl: "doc-header"});

    const allSelector = Elem.create("input", {id: "all-selector"});
    allSelector.type = "checkbox";
    allSelector.style.width = "20px";
    allSelector.addEventListener("click", e => {
      if(e.target.checked){
        Doc.getDivs().forEach( ( _, i ) => {
          if(Doc.getDisabled(i)) return;
          Doc.getSelector(i).checked = true;
          Doc.setChecked(i, true);
        });
      }else{
        Doc.getDivs().forEach( ( _, i ) => {
          Doc.getSelector(i).checked = false;
          Doc.setChecked(i, false);
        });
      }
    });

    const fileName = Elem.create("span");
    fileName.textContent = TextFile.getName();

    elem.appendChild(allSelector);
    elem.appendChild(fileName);

    this.elem = elem;
    return elem;
  }
  static get(){
    return this.elem;
  }

  static getSelector(){
    return this.elem.querySelector("#all-selector");
  }

  static check(){
    this.getSelector().checked = true;
  }
  static uncheck(){
    this.getSelector().checked = false;
  }
}