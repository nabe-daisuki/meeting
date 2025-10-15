class TextSpan {
  static selectionStr = {
    start: -1,
    end: -1
  }
  static draggingMiniComment = {
    elem: null,
    lineIdx: -1,
    commentIdx: -1
  }

  static setDraggingMiniComment(elem, lineIdx, commentIdx){
    this.draggingMiniComment.elem = elem;
    this.draggingMiniComment.lineIdx = lineIdx;
    this.draggingMiniComment.commentIdx = commentIdx;
  }
  static getDraggingMiniComment(){
    return this.draggingMiniComment;
  }
  static initDraggingMiniComment(){
    this.draggingMiniComment.elem = null;
    this.draggingMiniComment.lineIdx = -1;
    this.draggingMiniComment.commentIdx = -1;
  }

  static create(Side, idx){
    const line = Side.lines[idx];

    const textSpanBody = this.createElem("div", "FlexTextarea");
    if(Side.lines[idx].hided) textSpanBody.style.display = "none";

    const textSpanDummy = this.createElem("div", "text FlexTextarea__dummy");
    const textSpan = this.createElem("textarea", "text FlexTextarea__textarea");
    textSpan.textContent = line.editedText || line.text;
    textSpan.oninput = e => {
      textSpanDummy.textContent = e.target.value + '\u200b';
    }
    if(line.editedText) textSpan.classList.add("edited");

    textSpan.oncontextmenu = e => {
      const elem = e.target;
      if(elem.selectionStart === elem.selectionEnd) return;

      this.selectionStr.start = elem.selectionStart;
      this.selectionStr.end = elem.selectionEnd;

      console.log(this.selectionStr.start);
      console.log(this.selectionStr.end);
      
      if(this.selectionStr.start === -1) return;

      const textSpan = e.target;
      const prefix = textSpan.value.slice(0, TextSpan.selectionStr.start);
      const surfix = textSpan.value.slice(TextSpan.selectionStr.end)
      const replacedText = prefix + surfix;
      textSpan.textContent = replacedText;

      const caretPos = prefix.length;
      console.log(caretPos)
      textSpan.setSelectionRange(caretPos, caretPos);
      textSpan.focus();

      Side.setLineText(replacedText, idx);
      this.resetCharCounts(idx);
      this.resetParagraphs(idx);
      this.resetCommnetPos(idx);

      TextSpan.initSelection();

      e.stopPropagation();
      e.preventDefault();
    }
    textSpan.addEventListener("focusin", () => {
      Selection.relocateHighlight(Side, idx);
    });
    textSpan.addEventListener("focusout", e => {
      Side.setLineText(e.target.value, idx);
      this.resetCharCounts(idx);
      this.resetParagraphs(idx);
      this.resetCommnetPos(idx);
    });
    textSpan.addEventListener('mousedown', e => {
      // ミドルクリック
      if (e.button !== 1) return;

      const elem = e.target;
      if(elem.selectionStart === 0 && elem.selectionEnd === 0) return;

      this.selectionStr.start = elem.selectionStart;
      this.selectionStr.end = elem.selectionEnd;
      
      if(TextSpan.selectionStr.start === -1) return;
      e.preventDefault();

      ContextMenu.show(e.clientX, e.clientY);
    });
    textSpan.addEventListener("mouseup", e => {
      if(Side.lines[idx].editedText) return;
      if(e.button !== 0) return;

      this.selectionStr.start = e.target.selectionStart;
      this.selectionStr.end = e.target.selectionEnd;

      if(this.selectionStr.start !== this.selectionStr.end) return;
      
    });


    textSpan.addEventListener("drop", e => {
      const content = e.dataTransfer.getData('text/plain');
      if(content === "森_SPEAKER" || content === "田中_SPEAKER" || content === "佐藤_SPEAKER"){
        e.preventDefault();
        const offsetX = e.clientX;
        const offsetY = e.clientY;

        const caretIndex = this.getCaretIndexFromPosition(textSpanBody, e.target, offsetX, offsetY);// - this.getOffsetTop(idx);
        // console.log("補正済みドロップ位置:", caretIndex);

        if(caretIndex <= -1) return;

        let offset = 0;
        const lineNum = Side.lines[idx].charCounts.findIndex(charCount => {
          let result = offset + charCount > caretIndex;
          offset += charCount;
          return result;
        });

        const textSpan = e.target;

        const speaker = content.split("_")[0];
        const replacedText = textSpan.value.split("\n").map((l, i) => {
          if(i === lineNum) return this.resetSpeaker(l, speaker);
          else return l;
        }).join("\n");

        textSpan.value = replacedText;
        Side.setLineText(replacedText, idx);
        this.resetCharCounts(idx);
        this.resetParagraphs(idx);
        this.resetCommnetPos(idx);

        textSpan.setSelectionRange(caretIndex, caretIndex);
        textSpan.focus();
      }else if(content === "ATTACHMENT_BADGE" || content === "START_BADGE"){
        e.preventDefault();
      }else if(["COMMENT_BADGE", "MINI_COMMENT_BADGE"].includes(content)){
        e.preventDefault();
        
        const offsetX = e.clientX;
        const offsetY = e.clientY;

        const caretIndex = this.getCaretIndexFromPosition(textSpanBody, e.target, offsetX, offsetY);// - this.getOffsetTop(idx);
        // console.log("補正済みドロップ位置:", caretIndex);

        if(caretIndex <= -1) return;

        let offset = 0;
        const lineNum = Side.lines[idx].charCounts.findIndex(charCount => {
          let result = offset + charCount > caretIndex;
          offset += charCount;
          return result;
        });

        if(this.hasComment(idx, lineNum)) return;
        if(content === "MINI_COMMENT_BADGE"){
          const comment = this.getDraggingMiniComment();
          comment.elem.remove();
          this.disableComment(comment.lineIdx, comment.commentIdx);
          this.initDraggingMiniComment();
        }
        this.insertComment(textSpanBody, idx, lineNum);
      }else{
        console.log("a");
      }
    });

    textSpanBody.appendChild(textSpanDummy);
    textSpanBody.appendChild(textSpan);

    return textSpanBody;
  }

  static resetSpeaker(text, speaker){
    const pattern = /（[^（）]*?）$/;

    if (pattern.test(text)) {
        return text.replace(pattern, `（${speaker}）`);
    }else{
      return `${text}（${speaker}）`;
    }
  }

  static createElem(tagName, className){
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
  }

  static initSelection(){
    this.selectionStr.start = -1;
    this.selectionStr.end = -1;
  }

  static getCaretIndexFromPosition(textSpanBody, textSpan, x, y) {
    const measureTopDiv = this.createMeasureTopDiv(textSpanBody, textSpan);

    const textLen = textSpan.value.length;
    const text = textSpan.value;

    let index = -1;
    for (let i = 0; i < textLen; i++) {
      const span = document.createElement("span");
      span.textContent = text[i];
      measureTopDiv.appendChild(span);
      const rect = span.getBoundingClientRect();
      if (rect.top <= y && rect.bottom >= y && rect.left < x && rect.right > x) {
        index = i;
        break;
      }
    }

    this.removeMeasureTopDiv(textSpanBody);
    return index;
  }

  static enableComment(idx, lineNum){
    lSide.lines[idx].comments[lineNum] = true;
  }

  static disableComment(idx, lineNum){
    lSide.lines[idx].comments[lineNum] = false;
  }

  static hasComment(idx, lineNum){
    return lSide.lines[idx].comments[lineNum];
  }

  static insertComment(textSpanBody, idx, lineNum){
    const commentBadge = document.createElement("div");
    commentBadge.className = "badge mini-badge";
    commentBadge.draggable = true;
    commentBadge.style.top = lSide.lines[idx].paragraphs[lineNum][0] - 3 + "px";
    const commentIcon = document.createElement("img");
    commentIcon.src = "img/comment-mini.png";

    commentBadge.addEventListener("contextmenu", e => {
      e.stopPropagation();
      e.preventDefault();
      e.target.remove();
      this.disableComment(idx, lineNum);
    });

    commentBadge.addEventListener("dragstart", e => {
      this.setDraggingMiniComment(e.target, idx, lineNum);
      e.dataTransfer.setData("text/plain", "MINI_COMMENT_BADGE");
      e.dataTransfer.effectAllowed = "copy";
    });

    commentBadge.appendChild(commentIcon);
    textSpanBody.appendChild(commentBadge);
    this.enableComment(idx, lineNum);
  }

  static resetCharCounts(idx){
    const line = lSide.lines[idx];
    const text = line.editedText || line.text;
    line.charCounts = text.split("\n").map(l => l.length + 1);
  }

  static resetParagraphs(idx){
    this.clearParagraphs(idx);

    const div = lSide.divs[idx];
    const textSpanBody = div.querySelector(".FlexTextarea");
    const textSpan = textSpanBody.querySelector(".FlexTextarea__textarea");

    const measureTopDiv = this.createMeasureTopDiv(textSpanBody, textSpan);

    let offset = 0;

    const line = lSide.lines[idx];
    const charCountsLen = line.charCounts.length;
    line.paragraphs = new Array(charCountsLen).fill(null).map(() => []);;

    for(let i = 0; i < charCountsLen; i++){
      const charCount = line.charCounts[i];

      const text = textSpan.value.slice(offset, offset + charCount);
      const textLen = text.length;
      
      for(let j = 0; j < textLen; j++){
        const span = document.createElement("span");
        span.textContent = text[j];

        if(lSide.rephists.length != 0){
          const rephist = [];
          for(let k = 0; k < lSide.rephists[0].length; k++){
            if(!lSide.rephists[0][k].includes(offset + j))continue;
            rephist.push(k);
          }
          if(rephist.length != 0){
            span.style.backgroundColor = "#ffc8c8";
            span.style.color = "#ffc8c8";
            span.style.display = "inline-block";
          }else{          
            span.style.color = "transparent";
          }
        }

        measureTopDiv.appendChild(span);

        const rect = span.getBoundingClientRect();
        const top = rect.top - this.getOffsetTop(idx);
        if(!line.paragraphs[i].includes(top))line.paragraphs[i].push(top);
      }

      offset += charCount;
    }

    this.removeMeasureTopDiv(textSpanBody);
  }

  static clearParagraphs(idx){
    lSide.lines[idx].paragraphs.length = 0;
  }

  static resetCommnetPos(idx){
    this.clearCommnets(idx);

    lSide.lines[idx].comments.forEach((comment, i) => {
      if(!comment) return;
      const textSpanBody = lSide.divs[idx].querySelector("div.FlexTextarea");
      this.insertComment(textSpanBody, idx, i);
    });
  }

  static clearCommnets(idx){
    const div = lSide.divs[idx];
    Array.from(div.querySelectorAll("div.FlexTextarea div.mini-badge")).forEach(commentBadge => {
      commentBadge.remove();
    });
  }

  static createMeasureTopDiv(parent, textarea){
    const div = document.createElement("div");
    div.id = "measure-top-div"
    // const style = getComputedStyle(textarea);
    // for (const prop of style) div.style[prop] = style[prop];

    div.style.overflow = "hidden";
    div.style.boxSizing = "border-box";
    div.style.padding = "5px 15px 5px 45px";
    div.style.position = "absolute";
    div.style.top = "0";
    div.style.left = "0";
    div.style.whiteSpace = "pre-wrap";
    div.style.width = textarea.offsetWidth + "px";
    div.style.height = textarea.offsetHeight + "px";
    div.style.marginLeft = "5px";

    parent.appendChild(div);

    return div;
  }

  static getOffsetTop(idx){
    return Header.getHeight()
      + PanelHeader.getHeight()
      - lPanel.scrollTop
      + lSide.divs.slice(0, idx).reduce((acc, cur) => acc + cur.offsetHeight, 0)
      + LineDiv.getBorderWidth()
      + LineDiv.getPaddingTop();
  }

  static removeMeasureTopDiv(parent){
    parent.querySelector("#measure-top-div").remove();
  }
}