class TimeStamp {
  static create(i) {
    const line = Doc.getLine(i);
    const elem = Elem.create("div", {cl: `timestamp TS_${Theme.get()}`});
    elem.textContent = this.toTimeRangeStr(line.startSec, line.endSec);
    if(line.hided) elem.style.display = "none";
    
    elem.addEventListener("dragover", e => e.preventDefault());
    elem.addEventListener("click", () => {
      Selection.relocateHighlight(i);
      audio.currentTime = line.startSec;
      if(!Scroll.isAuto) Scroll.scrollToLine(i);
    });
    return elem;
  }

  static toTimeRangeStr(ss, es){
    return `[${Convert.secToStr(ss)} -> ${Convert.secToStr(es)}]`;
    // return `[${Convert.secToStr(ss)} -> ]`;
  }
}