class Speaker {
  static table = [];

  static count(){
    return this.getBtns().length;
  }
  static get(){
    return this.table;
  }
  static set(t){
    this.table.length = 0;
    this.table.push(...t);
  }

  static getBtns(){
    return Array.from(speakers.querySelectorAll("button")).reduce( (acc, cur) => {
      acc.push(cur);
      return acc;
    }, []);
  }

  static create(name){
    const el = Elem.create("button", {cl: `STB_BTN_${Theme.jpnToCode(Theme.get())}`});
    el.draggable = true;
    el.textContent = `（${name}）`;
    el.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", `${name}_SPEAKER`);
      e.dataTransfer.effectAllowed = "copy";
    });
    el.addEventListener("click", e => {
      const j = Selection.idx;
      const textBody = Doc.getTextBody(j);
      const isMultiLine = textBody.value.slice(TextBody.selection.start, TextBody.selection.end).includes("\n");
      const paraNum = TextBody.getSelectionParaNum(j);

      if(isMultiLine) return;
      const speaker = e.target.textContent.replace(/[（）]/g, "");
      const replacedText = textBody.value.split("\n").map((l, k) => {
        if(k === paraNum) return TextBody.resetSpeaker(l, speaker);
        else return l;
      }).join("\n");

      textBody.value = replacedText;
      TextBody.enableEdited(j);
      Doc.setEditedText(j, replacedText);
      
      TextBody.resetCharsPerPara(j);
      TextBody.resetParaHeights(j);
      TextBody.resetMiniBadges(j);
    });
    return el;
  }
}