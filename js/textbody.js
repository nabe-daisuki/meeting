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
  static edit = {
    isKeyup: false,
    isDelete: false,
    isBackspace: false,
    isEnter: false,
    isPaste: false,
    isRightCut: false,
    isSpeakerDrop: false,
    pastedText: null,
    isDrop: false,
    droppedText: null,
    droppedElem: null
  }
  static isMouseDown = false;
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

  static initDragover(){
    this.setDragover(-1, -1);
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

    const textBox = Elem.create("div", {cl: "FlexTextarea"});
    if(line.hided) textBox.style.display = "none";

    const textBodyBG = Elem.create("div", {cl: "text FlexTextarea__dummy"});
    
    const textBody = Elem.create("textarea", {cl: "text FlexTextarea__textarea"});
    textBody.textContent = line.editedText || line.text;
    if(line.editedText) textBody.classList.add("edited");

    textBody.addEventListener("paste", e => {
      this.edit.isPaste = true;
      this.edit.pastedText = e.clipboardData.getData("text");
    });

    textBody.addEventListener("keyup", e => {
      this.edit.isKeyup = true;

      switch(e.key){
        case "Backspace":
          this.edit.isBackspace = true;
          break;
        case "Delete":
          this.edit.isDelete = true;
          break;
        case "Enter":
          this.edit.isEnter = true;
          break;
      }

      const i = Selection.idx;
      const textBody = Doc.getTextBody(i);

      this.setLineText(textBody.value, i);

      textBodyBG.innerHTML = textBody.value;
      this.resetCharsPerPara(i);
      this.resetParaHeights(i);
      this.setSelection(e.target, i);
      this.resetCommentPos(i);
      this.resetResponsePos(i);

      this.edit.isBackspace = false;
      this.edit.isDelete = false;
      this.edit.isEnter = false;
      this.edit.isPaste = false;
      this.edit.pastedText = null;
    });

    textBody.addEventListener("contextmenu", e => {
      console.log("contextmenu");
      if(this.selection.start === this.selection.end) return;      
      if(this.selection.start === -1) return;

      this.edit.isRightCut = true;

      const prefix = e.target.value.slice(0, this.selection.start);
      const suffix = e.target.value.slice(this.selection.end)
      const replacedText = (prefix + suffix);
      e.target.value = replacedText;
      console.log(prefix)
      console.log(suffix)

      this.setLineText(replacedText, i);
      
      const caretPos = prefix.length;
      e.target.setSelectionRange(caretPos, caretPos);
      e.target.focus();
      
      this.resetCharsPerPara(i);
      this.resetParaHeights(i);

      e.stopPropagation();
      e.preventDefault();
    });

    textBody.addEventListener("focusin", e => {
      console.log("focusin")
      textBodyBG.style.visibility = "hidden";
      Selection.relocateHighlight(i);
    });

    textBody.addEventListener("focusout", e => {
      console.log("focusout")
      textBodyBG.style.visibility = "visible";
      
      this.setLineText(e.target.value, i);
    });

    textBody.addEventListener("mousedown", e => {
      console.log("mousedown")
      if ( e.button === 0 ){
        this.isMouseDown = true;
        return;
      }
      // ミドルクリック
      // if (e.button !== 1) return;

      // const elem = e.target;
      // if(elem.selectionStart === 0 && elem.selectionEnd === 0) return;

      // this.selection.start = elem.selectionStart;
      // this.selection.end = elem.selectionEnd;
      
      // if(this.selection.start === -1) return;
      // e.preventDefault();

      // ContextMenu.show(e.clientX, e.clientY);
    });

    textBody.addEventListener("mouseup", e => {
      if(e.button !== 0) return;

      this.isMouseDown = false;
      e.target.dispatchEvent(new Event("selectionchange"));
    });

    textBody.addEventListener("selectionchange", e => {
      console.log("selectionchange");
      if(this.edit.isRightCut || this.edit.isSpeakerDrop){
        this.setSelection(e.target, i);

        this.edit.isBackspace = true;
        this.resetCommentPos(i);
        this.resetResponsePos(i);
        this.edit.isBackspace = false;
        this.edit.isRightCut = false;
        this.edit.isSpeakerDrop = false;
      }

      if(this.isMouseDown){
        this.setLineText(textBody.value, i);
        this.resetCharsPerPara(i);
        this.resetParaHeights(i);
        this.setSelection(e.target, i);

        if(this.edit.isDrop && this.edit.droppedElem === e.target){
          this.resetCommentPos(i);
          this.resetResponsePos(i);

          this.edit.isDrop = false;
          this.edit.droppedText = null;
          this.edit.droppedElem = null;
        }
        return;
      }
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

    textBody.addEventListener("drop", e => {
      console.log("drop")
      const content = e.dataTransfer.getData('text/plain');
      if(content === "森_SPEAKER" || content === "田中_SPEAKER" || content === "佐藤_SPEAKER"){
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
        this.setLineText(replacedText, i);
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
        this.setLineText(textBody.value, i);
        textBodyBG.innerHTML = textBody.value;

        this.resetCharsPerPara(i);
        this.setSelection(e.target, i);
        this.resetParaHeights(i);
        this.resetCommentPos(i);
        this.resetResponsePos(i);

        console.log("dropstatus");

        this.edit.isDrop = true;
        this.edit.droppedText = content;
        this.edit.droppedElem = e.target;
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
    console.log(charsPerPara.length)
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
    console.log(this.preSelection);
    console.log(this.selection);
  }

  static initSelection(){
    this.selection.start = -1;
    this.selection.end = -1;
  }

  static emphasizeText(i, paraNum){
    Doc.getTextBodyBG(i).querySelectorAll("span")[paraNum].style.backgroundColor = "#d3d3d3";
  }
  static unemphasizeText(i, paraNum){
    Doc.getTextBodyBG(i).querySelectorAll("span")[paraNum].style.backgroundColor = "transparent";
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

    Doc.setParaHeights(i, [...paraHeights]);

    // for(let j = 0; j < paraCount; j++){
    //   if(j != 0){
    //     const newLine = Elem.create("span");
    //     newLine.textContent = "\n";
    //     textBodyBG.appendChild(newLine);
    //   }

    //   const chars = charsPerPara[j];

    //   const rephist = [];
    //   const paraTop = [];
    //   for(let k = 0; k < chars.length; k++){
    //     const char = Elem.create("span");
    //     char.textContent = chars[k];

    //     if(Doc.getRepHists().length != 0){
    //       console.log(j)
    //       console.log(lSide.rephists[0][j])
    //       if(lSide.rephists[0][j].length == 0){
    //         rephist.push([]);
    //       }else{
    //         rephist.push(lSide.rephists[0][j]);
    //       }
    //       console.log(rephist);
    //       if(rephist[j].length != 0){
    //         char.style.backgroundColor = "#ffc8c8";
    //         char.style.color = "#ffc8c8";
    //         char.style.display = "inline-block";
    //       }else{          
    //         char.style.color = "transparent";
    //       }
    //     }

    //     textBodyBG.appendChild(char);

    //     const rect = char.getBoundingClientRect();
    //     const top = rect.top - this.getOffsetTop(i);
    //     const bottom = rect.bottom - this.getOffsetTop(i);
    //     const paraHeight = `${top}:${bottom}`;
    //     if(!paraTop.includes(paraHeight)) paraTop.push(paraHeight);
    //   }

    //   Doc.setParaTop(i, j, paraTop);
    // }

    // console.log(Doc.getParaTops(i)[0]);
  }


  static resetCommentPos(i){
    if(!isWindowResize && this.selection.paras.length !== this.preSelection.paras.length){
      let newComments;
      if(this.edit.isBackspace){
        const diffCount = this.preSelection.paras.filter(p => p !== "none").length;
        const selectionParaNum = this.selection.paras.findIndex(p => p !== "none");

        newComments = this.selection.paras.reduce((acc, _, j) => {
          if(selectionParaNum >= j){
            acc.push(Doc.getComment(i, j));
          }else if(selectionParaNum < j){
            if(diffCount == 1){
              acc.push(Doc.getComment(i, j + 1));
            }else{
              acc.push(Doc.getComment(i, j + diffCount - 1));
            }
          }
          return acc;
        }, []);
      }else if(this.edit.isDelete){
        const diffCount = this.preSelection.paras.filter(p => p !== "none").length;
        const selectionParaNum = this.selection.paras.findIndex(p => p !== "none");

        newComments = this.selection.paras.reduce((acc, _, j) => {
          if(selectionParaNum >= j){
            acc.push(Doc.getComment(i, j));
          }else if(selectionParaNum < j){
            if(diffCount == 1){
              acc.push(Doc.getComment(i, j + 1));
            }else{
              acc.push(Doc.getComment(i, j + diffCount - 1));
            }
          }
          return acc;
        }, []);
      }else if(this.edit.isEnter){
        const diffCount = this.preSelection.paras.filter(p => p !== "none").length - 2;
        const preSelectionPrefix = this.preSelection.paras.find(p => p !== "none");
        const preSelectionParaNum = this.preSelection.paras.findIndex(p => p !== "none");
        const preSelectionSuffix = [...this.preSelection.paras].reverse().find(p => p !== "none");

        newComments = this.selection.paras.reduce((acc, _, j) => {
          if(preSelectionParaNum > j){
            acc.push(Doc.getComment(i, j));
          }else if(preSelectionParaNum === j){
            if(["start", "all"].includes(preSelectionPrefix)) acc.push(false);
            else acc.push(Doc.getComment(i, j));
          }else if(preSelectionParaNum + 1 === j){
            if(["start", "all"].includes(preSelectionPrefix)) acc.push(Doc.getComment(i, j - 1));
            else if(preSelectionSuffix !== "start") acc.push(false);
            else acc.push(Doc.getComment(i, j + diffCount));
          }else{
            acc.push(Doc.getComment(i, j + diffCount));
          }
          return acc;
        }, []);
      }else if(this.edit.isPaste){
        const newLineCount = this.edit.pastedText.split("\n").length - 1;
        if(newLineCount === 0){
          const diffCount = this.preSelection.paras.filter(p => p !== "none").length;
          const selectionParaNum = this.selection.paras.findIndex(p => p !== "none");

          newComments = this.selection.paras.reduce((acc, _, j) => {
            if(selectionParaNum >= j){
              acc.push(Doc.getComment(i, j));
            }else if(selectionParaNum < j){
              if(diffCount == 1){
                acc.push(Doc.getComment(i, j + 1));
              }else{
                acc.push(Doc.getComment(i, j + diffCount - 1));
              }
            }
            return acc;
          }, []);
        }else{
          const diffCount = this.preSelection.paras.filter(p => p !== "none").length - (1 + newLineCount);
          const preSelectionPrefix = this.preSelection.paras.find(p => p !== "none");
          const preSelectionParaNum = this.preSelection.paras.findIndex(p => p !== "none");
          const preSelectionSuffix = [...this.preSelection.paras].reverse().find(p => p !== "none");

          newComments = this.selection.paras.reduce((acc, _, j) => {
            if(preSelectionParaNum > j){
              acc.push(Doc.getComment(i, j));
            }else if(preSelectionParaNum === j){
              if(["start", "all"].includes(preSelectionPrefix)) acc.push(false);
              else acc.push(Doc.getComment(i, j));
            }else if(newLineCount > 1 && preSelectionParaNum + newLineCount > j){
              acc.push(false);
            }else if(preSelectionParaNum + 1 + (newLineCount - 1)  === j){
              if(["start", "all"].includes(preSelectionPrefix)) if(preSelectionSuffix !== "start") acc.push(Doc.getComment(i, j - (1 + newLineCount - 1)));
              else acc.push(Doc.getComment(i, j + diffCount));
              else if(preSelectionSuffix !== "start") acc.push(false);
              else acc.push(Doc.getComment(i, j + diffCount));
            }else{
              acc.push(Doc.getComment(i, j + diffCount));
            }
            return acc;
          }, []);
        }
      }else if(this.edit.isDrop){
        const newLineCount = this.edit.droppedText.split("\n").length - 1;

        const selectionParaNum = this.selection.paras.findIndex(p => p !== "none");

        newComments = this.selection.paras.reduce((acc, _, j) => {
          if(selectionParaNum >= j){
            acc.push(Doc.getComment(i, j));
          }else if(selectionParaNum + newLineCount >= j){
            acc.push(false);
          }else{
            acc.push(Doc.getComment(i, j - newLineCount));
          }
          return acc;
        }, []);
      }
      if(!newComments) return;
      Doc.setComments(i, [...(newComments.map(v => v ?? false))]);
    }

    this.clearComments(i);

    Doc.getComments(i).forEach((b, j) => {
      if(!b) return;
      this.setComment(i, j);
    });
  }
  static clearComments(i){
    const div = Doc.getDiv(i);
    Array.from(div.querySelectorAll("div.FlexTextarea div.mini-comment")).forEach(commentBadge => {
      commentBadge.remove();
    });
  }
  static hasComment(i, paraNum){
    return Doc.getComment(i, paraNum);
  }
  static setComment(i, paraNum){
    const el = Elem.create("div", {cl: "badge mini-badge mini-comment"});
    el.draggable = true;
    el.style.top = parseFloat(Doc.getParaHeight(i, paraNum).split(":")[0]) - 3 + "px";
    el.style.cursor = "pointer";

    const icon = Elem.create("img");
    icon.src = "img/comment-mini.png";

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
    if(!isWindowResize && this.selection.paras.length !== this.preSelection.paras.length){
      let newResponses;
      if(this.edit.isBackspace){
        const diffCount = this.preSelection.paras.filter(p => p !== "none").length;
        const selectionParaNum = this.selection.paras.findIndex(p => p !== "none");

        newResponses = this.selection.paras.reduce((acc, _, j) => {
          if(selectionParaNum >= j){
            acc.push(Doc.getResponse(i, j));
          }else if(selectionParaNum < j){
            if(diffCount == 1){
              acc.push(Doc.getResponse(i, j + 1));
            }else{
              acc.push(Doc.getResponse(i, j + diffCount - 1));
            }
          }
          return acc;
        }, []);
      }else if(this.edit.isDelete){
        const diffCount = this.preSelection.paras.filter(p => p !== "none").length;
        const selectionParaNum = this.selection.paras.findIndex(p => p !== "none");

        newResponses = this.selection.paras.reduce((acc, _, j) => {
          if(selectionParaNum >= j){
            acc.push(Doc.getResponse(i, j));
          }else if(selectionParaNum < j){
            if(diffCount == 1){
              acc.push(Doc.getResponse(i, j + 1));
            }else{
              acc.push(Doc.getResponse(i, j + diffCount - 1));
            }
          }
          return acc;
        }, []);
      }else if(this.edit.isEnter){
        const diffCount = this.preSelection.paras.filter(p => p !== "none").length - 2;
        const preSelectionPrefix = this.preSelection.paras.find(p => p !== "none");
        const preSelectionParaNum = this.preSelection.paras.findIndex(p => p !== "none");
        const preSelectionSuffix = [...this.preSelection.paras].reverse().find(p => p !== "none");

        newResponses = this.selection.paras.reduce((acc, _, j) => {
          if(preSelectionParaNum > j){
            acc.push(Doc.getResponse(i, j));
          }else if(preSelectionParaNum === j){
            if(["start", "all"].includes(preSelectionPrefix)) acc.push(false);
            else acc.push(Doc.getResponse(i, j));
          }else if(preSelectionParaNum + 1 === j){
            if(["start", "all"].includes(preSelectionPrefix)) acc.push(Doc.getResponse(i, j - 1));
            else if(preSelectionSuffix !== "start") acc.push(false);
            else acc.push(Doc.getResponse(i, j + diffCount));
          }else{
            acc.push(Doc.getResponse(i, j + diffCount));
          }
          return acc;
        }, []);
      }else if(this.edit.isPaste){
        const newLineCount = this.edit.pastedText.split("\n").length - 1;
        if(newLineCount === 0){
          const diffCount = this.preSelection.paras.filter(p => p !== "none").length;
          const selectionParaNum = this.selection.paras.findIndex(p => p !== "none");

          newResponses = this.selection.paras.reduce((acc, _, j) => {
            if(selectionParaNum >= j){
              acc.push(Doc.getResponse(i, j));
            }else if(selectionParaNum < j){
              if(diffCount == 1){
                acc.push(Doc.getResponse(i, j + 1));
              }else{
                acc.push(Doc.getResponse(i, j + diffCount - 1));
              }
            }
            return acc;
          }, []);
        }else{
          const diffCount = this.preSelection.paras.filter(p => p !== "none").length - (1 + newLineCount);
          const preSelectionPrefix = this.preSelection.paras.find(p => p !== "none");
          const preSelectionParaNum = this.preSelection.paras.findIndex(p => p !== "none");
          const preSelectionSuffix = [...this.preSelection.paras].reverse().find(p => p !== "none");

          newResponses = this.selection.paras.reduce((acc, _, j) => {
            if(preSelectionParaNum > j){
              acc.push(Doc.getResponse(i, j));
            }else if(preSelectionParaNum === j){
              if(["start", "all"].includes(preSelectionPrefix)) acc.push(false);
              else acc.push(Doc.getResponse(i, j));
            }else if(newLineCount > 1 && preSelectionParaNum + newLineCount > j){
              acc.push(false);
            }else if(preSelectionParaNum + 1 + (newLineCount - 1)  === j){
              if(["start", "all"].includes(preSelectionPrefix)) if(preSelectionSuffix !== "start") acc.push(Doc.getResponse(i, j - (1 + newLineCount - 1)));
              else acc.push(Doc.getResponse(i, j + diffCount));
              else if(preSelectionSuffix !== "start") acc.push(false);
              else acc.push(Doc.getResponse(i, j + diffCount));
            }else{
              acc.push(Doc.getResponse(i, j + diffCount));
            }
            return acc;
          }, []);
        }
      }else if(this.edit.isDrop){
        const newLineCount = this.edit.droppedText.split("\n").length - 1;

        const selectionParaNum = this.selection.paras.findIndex(p => p !== "none");

        newResponses = this.selection.paras.reduce((acc, _, j) => {
          if(selectionParaNum >= j){
            acc.push(Doc.getResponse(i, j));
          }else if(selectionParaNum + newLineCount >= j){
            acc.push(false);
          }else{
            acc.push(Doc.getResponse(i, j - newLineCount));
          }
          return acc;
        }, []);
      }
      if(!newResponses) return;
      Doc.setResponses(i, [...(newResponses.map(v => v ?? false))]);
    }

    KeyBorad.isEntered = false;
    this.isDelete = false;

    this.clearResponses(i);

    Doc.getResponses(i).forEach((b, j) => {
      if(!b) return;
      this.setResponse(i, j);
    });
  }
  static clearResponses(i){
    const div = Doc.getDiv(i);
    Array.from(div.querySelectorAll("div.FlexTextarea div.mini-response")).forEach(b => {
      b.remove();
    });
  }
  static hasResponse(i, paraNum){
    return Doc.getResponse(i, paraNum);
  }
  static setResponse(i, paraNum){
    const el = Elem.create("div", {cl: "badge mini-badge mini-response"});
    el.draggable = true;
    el.style.top = parseFloat(Doc.getParaHeight(i, paraNum).split(":")[0]) - 3 + "px";
    el.style.cursor = "pointer";

    const icon = Elem.create("img");
    icon.src = "img/response-mini.png";

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


  static getDroppedParaNum(i, y){
    const yPos = y - this.getOffsetTop(i);
    return Doc.getParaHeights(i).findIndex(paraHeight => {
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

  static setLineText(newText, i){
    const textBody = Doc.getTextBody(i);
    const line = Doc.getLine(i);

    if(line.text === newText){
      line.editedText = null;
      
      // textBody.value = line.text;
      textBody.classList.remove("edited");
    }else{
      line.editedText = newText;
      
      // textBody.value = newText;
      textBody.classList.add("edited");
    }
  }
}