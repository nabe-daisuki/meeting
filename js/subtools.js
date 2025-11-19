class SubTools {
  static init(){
    subToolTabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        subToolTabButtons.forEach(b => b.classList.remove("active"));
        subToolTabContents.forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
        if(btn.dataset.tab === "reference-tools") SubTools.setCaseContentH();
        if(btn.dataset.tab === "analyze-tools") SubTools.setPreReplaceH();
      });
    });

    this.setPreReplaceH();
    this.setCaseContentH();
  }

  static getTabsH(){
    return document.getElementById("tabs").offsetHeight;
  }

  static getSubToolSectionBorderW(){
    return parseFloat(getComputedStyle(document.querySelector(".sub-tool-section")).borderWidth);
  }
  static getSubToolSectionPadding(){
    return parseFloat(getComputedStyle(document.querySelector(".sub-tool-section")).padding);
  }
  static getSubToolHeaderOffsetH(){
    return document.querySelector(".sub-tool-header").offsetHeight;
  }

  static getCaseIdsWrapperH(){
    return caseIdsWrapper.offsetHeight;
  }

  static setCaseContentH(){
    caseContent.style.maxHeight = `${Panel.getRightPanelH()
      - this.getTabsH()
      - this.getSubToolSectionBorderW() * 2
      - this.getSubToolSectionPadding() * 2
      - this.getCaseIdsWrapperH()}px`;
  }

  static setPreReplaceH(){
    repInfosUl.style.maxHeight = `${Panel.getRightPanelH()
      - this.getTabsH()
      - this.getSubToolSectionBorderW() * 2
      - this.getSubToolSectionPadding() * 2
      - this.getSubToolHeaderOffsetH()}px`;
  }
}