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

      b.addEventListener("click", () => {
        const j = Selection.idx;
        if(j === -1) return;
        if(Badged.can(c)){
          Doc.addBadge(j, c);
          Badged.set(j, Badged.createBadges(j));
        }else{
          const isMultiLine = Doc.getTextBody(j).value.slice(TextBody.selection.start, TextBody.selection.end).includes("\n");
          const paraNum = TextBody.getSelectionParaNum(j);

          if(c === "c"){
            if(isMultiLine || TextBody.hasComment(j, paraNum) || !Doc.hasCharsInPara(j, paraNum)) return;
            if(TextBody.hasResponse(j, paraNum)){
              Doc.disableResponse(j, paraNum);
            }
            TextBody.setComment(j, paraNum);
            TextBody.resetResponsePos(j);
          }else if(c === "r"){
            if(isMultiLine || TextBody.hasResponse(j, paraNum) || !Doc.hasCharsInPara(j, paraNum)) return;
            if(TextBody.hasComment(j, paraNum)){
              Doc.disableComment(j, paraNum);
            }
            TextBody.setResponse(j, paraNum);
            TextBody.resetCommentPos(j);
          }
        }
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