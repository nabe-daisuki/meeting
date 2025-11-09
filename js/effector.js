class Effector {
  static init(){
    checkedShow.onclick = () => this.show("checked");

    checkedHide.onclick = () => this.hide("checked");

    checkedSetGreen.onclick = () => this.setGreen("checked");

    editedSetGreen.onclick = () => this.setGreen("edited");

    // checkedUnsetGreen.onclick = () => this.unsetGreen("checked");

    // editedSetGreen.onclick = () => this.setGreen("edited");

    // editedUnsetGreen.onclick = () => this.unsetGreen("edited");
  }

  static getIndexes(type){
    if(type === "checked"){
      return Doc.getCheckedSelectorIndexes();
    }else if(type === "edited"){
      return Doc.getEditedTextIndexes();
    }
  }

  static hide(type){
    this.getIndexes(type).forEach( i => {
      Doc.getTimeStamp(i).style.display = "none";
      Doc.getBadged(i).style.display = "none";
      Doc.getTextBox(i).style.display = "none";
      Selector.uncheck(i);

      Doc.setChecked(i, false);
      Doc.setHided(i, true);
    });

    DocHeader.uncheck();
  }

  static show(type){
    this.getIndexes(type).forEach( i => {
      Doc.getTimeStamp(i).style.display = "block";
      Doc.getBadged(i).style.display = "block";
      Doc.getTextBox(i).style.display = "block";
      Selector.uncheck(i);

      Doc.setChecked(i, false);
      Doc.setHided(i, false);
    });

    DocHeader.uncheck();
  }

  static setGreen(type){
    this.getIndexes(type).forEach( i => {
      Hatching.remove(i);
      Hatching.green(i);
      Selector.uncheck(i);
      
      Doc.setChecked(i, false);
    });
    DocHeader.uncheck();
  }

  static unsetGreen(type){
    this.getIndexes(type).forEach( i => {
      Hatching.remove(i);
      Selector.uncheck(i);

      Doc.setChecked(i, false);
    });
    DocHeader.uncheck();
  }


}