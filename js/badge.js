class Badge {
  static name = {
    a: "attachment",
    c: "comment",
    s: "start",
    r: "response"
  }

  static init(){
    Array.from(badges.querySelectorAll(".badge")).forEach( b => {
      const c = b.id.slice(0, 1);
      b.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", `${this.name[c].toUpperCase()}_BADGE`);
        e.dataTransfer.effectAllowed = "copy";
      });
    });
  }

  static createSmall(i, c){
    const elem = Elem.create("div", {cl: "badge small-badge"});
    elem.addEventListener("contextmenu", e => {
      e.stopPropagation();
      e.preventDefault();
      e.target.remove();
      Doc.removeBadge(i, c);
    });

    const icon = Elem.create("img");
    
    if(c in this.name){
      const w = this.name[c];
      elem.classList.add(`${w}-badge`);
      icon.src = `img/${w}.png`;
    }

    elem.appendChild(icon);
    return elem;
  }

  static strToCharFormat(str){
    return str.slice(0, 1).toLowerCase();
  }
}