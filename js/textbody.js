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

  static draggingMiniBadge = {
    elem: null,
    lineIdx: -1,
    paraNum: -1
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

  static MINI_BADGE_LOOP = ["n", "c", "r"];

  static setDragover(_i, _paraNum){
    this.dragover.i = _i;
    this.dragover.paraNum = _paraNum;
  }

  static setDraggingMiniBadge(_elem, _lineIdx, _paraNum){
    this.draggingMiniBadge.elem = _elem;
    this.draggingMiniBadge.lineIdx = _lineIdx;
    this.draggingMiniBadge.paraNum = _paraNum;
  }
  static getDraggingMiniBadge(){
    return this.draggingMiniBadge;
  }
  static initDraggingMiniBadge(){
    this.setDraggingMiniBadge(null, -1, -1);
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
    const themeType = Theme.jpnToCode(Theme.get());

    const textBox = Elem.create("div", {cl: "text-box"});
    if(line.hided) textBox.style.display = "none";

    const textBodyBG = Elem.create("div", {cl: `text text-body-bg TBB_${themeType}`});
    textBodyBG.addEventListener("contextmenu", ()=> {
      console.log("bg_contextmenu");
    });

    const textBody = Elem.create("textarea", {cl: `text text-body TB_${themeType}`});
    textBody.textContent = line.editedText || line.text;
    if(line.editedText){
      textBodyBG.classList.add("TB_edited");
      textBody.classList.add("TB_edited");
    }

    textBody.addEventListener("input", e => {
      const currentText = e.target.value;
      textBodyBG.innerHTML = "";
      textBodyBG.textContent = currentText + '\u200b';

      if(this.isEdited(currentText, i)){
        this.enableEdited(i);
        Doc.setEditedText(i, currentText);
      }else{
        this.disableEdited(i);
        Doc.setEditedText(i, null)
      }

      if(!Replace.register) return;
      Replace.resetAfter(currentText);
    });

    textBody.addEventListener("keydown", e => {
      // console.log("keydown");
      this.edit.isKeydown = true;

      if(e.key === "Tab"){
        e.preventDefault();
        const nextIndex = i + Math.sign(Number(KeyBoard.hasShift) - 0.5) * -1;
        if(nextIndex < 0 || nextIndex >= Doc.getLines().length) return;
        Doc.getTextBody(nextIndex).focus();
        return;
      }

      const keyString = KeyBoard.getKeyString(e);
      const shortCuts = Config.getTextBodyShortCuts().find(s => keyString === s.value.at(-1));
      
      if(!shortCuts) return;
      
      const isMultiLine = e.target.value.slice(this.selection.start, this.selection.end).includes("\n");
      const paraNum = this.getSelectionParaNum(i);

      const textBody = Doc.getTextBody(i);
      const textBodyBG = Doc.getTextBodyBG(i);
      
      let replacedText = "";
      
      const type = shortCuts.type;

      if(type === "add-comment"){
        if(isMultiLine) return;
        if(Doc.hasMiniBadge(i, paraNum, "c")){
          Doc.removeMiniBadge(i, paraNum);
        }else{
          Doc.setMiniBadge(i, paraNum, "c");
          TextBody.resetMiniBadges(i);
        }
      }else if(type === "add-response"){
        if(isMultiLine) return;
        if(Doc.hasMiniBadge(i, paraNum, "r")){
          Doc.removeMiniBadge(i, paraNum);
        }else{
          Doc.setMiniBadge(i, paraNum, "r");
          TextBody.resetMiniBadges(i);
        }
      }else if(["add-speaker", "add-speaker-reverse"].includes(type)){
        if(isMultiLine) return;

        let newSpeakerIdx = 0;
        if(/\（.*?\）$/.test(Doc.getCharsPerPara(i)[paraNum])){
          const speaker = Doc.getCharsPerPara(i)[paraNum].match(/\（.*?\）$/)[0].replace(/[（）]/g, "");
          
          const speakerIdx = Array.from(Speaker.getBtns()).findIndex(s => speaker === s.textContent.replace(/[（）]/g, ""));
          if(KeyBoard.hasShift){
            if(speakerIdx === 0) newSpeakerIdx = Speaker.count() - 1;
            else newSpeakerIdx = speakerIdx - 1;
          }else{
            if(speakerIdx !== Speaker.count() - 1) newSpeakerIdx = speakerIdx + 1;
          }
        }
        const newSpeaker = Speaker.getBtns()[newSpeakerIdx].textContent.replace(/[（）]/g, "");

        Render.speakerGuide(newSpeakerIdx);

        replacedText = textBody.value.split("\n").map((l, j) => {
          if(j === paraNum) return this.resetSpeaker(l, newSpeaker);
          else return l;
        }).join("\n");

        textBody.value = replacedText;
        textBodyBG.innerHTML = replacedText + '\u200b';

        textBody.setSelectionRange(this.selection.start, this.selection.end);
        this.enableEdited(i);
        Doc.setEditedText(i, replacedText);
        
        this.resetCharsPerPara(i);
        this.resetParaHeights(i);
        this.resetMiniBadges(i);
      }else if(type === "insert-time"){
        const curTime = AudioState.getTime();

        const hms = Convert.secToStr(curTime);
        const format = Convert.secToStr(AudioFile.getDuration()).slice(0,2) === "00" ? `(${hms.slice(-5)})` : `(${hms})`;


        const prefix = textBody.value.slice(0, this.selection.end);
        const suffix = textBody.value.slice(this.selection.end);
        replacedText = prefix + format + suffix;

        textBody.value = replacedText;
        textBodyBG.innerHTML = replacedText + '\u200b';

        const pos = prefix.length + format.length;
        textBody.setSelectionRange(pos, pos);

        this.enableEdited(i);
        Doc.setEditedText(i, replacedText);
        
        this.resetCharsPerPara(i);
        this.resetParaHeights(i);
        this.resetMiniBadges(i);

        if(!SeekLabel.exists(curTime)){
          const seekLabel = SeekLabel.create(curTime);
          playbackSliderBox.appendChild(seekLabel);
        }

        if(!Badged.can("d")) return;
        Doc.addBadge(i, "d");
        Badged.set(i, Badged.createBadges(i));

      }else{
        alert("キー操作に対する処理がプログラムされていません。");
        return;
      }
      e.preventDefault();
      
    });
    
    textBody.addEventListener("keyup", e => {
      // console.log("keyup");
      this.edit.isKeydown = false;
      const isMultiLine = e.target.value.slice(this.selection.start, this.selection.end).includes("\n");

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
      if(e.key === "Enter"){
        if(KeyBoard.hasCtrl && !isMultiLine){
          const paraNum = this.getSelectionParaNum(i);
          const charCount = Doc.getCharsPerPara(i).reduce( (acc, cur, j) => {
            if(j <= paraNum){
              acc += cur.length;
            }
            return acc;
          }, 0) + paraNum;

          const prefix = e.target.value.slice(0, charCount);
          const suffix = e.target.value.slice(charCount);
          const replacedText = prefix + "\n" + suffix;
          e.target.value = replacedText;
          e.target.setSelectionRange(charCount + 1, charCount + 1);

          textBodyBG.textContent = replacedText + '\u200b';
        }
        this.edit.isEnter = true
      }

      e.target.dispatchEvent(new Event("selectionchange"));
    });

    textBody.addEventListener("contextmenu", async(e) => {
      console.log("contextmenu");
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
      this.visible(i);

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
      if(ContextMenu.isShow) ContextMenu.hide();
      this.invisible(i);
      this.unsetTransparent(i);
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
      Replace.removeHelper();
      if(Replace.register){
        Replace.registering();
        Replace.removeRegister();
      }
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
      console.log(i, "mouseup");

      this.edit.isMouseDown = false;
      if(KeyBoard.hasShift) this.edit.isKeydown = false;
      if(this.edit.isRightClick) return;
      e.target.dispatchEvent(new Event("selectionchange"));
    });

    textBody.addEventListener("mousemove", e => {
      if(Doc.getEditedText(i)) return;
      if(Doc.getRepInfos().length === 0) return;
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

          const li = Elem.create("li", {cl: `REPINFOS_LI_${Theme.jpnToCode(Theme.get())}`});
          li.appendChild(before);
          li.appendChild(arrow);
          li.appendChild(after);

          repInfosUl.appendChild(li);
        });
        return true;
      });
    });

    textBody.addEventListener("selectionchange", e => {
      if(ReplaceHelper.replaceInfo.isApply[i]){
        ReplaceHelper.replaceInfo.isApply[i] = false;
        return;
      }
      if(this.edit.isMouseDown || this.edit.isKeydown){
        // console.log("s_out");
        this.edit.isSelecting = i;
        return;
      }
      // console.log(i, "selectionchange");
      this.edit.isSelecting = false;

      const el = e.target;
      const currentText = el.value;
      const textBodyBG = Doc.getTextBodyBG(i);
      textBodyBG.innerHTML = "";
      textBodyBG.textContent = currentText + '\u200b';


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

      if(this.selection.start !== this.selection.end
        && !Replace.register
        && !currentText.slice(this.selection.start, this.selection.end).includes("\n")){
        Render.replaceRegisterHelper();
      }else{
        Replace.removeHelper();
      }

      if(Replace.register){
        const currentCharCount = currentText.length;
        const srcCharCount = Replace.registerInfo.blockCharCount;
        const replacingCharCount = Replace.registerInfo.charCount;
        const start = Replace.registerInfo.startPos;

        const replacedCharCount = currentCharCount - srcCharCount + replacingCharCount;
        if(start > this.selection.start
          || srcCharCount - replacingCharCount > currentCharCount
          || start + replacedCharCount < this.selection.end
        ){
          Replace.registering();
          Replace.removeRegister();
        }
      }

      // console.log(`bs: ${this.edit.isBackspace}, dl: ${this.edit.isDelete}, en: ${this.edit.isEnter}, cu: ${this.edit.isCut}, pa: ${this.edit.isPaste}, dr: ${this.edit.isDrop}`);

      this.resetMiniBadges(i);
      
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
      console.log(i, "drop");

      const content = e.dataTransfer.getData('text/plain');
      if(content.includes("_SPEAKER")){
        e.preventDefault();
        this.edit.isSpeakerDrop = true;
        
        const paraNum = this.getDroppedParaNum(i, e.clientY);

        const textBody = e.target;
        const textBodyBG = Doc.getTextBodyBG(i);

        const speaker = content.split("_")[0];
        const replacedText = textBody.value.split("\n").map((l, i) => {
          if(i === paraNum) return this.resetSpeaker(l, speaker);
          else return l;
        }).join("\n");

        textBody.value = replacedText;
        textBodyBG.innerHTML = replacedText + '\u200b';
        this.enableEdited(i);
        Doc.setEditedText(i, replacedText);

      }else if(["ATTACHMENT_BADGE", "START_BADGE", "DONTHEAR_BADGE"].includes(content)){
        e.preventDefault();
      }else if(content.includes("COMMENT") || content.includes("RESPONSE")){
        e.preventDefault();

        const badgeCode = content.slice(0, 1).toLowerCase();
        const paraNum = this.getDroppedParaNum(i, e.clientY);
        if(Doc.hasMiniBadge(i, paraNum, badgeCode)) return;
        Doc.setMiniBadge(i, paraNum, badgeCode);
        if(content.includes("MINI")){
          const dragSrc = this.getDraggingMiniBadge();
          dragSrc.elem.remove();
          Doc.removeMiniBadge(dragSrc.lineIdx, dragSrc.paraNum);
          this.resetMiniBadges(dragSrc.lineIdx);
          this.initDraggingMiniBadge();
        }

        this.resetMiniBadges(i);
      }else if(content.includes("CASE_")){
        e.preventDefault();

        const caseId = content.replace("CASE_", "");
        const paraNum = this.getDroppedParaNum(i, e.clientY);

        const textBody = e.target;
        const textBodyBG = Doc.getTextBodyBG(i);

        const replacedText = textBody.value.split("\n").map((l, i) => {
          if(i === paraNum) return `${caseId}\n${l}`;
          else return l;
        }).join("\n");

        textBody.value = replacedText;
        textBodyBG.innerHTML = replacedText + '\u200b';

        const pos = replacedText.indexOf(caseId) + caseId.length;
        textBody.setSelectionRange(pos, pos);
        this.setSelection(textBody, i);
        textBody.setSelectionRange(pos + 1, pos + 1);

        this.enableEdited(i);
        Doc.setEditedText(i, replacedText);

        this.edit.isEnter = true;
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
    // console.log(this.selection);
  }

  static emphasizeSelection(i){
    const textBody = Doc.getTextBody(i);
    const splittedPrefix = textBody.value.slice(0, this.selection.start).split("\n"); 
    const splittedTarget = textBody.value.slice(this.selection.start, this.selection.end).split("\n");
    const splittedSuffix = textBody.value.slice(this.selection.end).split("\n");

    const isSelectionInside = this.selection.paras.includes("inside");

    const spanContainingPrefixAndTarget = Elem.create("span");
    const spanContainingTargetAndSuffix = Elem.create("span");
    const spans = document.createDocumentFragment();;
    for(let j = 0; j < splittedPrefix.length; j++){
      const isLast = j === splittedPrefix.length - 1;
      const span = Elem.create("span");
      span.textContent = splittedPrefix[j];
      
      if(isLast){
        spanContainingPrefixAndTarget.appendChild(span);
      }else{
        spans.appendChild(span);
      }
    }

    for(let j = 0; j < splittedTarget.length; j++){
      const isFirst = j === 0;
      const isLast = j === splittedTarget.length - 1;
      const span = Elem.create("span", {cl: "is-selected"});
      span.textContent = splittedTarget[j];
      span.style.display = "inline-block";

      if(isFirst === isLast){
        spanContainingPrefixAndTarget.appendChild(span);
      }else if(isFirst){
        spanContainingPrefixAndTarget.appendChild(span);
        spans.appendChild(spanContainingPrefixAndTarget);
      }else if(isFirst){
        spanContainingTargetAndSuffix.appendChild(span);
      }else{
        spans.appendChild(span);
      }
    }

    for(let j = 0; j < splittedSuffix.length; j++){
      const isFirst = j === 0;
      const isLast = j === splittedSuffix.length - 1;
      const span = Elem.create("span");
      span.textContent = splittedSuffix[j];

      if(isFirst){
        if(isSelectionInside){
          spanContainingPrefixAndTarget.appendChild(span);
          spans.appendChild(spanContainingPrefixAndTarget);
        }else{
          spanContainingTargetAndSuffix.appendChild(span);
          spans.appendChild(spanContainingTargetAndSuffix);
        }
      }else if(isLast){
        span.textContent += '\u200b';
        spans.appendChild(span);
      }else{
        spans.appendChild(span);
      }
    }

    for(let j = 0; j < spans.childNodes.length; j++){
      const textNode = Elem.createT("\n");
      spans.childNodes[j].appendChild(textNode);
    }

    const textBodyBG = Doc.getTextBodyBG(i);
    textBodyBG.innerHTML = "";
    textBodyBG.appendChild(spans);
  }


  static emphasizeText(i, paraNum){
    const para = Doc.getTextBodyBG(i).querySelectorAll("span")[paraNum];
    para.classList.add("focus-para");
    para.classList.add(`FP_${Theme.jpnToCode(Theme.get())}`);
  }
  static unemphasizeText(i, paraNum){
    const para = Doc.getTextBodyBG(i).querySelectorAll("span")[paraNum];
    para.classList.remove("focus-para");
  }

  static resetCharsPerPara(i){
    const line = Doc.getLine(i);
    const text = line.editedText || (line.editedText === "" ? "(空)" : line.text);
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
      if(j !== paraCount - 1) newPara.textContent += "\n";
      else newPara.textContent += '\u200b';
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
    
    if(SearchHelper.isActive){
      if(ReplaceHelper.replaceInfo.isApply.some(Boolean)){
        this.setReplaceResultHighlights(i);
      }else{
        SearchHelper.research();
      }
    }else{
      this.setReplacementHighlights(i);
    }
  }

  static setSearchResultHighlights(i){
    const textBodyBG = Doc.getTextBodyBG(i);
    const spans = new Array(Doc.getParaHeights(i).length).fill(null).map(v => Elem.create("span"));

    const text = Doc.getTextBody(i).value;
    const len = text.length;
    const hitSet = new Set(SearchHelper.searchInfo.resultPerLine[i]);
    let buffer = "";

    const flag = document.createDocumentFragment();
    let paraCount = 0;

    for(let j = 0; j < len; j++){
      const c = text[j];

      if(hitSet.has(j)){
        if(buffer){
          spans[paraCount].appendChild(Elem.createT(buffer));
          buffer = "";
        }
        const italic = Elem.create("i", {cl: "is-searched"});
        italic.textContent = c;
        spans[paraCount].appendChild(italic);
      }else{
        buffer += c;
      }

      if(c === "\n" || len - 1 === j){
        if(buffer){
          spans[paraCount].appendChild(Elem.createT(buffer));
          buffer = "";
        }
        flag.appendChild(spans[paraCount++]);
      }
    }
    // text.split("").forEach( (c, j) => {
    //   const italic = Elem.create("i");
    //   italic.textContent = c;
    //   italic.style.fontStyle = "normal";
    //   if(searchResultPerLine.includes(j)){
    //     italic.classList.add("is-searched");
    //   }
    //   if(Doc.getTextBody(i).value.length - 1 === j) italic.textContent += '\u200b';
    //   spans[paraCount].appendChild(italic);
    //   if(c === "\n" || Doc.getTextBody(i).value.length - 1 === j){
    //     flag.appendChild(spans[paraCount]);
    //     paraCount++;
    //   }
    // });
    
    textBodyBG.innerHTML = "";
    textBodyBG.appendChild(flag);
  }

  static setReplaceResultHighlights(i){
    const textBodyBG = Doc.getTextBodyBG(i);
    const spans = new Array(Doc.getParaHeights(i).length).fill(null).map(v => Elem.create("span"));
    const replaceSearchPerLine = SearchHelper.searchInfo.resultPerLine[i];
    const replaceResultPerLine = ReplaceHelper.replaceInfo.resultPerLine[i];

    const flag = document.createDocumentFragment();
    let paraCount = 0;
    Doc.getTextBody(i).value.split("").forEach( (c, j) => {
      const italic = Elem.create("i");
      italic.textContent = c;
      italic.style.fontStyle = "normal";
      if(replaceSearchPerLine.includes(j)){
        italic.classList.add("is-searched");
      }else if(replaceResultPerLine.includes(j)){
        italic.classList.add("is-replaced");
      }
      if(Doc.getTextBody(i).value.length - 1 === j) italic.textContent += '\u200b';
      spans[paraCount].appendChild(italic);
      if(c === "\n" || Doc.getTextBody(i).value.length - 1 === j){
        flag.appendChild(spans[paraCount]);
        paraCount++;
      }
    });
    
    textBodyBG.innerHTML = "";
    textBodyBG.appendChild(flag);
  }

  static unsetReplaceResultHighlights(){
    for(const i in Doc.getLines()){
      const isReplacedIs = Doc.getTextBodyBG(i).querySelectorAll(".is-replaced");
      for(const j of isReplacedIs){
        j.classList.remove("is-replaced");
      }
    }
  }

  static setReplacementHighlights(i){
    if(Doc.getEditedText(i) || Doc.getEditedText(i) === "") return;
    if(Doc.getRepInfos().length === 0) return;

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
        italic.classList.add(`HR_${Theme.jpnToCode(Theme.get())}`);
        italic.setAttribute("idx", j);
        italic.addEventListener("mousemove", () => {
          repInfosUl.textContent = rephist;
        });
      }
      if(Doc.getRepInfo(i)["replace_histories"].length - 1 === j) italic.textContent += '\u200b';
      spans[paraCount].appendChild(italic);
      if(char === "\n" || Doc.getRepInfo(i)["replace_histories"].length - 1 === j){
        textBodyBG.appendChild(spans[paraCount]);
        paraCount++;
      }
    });
  }

  static resetMiniBadges(i){
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

      // console.log(`i: ${i}, pps: ${prefixPreSelParaNum}, sps: ${suffixPreSelParaNum}, sp: ${selParaNum}, rpc: ${restParaCountAfterCaret}`);

      const caretBeforeState = [];
      if(this.edit.isBackspace){
        caretBeforeState.push(...Doc.getMiniBadges(i).slice(0, selParaNum + 1));
      }else if(this.edit.isDrop && i === this.draggingText.dest){
        caretBeforeState.push(...Doc.getMiniBadges(i).slice(0, selParaNum + 1));
        const selText = Doc.getTextBody(i).value.slice(this.selection.start, this.selection.end);
        const selParaCount = selText.split("\n").length - 1
        caretBeforeState.push(...new Array(selParaCount).fill("n"));
      }else{
        caretBeforeState.push(...Doc.getMiniBadges(i).slice(0, prefixPreSelParaNum + 1));
        if(this.edit.isEnter || this.edit.isPaste) caretBeforeState.push(...new Array(selParaNum - prefixPreSelParaNum).fill("n"));
      }

      const caretAfterState = [];
      if(this.edit.isDelete){
        caretAfterState.push(...Doc.getMiniBadges(i).slice(this.preSelection.paras.length - restParaCountAfterCaret));
      }else if(this.edit.isDrop && i === this.draggingText.dest){
        caretAfterState.push(...Doc.getMiniBadges(i).slice(selParaNum + 1));
      }else{
        caretAfterState.push(...Doc.getMiniBadges(i).slice(suffixPreSelParaNum));
      }

      const result = [...caretBeforeState, ...caretAfterState];
      if(result.length === 0) result.push("n");
      Doc.setMiniBadges(i, [...result]);
    }
    Doc.setMiniBadges(i, Doc.getMiniBadges(i).slice(0, Doc.getCharsPerPara(i).length));

    this.clearMiniBadges(i);

    this.setMiniBadges(i);
  }

  static clearMiniBadges(i){
    Array.from(Doc.getTextBox(i).querySelectorAll(".mini-badge")).forEach(b => {
      b.remove();
    });
  }

  static setMiniBadges(i){
    Doc.getMiniBadges(i).forEach( (mb, j) => {
      if(mb === "n"){
        const el = Elem.create("div", {cl: `badge mini-badge mini-none`});
        el.style.top = parseFloat(Doc.getParaHeight(i, j).split(":")[0]) + 2 + "px";

        el.addEventListener("click", e => {
          e.stopPropagation();
          e.preventDefault();
          Doc.setMiniBadge(i, j, "c");
          this.resetMiniBadges(i);
        });

        el.addEventListener("dragover", e => e.preventDefault());
        el.addEventListener("drop", e => {
          const content = e.dataTransfer.getData('text/plain');
          if(!content.includes("COMMENT") && !content.includes("RESPONSE")) return;
          e.preventDefault();

          const badgeCode = content.slice(0, 1).toLowerCase();
          const paraNum = this.getDroppedParaNum(i, e.clientY);
          if(Doc.hasMiniBadge(i, paraNum, badgeCode)) return;
          Doc.setMiniBadge(i, paraNum, badgeCode);
          if(content.includes("MINI")){
            const dragSrc = this.getDraggingMiniBadge();
            dragSrc.elem.remove();
            Doc.removeMiniBadge(dragSrc.lineIdx, dragSrc.paraNum);
            this.resetMiniBadges(dragSrc.lineIdx);
            this.initDraggingMiniBadge();
          }

          this.resetMiniBadges(i);
        });

        Doc.getTextBox(i).appendChild(el);
        return;  
      }
      const badgeName = Badge.name[mb];

      const el = Elem.create("div", {cl: `badge mini-badge mini-${badgeName}`});
      el.draggable = true;
      el.style.top = parseFloat(Doc.getParaHeight(i, j).split(":")[0]) + 2 + "px";

      const icon = Elem.create("img");
      icon.src = `img/theme/${Theme.jpnToCode(Theme.get())}/${badgeName}-mini.png`;

      el.addEventListener("click", e => {
        e.stopPropagation();
        e.preventDefault();
        const miniBadgeIdx = this.MINI_BADGE_LOOP.indexOf(mb);
        const nextMiniBadgeIdx = miniBadgeIdx === this.MINI_BADGE_LOOP.length - 1 ? 0 : miniBadgeIdx + 1;
        Doc.setMiniBadge(i, j, this.MINI_BADGE_LOOP[nextMiniBadgeIdx]);
        this.resetMiniBadges(i);
      });

      el.addEventListener("contextmenu", e => {
        e.stopPropagation();
        e.preventDefault();
        Doc.removeMiniBadge(i, j, mb);
        this.resetMiniBadges(i);
      });

      el.addEventListener("dragstart", e => {
        this.setDraggingMiniBadge(e.target, i, j);
        e.dataTransfer.setData("text/plain", `${badgeName.toUpperCase()}_MINI_BADGE`);
        e.dataTransfer.effectAllowed = "copy";
      });

      el.addEventListener("dragover", e => e.preventDefault());
      el.addEventListener("drop", e => {
        const content = e.dataTransfer.getData('text/plain');
        if(!content.includes("COMMENT") && !content.includes("RESPONSE")) return;
        e.preventDefault();

        const badgeCode = content.slice(0, 1).toLowerCase();
        const paraNum = this.getDroppedParaNum(i, e.clientY);
        if(Doc.hasMiniBadge(i, paraNum, badgeCode)) return;
        Doc.setMiniBadge(i, paraNum, badgeCode);
        if(content.includes("MINI")){
          const dragSrc = this.getDraggingMiniBadge();
          dragSrc.elem.remove();
          Doc.removeMiniBadge(dragSrc.lineIdx, dragSrc.paraNum);
          this.resetMiniBadges(dragSrc.lineIdx);
          this.initDraggingMiniBadge();
        }

        this.resetMiniBadges(i);
      });
      
      el.appendChild(icon);
      Doc.getTextBox(i).appendChild(el);
    });

    Output.write();
  }


  static posToParaNum(i, pos){
    let offset = 0;
    const charsPerPara = Doc.getCharsPerPara(i);
    for(let j = 0; j < charsPerPara.length; j++){
      const charCount = offset + (Doc.hasCharsInPara(i, j) ? charsPerPara[j].length : 1);
      if(pos <=  charCount) return j;
      offset += (Doc.hasCharsInPara(i, j) ? charsPerPara[j].length : 1);
    }
  }
  static getSelectionParaNum(i){
    let offset = 0;
    const charsPerPara = Doc.getCharsPerPara(i);
    for(let j = 0; j < charsPerPara.length; j++){
      const charCount = offset + (Doc.hasCharsInPara(i, j) ? charsPerPara[j].length + !!j : 1);
      if(this.selection.start <=  charCount) return j;
      offset += (Doc.hasCharsInPara(i, j) ? charsPerPara[j].length + !!j : 1);
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

    const prefix = textBody.value.slice(0, this.selection.end);
    const suffix = textBody.value.slice(this.selection.end);
    const replacedText = prefix + text + suffix;

    textBody.value = replacedText;
    textBodyBG.innerHTML = replacedText + '\u200b';

    const pos = prefix.length + text.length;
    textBody.setSelectionRange(pos, pos);
    textBody.focus();

    this.enableEdited(i);
    Doc.setEditedText(i, replacedText);
    
    this.resetCharsPerPara(i);
    this.resetParaHeights(i);
    this.resetMiniBadges(i);
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
    textBodyBG.value = textBody.value + '\u200b';

    // ↓ 要修正
    this.setLineText(replacedText, i);
    // ↑ 要修正

    const caretPos = prefix.length + replacedText.length;
    textBody.setSelectionRange(caretPos, caretPos);
    textBody.focus();

    this.resetCharsPerPara(i);
    this.resetParaHeights(i);
    this.resetMiniBadges(i);
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

  static getParaStartPos(i, paraNum){
    let offset = 0;
    const charsPerPara = Doc.getCharsPerPara(i);
    for(let j = 0; j < charsPerPara.length; j++){
      console.log(paraNum, j, offset)
      if(j === paraNum) return offset;
      offset += (Doc.hasCharsInPara(i, j) ? charsPerPara[j].length + !!j : 1) + 1;
    }
    return 0;
  }
  static getPosFromCommentCount(count){
    const pos = {
      idx: null,
      paraNum: null
    }
    const commentLines = Doc.getLines()
      .map((l, i) => ({l, i}))
      .filter(m => m.l.editedText);
    
    let commentCounter = 0;
    for(let j = 0; j < commentLines.length; j++){
      for(let paraNum = 0; paraNum < commentLines[j].l.charsPerPara.length; paraNum++){
        if(commentLines[j].l.miniBadges[paraNum].includes("n")) continue;
        commentCounter++;
        console.log(commentCounter, count);
        if(count !== commentCounter) continue;
        pos.idx = commentLines[j].i;
        pos.paraNum = paraNum;
        return pos;
      }
    }

    return pos;
  }

  static getCommentCountBeforeSelection(){
    if(this.selection.start === -1) return -1;
    const i = Selection.idx;
    const paraNum = this.getSelectionParaNum(i);

    return Doc.getLines().reduce((acc, cur, j) => {
      if(!cur.editedText || j > i) return acc;
      const miniBadges = cur.miniBadges;
      if(j === i) acc += miniBadges.slice(0, paraNum + 1).filter(b => b !== "n").length;
      else acc += miniBadges.filter(b => b !== "n").length;

      return acc;
    }, 0);
  }
}