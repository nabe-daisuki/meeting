class TextBody {
  static preSelection = {
    start: -1,
    end: -1,
    paras: []
  }
  static selection = {
    start: -1,
    end: -1,
    paras: []
  }

  static dragover = {
    i: -1,
    paraNum: -1
  }

  static contextmenu = {
    i: -1
  }

  static edit = {
    isMouseDown: false,
    isKeydown: false,
    isMouseClicked: false,
    isRightClick: false,
    isArrowTyped: false,
    isDelete: false,
    isBackspace: false,
    isEnter: false,
    isCut: false,
    isPaste: false,
    isSelecting: false,
    isRightCut: false,
    isSpeakerDrop: false,
    isDrop: false
  }
  static draggingText = {
    src: -1,
    dest: -1
  }

  static draggingMiniComment = {
    elem: null,
    lineIdx: -1,
    commentIdx: -1
  }
  static draggingMiniResponse = {
    elem: null,
    lineIdx: -1,
    responseIdx: -1
  }

  static setDragover(_i, _paraNum){
    this.dragover.i = _i;
    this.dragover.paraNum = _paraNum;
  }

  static setDraggingMiniComment(_elem, _lineIdx, _commentIdx){
    this.draggingMiniComment.elem = _elem;
    this.draggingMiniComment.lineIdx = _lineIdx;
    this.draggingMiniComment.commentIdx = _commentIdx;
  }
  static getDraggingMiniComment(){
    return this.draggingMiniComment;
  }
  static initDraggingMiniComment(){
    this.setDraggingMiniComment(null, -1, -1);
  }

  static setDraggingMiniResponse(_elem, _lineIdx, _responseIdx){
    this.draggingMiniResponse.elem = _elem;
    this.draggingMiniResponse.lineIdx = _lineIdx;
    this.draggingMiniResponse.responseIdx = _responseIdx;
  }
  static getDraggingMiniResponse(){
    return this.draggingMiniResponse;
  }
  static initDraggingMiniResponse(){
    this.setDraggingMiniResponse(null, -1, -1);
  }

  static create(i){
    const line = Doc.getLine(i);
    const themeType = Theme.get();

    const textBox = Elem.create("div", {cl: "text-box"});
    if(line.hided) textBox.style.display = "none";

    const textBodyBG = Elem.create("div", {cl: `text text-body-bg TBB_${themeType}`});
    
    const textBody = Elem.create("textarea", {cl: `text text-body TB_${themeType}`});
    textBody.textContent = line.editedText || line.text;
    if(line.editedText){
      textBodyBG.classList.add("TB_edited");
      textBody.classList.add("TB_edited");
    }

    textBody.addEventListener("keydown", e => {
      // console.log("keydown");
      
      this.edit.isKeydown = true;

      const isMultiLine = e.target.value.slice(this.selection.start, this.selection.end).includes("\n");
      const paraNum = this.getSelectionParaNum(i);
      
      switch(e.key){
        case "Tab":
          e.preventDefault();
          const nextIndex = i + Math.sign(Number(KeyBoard.hasShift) - 0.5) * -1;
          if(nextIndex < 0 || nextIndex >= Doc.getLines().length) return;
          Doc.getTextBody(nextIndex).focus();
          break;
        case "F1":
          e.preventDefault();

          if(isMultiLine) return;

          let newSpeakerIdx = 0;
          if(/\（.*?\）$/.test(Doc.getCharsPerPara(i)[paraNum])){
            const speaker = Doc.getCharsPerPara(i)[paraNum].match(/\（.*?\）$/)[0].replace(/[（）]/g, "");
            const speakerIdx = Array.from(Speaker.getBtns()).findIndex(s => speaker === s.textContent.replace(/[（）]/g, ""));
            if(speakerIdx !== Speaker.count() - 1) newSpeakerIdx = speakerIdx + 1;
          }
          const newSpeaker = Speaker.getBtns()[newSpeakerIdx].textContent.replace(/[（）]/g, "");

          const replacedText = textBody.value.split("\n").map((l, j) => {
            if(j === paraNum) return this.resetSpeaker(l, newSpeaker);
            else return l;
          }).join("\n");

          textBody.value = replacedText;
          this.enableEdited(i);
          Doc.setEditedText(i, replacedText);
          
          this.resetCharsPerPara(i);
          this.resetParaHeights(i);
          this.resetCommentPos(i);
          this.resetResponsePos(i);

        case "q":
          if(!KeyBoard.hasCtrl) return;
          e.preventDefault();

          if(isMultiLine || this.hasComment(i, paraNum) || !Doc.hasCharsInPara(i, paraNum)) return;
          if(this.hasResponse(i, paraNum)){
            Doc.disableResponse(i, paraNum);
          }
          this.setComment(i, paraNum);
          this.resetResponsePos(i);
          break;
          
        case "r":
          if(!KeyBoard.hasCtrl) return;
          e.preventDefault();

          if(isMultiLine || this.hasResponse(i, paraNum) || !Doc.hasCharsInPara(i, paraNum)) return;
          if(this.hasComment(i, paraNum)){
            Doc.disableComment(i, paraNum);
          }
          this.setResponse(i, paraNum);
          this.resetCommentPos(i);
          break;
      }
    });
    
    textBody.addEventListener("keyup", e => {
      // console.log("keyup");
      this.edit.isKeydown = false;

      if(!e.shiftKey){
        if(this.edit.isMouseClicked || this.edit.isArrowTyped){
          this.edit.isMouseClicked = false;
          this.edit.isArrowTyped = false;
          return;
        }
      }
      if(!e.ctrlKey){
        if(this.edit.isPaste || this.edit.isCut){
          this.edit.isPaste = false;
          this.edit.isCut = false;
          return;
        }
      }
      if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)){
        if(KeyBoard.hasShift) this.edit.isArrowTyped = true;
      }

      if(e.key === "x"){
        if(KeyBoard.hasCtrl) this.edit.isCut = true;
      }else if(e.key === "v"){
        if(KeyBoard.hasCtrl) this.edit.isPaste = true;
      }else if(e.key === "c"){
        if(KeyBoard.hasCtrl) return;
      }

      if(e.key === "Backspace"){this.edit.isBackspace = true}
      if(e.key === "Delete"){this.edit.isDelete = true}
      if(e.key === "Enter"){this.edit.isEnter = true}

      e.target.dispatchEvent(new Event("selectionchange"));
    });

    textBody.addEventListener("contextmenu", async(e) => {
      // console.log("contextmenu");
      if(this.selection.start === -1) return;

      this.edit.isRightClick = false;
      e.target.dispatchEvent(new Event("selectionchange"));

      const x = e.clientX;
      const y = e.clientY;
      const text = e.target.value;

      const isSelection = this.selection.start !== this.selection.end;
      const isMultiLine = text.slice(this.selection.start, this.selection.end).includes("\n");
      
      await ContextMenu.reset(isSelection, isMultiLine);
      ContextMenu.show(x, y);

      if(isSelection) this.emphasizeSelection(i);
      this.setTransparent(i);

      this.contextmenu.i = i;
      e.stopPropagation();
      e.preventDefault();
      return;

      this.edit.isRightCut = true;

      const prefix = e.target.value.slice(0, this.selection.start);
      const suffix = e.target.value.slice(this.selection.end);
      const replacedText = prefix + suffix;
      e.target.value = replacedText;

      this.setLineText(replacedText, i);
      
      const caretPos = prefix.length;
      e.target.setSelectionRange(caretPos, caretPos);
      e.target.focus();
      
      this.resetCharsPerPara(i);
      this.resetParaHeights(i);

    });

    textBody.addEventListener("click", e => {
      e.stopPropagation();
    });

    textBody.addEventListener("focusin", () => {
      // console.log("focusin");

      if(ContextMenu.isShow) ContextMenu.hide();
      this.invisible(i);
      this.unsetTransparent(i);
      Selection.relocateHighlight(i);
    });

    textBody.addEventListener("focusout", () => {
      // console.log("focusout");
      
      this.visible(i);
    });

    textBody.addEventListener("mousedown", e => {
      // console.log("mousedown");

      this.edit.isMouseDown = true;
      if(KeyBoard.hasShift) this.edit.isMouseClicked = true;
      if(e.button === 2) this.edit.isRightClick = true;
      // if ( e.button === 0 ){
      //   this.isMouseDown = true;
      //   return;
      // }else if (e.button === 1){
      //   const x = e.clientX;
      //   const y = e.clientY;
      //   if(this.selection.start === this.selection.end) return;
      //   if(this.selection.start === -1) return;

      //   this.edit.isRightCut = true;

      //   const prefix = e.target.value.slice(0, this.selection.start);
      //   const suffix = e.target.value.slice(this.selection.end);
      //   const replacedText = prefix + suffix;
      //   e.target.value = replacedText;

      //   this.setLineText(replacedText, i);
        
      //   const caretPos = prefix.length;
      //   e.target.setSelectionRange(caretPos, caretPos);
      //   e.target.focus();
        
      //   this.resetCharsPerPara(i);
      //   this.resetParaHeights(i);

      //   e.stopPropagation();
      //   e.preventDefault();
      // }
    });

    textBody.addEventListener("mouseup", e => {
      // console.log("mouseup");

      this.edit.isMouseDown = false;
      if(KeyBoard.hasShift) this.edit.isKeydown = false;
      if(this.edit.isRightClick) return;
      e.target.dispatchEvent(new Event("selectionchange"));
    });

    textBody.addEventListener("mousemove", e => {
      if(Doc.getEditedText(i)) return;
      const x = e.clientX;
      const y = e.clientY;

      const repinfo = Doc.getRepInfo(i)["replace_histories"];
      Array.from(Doc.getTextBodyBG(i).querySelectorAll("i.has-replace")).some( (el, j) => {
        const r = el.getBoundingClientRect();
        if(r.top >= y || y >= r.bottom || r.left >= x || x >= r.right) return;
        repInfosUl.innerHTML = "";
        const idx = el.getAttribute("idx");
        
        repinfo[idx].forEach( r => {
          const before = Elem.create("span");
          const beforePrefix = Elem.createT(r.before[0]);
          const beforeTarget = Elem.create("span", {cl: "replace-target"});
          beforeTarget.textContent = r.before[1];
          const beforeSuffix = Elem.createT(r.before[2]);

          before.appendChild(beforePrefix);
          before.appendChild(beforeTarget);
          before.appendChild(beforeSuffix);

          const after = Elem.create("span");
          const afterPrefix = Elem.createT(r.after[0]);
          const afterTarget = Elem.create("span", {cl: "replace-target"});
          afterTarget.textContent = r.after[1];
          const afterSuffix = Elem.createT(r.after[2]);

          after.appendChild(afterPrefix);
          after.appendChild(afterTarget);
          after.appendChild(afterSuffix);

          const arrow = Elem.create("span");
          arrow.textContent = "↓";

          const li = Elem.create("li", {cl: `REPINFOS_LI_${Theme.get()}`});
          li.appendChild(before);
          li.appendChild(arrow);
          li.appendChild(after);

          repInfosUl.appendChild(li);
        });
        return true;
      });
    });

    textBody.addEventListener("selectionchange", e => {
      if(this.edit.isMouseDown || this.edit.isKeydown){
        // console.log("s_out");
        this.edit.isSelecting = i;
        return;
      }
      // console.log("selectionchange");
      this.edit.isSelecting = false;

      const el = e.target;
      const currentText = el.value;
      if(this.isEdited(currentText, i)){
        this.enableEdited(i);
        Doc.setEditedText(i, currentText);
      }else{
        this.disableEdited(i);
        Doc.setEditedText(i, null)
      }
      
      this.resetCharsPerPara(i);
      this.resetParaHeights(i);
      this.setSelection(el, i);

      // console.log(`bs: ${this.edit.isBackspace}, dl: ${this.edit.isDelete}, en: ${this.edit.isEnter}, cu: ${this.edit.isCut}, pa: ${this.edit.isPaste}, dr: ${this.edit.isDrop}`);

      this.resetCommentPos(i);
      this.resetResponsePos(i);
      
      this.edit.isBackspace = false;
      this.edit.isDelete = false;
      this.edit.isEnter = false;
      if(i === this.draggingText.dest) this.edit.isDrop = false;
    });

    textBody.addEventListener("dragover", e => {
      const paraNum = this.getDroppedParaNum(i, e.clientY);
      if(this.dragover.i !== -1){
        this.unemphasizeText(this.dragover.i, this.dragover.paraNum);
      }
      if(paraNum === -1)return;
      this.emphasizeText(i, paraNum);
      this.setDragover(i, paraNum);
    });

    textBody.addEventListener("dragstart", () => {
      // console.log("dragstart");
      this.draggingText.src = i;
    });

    textBody.addEventListener("drop", e => {
      // console.log("drop");

      const content = e.dataTransfer.getData('text/plain');
      if(content.includes("_SPEAKER")){
        e.preventDefault();
        this.edit.isSpeakerDrop = true;
        
        const paraNum = this.getDroppedParaNum(i, e.clientY);

        const textBody = e.target;

        const speaker = content.split("_")[0];
        const replacedText = textBody.value.split("\n").map((l, i) => {
          if(i === paraNum) return this.resetSpeaker(l, speaker);
          else return l;
        }).join("\n");

        textBody.value = replacedText;
        this.enableEdited(i);
        Doc.setEditedText(i, replacedText);
        
        this.resetCharsPerPara(i);
        this.resetParaHeights(i);
        this.resetCommentPos(i);
        this.resetResponsePos(i);

      }else if(content === "ATTACHMENT_BADGE" || content === "START_BADGE"){
        e.preventDefault();
      }else if(["COMMENT_BADGE", "MINI_COMMENT_BADGE"].includes(content)){
        e.preventDefault();
        
        const paraNum = this.getDroppedParaNum(i, e.clientY);
        if(this.hasComment(i, paraNum)) return;
        if(!Doc.hasCharsInPara(i, paraNum)) return;
        if(this.hasResponse(i, paraNum)){
          Doc.disableResponse(i, paraNum);
        }
        if(content === "MINI_COMMENT_BADGE"){
          const comment = this.getDraggingMiniComment();
          comment.elem.remove();
          Doc.disableComment(comment.lineIdx, comment.commentIdx);
          this.initDraggingMiniComment();
        }
        this.setComment(i, paraNum);
        this.resetResponsePos(i);

      }else if(["RESPONSE_BADGE", "MINI_RESPONSE_BADGE"].includes(content)){
        e.preventDefault();
        
        const paraNum = this.getDroppedParaNum(i, e.clientY);
        if(this.hasResponse(i, paraNum)) return;
        if(!Doc.hasCharsInPara(i, paraNum)) return;
        if(this.hasComment(i, paraNum)){
          Doc.disableComment(i, paraNum);
        }
        if(content === "MINI_RESPONSE_BADGE"){
          const response = this.getDraggingMiniResponse();
          response.elem.remove();
          Doc.disableResponse(response.lineIdx, response.responseIdx);
          this.initDraggingMiniResponse();
        }
        this.setResponse(i, paraNum);
        this.resetCommentPos(i);
      }else{
        this.draggingText.dest = i;
        this.edit.isMouseDown = false;
        this.edit.isDrop = true;
      }
    });

    textBox.appendChild(textBodyBG);
    textBox.appendChild(textBody);

    return textBox;
  }

  static resetSpeaker(text, speaker){
    const pattern = /（[^（）]*?）$/;

    if (pattern.test(text)) {
        return text.replace(pattern, `（${speaker}）`);
    }else{
      return `${text}（${speaker}）`;
    }
  }

  static setSelection(el, i){
    this.preSelection.start = this.selection.start;
    this.preSelection.end = this.selection.end;
    this.preSelection.paras.length = 0;
    this.preSelection.paras.push(...this.selection.paras);

    this.selection.start = el.selectionStart;
    this.selection.end = el.selectionEnd;

    const charsPerPara = Doc.getCharsPerPara(i);
    this.selection.paras = new Array(charsPerPara.length).fill("");
    let startPos = 0;

    for( let j = 0; j < charsPerPara.length; j++ ){
      const endPos = startPos + charsPerPara[j].length;
      const containsStart = startPos >= this.selection.start && this.selection.end >= startPos;
      const containsEnd = endPos >= this.selection.start && this.selection.end >= endPos;
      const containsInside = startPos < this.selection.start && this.selection.end < endPos;

      if(containsInside){
        this.selection.paras[j] = "inside";
      }else if(containsStart && !containsEnd){
        this.selection.paras[j] = "start";
      }else if(containsEnd && !containsStart){
        this.selection.paras[j] = "end";
      }else if(containsStart && containsEnd){
        this.selection.paras[j] = "all";
      }else{
        this.selection.paras[j] = "none";
      }

      startPos += charsPerPara[j].length + 1;
    }
    // console.log(this.preSelection);
    console.log(this.selection);
  }

  static initSelection(){
    this.selection.start = -1;
    this.selection.end = -1;
  }

  static emphasizeSelection(i){
    this.resetCharsPerPara(i);
    this.resetParaHeights(i);

    const paraNum = this.getSelectionParaNum(i);
    const charsPerPara = Doc.getCharsPerPara(i);
    const chars = charsPerPara[paraNum];
    const offset = charsPerPara.reduce((acc, cur, i) => {
      if(paraNum <= i) return acc;
      acc += cur.length + 1;
      return acc;
    }, 0);

    const textBody = Doc.getTextBody(i);
    const prefix = textBody.value.slice(offset, this.selection.start);
    const targets = textBody.value.slice(this.selection.start, this.selection.end).split("\n");
    const suffix = textBody.value.slice(this.selection.end, offset + chars.length);

    const prefixNode = Elem.createT(prefix);
    const targetNodes = targets.flatMap( (target, j) => {
      const nodes = [];
      const textSpan = Elem.create("span");
      textSpan.textContent = target;
      // textSpan.style.display = "inline-block";
      textSpan.style.color = "white";
      textSpan.style.backgroundColor = "#2A61D1";
      nodes.push(textSpan);
      if(j !== targets.length - 1){
        const newLine = Elem.createT("\n");
        nodes.push(newLine);
      }
      return nodes;
    });
    const suffixNode = Elem.createT(suffix);

    const textBodyBG = Doc.getTextBodyBG(i);
    const paraSpan = textBodyBG.querySelectorAll("span")[paraNum];
    paraSpan.innerHTML = "";
    paraSpan.appendChild(prefixNode);
    targetNodes.forEach( targetNode => paraSpan.appendChild(targetNode));
    paraSpan.appendChild(suffixNode);
  }


  static emphasizeText(i, paraNum){
    const para = Doc.getTextBodyBG(i).querySelectorAll("span")[paraNum];
    para.classList.add("focus-para");
    para.classList.add(`FP_${Theme.get()}`);
  }
  static unemphasizeText(i, paraNum){
    const para = Doc.getTextBodyBG(i).querySelectorAll("span")[paraNum];
    para.classList.remove("focus-para");
  }

  static resetCharsPerPara(i){
    const line = Doc.getLine(i);
    const text = line.editedText || line.text;
    line.charsPerPara = text.split("\n");
  }

  static resetParaHeights(i){
    const textBodyBG = Doc.getTextBodyBG(i);
    textBodyBG.innerHTML = "";

    const charsPerPara = Doc.getCharsPerPara(i);
    const paraCount = charsPerPara.length;

    const paraHeights = [];
    for(let j = 0; j < paraCount; j++){
      const newPara = Elem.create("span");
      newPara.textContent = charsPerPara[j];
      if(j !== paraCount -1) newPara.textContent += "\n";
      textBodyBG.appendChild(newPara);

      const rect = newPara.getBoundingClientRect();
      const top = rect.top - this.getOffsetTop(i);
      const bottom = rect.bottom - this.getOffsetTop(i);
      const paraHeight = `${top}:${bottom}`;
      if(!paraHeights.includes(paraHeight)) paraHeights.push(paraHeight);
    }

    const reCalcPparaHeights = paraHeights.map( (paraHeight, j) => {
      let [top, bottom] = paraHeight.split(":").map(Number);

      if(paraCount === 1){
        top = 5;
        bottom = textBodyBG.offsetHeight;
      }else if(j === 0){
        top = 5;
        const [nextTop, ] = paraHeights[j + 1].split(":").map(Number);
        bottom += (nextTop - bottom) / 2;
      }else if(j === paraCount - 1){
        const [, preBottom] = paraHeights[j - 1].split(":").map(Number);
        top -= (top - preBottom) / 2;
        bottom = textBodyBG.offsetHeight;
      }else{
        const [, preBottom] = paraHeights[j - 1].split(":").map(Number);
        top -= (top - preBottom) / 2;
        const [nextTop, ] = paraHeights[j + 1].split(":").map(Number);
        bottom += (nextTop - bottom) / 2;
      }
      return `${top}:${bottom}`;
    });

    Doc.setParaHeights(i, [...reCalcPparaHeights]);

    this.setReplacementHighlights(i);
  }


  static setReplacementHighlights(i){
    if(Doc.getEditedText(i)) return;
    
    const textBodyBG = Doc.getTextBodyBG(i);
    textBodyBG.innerHTML = "";

    const spans = new Array(Doc.getParaHeights(i).length).fill(null).map(v => Elem.create("span"));

    let paraCount = 0;
    Doc.getRepInfo(i)["replace_histories"].forEach( (rephist, j) => {
      const char = Doc.getText(i).slice(j, j + 1);
      const italic = Elem.create("i");
      italic.textContent = Doc.getText(i).slice(j, j + 1);
      italic.style.fontStyle = "normal";
      if(rephist.length !== 0){
        italic.classList.add("has-replace");
        italic.classList.add(`HR_${Theme.get()}`);
        italic.setAttribute("idx", j);
        italic.addEventListener("mousemove", () => {
          repInfosUl.textContent = rephist;
        });
      }
      spans[paraCount].appendChild(italic);
      if(char === "\n" || Doc.getRepInfo(i)["replace_histories"].length - 1 === j){
        textBodyBG.appendChild(spans[paraCount]);
        paraCount++;
      }
    });
  }


  static resetCommentPos(i){

    if(this.edit.isBackspace 
      || this.edit.isDelete
      || this.edit.isEnter
      || this.edit.isPaste
      || this.edit.isCut
      || this.edit.isDrop){

      const prefixPreSelParaNum = this.preSelection.paras.findIndex(p => p !== "none");
      const suffixPreSelParaNum = this.preSelection.paras.length - [...this.preSelection.paras].reverse().findIndex(p => p !== "none");
      const selParaNum = this.selection.paras.findIndex(p => p !== "none");
      const restParaCountAfterCaret = [...this.selection.paras].reverse().findIndex(p => p !== "none");

      console.log(`i: ${i}, pps: ${prefixPreSelParaNum}, sps: ${suffixPreSelParaNum}, sp: ${selParaNum}, rpc: ${restParaCountAfterCaret}`);

      const caretBeforeState = [];
      if(this.edit.isBackspace){
        caretBeforeState.push(...Doc.getComments(i).slice(0, selParaNum + 1));
      }else if(this.edit.isDrop && i === this.draggingText.dest){
        caretBeforeState.push(...Doc.getComments(i).slice(0, selParaNum + 1));
        const selText = Doc.getTextBody(i).value.slice(this.selection.start, this.selection.end);
        const selParaCount = selText.split("\n").length - 1
        caretBeforeState.push(...new Array(selParaCount).fill(false));
      }else{
        caretBeforeState.push(...Doc.getComments(i).slice(0, prefixPreSelParaNum + 1));
        if(this.edit.isEnter || this.edit.isPaste) caretBeforeState.push(...new Array(selParaNum - prefixPreSelParaNum).fill(false));
      }

      const caretAfterState = [];
      if(this.edit.isDelete){
        caretAfterState.push(...Doc.getComments(i).slice(this.preSelection.paras.length - restParaCountAfterCaret));
      }else if(this.edit.isDrop && i === this.draggingText.dest){
        caretAfterState.push(...Doc.getComments(i).slice(selParaNum + 1));
      }else{
        caretAfterState.push(...Doc.getComments(i).slice(suffixPreSelParaNum));
      }

      const result = [...caretBeforeState, ...caretAfterState];
      Doc.setComments(i, [...result]);
    }

    this.clearComments(i);

    Doc.getComments(i).forEach((b, j) => {
      if(!b) return;
      this.setComment(i, j);
    });
  }
  static clearComments(i){
    const div = Doc.getDiv(i);
    Array.from(div.querySelectorAll("div.text-box div.mini-comment")).forEach(commentBadge => {
      commentBadge.remove();
    });
  }
  static hasComment(i, paraNum){
    return Doc.getComment(i, paraNum);
  }
  static setComment(i, paraNum){
    const el = Elem.create("div", {cl: "badge mini-badge mini-comment"});
    el.draggable = true;
    el.style.top = parseFloat(Doc.getParaHeight(i, paraNum).split(":")[0]) + 2 + "px";
    el.style.cursor = "pointer";

    const icon = Elem.create("img");
    icon.src = `img/theme/${Theme.get()}/comment-mini.png`;

    el.addEventListener("contextmenu", e => {
      e.stopPropagation();
      e.preventDefault();
      e.target.remove();
      Doc.disableComment(i, paraNum);
    });

    el.addEventListener("dragstart", e => {
      this.setDraggingMiniComment(e.target, i, paraNum);
      e.dataTransfer.setData("text/plain", "MINI_COMMENT_BADGE");
      e.dataTransfer.effectAllowed = "copy";
    });

    el.appendChild(icon);
    Doc.getTextBox(i).appendChild(el);
    Doc.enableComment(i, paraNum);
  }


  static resetResponsePos(i){
    if(this.edit.isBackspace 
      || this.edit.isDelete
      || this.edit.isEnter
      || this.edit.isPaste
      || this.edit.isCut
      || this.edit.isDrop){

      const prefixPreSelParaNum = this.preSelection.paras.findIndex(p => p !== "none");
      const suffixPreSelParaNum = this.preSelection.paras.length - [...this.preSelection.paras].reverse().findIndex(p => p !== "none");
      const selParaNum = this.selection.paras.findIndex(p => p !== "none");
      const restParaCountAfterCaret = [...this.selection.paras].reverse().findIndex(p => p !== "none");

      const caretBeforeState = [];
      if(this.edit.isBackspace){
        caretBeforeState.push(...Doc.getResponses(i).slice(0, selParaNum + 1));
      }else if(this.edit.isDrop && i === this.draggingText.dest){
        caretBeforeState.push(...Doc.getResponses(i).slice(0, selParaNum + 1));
        const selText = Doc.getTextBody(i).value.slice(this.selection.start, this.selection.end);
        const selParaCount = selText.split("\n").length - 1
        caretBeforeState.push(...new Array(selParaCount).fill(false));
      }else{
        caretBeforeState.push(...Doc.getResponses(i).slice(0, prefixPreSelParaNum + 1));
        if(this.edit.isEnter || this.edit.isPaste) caretBeforeState.push(...new Array(selParaNum - prefixPreSelParaNum).fill(false));
      }

      const caretAfterState = [];
      if(this.edit.isDelete){
        caretAfterState.push(...Doc.getResponses(i).slice(this.preSelection.paras.length - restParaCountAfterCaret));
      }else if(this.edit.isDrop && i === this.draggingText.dest){
        caretAfterState.push(...Doc.getResponses(i).slice(selParaNum + 1));
      }else{
        caretAfterState.push(...Doc.getResponses(i).slice(suffixPreSelParaNum));
      }

      const result = [...caretBeforeState, ...caretAfterState];
      Doc.setResponses(i, [...result]);
    }

    this.clearResponses(i);

    Doc.getResponses(i).forEach((b, j) => {
      if(!b) return;
      this.setResponse(i, j);
    });
  }
  static clearResponses(i){
    const div = Doc.getDiv(i);
    Array.from(div.querySelectorAll("div.text-box div.mini-response")).forEach(b => {
      b.remove();
    });
  }
  static hasResponse(i, paraNum){
    return Doc.getResponse(i, paraNum);
  }
  static setResponse(i, paraNum){
    const el = Elem.create("div", {cl: "badge mini-badge mini-response"});
    el.draggable = true;
    el.style.top = parseFloat(Doc.getParaHeight(i, paraNum).split(":")[0]) + 2 + "px";
    el.style.cursor = "pointer";

    const icon = Elem.create("img");
    icon.src = `img/theme/${Theme.get()}/response-mini.png`;

    el.addEventListener("contextmenu", e => {
      e.stopPropagation();
      e.preventDefault();
      e.target.remove();
      Doc.disableResponse(i, paraNum);
    });

    el.addEventListener("dragstart", e => {
      this.setDraggingMiniResponse(e.target, i, paraNum);
      e.dataTransfer.setData("text/plain", "MINI_RESPONSE_BADGE");
      e.dataTransfer.effectAllowed = "copy";
    });

    el.appendChild(icon);
    Doc.getTextBox(i).appendChild(el);
    Doc.enableResponse(i, paraNum);
  }


  static getSelectionParaNum(i){
    let offset = 0;
    const charsPerPara = Doc.getCharsPerPara(i);
    for(let j = 0; j < charsPerPara.length; j++){
      const charCount = offset + charsPerPara[j].length;
      if(this.selection.start <=  charCount) return j;
      offset += charsPerPara[j].length;
    }
    return charsPerPara.length - 1;
  }
  static getDroppedParaNum(i, y){
    const yPos = y - this.getOffsetTop(i);
    return Doc.getParaHeights(i).findIndex((paraHeight, j) => {
      const topAndBottom = paraHeight.split(":");
      const top = parseFloat(topAndBottom[0]);
      const bottom = parseFloat(topAndBottom[1]);
      return parseFloat(top) < yPos && yPos < parseFloat(bottom);
    });
  }
  static getOffsetTop(i){
    return Header.getHeight()
      + DocHeader.getHeight()
      - lPanel.scrollTop
      + Doc.getDivs().slice(0, i).reduce((acc, cur) => acc + cur.offsetHeight, 0)
      + Chunk.getBorderWidth()
      + Chunk.getPaddingTop();
  }

  static insert(text, i){
    const textBody = Doc.getTextBody(i);
    const textBodyBG = Doc.getTextBodyBG(i);    

    const prefix = textBody.value.slice(0, this.selection.start);
    const suffix = textBody.value.slice(this.selection.end);
    const replacedText = prefix + text + suffix;

    textBody.value = replacedText;
    textBodyBG.innerHTML = textBody.value;

    // ↓ 要修正
    this.setLineText(replacedText, i);
    // ↑ 要修正

    const caretPos = prefix.length + text.length;
    textBody.setSelectionRange(caretPos, caretPos);
    textBody.focus();

    this.resetCharsPerPara(i);
    this.resetParaHeights(i);
    this.resetCommentPos(i);
    this.resetResponsePos(i);
  }

  static replace(before, after, i){
    const textBody = Doc.getTextBody(i);
    const textBodyBG = Doc.getTextBody(i);

    const prefix = textBody.value.slice(0, this.selection.start);
    const target = textBody.value.slice(this.selection.start, this.selection.end);
    const suffix = textBody.value.slice(this.selection.end);

    const regex = new RegExp(before, "g");
    const replacedText = target.replace(regex, after);
    const newText = prefix + replacedText + suffix;

    textBody.value = newText;
    textBodyBG.value = textBody.value;

    // ↓ 要修正
    this.setLineText(replacedText, i);
    // ↑ 要修正

    const caretPos = prefix.length + replacedText.length;
    textBody.setSelectionRange(caretPos, caretPos);
    textBody.focus();

    this.resetCharsPerPara(i);
    this.resetParaHeights(i);
    this.resetCommentPos(i);
    this.resetResponsePos(i);
  }

  static isEdited(newText, i){
    return Doc.getText(i) !== newText;
  }

  static enableEdited(i){
    Doc.getTextBody(i).classList.add("TB_edited");
    Doc.getTextBodyBG(i).classList.add("TB_edited");
  }
  static disableEdited(i){
    Doc.getTextBody(i).classList.remove("TB_edited");
    Doc.getTextBodyBG(i).classList.remove("TB_edited");
  }

  static visible(i){
    Doc.getTextBodyBG(i).classList.remove("TBB_hidden");
  }
  static invisible(i){
    Doc.getTextBodyBG(i).classList.add("TBB_hidden");
  }

  static setTransparent(i){
    Doc.getTextBody(i).classList.add("TB_transparent");
  }
  static unsetTransparent(i){
    Doc.getTextBody(i).classList.remove("TB_transparent");
  }

  static select(i, start, end){
    const textBody = Doc.getTextBody(i);
    textBody.focus();
    textBody.setSelectionRange(start, end);
  }
}