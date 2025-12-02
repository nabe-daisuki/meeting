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

  static unsetHighlight(){
    [...output.children].find(p => p.classList.contains("editing"))?.classList.remove("editing");
  }

  static createSelectionCommentSpans(selectionPara, commentCountBeforeSelection){
    const charsInfo = [];

    let commentCount = 0;
    let isResponseComment = false;
    const lines = Doc.getLines();
    for(let i = 0; i < lines.length; i++){
      if(!lines[i].editedText) continue;
      const miniBadges = lines[i].miniBadges;
      const charsPerPara = lines[i].charsPerPara;

      for(let paraNum = 0; paraNum < charsPerPara.length; paraNum++){
        const chars = charsPerPara[paraNum];
        const miniBadge = miniBadges[paraNum];
        if(/^[・→]/.test(chars) || miniBadges[paraNum] !== "n") commentCount++;
        if(commentCount !== commentCountBeforeSelection) continue;
        if(chars.startsWith("→") || miniBadge === "r") isResponseComment = true;
        if(/^[『【]/.test(chars)) continue;
        charsInfo.push({
          chars,
          idx: i,
          paraNum
        });
      }
      if(commentCount > commentCountBeforeSelection) break;
    }


    const spans = [];
    for(let partNum = 0; partNum < charsInfo.length; partNum++){
      const span = Elem.create("span");
      span.dataset.idx = charsInfo[partNum].idx;
      span.dataset.paranum = charsInfo[partNum].paraNum;
      span.setAttribute("contenteditable", "true");
      span.style.cursor = "pointer";

      let chars = charsInfo[partNum].chars;
      if(partNum === 0){
        if(isResponseComment) chars = chars.startsWith("→") ? chars : `→${chars}`;
        else chars = chars.startsWith("・") ? chars : `・${chars}`;
      }
      span.innerText = chars;

      span.addEventListener("click", e => {
        e.stopPropagation();
      });
      span.addEventListener("focus", e => {
        const idx = e.target.dataset.idx;
        const paraNum = e.target.dataset.paranum;
        this.editing.idx = idx;
        this.editing.paraNum = paraNum;
        this.editBefore = chars;
        Scroll.scrollToLine(idx);
      });
      span.addEventListener("blur", e => {
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
        TextBody.resetMiniBadges(idx);

        const paraStartPos = TextBody.getParaStartPos(idx, paraNum);
        TextBody.select(idx, paraStartPos, paraStartPos);
      });
      if(chars === selectionPara) span.classList.add("editing");
      spans.push(span);
    }

    return spans;
  }

  static scroll(){
    if(TextBody.selection.start == -1) return System.warn("編集ブロックが選択されていないため、スクロール処理はされません。");
    const i = Selection.idx;
    const charsPerPara = Doc.getCharsPerPara(i);
    const paraNum = TextBody.getSelectionParaNum(i);
    const miniBadge = Doc.getMiniBadge(i, paraNum);

    const para = miniBadge === "n"
      ? charsPerPara[paraNum]
      : miniBadge === "c" && !charsPerPara[paraNum].startsWith("・")
        ? `・${charsPerPara[paraNum]}`
        : miniBadge === "r" && !charsPerPara[paraNum].startsWith("→")
          ? `→${charsPerPara[paraNum]}`
          : charsPerPara[paraNum];
    if(para.trim() === "") return System.warn(`${TimeStamp.toTimeRangeStr(Doc.getLine(i).startSec)}の編集ブロックの${paraNum}行目は空行のため、スクロール処理はされません。`);
    
    const paras = output.children;

    
    const outputParaNum = [...paras].findIndex(l => {
      return l.textContent.includes(para);
    });

    if(outputParaNum === -1) return;
    
    const commentCountBeforeSelection = TextBody.getCommentCountBeforeSelection();
    if(commentCountBeforeSelection === -1) return;

    this.unsetHighlight();

    let scrollTop = 0;
    const rect = output.getBoundingClientRect();
    if(commentCountBeforeSelection > 0) {
      const spans = this.createSelectionCommentSpans(para, commentCountBeforeSelection);

      let commentCount = 0;
      for(let commentNum = 0; commentNum < paras.length; commentNum++){
        const comment = paras[commentNum];
        if(/^[・→]/.test(comment.textContent)) commentCount++;
        if(commentCount !== commentCountBeforeSelection) continue;
        comment.innerHTML = "";
        comment.style.backgroundColor = "#63630038";
        spans.forEach(s => {
          comment.appendChild(s);
          if(s.innerText === para){
            const top = s.offsetTop;
            scrollTop = top - rect.top - 150;
          }
        });
        break;
      }
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