class SearchHelper {
  static isActive = false;
  static canMoveAudio = true;
  static searchInfo = {
    text: null,
    charCount: 0,
    result: [],
    resultCount: 0,
    resultPerLine: []
  }

  static init(){
    searchInput.addEventListener("input", e => {
      this.clearResult();
      this.searchInfo.text = e.target.value;
      this.searchInfo.charCount = this.searchInfo.text.length;
      if(this.searchInfo.text !== ""){
        this.searchInfo.result.push(...this.search(this.searchInfo.text));
        this.searchInfo.resultCount = this.searchInfo.result.length;
      }
      this.update();

      if(this.searchInfo.resultCount) this.searchInfo.resultPerLine.push(...this.toPerLine());
      else this.searchInfo.resultPerLine.push(...new Array(Doc.getLines().length).fill(null).map(v => []));

      for(const i in Doc.getLines()){
        TextBody.setSearchResultHighlights(i);
      }

      if(!this.searchInfo.resultCount) return;
      const lineIdx = this.searchInfo.result[0].lineIdx;
      if(Selection.preIdx === lineIdx) return;
      Scroll.scrollToLine(lineIdx);
      Selection.relocateHighlight(lineIdx);

      if(this.canMoveAudio) Doc.getTimeStamp(lineIdx).click();
    });

    searchInput.addEventListener("click", e => {
      e.stopPropagation();
    });

    searchInput.addEventListener("keydown", e => {
      if(e.key !== "Enter") return;
      const resultCount = this.searchInfo.resultCount;
      if(resultCount === 0) return;

      Scroll.unsetAuto();

      const [currentCount, ] = searchResult.textContent.split("/").map(Number);
      let lineIdx = 0;
      let startIdx = 0;

      if(KeyBoard.hasShift){
        if(currentCount > 0){
          const preCount = currentCount - 1;
          searchResult.textContent = `${preCount}/${resultCount}`;

          lineIdx = this.searchInfo.result[preCount - 1].lineIdx;
          startIdx = this.searchInfo.result[preCount - 1].startIdx;
        }else if(currentCount === 0){
          searchResult.textContent = `${resultCount}/${resultCount}`;
          
          lineIdx = this.searchInfo.result[resultCount - 1].lineIdx;
          startIdx = this.searchInfo.result[resultCount - 1].startIdx;
        }
      }else{
        if(currentCount < resultCount){
          const nextCount = currentCount + 1;
          searchResult.textContent = `${nextCount}/${resultCount}`;

          lineIdx = this.searchInfo.result[nextCount - 1].lineIdx;
          startIdx = this.searchInfo.result[nextCount - 1].startIdx;
        }else if(currentCount === resultCount){
          searchResult.textContent = `1/${resultCount}`;
          
          lineIdx = this.searchInfo.result[0].lineIdx;
          startIdx = this.searchInfo.result[0].startIdx;
        }
      }

      for(const j in Doc.getLines()){
        const textBodyBG = Doc.getTextBodyBG(j);
        const isSearchedI = textBodyBG.querySelectorAll(".is-searched");
        for(let k = 0; k < isSearchedI.length; k++){
          isSearchedI[k].classList.remove("focus");
        }

        if(Number(j) !== lineIdx) continue;
        const idx = this.searchInfo.resultPerLine[lineIdx].indexOf(startIdx);
        for(let k = 0; k < this.searchInfo.charCount; k++){
          isSearchedI[k + idx].classList.add("focus");
        }
      }

      if(Selection.preIdx === lineIdx) return;
      Scroll.scrollToLine(lineIdx);
      Selection.relocateHighlight(lineIdx);

      if(this.canMoveAudio) Doc.getTimeStamp(lineIdx).click();
    });

    canMoveAudioBtn.addEventListener("click", e => {
      if(this.canMoveAudio){
        e.target.classList.add("disable");
      }else{
        e.target.classList.remove("disable");
      }
      this.canMoveAudio = !this.canMoveAudio;
    });

    searchCloseBtn.addEventListener("click", () => {
      this.hide();
    });
  }

  static clearResult(){
    this.searchInfo.result.length = 0;
    this.searchInfo.resultCount = 0;
    this.searchInfo.resultPerLine.length = 0;
  }

  static show(){
    this.isActive = true;
    searchContainer.classList.remove("hide");
    searchInput.focus();
  }
  static hide(){
    this.isActive = false;
    searchContainer.classList.add("hide");

    for(const j in Doc.getLines()){
      TextBody.setReplacementHighlights(j);
    }
  }

  static research(){
    if(searchInput.value === "") return;
    this.clearResult();
    this.searchInfo.text = searchInput.value;
    this.searchInfo.charCount = this.searchInfo.text.length;
    this.searchInfo.result.push(...this.search(this.searchInfo.text));
    this.searchInfo.resultCount = this.searchInfo.result.length;
    this.update();

    if(this.searchInfo.resultCount) this.searchInfo.resultPerLine.push(...this.toPerLine());
    else this.searchInfo.resultPerLine.push(...new Array(Doc.getLines().length).fill(null).map(v => []));

    for(const i in Doc.getLines()){
      TextBody.setSearchResultHighlights(i);
    }
  }

  static search(target){
    const result = [];
    for(const i in Doc.getLines()){
      const text = Doc.getTextBody(i).value;

      let offset = 0;
      let startIdx = 0;
      while( (startIdx = text.indexOf(target, offset)) !== -1){
        result.push({
          lineIdx: Number(i),
          startIdx
        });
        offset = startIdx + this.searchInfo.charCount;
      }
    }
    return structuredClone(result);
  }

  static update(){
    searchResult.textContent = this.searchInfo.resultCount
      ? `1/${this.searchInfo.resultCount}`
      : "0/0";
  }

  static toPerLine(){
    const resultPerLine = [];
    let offset = 0, offsetBuf = 0;
    for(const i in Doc.getLines()){
      const resultLine = [];
      for(const j in this.searchInfo.result.slice(offset)){
        if(Number(i) !== this.searchInfo.result[offset + Number(j)].lineIdx) break;
        const startIdx = this.searchInfo.result[offset + Number(j)].startIdx;
        console.log(`arr :`,Array.from({ length: this.searchInfo.charCount }, (_, k) => startIdx + k))
        resultLine.push(...Array.from({ length: this.searchInfo.charCount }, (_, k) => startIdx + k))
        offsetBuf++;
      }
      resultPerLine.push(resultLine);
      offset = offsetBuf;
    }

    return structuredClone(resultPerLine);
  }
}