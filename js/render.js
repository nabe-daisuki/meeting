class Render {
  // static render(lFile, rFile) {
  static render(lFile) {

    const lPanelHeader = PanelHeader.create(lFile);
    this.commonRender(lPanelHeader);
  }

  static rerender(){
    const lPanelHeader = lPanel.querySelector(".panel-header");
    this.commonRender(lPanelHeader);
  }

  static commonRender(lPanelHeader){
    const lFlag = document.createDocumentFragment();

    lFlag.appendChild(lPanelHeader);

    lSide.clearDivs();
    // rSide.clearDivs();
    // lSide.clearInterts();
    // rSide.clearInterts();

    for (let i = 0; i < lSide.lines.length; i++) {
      const lDiv = LineDiv.create(lSide, i);
      // const rDiv = LineDiv.create(rSide, i);

      lFlag.appendChild(lDiv);
      // rFlag.appendChild(rDiv);

      lSide.divs.push(lDiv);
      // rSide.divs.push(rDiv);

      // const lInsertDiv = InsertLineDiv.create(lSide, i);
      // const rInsertDiv = InsertLineDiv.create(rSide, i);

      // lFlag.appendChild(lInsertDiv);
      // rFlag.appendChild(rInsertDiv);

      // lSide.inserts.push(lInsertDiv);
      // rSide.inserts.push(rInsertDiv);
    }

    lPanel.innerHTML = "";
    lPanel.appendChild(lFlag);

    PanelHeader.setHeight(lPanelHeader.offsetHeight);

    this.syncRowHeights();
    for(let i = 0; i < lSide.lines.length; i++){
      TextSpan.resetParagraphs(i);
    }
    AudioInput.showPlayLine();
  }

  static syncRowHeights() {
    const lDivs = lSide.divs;
    // const rDivs = rSide.divs;

    for(let i=0; i<lDivs.length; i++){
      const lDiv = lDivs[i];
      // const rDiv = rDivs[i];
      
      lDiv.style.height = "auto";
      // rDiv.style.height = "auto";

      // const maxHeight = Math.max(lDiv.offsetHeight, rDiv.offsetHeight);
      // lDiv.style.height = maxHeight + 'px';
      lDiv.style.height = lDiv.offsetHeight + 'px';
      // rDiv.style.height = maxHeight + 'px';
    }
  }
}