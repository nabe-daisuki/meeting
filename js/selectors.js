class Selectors {
  static preCheckedIdx = -1;

  static initPreCheckedIdx(){
    this.preCheckedIdx = -1;
  }
  static setPreCheckedIdx(i){
    this.preCheckedIdx = i;
  }

  static multiCheck(i){
    if(KeyBoard.hasShift){
      if(this.preCheckedIdx === -1){
        this.setPreCheckedIdx(i);
        return;
      }
      const minIdx = Math.min(this.preCheckedIdx, i);
      const maxIdx = Math.max(this.preCheckedIdx, i);

      for(let j = minIdx; j < maxIdx; j++){
        Doc.getSelector(j).checked = true;
        Doc.setChecked(j, true);
      }
    }else{
      this.setPreCheckedIdx(i);
    }
  }

  static hasCheck(){
    return Doc.divs.some( (_, i) => Doc.getSelector(i).checked);
  }
}