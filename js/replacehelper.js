class ReplaceHelper {
  static isActive = false;
  static AROUND_CHAR_COUNT = 4;
  static replaceInfo = {
    text: null,
    charCount: 0,
    result: [],
    resultPerLine: [],
    isApply: []
  }
  static replaceStack = [];

  static init(){
    replaceInput.addEventListener("input", e => {
      this.replaceInfo.text = e.target.value;
      this.replaceInfo.charCount = this.replaceInfo.text.length;
      if(SearchHelper.searchInfo.resultCount === 0) return;
      // if(this.replaceInfo.text === ""){
      //   this.hideCompare();
      //   return;
      // }
      this.clearReult();
      this.update();
      this.createResultList();

      this.showCompare();
      this.updateBottomFade();
    });

    replacingBtn.addEventListener("click", () => {
      if(this.replaceInfo.result.length === 0) return;

      const beforeStr = SearchHelper.searchInfo.text;
      const afterStr = this.replaceInfo.text;
      
      const revSearchResult = structuredClone(SearchHelper.searchInfo.result).reverse();
      const replaceResultList = replaceCompare.querySelectorAll(".replace-selector");
      const replaceReulstCount = replaceResultList.length;
      const revReplacingTargets = Array.from(replaceResultList).reduce( (acc, cur) => {
        acc.push(cur.checked);
        return acc;
      }, []).reverse();
      const replacedLineNums = [];

      const replaceResultPerLine = new Array(Doc.getLines().length).fill(null).map(v => []);
      this.replaceInfo.isApply.length = 0;
      this.replaceInfo.isApply.push(...new Array(Doc.getLines().length).fill(false));

      revSearchResult.forEach( (r, j) => {
        if(!revReplacingTargets[j]) return;
        const i = r.lineIdx;
        const startIdx = r.startIdx;

        const textBody = Doc.getTextBody(i);
        const textBodyBG = Doc.getTextBodyBG(i);

        const target = textBody.value;
        const before = target.slice(0, startIdx);
        const after = target.slice(startIdx);

        const replacedAfter = after.replace(beforeStr, afterStr);

        const replaced = before + replacedAfter;
        textBody.value = replaced;
        textBodyBG.innerHTML = replaced;

        if(!replacedLineNums.includes(i)) replacedLineNums.push(i);

        const replacedNum = replaceReulstCount - 1 - j;
        document.querySelectorAll("#replace-compare li")[replacedNum].remove();
        this.replaceInfo.result.splice(replacedNum, 1);
        SearchHelper.removeFromResult(replacedNum);
        SearchHelper.decrementResult();

        if(replaceResultPerLine[i].length === 0){
          console.log(structuredClone(replaceResultPerLine));
          replaceResultPerLine[i].push(...Array.from({length: this.replaceInfo.charCount}, (_, k) => startIdx + k));
          console.log(structuredClone(replaceResultPerLine));
        }else{
          const diff = this.replaceInfo.charCount - SearchHelper.searchInfo.charCount;
          for(let k = 0; k < replaceResultPerLine[i].length; k++){
            replaceResultPerLine[i][k] += diff;
          }
          const addChars = Array.from({length: this.replaceInfo.charCount}, (_, k) => startIdx + k);

          replaceResultPerLine[i].unshift(...addChars);
        }

        if(SearchHelper.searchInfo.result.length !== replacedNum){
          const restSearchResult = SearchHelper.searchInfo.result.slice(replacedNum);
          if(restSearchResult[0].lineIdx !== i) return;
          const diff = this.replaceInfo.charCount - SearchHelper.searchInfo.charCount;
          for(const k in restSearchResult){
            if(restSearchResult[k].lineIdx !== i) continue;
            SearchHelper.searchInfo.result[Number(k) + replacedNum].startIdx += diff;
          }
        }
        console.log(structuredClone(replaceResultPerLine));
      });

      console.log(structuredClone(replaceResultPerLine));
      this.clearResultPerLine();
      this.replaceInfo.resultPerLine.push(...structuredClone(replaceResultPerLine));
      SearchHelper.clearResultPerLine();
      SearchHelper.searchInfo.resultPerLine.push(...SearchHelper.toPerLine());

      TextBody.unsetReplaceResultHighlights();

      for(const i of replacedLineNums){
        this.replaceInfo.isApply[i] = true;

        const textBody = Doc.getTextBody(i);
        if(TextBody.isEdited(textBody.value, i)){
          TextBody.enableEdited(i);
          Doc.setEditedText(i, textBody.value);
        }else{
          TextBody.disableEdited(i);
          Doc.setEditedText(i, null);
        }

        console.log(ReplaceHelper.replaceInfo.resultPerLine[i]);
        TextBody.resetCharsPerPara(i);
        TextBody.resetParaHeights(i);
        TextBody.resetMiniBadges(i);
      }

      SearchHelper.update();
      SearchHelper.selectFirst();

      this.updateBottomFade();

      this.replaceStack.push({
        before: beforeStr,
        after: afterStr
      });
    });
  }

  static show(){
    this.isActive = true;
    replaceContainer.classList.remove("hide");
    if(this.replaceInfo.text){
      this.clearReult();
      this.update();
      this.createResultList();
    }
    if(this.replaceInfo.result.length !== 0){
      this.showCompare();
      this.updateBottomFade();
    }
    if(SearchHelper.searchInfo.text) replaceInput.focus();
    else searchInput.focus();
  }
  static hide(){
    this.isActive = false;
    replaceContainer.classList.add("hide");
    if(this.replaceInfo.result.length === 0) return;
    this.hideCompare();
  }

  static clearReult(){
    this.replaceInfo.result.length = 0;
    this.clearResultPerLine();
  }
  static clearResultPerLine(){
    this.replaceInfo.resultPerLine.length = 0;
  }

  static update(){
    const searchInfo = SearchHelper.searchInfo;
    for(const j in searchInfo.result){
      const searchResult = searchInfo.result[j];

      const i = searchResult.lineIdx;
      const startIdx = searchResult.startIdx;
      const endIdx = startIdx + searchInfo.charCount;

      const paraNum = TextBody.posToParaNum(i, startIdx);
      const paraChars = Doc.getCharsPerPara(i)[paraNum];
      
      let prefix = null;
      if(startIdx - this.AROUND_CHAR_COUNT <= 0){
        prefix = paraChars.slice(0, startIdx);
      }else{
        prefix = `…${paraChars.slice(startIdx - this.AROUND_CHAR_COUNT, startIdx)}`;
      }

      let suffix = null;
      if(endIdx + this.AROUND_CHAR_COUNT >= paraChars.length){
        suffix = paraChars.slice(endIdx);
      }else{
        suffix = `${paraChars.slice(endIdx, endIdx + this.AROUND_CHAR_COUNT)}…`;
      }

      this.replaceInfo.result.push({
        before: [prefix, searchInfo.text, suffix],
        after: [prefix, this.replaceInfo.text, suffix]
      });
    }
  }

  static createResultList(){
    replaceCompare.innerHTML = "";

    const replaceResult = this.replaceInfo.result;
    replaceResult.forEach( (r, j) => {
      const rSelectorBox = Elem.create("div");
      rSelectorBox.style.pointerEvents = "none";
      const rSelector = Elem.create("input", {cl: "replace-selector"});
      rSelector.type = "checkbox";
      rSelector.checked = true;

      rSelectorBox.appendChild(rSelector);

      const item = Elem.create("div", {cl: "replace-compare-item"});

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

      item.appendChild(before);
      item.appendChild(arrow);
      item.appendChild(after);

      const li = Elem.create("li");
      li.addEventListener("click", e => {
        const selector = e.target.querySelector(".replace-selector");
        const item = e.target.querySelector(".replace-compare-item");

        if(selector.checked) item.classList.add("disabled");
        else item.classList.remove("disabled");
        selector.checked = !selector.checked;
      });
      li.appendChild(rSelectorBox);
      li.appendChild(item);

      replaceCompare.appendChild(li);
    });
  }

  static updateBottomFade(){
    const maxHeight = parseFloat(getComputedStyle(replaceCompare).maxHeight ?? "0px");
    if(maxHeight === 0) return;

    const gap = parseFloat(getComputedStyle(replaceCompare).gap ?? "0px");
    const resultLiElems = replaceCompare.children;
    const resultCount = resultLiElems.length;
    const totalResultLiElemHeight = Array.from(resultLiElems).reduce( (acc, cur) => {
      acc += cur.offsetHeight;
      return acc;
    }, 0);
    const sumHeight = totalResultLiElemHeight + gap * (resultCount - 1);

    if(sumHeight > maxHeight) replaceCompare.classList.add("overflow");
    else replaceCompare.classList.remove("overflow");
  }

  static showCompare(){
    replaceCompare.classList.remove("hide");
  }
  static hideCompare(){
    replaceCompare.classList.add("hide");
  }
}