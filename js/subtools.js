class SubTools {
  static activeTag = null;

  static init(){
    subToolTabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        subToolTabButtons.forEach(b => b.classList.remove("active"));
        subToolTabContents.forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        const id = btn.dataset.tab;
        document.getElementById(id).classList.add("active");
        if(id === "reference-tools"){
          CRList.setCaseIdsW();
          SubTools.setCaseContentH();
        }
        if(id === "output-tools") Output.setOutputH();
        if(id === "analyze-tools") SubTools.setPreReplaceH();

        this.activeTag = id;
      });
    });

    this.setPreReplaceH();
    this.setCaseContentH();
  }

  static activate(){
    if(!this.activeTag) return;
    subToolTabButtons.forEach(b => b.classList.remove("active"));
    subToolTabContents.forEach(c => c.classList.remove("active"));

    [...document.querySelectorAll(".tab-btn")]
      .find(b => b.dataset.tab === this.activeTag)
      .classList.add("active");

    document.getElementById(this.activeTag).classList.add("active");
    if(this.activeTag === "reference-tools"){
      CRList.setCaseIdsW();
      SubTools.setCaseContentH();
    }
    if(this.activeTag === "analyze-tools") SubTools.setPreReplaceH();
  }

  static getTabsH(){
    return tabs.offsetHeight;
  }

  static getSubToolSectionBorderW(){
    return Elem.getStyleNum(document.querySelector(".tab-content.active .sub-tool-section"), "border-width");
  }
  static getSubToolSectionPaddingT(){
    return Elem.getStyleNum(document.querySelector(".tab-content.active .sub-tool-section"), "padding-top");
  }
  static getSubToolSectionPaddingB(){
    return Elem.getStyleNum(document.querySelector(".tab-content.active .sub-tool-section"), "padding-bottom");
  }
  static getSubToolSectionPaddingL(){
    return parseFloat(getComputedStyle(document.querySelector(".sub-tool-section")).paddingLeft);
  }
  static getSubToolSectionPaddingR(){
    return parseFloat(getComputedStyle(document.querySelector(".sub-tool-section")).paddingRight);
  }
  static getSubToolSectionW(){
    const totalW = document.querySelector(".tab-content.active .sub-tool-section").clientWidth;
    const deductions = [
      this.getSubToolSectionPaddingL(),
      this.getSubToolSectionPaddingR()
    ].reduce((acc, cur) => acc + cur, 0);

    return totalW - deductions;
  }
  static getSubToolHeaderOffsetH(){
    const header = document.querySelector(".tab-content.active .sub-tool-header");
    return header?.offsetHeight ?? 0;
  }

  static getCaseIdsWrapperH(){
    return caseIdsWrapper.offsetHeight;
  }

  static setCaseContentH(){
    const totalH = Panel.getRightPanelH();
    const deductions = [
      this.getTabsH(),
      this.getSubToolSectionBorderW() * 2,
      this.getSubToolSectionPaddingL(),
      this.getSubToolSectionPaddingR(),
      this.getCaseIdsWrapperH()
    ].reduce((acc, cur) => acc + cur, 0);
    caseContent.style.maxHeight = `${totalH - deductions}px`;
  }

  static setPreReplaceH(){
    const totalH = Panel.getRightPanelH();
    const deductions = [
      this.getTabsH(),
      this.getSubToolSectionBorderW() * 2,
      this.getSubToolSectionPaddingT(),
      this.getSubToolSectionPaddingB(),
      this.getSubToolHeaderOffsetH()
    ];

    const h = Calc.sub(totalH, deductions);
    repInfosUl.style.maxHeight = Convert.numToPx(h);
    // repInfosUl.style.maxHeight = `${Panel.getRightPanelH()
    //   - this.getTabsH()
    //   - this.getSubToolSectionBorderW() * 2
    //   - this.getSubToolSectionPaddingT()
    //   - this.getSubToolSectionPaddingB()
    //   - this.getSubToolHeaderOffsetH()}px`;
  }
}