class PanelHeader {
  static height = 0;
  static getHeight(){
    return this.height;
  }

  static setHeight(val){
    this.height = val;
  }

  static create(textFile){
    const elem = document.createElement("div");
    elem.className = "panel-header";

    const allEffector = document.createElement("input");
    allEffector.type = "checkbox";
    allEffector.style.width = "20px";
    allEffector.onclick = e => {
      const Side = textFile.side === "left" ? lSide : rSide;
      if(e.target.checked){
        Side.divs.forEach( (l, i) => {
          if(Side.lines[i].disabled) return;
          l.querySelector("input").checked = true
        });
      }else{
        Side.divs.forEach(l => l.querySelector("input").checked = false);
      }
    }

    const fileName = document.createElement("span");
    if(textFile.side === "left"){
      allEffector.id = "left-all-effector";
      fileName.textContent = `${textFile.name}`;
    }else{
      allEffector.id = "right-all-effector";
      fileName.textContent = `②${textFile.name}`;
    }

    elem.appendChild(allEffector);
    elem.appendChild(fileName);
    return elem;
  }
}