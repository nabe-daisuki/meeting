class Replace {
  static table = [];
  static tempTable = [];

  static helper = null;
  static register = null;

  static registerInfo = {
    charCount: 0,
    startPos: 0,
    endPos: 0,
    blockCharCount: 0,
    prefix: "",
    suffix: "",
    before: "",
    after: "",
    afterElem: null
  }

  static init(){
    showReplaceCandidateBtn.addEventListener("click", () => {
      Render.replaceCandidates();
      this.show();
    });

    rBack.addEventListener("click", () => {
      this.hide();
    });
  }

  static set(t){
    this.table.length = 0;
    this.table.push(...t);
  }

  static get(){
    return this.table;
  }

  static getList(){
    return repInfosUl.children;
  }

  static createHelper(){
    const box = Elem.create("div", {cl: "replace-register-helper-box"});
    box.innerHTML = "<span style='color:red;font-weight:bold;'>Ctrl+A</span>で置換候補を登録！";

    this.helper = box;
    return box;
  }

  static removeHelper(){
    this.helper?.remove();
    this.helper = null;
  }

  static resetAfter(newText){
    const replacedCharCount = newText.length - this.registerInfo.blockCharCount + this.registerInfo.charCount;
    const start = this.registerInfo.startPos;
    this.registerInfo.after = newText.slice(start, start + replacedCharCount)
    this.registerInfo.afterElem.textContent = this.registerInfo.after;
  }

  static resetRegisterInfo(){
    const i = Selection.idx;
    const text = Doc.getTextBody(i).value;

    this.registerInfo.charCount = TextBody.selection.end - TextBody.selection.start; 
    this.registerInfo.startPos = TextBody.selection.start;
    this.registerInfo.endPos = TextBody.selection.end;
    this.registerInfo.blockCharCount = text.length;

    const prefixStart = Math.max(0, this.registerInfo.startPos - 7);
    const suffixEnd = Math.min(this.registerInfo.endPos + 7, this.registerInfo.blockCharCount);

    let prefix = text.slice(prefixStart, this.registerInfo.startPos);
    if(prefixStart !== 0) prefix = `…${prefix}`;
    this.registerInfo.prefix = prefix;

    let suffix = text.slice(this.registerInfo.endPos, suffixEnd);
    if(suffixEnd !== this.registerInfo.blockCharCount) suffix = `${suffix}…`;
    this.registerInfo.suffix = suffix;

    this.registerInfo.before = text.slice(this.registerInfo.startPos, this.registerInfo.endPos);
    this.registerInfo.after = text.slice(this.registerInfo.startPos, this.registerInfo.endPos);
  }

  static createRegister(){
    const box = Elem.create("div", {cl: "replace-register-box"});

    const descBox = Elem.create("div");
    const desc1 = Elem.create("span", {cl: "emphasis-word"});
    desc1.textContent = "選択文字の範囲外を選択したら";
    const desc2 = Elem.createT("置換候補を登録します。");

    descBox.appendChild(desc1);
    descBox.appendChild(desc2);

    const beforePrefix = Elem.create("span", {cl: "normal-word"});
    beforePrefix.textContent = this.registerInfo.prefix;
    const before = Elem.create("span", {cl: "before-word"});
    before.textContent = this.registerInfo.before;
    const beforeSuffix = Elem.create("span", {cl: "normal-word"});
    beforeSuffix.textContent = this.registerInfo.suffix;

    const afterPrefix = Elem.create("span", {cl: "normal-word"});
    afterPrefix.textContent = this.registerInfo.prefix;
    const after = Elem.create("span", {cl: "after-word"});
    after.textContent = this.registerInfo.after;
    this.registerInfo.afterElem = after;
    const afterSuffix = Elem.create("span", {cl: "normal-word"});
    afterSuffix.textContent = this.registerInfo.suffix;

    const replacingBox = Elem.create("div");
    const beforeBox = Elem.create("div");
    beforeBox.appendChild(beforePrefix);
    beforeBox.appendChild(before);
    beforeBox.appendChild(beforeSuffix);

    const arrow = Elem.create("div");
    arrow.textContent = "↓";

    const afterBox = Elem.create("div");
    afterBox.appendChild(afterPrefix);
    afterBox.appendChild(after);
    afterBox.appendChild(afterSuffix);

    replacingBox.appendChild(beforeBox);
    replacingBox.appendChild(arrow);
    replacingBox.appendChild(afterBox);

    box.appendChild(descBox);
    box.appendChild(Elem.create("hr"));
    box.appendChild(replacingBox);

    this.register = box;
    return box;
  }

  static removeRegister(){
    this.register?.remove();
    this.register = null;
  }

  static registering(count = 0){
    if(this.registerInfo.before === this.registerInfo.after) return;
    this.tempTable.push({
      src: this.registerInfo.before,
      dest: this.registerInfo.after,
      prefix: this.registerInfo.prefix,
      suffix: this.registerInfo.suffix,
      check: false,
      count
    });
  }

  static hasDuplicatesAfterReplacement(target){

  }

  static createCandidates(){
    const items = [];

    this.tempTable.forEach(t => {
      const item = Elem.create("div", {cl: "r-tile"});
      const check = Elem.create("input", {cl: "r-status"});
      check.type = "checkbox";
      check.value = t.check;

      const status = Elem.create("span", {cl: "r-status"});
      // if()
      status.textContent = "Duplicate"

      const beforePrefix = Elem.create("span", {cl: "r-normal-word"});
      beforePrefix.textContent = t.prefix;
      const before = Elem.create("span", {cl: "r-before-word"});
      before.textContent = t.src;
      const beforeSuffix = Elem.create("span", {cl: "r-normal-word"});
      beforeSuffix.textContent = t.suffix;

      const afterPrefix = Elem.create("span", {cl: "r-normal-word"});
      afterPrefix.textContent = t.prefix;
      const after = Elem.create("span", {cl: "r-after-word"});
      after.textContent = t.dest;
      const afterSuffix = Elem.create("span", {cl: "r-normal-word"});
      afterSuffix.textContent = t.suffix;

      const replacingBox = Elem.create("div", {cl: "r-replacing-box"});
      const beforeBox = Elem.create("div");
      beforeBox.appendChild(beforePrefix);
      beforeBox.appendChild(before);
      beforeBox.appendChild(beforeSuffix);

      const arrow = Elem.create("div");
      arrow.textContent = "↓";

      const afterBox = Elem.create("div");
      afterBox.appendChild(afterPrefix);
      afterBox.appendChild(after);
      afterBox.appendChild(afterSuffix);

      replacingBox.appendChild(beforeBox);
      replacingBox.appendChild(arrow);
      replacingBox.appendChild(afterBox);

      item.appendChild(check);
      item.appendChild(status);
      item.appendChild(replacingBox);

      items.push(item);
    });

    return items;

    // <div class="tile">
    //     <input type="checkbox" />
    //     <span class="badge">ACTIVE</span>
    //     <div>
    //       <div class="tile-title">Tile 05</div>
    //       <div class="tile-meta">updated yesterday</div>
    //     </div>
    //   </div>
  }

  static show(){
    replaceSelectorSection.classList.remove("hide");
  }

  static hide(){
    replaceSelectorSection.classList.add("hide");
  }
}