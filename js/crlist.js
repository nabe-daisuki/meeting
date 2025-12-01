class CRList {
  static isTest = true;
  static isValid = false;
  static data = [
    {
      case_id: "2025-000",
      case_name: "aiueo",
      case_content: "人が何かを始めるとき、最初から完璧にやろうとする必要はない。むしろ、適当に触ってみて「これでいいのか？」と疑いながら進めるほうが、結果的に理解が深まることが多い。技術でも仕事でも同じだ。完璧主義で固まって動けなくなるくらいなら、まず雑でも動く。それだけで状況は一気に変わる。迷ったら、小さく試して、結果を見て修正すればいい。誰だって最初は見よう見まねだし、そこから自分の形ができていく。大事なのは、自分がどう感じるかを無視しないことだ。「これは違うな」と思ったら引き返していいし、「意外といける」と思ったら踏み込めばいい。正解なんて後からついてくる。今は前に進む力さえあれば十分だ。",
      attachments: [{
          name: "a",
          size: 111,
          binary: null,
          rotations: []
        },
        {
          name: "b",
          size: 112,
          binary: null,
          rotations: []
        }]
    },
    {
      case_id: "2025-001",
      case_name: "start-small",
      case_content:
        "何かを始めるときに、一気に大きな成果を狙う必要はない。まずは小さく踏み出して、手応えを確認しながら進めばいい。小さな前進を積み重ねれば、結果は自然とついてくる。大事なのは、止まらないこと。",
      attachments: []
    },
    {
      case_id: "2025-002",
      case_name: "don’t-overthink",
      case_content:
        "人が何かを始めるとき、最初から完璧にやろうとする必要はない。むしろ、適当に触ってみて「これでいいのか？」と疑いながら進めるほうが、結果的に理解が深まることが多い。技術でも仕事でも同じだ。完璧主義で固まって動けなくなるくらいなら、まず雑でも動く。それだけで状況は一気に変わる。迷ったら、小さく試して、結果を見て修正すればいい。誰だって最初は見よう見まねだし、そこから自分の形ができていく。大事なのは、自分がどう感じるかを無視しないことだ。「これは違うな」と思ったら引き返していいし、「意外といける」と思ったら踏み込めばいい。正解なんて後からついてくる。今は前に進む力さえあれば十分だ。",
      attachments: [{
          name: "a",
          size: 111,
          binary: null,
          rotations: []
        },
        {
          name: "b",
          size: 112,
          binary: null,
          rotations: []
        }]
    },
    {
      case_id: "2025-003",
      case_name: "own-pace",
      case_content:
        "人と比べても意味がない。それぞれペースが違うし、求めているものも違う。自分のリズムを守って進めばいい。他人の速度に焦って無理をすると、結局遠回りになる。自分の感覚を信じて調整していけば十分。",
      attachments: [{
          name: "c",
          size: 120,
          binary: null,
          rotations: []
        },
        {
          name: "d",
          size: 200,
          binary: null,
          rotations: []
        },
        {
          name: "e",
          size: 222000,
          binary: null,
          rotations: []
        }]
    },
    {
      case_id: "2025-004",
      case_name: "trial-and-error",
      case_content:
        "失敗は悪いことじゃない。むしろ試行錯誤を繰り返した分だけ理解が深くなる。上手くいかない時期があるのは当然で、そこで諦めずに触り続けられるかが分岐点。遠回りしてもいい。結果的には前に進んでいる。",
      attachments: []
    },
    {
      case_id: "2025-005",
      case_name: "adjust-quickly",
      case_content:
        "違うと思ったらすぐ方向を変えればいい。意地になって進む必要はない。柔軟に修正できる人ほど成長が早い。正解は固定じゃなくて、進みながら作っていくもの。引き返すことも前進の一部だ。",
      attachments: []
    },
    {
      case_id: "2025-006",
      case_name: "trust-your-sense",
      case_content:
        "自分の感覚を軽視しないほうがいい。違和感は無視すると後で必ず足を引っ張る。逆に『これいける』と思えたら素直に踏み込んでいい。感覚は経験が積み重なってできた判断材料だから、信用していい。",
      attachments: []
    },
    {
      case_id: "2025-007",
      case_name: "keep-moving",
      case_content:
        "停滞が一番苦しい。でも、ほんの少しだけ進むだけで景色は変わる。速度は遅くていいし、雑でも構わない。止まらなければ、必ず何かは掴める。前向きに少しずつ手を伸ばしていけばいい。",
      attachments: []
    },
//     {
//       case_id: "2025-008",
//       case_name: "kakikukeko",
//       case_content: `古い町並みを歩いていると、ふと足を止めたくなる瞬間がある。
// 石畳の隙間から伸びた小さな草や、誰が置いたのか分からない錆びたベンチ。
// どれも特別なものではないのに、妙に心を落ち着かせる。

// 観光地として有名な場所でもないし、人通りもまばらだ。
// それでも、夕方の柔らかい光が差し込むだけで、そこは急に「大切な景色」になる。

// 人の記憶って、派手な出来事より、こういう何でもない瞬間のほうが深く残る。
// 理由なんてなくていい。ただ、その場が自分の感性に刺さった。それだけで十分だ。

// また来たいと思える場所は、案外こういうところなのかもしれない。`,
//       case_content2: `古い町並みを歩いていると、ふと足を止めたくなる瞬間がある。
// 石畳の隙間から伸びた小さな草や、誰が置いたのか分からない錆びたベンチ。
// どれも特別なものではないのに、妙に心を落ち着かせる。

// 観光地として有名な場所でもないし、人通りもまばらだ。
// それでも、夕方の柔らかい光が差し込むだけで、そこは急に「大切な景色」になる。

// 人の記憶って、派手な出来事より、こういう何でもない瞬間のほうが深く残る。
// 理由なんてなくていい。ただ、その場が自分の感性に刺さった。それだけで十分だ。

// また来たいと思える場所は、案外こういうところなのかもしれない。`,
//       case_content3: `古い町並みを歩いていると、ふと足を止めたくなる瞬間がある。
// 石畳の隙間から伸びた小さな草や、誰が置いたのか分からない錆びたベンチ。
// どれも特別なものではないのに、妙に心を落ち着かせる。

// 観光地として有名な場所でもないし、人通りもまばらだ。
// それでも、夕方の柔らかい光が差し込むだけで、そこは急に「大切な景色」になる。

// 人の記憶って、派手な出来事より、こういう何でもない瞬間のほうが深く残る。
// 理由なんてなくていい。ただ、その場が自分の感性に刺さった。それだけで十分だ。

// また来たいと思える場所は、案外こういうところなのかもしれない。`,
//       case_content3: `古い町並みを歩いていると、ふと足を止めたくなる瞬間がある。
// 石畳の隙間から伸びた小さな草や、誰が置いたのか分からない錆びたベンチ。
// どれも特別なものではないのに、妙に心を落ち着かせる。

// 観光地として有名な場所でもないし、人通りもまばらだ。
// それでも、夕方の柔らかい光が差し込むだけで、そこは急に「大切な景色」になる。

// 人の記憶って、派手な出来事より、こういう何でもない瞬間のほうが深く残る。
// 理由なんてなくていい。ただ、その場が自分の感性に刺さった。それだけで十分だ。

// また来たいと思える場所は、案外こういうところなのかもしれない。`,
//       case_content4: `古い町並みを歩いていると、ふと足を止めたくなる瞬間がある。
// 石畳の隙間から伸びた小さな草や、誰が置いたのか分からない錆びたベンチ。
// どれも特別なものではないのに、妙に心を落ち着かせる。

// 観光地として有名な場所でもないし、人通りもまばらだ。
// それでも、夕方の柔らかい光が差し込むだけで、そこは急に「大切な景色」になる。

// 人の記憶って、派手な出来事より、こういう何でもない瞬間のほうが深く残る。
// 理由なんてなくていい。ただ、その場が自分の感性に刺さった。それだけで十分だ。

// また来たいと思える場所は、案外こういうところなのかもしれない。`,
//       case_content5: `古い町並みを歩いていると、ふと足を止めたくなる瞬間がある。
// 石畳の隙間から伸びた小さな草や、誰が置いたのか分からない錆びたベンチ。
// どれも特別なものではないのに、妙に心を落ち着かせる。

// 観光地として有名な場所でもないし、人通りもまばらだ。
// それでも、夕方の柔らかい光が差し込むだけで、そこは急に「大切な景色」になる。

// 人の記憶って、派手な出来事より、こういう何でもない瞬間のほうが深く残る。
// 理由なんてなくていい。ただ、その場が自分の感性に刺さった。それだけで十分だ。

// また来たいと思える場所は、案外こういうところなのかもしれない。`,
//       case_content6: `古い町並みを歩いていると、ふと足を止めたくなる瞬間がある。
// 石畳の隙間から伸びた小さな草や、誰が置いたのか分からない錆びたベンチ。
// どれも特別なものではないのに、妙に心を落ち着かせる。

// 観光地として有名な場所でもないし、人通りもまばらだ。
// それでも、夕方の柔らかい光が差し込むだけで、そこは急に「大切な景色」になる。

// 人の記憶って、派手な出来事より、こういう何でもない瞬間のほうが深く残る。
// 理由なんてなくていい。ただ、その場が自分の感性に刺さった。それだけで十分だ。

// また来たいと思える場所は、案外こういうところなのかもしれない。`
//     },
    {
      case_id: "2025-009",
      case_name: "aiueo",
      case_content: "人が何かを始めるとき、最初から完璧にやろうとする必要はない。むしろ、適当に触ってみて「これでいいのか？」と疑いながら進めるほうが、結果的に理解が深まることが多い。技術でも仕事でも同じだ。完璧主義で固まって動けなくなるくらいなら、まず雑でも動く。それだけで状況は一気に変わる。迷ったら、小さく試して、結果を見て修正すればいい。誰だって最初は見よう見まねだし、そこから自分の形ができていく。大事なのは、自分がどう感じるかを無視しないことだ。「これは違うな」と思ったら引き返していいし、「意外といける」と思ったら踏み込めばいい。正解なんて後からついてくる。今は前に進む力さえあれば十分だ。",
      attachments: []
    },
    {
      case_id: "2025-010",
      case_name: "start-small",
      case_content:
        "何かを始めるときに、一気に大きな成果を狙う必要はない。まずは小さく踏み出して、手応えを確認しながら進めばいい。小さな前進を積み重ねれば、結果は自然とついてくる。大事なのは、止まらないこと。",
      attachments: []
    },
    {
      case_id: "2025-011",
      case_name: "don’t-overthink",
      case_content:
        "考えすぎると動けなくなる。完璧に計画を立てても、その通りにいくことなんて滅多にない。実際に手を動かしたほうが、問題点も方向性も鮮明になる。迷ったら、まず一歩踏み出せばいい。",
      attachments: []
    },
    {
      case_id: "2025-012",
      case_name: "own-pace",
      case_content:
        "人と比べても意味がない。それぞれペースが違うし、求めているものも違う。自分のリズムを守って進めばいい。他人の速度に焦って無理をすると、結局遠回りになる。自分の感覚を信じて調整していけば十分。",
      attachments: []
    },
    {
      case_id: "2025-013",
      case_name: "trial-and-error",
      case_content:
        "失敗は悪いことじゃない。むしろ試行錯誤を繰り返した分だけ理解が深くなる。上手くいかない時期があるのは当然で、そこで諦めずに触り続けられるかが分岐点。遠回りしてもいい。結果的には前に進んでいる。",
      attachments: []
    },
    {
      case_id: "2025-014",
      case_name: "adjust-quickly",
      case_content:
        "違うと思ったらすぐ方向を変えればいい。意地になって進む必要はない。柔軟に修正できる人ほど成長が早い。正解は固定じゃなくて、進みながら作っていくもの。引き返すことも前進の一部だ。",
      attachments: []
    },
    {
      case_id: "2025-015",
      case_name: "trust-your-sense",
      case_content:
        "自分の感覚を軽視しないほうがいい。違和感は無視すると後で必ず足を引っ張る。逆に『これいける』と思えたら素直に踏み込んでいい。感覚は経験が積み重なってできた判断材料だから、信用していい。",
      attachments: []
    },
    {
      case_id: "2025-016",
      case_name: "keep-moving",
      case_content:
        "停滞が一番苦しい。でも、ほんの少しだけ進むだけで景色は変わる。速度は遅くていいし、雑でも構わない。止まらなければ、必ず何かは掴める。前向きに少しずつ手を伸ばしていけばいい。",
      attachments: []
    },
  ];

  static isInitialized = false;
  static group = [];
  static compressCaseTitles = [];
  static isSelectedMultiCase = false;
  static loadingPDFCaseId = "";

  static timer = null;

  static getCaseIdsSelectorGap(){
    return Elem.getStyleNum(caseIdsSelector, "gap");
  }
  static getCaseIdsWrapperMarginL(){
    return Elem.getStyleNum(caseIdsWrapper, "margin-left");
  }
  static getCaseIdsWrapperGap(){
    return Elem.getStyleNum(caseIdsWrapper, "gap");
  }
  static getCaseIdsHandleW(){
    return caseIdsHandle.clientWidth;
  }
  static setCaseIdsW(){
    const totalWidth = SubTools.getSubToolSectionW();
    const deductions = [
      this.getCaseIdsSelectorGap(),
      this.getCaseIdsWrapperMarginL(),
      this.getCaseIdsWrapperGap(),
      this.getCaseIdsHandleW(),
      this.getCaseIdsSwitcherW()
    ]

    const computedW = Calc.sub(totalWidth, deductions);

    const w = Math.min(computedW, 330);
    caseIds.style.width = Convert.numToPx(w);
  }
  static getCaseIdsSwitcherW(){
    return caseIdsSwitcher.clientWidth;
  }
  static getCaseContentW() {
    const totalW = caseContent.clientWidth;
    const deduction = Elem.getStyleNum(caseContent, "--scroll-width");
    const computedW = Calc.sub(totalW, deduction);
    return computedW;
  }
  static getCaseContentLiPaddingL(){
    return Elem.getStyleNum(document.querySelector("#case-content li"), "padding-left");
  }
  static getCaseContentLiPaddingR(){
    return Elem.getStyleNum(document.querySelector("#case-content li"), "padding-right");
  }
  static setCaseContentLiW(){
    if(!this.isSelectedMultiCase) return;
    const minW = Convert.numToPx(Elem.getStyleNum(document.querySelector(".item-content"), "min-width"));
    document.querySelectorAll("#case-content li").forEach(li => {
      li.style.width = minW;
    });

    const caseCount = document.querySelector("#case-content li").querySelectorAll(".item-content").length;

    const w1 = Calc.sumArr([
        this.getItemContentW() * caseCount,
        this.getItemContentsGap() * (caseCount - 1)
    ]);

    const totalW = this.getCaseContentW();
    const deductions = [
      this.getCaseContentLiPaddingL(),
      this.getCaseContentLiPaddingR()
    ];
    const w2 = Calc.sub(totalW, deductions);
    const maxW = Convert.numToPx(Math.max(w1, w2));

    document.querySelectorAll("#case-content li").forEach(li => {
      li.style.width = maxW;
    });
  }
  static getItemContentW(){
    return document.querySelector("#case-content .item-content").offsetWidth;
  }
  static getItemContentsGap(){
    return parseFloat(getComputedStyle(document.querySelector("#case-content .item-contents")).gap);
  }

  static pdfLoaderEnableSticky(){
    caseContent.querySelector("li.loadable").classList.remove("nosticky");
  }
  static pdfLoaderDisableSticky(){
    caseContent.querySelector("li.loadable").classList.add("nosticky");
  }

  static getAttachmentBin(caseId, name){
    const attachment = this.getAttachment(caseId, name);
    const bin = attachment.binary;
    if(!bin) return null;
    const arrBuf = Convert.base64ToArrBuf(bin);
    return arrBuf;
  }
  static getAttachment(caseId, name){
    const attachments = this.getAttachments(caseId);
    for(let i = 0; i < attachments.length; i++){
      if(attachments[i].name.includes(name)) return attachments[i];
    }
    return null;
  }
  static getAttachments(caseId){
    const caseData = this.get().find(c => c.case_id === caseId);
    return caseData.attachments;
  }
  static addAttachment(name, size, binary, pageCount){
    const caseData = this.get().find(c => c.case_id === this.loadingPDFCaseId);
    if(!caseData) return;
    caseData.attachments.push({
      name,
      size,
      binary: Convert.arrBufToBase64(binary),
      rotations: new Array(pageCount).fill(0)
    });

    const attachmentItemContent = [...document.querySelectorAll("#case-content .item-content")]
      .find(el => el.dataset.attachmentcode === this.loadingPDFCaseId);
    
    const attachment = this.createAttachmentBox(name);
    attachmentItemContent.appendChild(attachment);
  }
  static setAttachmentRotation(caseId, name, rotations){
    const attachment = this.getAttachment(caseId, name);
    attachment.rotations.length = 0;
    attachment.rotations.push(...rotations);
  }

  static isDuplicatedPDF(caseId, name, size){
    const attachments = this.getAttachments(caseId);
    for(let i = 0; i < attachments.length; i++){
      if(attachments[i].name === name && attachments[i].size !== size){
        alert(`同じ名前の添付資料は、登録できません。
既存の添付資料を右クリックし、削除してから登録ください。
`);
        return true;
      }
      if(attachments[i].name === name && attachments[i].size === size) return true;
    }
    return false;
  }

  static createAttachmentBox(name){
    const attachment = Elem.create("div", {cl: "attachment-box"});

    const handle = Elem.create("div", {cl: "attachment-handle"});
    handle.draggable = "true";
    handle.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", `添付資料「${name}」`);
    });
    handle.addEventListener("click", e => {
      if(TextBody.selection.start === -1) return;
      const name = `添付資料「${e.target.parentElement.textContent}」`;
      const i = Selection.idx;
      TextBody.insert(name, i);
    });

    const attachmentName = Elem.create("div", {cl: "attachment-name"});
    attachmentName.textContent = name;
    attachmentName.addEventListener("click", async(e) => {
      const name = e.target.textContent;
      const caseId = e.target.parentElement.parentElement.dataset.attachmentcode;
      const bin = this.getAttachmentBin(caseId, name);
      if(!bin) return;
      const attachment = CRList.getAttachment(caseId, name);
      PDFViewer.prevPdf.caseid = caseId;
      PDFViewer.prevPdf.name = name;
      PDFViewer.prevPdf.size = attachment.size;
      PDFViewer.prevPdf.rotations = [...attachment.rotations];
      await PDFViewer.loadPDF(bin);
    });
    attachmentName.addEventListener("contextmenu", e => {
      e.preventDefault();
      const el = e.target;
      const attachment = el.parentElement;
      const itemContent = attachment.parentElement;

      const name = el.textContent;
      const caseId = itemContent.dataset.attachmentcode;
      const attachments = this.getAttachments(caseId);
      for(let i = 0; i < attachments.length; i++){
        if(attachments[i].name !== name) continue;
        attachments.splice(i, 1);
        break;
      }
      attachment.remove();

      if(!PDFViewer.isEnabled) return;
      if(PDFViewer.prevPdf.name !== name || PDFViewer.prevPdf.caseid !== caseId) return;

      PDFViewer.hide();
      PDFViewer.initProp();
      PDFViewer.deletePDF();
    });

    attachment.appendChild(handle);
    attachment.appendChild(attachmentName);

    return attachment;
  }

  static keyToJpn(key){
    switch(key){
      case "attachments":
        return "添付資料";
      default:
        return key;
    }
  }

  static initSelect(){
    caseIds.innerHTML = "";
    for(let i = 0; i < this.group.length; i++){
      const op = new Option(
        this.compressCaseTitles[i],
        Array.isArray(this.group[i]) ? this.group[i][0] : this.group[i]
      );
      caseIds.add(op);
    }
  }
  
  static init(){
    this.setCaseIdsW();

    this.initSelect();

    caseIdsWrapper.addEventListener("dragstart", e => {
      const caseIds = document.getElementById("case-ids");
      const caseId = caseIds.options[caseIds.selectedIndex].text.split("：")[0];
      e.dataTransfer.setData("text/plain", `CASE_『${caseId}』`);
    });

    caseIds.addEventListener("change", e => {
      this.resetList(e.target.value);
    });

    prevCaseBtn.addEventListener("click", () => {
      const caseIds = document.getElementById("case-ids");
      const optionCount = caseIds.options.length;
      const nextCaseIdx = (caseIds.selectedIndex - 1 + optionCount) % optionCount;
      caseIds.selectedIndex = nextCaseIdx;

      this.resetList(caseIds.value);
    });
    nextCaseBtn.addEventListener("click", () => {
      const caseIds = document.getElementById("case-ids");
      const nextCaseIdx = (caseIds.selectedIndex + 1) % caseIds.options.length;
      caseIds.selectedIndex = nextCaseIdx;

      this.resetList(caseIds.value);
    });
    categorizeUpdateBtn.addEventListener("click", () => {
      caseCategorizingOverlay.classList.remove("hide");
    });
    
    caseIds.selectedIndex = 0;
    console.log(caseIds)
    this.resetList(caseIds.value);

    this.isInitialized = true;
  }

  static resetList(selectedValue){
    const group = this.group.find( g => g.includes(selectedValue))
    const isMulti = Array.isArray(group);
    if(isMulti){
      this.multiSelect(group);
    }else{
      const data = this.get().find(c => c.case_id === selectedValue);
      this.select(data);
    }
    this.setCaseContentLiW();

    if(PDFViewer.isEnabled) this.pdfLoaderDisableSticky();
  }

  static select(data){
    const keys = Object.keys(data);

    const flag = document.createDocumentFragment();
    for(let i = 0; i < keys.length; i++){
      const li = Elem.create("li");

      const title = Elem.create("div", {cl: "item-title"});
      title.textContent = this.keyToJpn(keys[i]);

      const content = Elem.create("div", {cl: "item-content"});
      const d = data[keys[i]];

      if(keys[i] === "attachments"){
        content.classList.add("grabbables");
        content.dataset.attachmentcode = data["case_id"];

        for(let j = 0; j < d.length; j++){
          const attachment = this.createAttachmentBox(d[j].name);
          content.appendChild(attachment);
        }
      }else{
        content.textContent = d;
      }

      li.appendChild(title);
      li.appendChild(content);

      li.addEventListener("mouseenter", () => {
        const itemContent = li.querySelector(".item-content");
        if (itemContent.scrollHeight > itemContent.clientHeight) {
          this.timer = setTimeout(() => {
            itemContent.classList.add("expanded");
          }, 500);
        }
      });

      li.addEventListener("mouseleave", () => {
        clearTimeout(this.timer);
        li.querySelector(".item-content").classList.remove("expanded");
      });

      flag.appendChild(li);
    }

    const loadableLi = Elem.create("li", {cl: "loadable"});
    const title = Elem.create("div", {cl: "item-title multi"});
    title.textContent = "PDFドロップ";

    const loadableContent = Elem.create("div", {cl: "item-content loadable multi"});

    const caseId = data["case_id"];
    const id = `pdf-file-input-${caseId}`;

    const loadableArea = Elem.create("label", {cl: "item-content-loadable-area"});
    loadableArea.dataset.caseid = caseId;
    loadableArea.htmlFor = id;
    loadableArea.addEventListener("dragenter", e => {
      e.preventDefault();
      loadableArea.classList.add("active");
    });
    loadableArea.addEventListener("dragleave", e => {
      e.preventDefault();
      loadableArea.classList.remove("active");
    });
    loadableArea.addEventListener("dragover", e => {
      e.preventDefault();
    });
    loadableArea.addEventListener("drop", async(e) => {
      e.preventDefault();
      loadableArea.classList.remove("active");

      const files = e.dataTransfer.files;
      if(files.length >= 2){
        alert("1つのファイル(.pdf)をドロップ下さい。");
        return;
      }

      const file = files[0];
      const item = e.dataTransfer.items[0];
      
      if(item.webkitGetAsEntry().isDirectory){
        alert("フォルダではなくファイル(.pdf)をドロップ下さい。");
        return;
      }

      this.loadingPDFCaseId = e.target.dataset.caseid;
      await PDFViewer.inputPDF(file);
    });

    
    const input = Elem.create("input", {id: id, cl: "hide"});
    input.type = "file";
    input.accept = ".pdf";
    input.tabindex = "-1";

    input.addEventListener("change", async(e) => {
      const files = e.target.files;
      if(files.length != 1){
        alert("1つのファイル(.pdf)を選択してください。");
        return;
      }

      this.loadingPDFCaseId = e.target.parentElement.dataset.caseid;
      await PDFViewer.inputPDF(files[0]);
    });

    
    const loadImgBox = Elem.create("div", {cl: "item-content-load-img-box"});
    const loadNeutralImg = Elem.create("img", {cl: "item-content-load-neutral-img"});
    loadNeutralImg.src = "img/theme/dark/load.png";
    const loadBySelectionImg = Elem.create("img", {cl: "item-content-load-by-selection-img"});
    loadBySelectionImg.src = "img/load-by-selection.png";
    const loadByDropImg = Elem.create("img", {cl: "item-content-load-by-drop-img"});
    loadByDropImg.src = "img/load-by-drop.png";

    loadImgBox.appendChild(loadNeutralImg);
    loadImgBox.appendChild(loadBySelectionImg);
    loadImgBox.appendChild(loadByDropImg);

    const loadContexts = Elem.create("div", {cl: "item-content-load-contexts"});
    const loadBySelection = Elem.create("span", {cl: "item-content-load-by-selection"});
    loadBySelection.textContent = "ここをクリックして選択";
    const loadOr = Elem.create("span", {cl: "item-content-load-or"});
    loadOr.textContent = "or";
    const loadByDrop = Elem.create("span", {cl: "item-content-load-by-drop"});
    loadByDrop.textContent = "ここにドラッグ&ドロップ";
    
    loadContexts.appendChild(loadBySelection);
    loadContexts.appendChild(loadOr);
    loadContexts.appendChild(loadByDrop);

    loadableArea.appendChild(input);
    loadableArea.appendChild(loadImgBox);
    loadableArea.appendChild(loadContexts);

    loadableContent.appendChild(loadableArea);
    
    loadableLi.appendChild(title);
    loadableLi.appendChild(loadableContent);

    flag.appendChild(loadableLi);


    caseContent.innerHTML = "";
    caseContent.appendChild(flag);
    
    this.isSelectedMultiCase = false;
  }

  static multiSelect(group){
    const dataList = group.map(id => this.get().find(d => d.case_id === id));
    const flag = document.createDocumentFragment();

    const keys = Object.keys(dataList[0]);

    for(let i = 0; i < keys.length; i++){
      const li = Elem.create("li");

      const title = Elem.create("div", {cl: "item-title multi"});
      title.textContent = this.keyToJpn(keys[i]);

      const contents = Elem.create("div", {cl :"item-contents"});
      for(let j = 0; j < dataList.length; j++){
        const data = dataList[j][keys[i]];

        const content = Elem.create("div", {cl: "item-content multi"});
        if(keys[i] === "case_id"){
          content.classList.add("grabbable");

          const handle = Elem.create("div", {cl: "case-id-handle"});
          handle.draggable = "true";
          handle.addEventListener("dragstart", e => {
            const caseId = e.target.parentElement.textContent;
            e.dataTransfer.setData("text/plain", `CASE_【${caseId}】`);
          });
          content.appendChild(handle);

          const contentText = Elem.createT(data);
          content.appendChild(contentText);
        }else if(keys[i] === "attachments"){
          content.classList.add("grabbables");
          content.dataset.attachmentcode = dataList[j]["case_id"];

          for(let k = 0; k < data.length; k++){
            const attachment = this.createAttachmentBox(data[k].name);
            content.appendChild(attachment);
          }
        }else{
          const contentText = Elem.createT(data);
          content.appendChild(contentText);
        }

        contents.appendChild(content);
      }

      li.appendChild(title);
      li.appendChild(contents);

      li.addEventListener("mouseenter", () => {
        const allItemContent = li.querySelectorAll(".item-content");
        this.timer = setTimeout(() => {
          const needsExpand = [...allItemContent].some( el => el.scrollHeight > el.clientHeight);
          allItemContent.forEach(el => {
            el.classList.toggle("expanded", needsExpand);
          });
        }, 500);
      });

      li.addEventListener("mouseleave", () => {
        clearTimeout(this.timer);
        [...li.querySelectorAll(".item-content")].forEach(el => el.classList.remove("expanded"));
      });

      flag.appendChild(li);
    }

    
    const loadableLi = Elem.create("li", {cl: "loadable"});
    const title = Elem.create("div", {cl: "item-title multi"});
    title.textContent = "PDFドロップ";
    const contents = Elem.create("div", {cl :"item-contents"});
    for(let j = 0; j < dataList.length; j++){
      const loadableContent = Elem.create("div", {cl: "item-content loadable multi"});

      const caseId = dataList[j]["case_id"];
      const id = `pdf-file-input-${caseId}`;

      const loadableArea = Elem.create("label", {cl: "item-content-loadable-area"});
      loadableArea.dataset.caseid = caseId;
      loadableArea.htmlFor = id;
      loadableArea.addEventListener("dragenter", e => {
        e.preventDefault();
        loadableArea.classList.add("active");
      });
      loadableArea.addEventListener("dragleave", e => {
        e.preventDefault();
        loadableArea.classList.remove("active");
      });
      loadableArea.addEventListener("dragover", e => {
        e.preventDefault();
      });
      loadableArea.addEventListener("drop", async(e) => {
        e.preventDefault();
        loadableArea.classList.remove("active");

        const files = e.dataTransfer.files;
        if(files.length >= 2){
          alert("1つのファイル(.pdf)をドロップ下さい。");
          return;
        }

        const file = files[0];
        const item = e.dataTransfer.items[0];
        
        if(item.webkitGetAsEntry().isDirectory){
          alert("フォルダではなくファイル(.pdf)をドロップ下さい。");
          return;
        }

        this.loadingPDFCaseId = e.target.dataset.caseid;
        await PDFViewer.inputPDF(file);
      });

      
      const input = Elem.create("input", {id: id, cl: "hide"});
      input.type = "file";
      input.accept = ".pdf";
      input.tabindex = "-1";

      input.addEventListener("change", async(e) => {
        const files = e.target.files;
        if(files.length != 1){
          alert("1つのファイル(.pdf)を選択してください。");
          return;
        }



        this.loadingPDFCaseId = e.target.parentElement.dataset.caseid;
        await PDFViewer.inputPDF(files[0]);
      });

      
      const loadImgBox = Elem.create("div", {cl: "item-content-load-img-box"});
      const loadNeutralImg = Elem.create("img", {cl: "item-content-load-neutral-img"});
      loadNeutralImg.src = "img/theme/dark/load.png";
      const loadBySelectionImg = Elem.create("img", {cl: "item-content-load-by-selection-img"});
      loadBySelectionImg.src = "img/load-by-selection.png";
      const loadByDropImg = Elem.create("img", {cl: "item-content-load-by-drop-img"});
      loadByDropImg.src = "img/load-by-drop.png";

      loadImgBox.appendChild(loadNeutralImg);
      loadImgBox.appendChild(loadBySelectionImg);
      loadImgBox.appendChild(loadByDropImg);

      const loadContexts = Elem.create("div", {cl: "item-content-load-contexts"});
      const loadBySelection = Elem.create("span", {cl: "item-content-load-by-selection"});
      loadBySelection.textContent = "ここをクリックして選択";
      const loadOr = Elem.create("span", {cl: "item-content-load-or"});
      loadOr.textContent = "or";
      const loadByDrop = Elem.create("span", {cl: "item-content-load-by-drop"});
      loadByDrop.textContent = "ここにドラッグ&ドロップ";
      
      loadContexts.appendChild(loadBySelection);
      loadContexts.appendChild(loadOr);
      loadContexts.appendChild(loadByDrop);

      loadableArea.appendChild(input);
      loadableArea.appendChild(loadImgBox);
      loadableArea.appendChild(loadContexts);

      loadableContent.appendChild(loadableArea);
      
      contents.appendChild(loadableContent);
    }
    loadableLi.appendChild(title);
    loadableLi.appendChild(contents);
    flag.appendChild(loadableLi);
    
    caseContent.innerHTML = "";
    caseContent.appendChild(flag);
    document.querySelectorAll("#case-content li").forEach(li => {
      li.querySelector(".item-title").style.left = `${this.getCaseContentLiPaddingL()}px`;
    });
    this.setCaseContentLiW();

    this.isSelectedMultiCase = true;
  }

  static get(){
    return this.data;
  }

  static set(list){
    this.clear();
    this.data.push(...list);
  }

  static clear(){
    this.data.length = 0;
  }

  static getCaseName(caseId){
    return this.get().find(c => c.case_id === caseId).case_name;
  }

  static getCompressId(caseIds){
    const idToNum = id => Number(id.replace("-", ""));

    const sorted = [...caseIds].sort((a, b) => idToNum(a) - idToNum(b));

    const getPrefix = id => id.split("-")[0];

    const getSuffix = id => id.split("-")[1];

    const result = [];
    let buffer = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const cur = sorted[i];

      // prefix が同じなら buffer に追加
      if (getPrefix(prev) === getPrefix(cur)) {
        buffer.push(cur);
      } else {
        // prefix が変わった → buffer を圧縮して結果へ
        result.push(...compressOnePrefix(buffer));
        buffer = [cur];
      }
    }

    // 最後のバッファ
    result.push(...compressOnePrefix(buffer));

    return result;

    function compressOnePrefix(list) {
      const prefix = getPrefix(list[0]);
      const nums = list.map(id => Number(getSuffix(id)));

      const compressed = [];

      let start = nums[0];
      let prev = nums[0];
      let count = 1; // 連続数カウント

      for (let i = 1; i < nums.length; i++) {
        const cur = nums[i];

        if (cur === prev + 1) {
          prev = cur;
          count++;
        } else {
          // 区間終了
          compressed.push(formatRange(prefix, start, prev, count));
          start = cur;
          prev = cur;
          count = 1;
        }
      }

      // 最後の区間
      compressed.push(formatRange(prefix, start, prev, count));

      return compressed;
    }

    // start-end の形式を決める
    function formatRange(prefix, start, end, count) {
      const pad = n => String(n).padStart(3, "0");

      if (count >= 3) return `${prefix}-${pad(start)}～${pad(end)}`;
      if (count === 2) return `${prefix}-${pad(start)},${pad(end)}`;
      return `${prefix}-${pad(start)}`;
    }

  }

  static compare(){
    function deepEqual(a, b) {
      if (a === b) return true;
      if (typeof a !== typeof b) return false;
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((v, i) => deepEqual(v, b[i]));
      }
      if (typeof a === 'object' && a && b) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        return keysA.every(key => deepEqual(a[key], b[key]));
      }
      return false;
    }


    const newGroup = this.createGroup();
    const newCompressCaseTitles = this.createCompressCaseTitles(newGroup);

    if(deepEqual(newGroup, this.getGroup()) && deepEqual(newCompressCaseTitles, this.getCompressCaseTitles())){
      console.log("更新なし");
    }else{
      console.log("更新あり");
      this.setGroup(newGroup);
      this.setCompressCaseTitles(newCompressCaseTitles);
      
      if(this.isInitialized){
        this.initSelect();
        caseIds.selectedIndex = 0;
        this.resetList(caseIds.value);
      }else{
        this.init();
      }
    }
  }

  static createCompressCaseTitles(g = null){
    const group = g || this.group;
    if (this.group.length === 0) return;

    const result = [];
    group.forEach(ids => {
      if(Array.isArray(ids)){
        const compressId =this.getCompressId(ids);
        result.push(`${compressId}：${this.getCaseName(ids[0])}`);
      }else{
        result.push(`${ids}：${this.getCaseName(ids)}`);
      }
    });

    return result;
  }
  static getCompressCaseTitles(){
    return this.compressCaseTitles;
  }
  static setCompressCaseTitles(t) {
    this.clearCompressCaseTitles();
    this.compressCaseTitles.push(...t);
  }
  static clearCompressCaseTitles(){
    this.compressCaseTitles.length = 0;
  }

  static createGroup(){
    const caseIds = this.get()
      .map(c => c.case_id)
      .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));

    const categoryResultCaseIds = document.querySelectorAll(".category-result-case-ids");
    const groups = [...categoryResultCaseIds]
      .map(el => el.textContent
        .split("/")
        .map(v => v.trim())
        .filter(v => v !== "")
      )
      .filter(arr => arr.length !== 0)
      .sort((a, b) => a[0].localeCompare(b[0], undefined, {numeric: true}));

    const ungroupedCaseIds = caseIds
      .filter(id => groups.every(ids => !ids.includes(id)));
    
    const merged = [...ungroupedCaseIds, ...structuredClone(groups)];

    merged.sort((a, b) => {
      const aVal = Array.isArray(a) ? a[0] : a;
      const bVal = Array.isArray(b) ? b[0] : b;
      return aVal.localeCompare(bVal, undefined, { numeric: true });
    });

    return merged;
  }
  static getGroup(){
    return this.group;
  }
  static setGroup(g){
    this.clearGroup();
    this.group.push(...structuredClone(g));
  }

  static clearGroup(){
    this.group.length = 0;
  }

}