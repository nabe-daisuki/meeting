class Chunk {
  static getPaddingTop(){
    return parseInt(getComputedStyle(Doc.getDiv(0)).paddingTop.slice(0, -2));
  }
  static getBorderWidth(){
    return parseInt(getComputedStyle(Doc.getDiv(0)).borderWidth.slice(0, -2));
  }

  static create(i){
    const line = Doc.getLine(i);
    const div = Elem.create("div", {cl: `chunk CHUNK_${Theme.jpnToCode(Theme.get())}`});
    if(line.disabled) div.classList.add("disabled");
    if(line.color === "g") div.classList.add("green-hatch");
    div.addEventListener("contextmenu", e => {
      Hatching.green(i);
      e.preventDefault();
    });

    const selector = Selector.create(i);

    const textMeta = Elem.create("div", {cl: "textmeta"});

    const ts = TimeStamp.create(i);

    const badged = Badged.create(i);

    const textSpan = TextBody.create(i);

    const invalidBtn = InvalidBtn.create(i);

    div.addEventListener("drop", e => {
      const droppedData = e.dataTransfer.getData("text/plain");
      const c = Badge.strToCharFormat(droppedData);
      if(!Badged.can(c)) return;
      Doc.addBadge(i, c);

      Badged.set(i, Badged.createBadges(i));
    });
    
    textMeta.appendChild(ts);
    textMeta.appendChild(badged);

    div.appendChild(selector);
    div.appendChild(textMeta);
    div.appendChild(textSpan);
    div.appendChild(invalidBtn);

    return div;
  }
}