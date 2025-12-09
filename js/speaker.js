class Speaker {
  static table = [];
  static calledCount = 0;

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

  static updateGuide(speakerIdx, guide){
    const prev = guide.querySelector(".speaker-prev");
    const curr = guide.querySelector(".speaker-curr");
    const next = guide.querySelector(".speaker-next");

    const speakers = Speaker.get();

    const prevSpeakerIdx = speakerIdx - 1 < 0
      ? speakers.length - 1
      : speakerIdx - 1;
    const nextSpeakerIdx = speakerIdx + 1 === speakers.length
      ? 0
      : speakerIdx + 1;

    prev.textContent = `${speakers[prevSpeakerIdx].name}←`;
    curr.textContent = speakers[speakerIdx].name;
    next.textContent = `→${speakers[nextSpeakerIdx].name}`;
  }

  static createGuide(speakerIdx){
    const box = Elem.create("div", {cl: "speaker-guide-box"});
    const prev = Elem.create("div", {cl: "speaker-prev"});
    const curr = Elem.create("div", {cl: "speaker-curr"});
    const next = Elem.create("div", {cl: "speaker-next"});

    const speakers = Speaker.get();

    const prevSpeakerIdx = speakerIdx - 1 < 0
      ? speakers.length - 1
      : speakerIdx - 1;
    const nextSpeakerIdx = speakerIdx + 1 === speakers.length
      ? 0
      : speakerIdx + 1;

    prev.textContent = `${speakers[prevSpeakerIdx].name} ←`;
    curr.textContent = speakers[speakerIdx].name;
    next.textContent = `→ ${speakers[nextSpeakerIdx].name}`;

    box.appendChild(prev);
    box.appendChild(curr);
    box.appendChild(next);

    return box;
  }
}