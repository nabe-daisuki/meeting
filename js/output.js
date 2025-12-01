class Output {
  static commentAndResponseCount = 0;
  static selectionParaSpans = [];
  static editBefore = "";
  static editing = {
    idx: -1,
    paraNum: -1
  }

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
    let scrollTop = 0;
    const rect = output.getBoundingClientRect();
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
          this.selectionParaSpans.push({
            chars: paras[j],
            idx: i,
            paraNum: j
          });
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
        l.style.backgroundColor = "#63630038";
        this.selectionParaSpans.forEach((p, j) => {
          const s = Elem.create("span");
          s.dataset.idx = p.idx;
          s.dataset.paranum = p.paraNum;
          s.setAttribute("contenteditable", "true");
          s.style.cursor = "pointer";
          s.textContent = j === 0 ? prefix + p.chars : p.chars;
          s.addEventListener("click", e => {
            e.stopPropagation();
          });
          s.addEventListener("focus", e => {
            const idx = e.target.dataset.idx;
            const paraNum = e.target.dataset.paranum;
            this.editing.idx = idx;
            this.editing.paraNum = paraNum;
            const miniBadge = Doc.getMiniBadge(idx, paraNum);
            this.editBefore = Doc.getCharsPerPara(idx)[paraNum];
            if(miniBadge.includes("c") && !this.editBefore.startsWith("・")){
              this.editBefore = "・" + this.editBefore;
            }else if(miniBadge.includes("r") && !this.editBefore.startsWith("→")){
              this.editBefore = "→" + this.editBefore;
            }
            Scroll.scrollToLine(idx);
          });
          s.addEventListener("blur", e => {
            const el = e.target;
            const editAfter = el.innerText.replace(/\s/g, "");
            el.innerText = editAfter;
            if(this.editBefore === editAfter) return;

            const idx = this.editing.idx;
            const paraNum = Number(this.editing.paraNum);
            if(editAfter.startsWith("・")) Doc.setMiniBadge(idx, paraNum, "c");
            else if(editAfter.startsWith("→")) Doc.setMiniBadge(idx, paraNum, "r");
            else Doc.removeMiniBadge(idx, paraNum);

            const charsPerPara = Doc.getCharsPerPara(idx);
            charsPerPara[paraNum] = editAfter.startsWith("・") || editAfter.startsWith("→") ? editAfter.slice(1) : editAfter;
            const newText = charsPerPara.join("\n");
            const textBody = Doc.getTextBody(idx);
            textBody.value = newText;
            const textBodyBG = Doc.getTextBodyBG(idx);
            textBodyBG.innerHTML = "";
            textBodyBG.textContent = newText + '\u200b';

            Doc.setEditedText(idx, newText);
            
            TextBody.resetCharsPerPara(idx);
            TextBody.resetParaHeights(idx);
            TextBody.resetMiniBadges(i);

            const paraStartPos = TextBody.getParaStartPos(idx, paraNum);
            TextBody.select(idx, paraStartPos, paraStartPos);
          });
          if(p.chars === para) s.classList.add("editing");
          l.appendChild(s);
          if(p.chars === para){
            const top = s.offsetTop;
            scrollTop = top - rect.top -150;
          }
        });
        currentCommentAndResponseCount++;
      });

    }else{
      paras[outputParaNum].classList.add("editing");
      const top = paras[outputParaNum].offsetTop;
      scrollTop = top - rect.top - 150;
    }

    output.scrollTop = scrollTop;
  }

  static toSpan(arranged){
    let i = 1;
    const lines = arranged.split("\n").map(l => {
      const span = Elem.create("span");
      if(l.startsWith("・") || l.startsWith("→")){
        span.style.cursor = "pointer";
        span.dataset.commentcount = i;
        i++;
      }
      span.addEventListener("click", e => {
        const commentCount = Number(e.target.dataset.commentcount);
        const pos = TextBody.getPosFromCommentCount(commentCount);
        if(!pos.idx) return;
        Selection.relocateHighlight(pos.idx);
        Scroll.scrollToLine(pos.idx);

        const startPos = TextBody.getParaStartPos(pos.idx, pos.paraNum);
        TextBody.select(pos.idx, startPos, startPos);
      });
      if(l.startsWith("→")) span.classList.add("response");
      span.textContent = l || " ";
      return span;
    });
    return lines;
  }

  static getCommentAndResponseCount(){

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