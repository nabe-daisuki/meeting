class Doc{
  static divs = [];
  static lines = [];
  static repinfos = [];

  static getDivs(){
    return this.divs;
  }
  static getDiv(i){
    return this.getDivs()[i];
  }
  static addDiv(div){
    this.getDivs().push(div);
  }

  static getLines(){
    return this.lines;
  }
  static getLine(i){
    return this.lines[i];
  }
  static setLines(lines){
    this.lines.push(...lines);
  }

  static getRepInfos(){
    return this.repinfos;
  }
  static setRepInfos(repinfos){
    this.repinfos.length = 0;
    this.repinfos.push(...repinfos);
  }
  static getRepInfo(i){
    return this.getRepInfos()[i];
  }

  static getCheckedSelectorIndexes(){
    return this.getLines().reduce( ( acc, _, i ) => {
      if(this.getChecked(i)) acc.push(i);
      return acc;
    }, []);
  }
  static getEditedTextIndexes(){
    return this.getLines().reduce( ( acc, _, i ) => {
      if(this.getEditedText(i) || this.getComments(i).some(c => c) || this.getResponses(i).some(r => r)) acc.push(i);
      return acc;
    }, []);
  }

  static getSelector(i){
    return this.getDiv(i).querySelector(".selector");
  }
  static getTimeStamp(i){
    return this.getDiv(i).querySelector(".timestamp");
  }
  static getBadged(i){
    return this.getDiv(i).querySelector(".badged");
  }
  static getTextBox(i){
    return this.getDiv(i).querySelector(".text-box");
  }
  static getTextBodyBG(i){
    return this.getDiv(i).querySelector(".text-body-bg");
  }
  static getTextBody(i){
    return this.getDiv(i).querySelector(".text-body");
  }

  static getText(i){
    return this.getLine(i).text;
  }

  static getEditedText(i){
    return this.getLine(i).editedText;
  }
  static setEditedText(i, t){
    this.getLine(i).editedText = t;
  }

  static getBadges(i){
    return this.getLine(i).badges;
  }
  static setBadges(i, b){
    this.getLine(i).badges = b;
  }
  static hadBadge(i, c){
    return this.getLine(i).badges.includes(c);
  }
  static addBadge(i, c){
    if(this.hadBadge(i, c)) return;
    this.setBadges(i, `${this.getBadges(i)}${c}`.split("").sort().join(""));
  }
  static removeBadge(i, c){
    this.setBadges(i, this.getBadges(i).replace(c, ""));
  }

  static getMiniBadges(i){
    return this.getLine(i).miniBadges;
  }
  static setMiniBadges(i, bs){
    this.getLine(i).miniBadges.length = 0;
    this.getLine(i).miniBadges.push(...bs);
  }
  static getMiniBadge(i, j){
    return this.getMiniBadges(i)[j];
  }
  static setMiniBadge(i, j, b){
    this.getMiniBadges(i)[j] = b;
  }
  static hasMiniBadge(i, j, c){
    return this.getLine(i).miniBadges[j].includes(c);
  }
  static addMiniBadge(i, j, c){
    if(this.hasMiniBadge(i, j, c)) return;
    this.setMiniBadge(i, j, c);
  }
  static removeMiniBadge(i, j){
    this.setMiniBadge(i, j, "n");
  }

  static getCharsPerPara(i){
    return this.getLine(i).charsPerPara;
  }
  static hasCharsInPara(i, j){
    return this.getCharsPerPara(i)[j].length !== 0;
  }

  static getParaHeights(i){
    return this.getLine(i).paraHeights;
  }
  static setParaHeights(i, pts){
    this.clearParaHeights(i);
    this.getParaHeights(i).push(...pts);
  }
  static clearParaHeights(i){
    this.getParaHeights(i).length = 0;
  }
  static getParaHeight(i, j){
    return this.getParaHeights(i)[j];
  }
  static setParaHeight(i, j, pt){
    this.getLine(i).paraHeights[j] = pt;
  }

  static getComments(i){
    return this.getLine(i).comments;
  }
  static setComments(i, cs){
    this.getLine(i).comments = cs;
  }
  static getComment(i, j){
    return this.getLine(i).comments[j];
  }
  static enableComment(i, j){
    this.getLine(i).comments[j] = true;
  }
  static disableComment(i, j){
    this.getLine(i).comments[j] = false;
  }

  static getResponses(i){
    return this.getLine(i).responses;
  }
  static setResponses(i, rs){
    this.getLine(i).responses = rs;
  }
  static getResponse(i, j){
    return this.getLine(i).responses[j];
  }
  static enableResponse(i, j){
    this.getLine(i).responses[j] = true;
  }
  static disableResponse(i, j){
    this.getLine(i).responses[j] = false;
  }

  static getDisabled(i){
    return this.getLine(i).disabled;
  }
  static setDisabled(i, b){
    this.getLine(i).disabled = b;
  }

  static getHided(i){
    return this.getLine(i).hided;
  }
  static setHided(i, b){
    this.getLine(i).hided = b;
  }

  static getChecked(i){
    return this.getLine(i).checked;
  }
  static setChecked(i, b){
    this.getLine(i).checked = b;
  }

  static clearDivs(){
    this.divs.length = 0;
  }
  static clearLines(){
    this.lines.length = 0;
  }
  static clearRepInfos(){
    this.repinfos.length = 0;
  }
}