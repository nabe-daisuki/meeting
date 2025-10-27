class Scroll {
  static isAuto = false;

  static init(){
    autoScrollCheckbox.addEventListener("change", e => {
      this.isAuto = e.target.checked;
    });
  }

  static scrollToLine(i) {
    if(i !== 0) i--;

    const lineTopHeight = Doc.getDivs().slice(0, i + 1).reduce( (acc, cur) => {
      return acc += cur.offsetHeight;
    }, 0);
    
    lPanel.scrollTop = lineTopHeight;
  }

  static enableAuto(){
    this.isAuto = true;
  }
  static disableAuto(){
    this.isAuto = false;
  }
}