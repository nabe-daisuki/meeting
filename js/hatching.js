class Hatching {
  static remove(i, isYellow = false){
    const div = Doc.getDiv(i);
    if(!isYellow){
      div.classList.remove("green-hatch");
      Doc.getLine(i).color = null;
    }else{
      div.classList.remove("yellow-hatch");
    }
  }

  static green(i){
    const div = Doc.divs[i];
    const line = Doc.lines[i];
      
    if(line.disabled) return;
    
    if(line.color === "g"){
      this.remove(i);
    }else{
      div.classList.add("green-hatch");
      line.color = "g";
    }
  }

  static yellow(div){
    div.classList.add("yellow-hatch");
  }
}