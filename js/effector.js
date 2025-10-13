class Effector {
  static preSide = "";
  static preIdx = -1;

  static create(Side, idx){
    const elem = document.createElement("input");
    elem.type = "checkbox";
    elem.style.width = "20px";
    elem.style.cursor = "pointer";
    elem.addEventListener("focus", e => e.target.blur());
    if(Side.lines[idx].disabled) elem.disabled = true;
    if(Side.lines[idx].checked) elem.checked = true;

    elem.onclick = e => {
      if(e.target.checked){
        Side.lines[idx].checked = true;
        if(!KeyBorad.hasShift){ 
          Effector.preSide = Side.side;
          Effector.preIdx = idx;
          document.getElementById(`${Side.side}-all-effector`).checked = true;
          return;
        }
        if(Effector.preSide !== Side.side || Effector.preSide === "" ){
          document.getElementById(`${Side.side}-all-effector`).checked = true;
        }else{
          const minIdx = Math.min(Effector.preIdx, idx);
          const maxIdx = Math.max(Effector.preIdx, idx);

          for(let i = minIdx; i < maxIdx; i++){
            Side.divs[i].querySelector("input").checked = true;
          }
        }
        Effector.preSide = Side.side;
        Effector.preIdx = idx;
      }else{
        const checkedDiv = Side.divs.find(l => l.querySelector("input").checked);
        Effector.preSide = "";
        Effector.preIdx = -1;
        Side.lines[idx].checked = false;
        if(checkedDiv) return;
        document.getElementById(`${Side.side}-all-effector`).checked = false;
      }
    }
    return elem;
  }

  static check(Side, idx){
    const checkBox = Side.divs[idx].querySelector("input");
    checkBox.disabled = true;
  }

  static enable(Side, idx){
    const checkBox = Side.divs[idx].querySelector("input");
    checkBox.disabled = false;
  }

  static disable(Side, idx){
    this.uncheck(Side, idx);
    const checkBox = Side.divs[idx].querySelector("input");
    checkBox.disabled = true;
  }

  static uncheck(Side, idx){
    const checkBox = Side.divs[idx].querySelector("input");
    checkBox.checked = false;
  }
}