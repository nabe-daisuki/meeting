class Scroll {
  static isAuto = false;
  static pos = 0;

  static init(){
    lPanel.addEventListener("scroll", e => {
      this.setPos(e.target.scrollTop);
    });
    autoScrollCheckbox.addEventListener("change", e => {
      if(e.target.checked) this.enableAuto();
      else this.disableAuto();
    });
  }

  static scrollToLine(i) {
    if(i === 0 || i === 1) {
      this.setScrollTop(0);
      return;
    }else if(i === -1){
      i = Doc.getLines().length - 1;
    }
    i -= 2;
    const lineTopHeight = Doc.getDivs().slice(0, i + 1).reduce( (acc, cur) => {
      return acc += cur.offsetHeight;
    }, 0);
    
    this.setScrollTop(lineTopHeight);
  }

  static setAuto(){
    autoScrollCheckbox.checked = true;
    this.enableAuto();
  }
  static unsetAuto(){
    autoScrollCheckbox.checked = false;
    this.disableAuto();
  }
  static enableAuto(){
    this.isAuto = true;
  }
  static disableAuto(){
    this.isAuto = false;
  }

  static getPos(){
    return this.pos;
  }
  static setPos(v){
    this.pos = v;
  }

  static setScrollTop(v){
    lPanel.scrollTop = v;
  }
}