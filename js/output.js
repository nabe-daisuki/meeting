class Output {
  static commentAndResponseCount = 0;
  static selectionParaSpans = [];

  static write(){
    const transcriptions = [];
    const times = [];
    Export.edited(transcriptions, times);

    const arranged = Export.arrange(transcriptions, times);
    output.innerHTML = "";
    this.toSpan("\n".repeat(20) + arranged.join("\n".repeat(3)) + "\n".repeat(20)).forEach(l => {
      output.appendChild(l);
    });

    this.scroll();
  }

  static scroll(){
    if(TextBody.selection.start == -1) return;
    const i = Selection.idx;
    const chars = Doc.getCharsPerPara(i);
    const paraNum = TextBody.getSelectionParaNum(i);

    const para = chars[paraNum];
    if(para.trim() === "") return;
    const paras = output.children;

    
    const outputParaNum = [...paras].findIndex(l => {
      return l.textContent.includes(para);
    });

    if(outputParaNum === -1) return;

    this.commentAndResponseCount = Doc.getLines().reduce((acc, cur, j) => {
      if(cur.editedText === null || j > i) return acc;
      if(j === i){
        acc += [...cur.miniBadges].slice(0, paraNum + 1).filter(p => p !== "n").length;
        return acc;
      }
      acc += cur.miniBadges.filter(p => p !== "n").length;
      return acc;
    }, 0);

    [...paras].find(p => p.classList.contains("editing"))?.classList.remove("editing");

    console.log(this.commentAndResponseCount);
    if(this.commentAndResponseCount > 0) {
      this.selectionParaSpans.length = 0;
      
      let currentCommentAndResponseCount = 0;
      const lines = Doc.getLines();
      for(let i = 0; i < lines.length; i++){
        if(lines[i].editedText === null) continue;
        const paras = lines[i].charsPerPara;
        for(let j = 0; j < paras.length; j++){
          console.log(paras[j])
          if(paras[j].startsWith("・") && paras[j].startsWith("→") || !lines[i].miniBadges[j].includes("n")) currentCommentAndResponseCount++;
          if(currentCommentAndResponseCount !== this.commentAndResponseCount) continue;
          if(/^[『└\s【]/.test(paras[j])) continue;
          this.selectionParaSpans.push(paras[j]);
        }
        if(currentCommentAndResponseCount > this.commentAndResponseCount) break;
      }
      console.log(this.selectionParaSpans);

      currentCommentAndResponseCount = 0;
      [...paras].forEach(l => {
        if(l.textContent.startsWith("・") || l.textContent.startsWith("→")) currentCommentAndResponseCount++;
        if(currentCommentAndResponseCount !== this.commentAndResponseCount) return;
        const prefix = l.textContent.slice(0, 1);
        l.innerHTML = "";
        this.selectionParaSpans.forEach((p, j) => {
          const s = Elem.create("span");
          s.textContent = j === 0 ? prefix + p : p;
          if(p === para) s.classList.add("editing");
          l.appendChild(s);
        });
        currentCommentAndResponseCount++;
      });

    }else{
      paras[outputParaNum].classList.add("editing");
    }


    
    const top = paras[outputParaNum].offsetTop;
    const rect = output.getBoundingClientRect();
    console.log(top - rect.top - 150);
    output.scrollTop = top - rect.top - 150;
  }

  static toSpan(arranged){
    const lines = arranged.split("\n").map(l => {
      const span = Elem.create("span");
      if(l.startsWith("→")) span.classList.add("response");
      span.textContent = l || " ";
      return span;
    });
    return lines;
  }

  static setOutputH(){
    const totalH = Panel.getRightPanelH();
    const deductions = [
      SubTools.getTabsH(),
      SubTools.getSubToolSectionBorderW() * 2,
      SubTools.getSubToolSectionPaddingT(),
      SubTools.getSubToolHeaderOffsetH(),
      SubTools.getSubToolSectionPaddingB()
    ];
    const h = Calc.sub(totalH, deductions);
    output.style.height = Convert.numToPx(h);
  }
}