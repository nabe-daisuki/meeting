class Render {
  static render(){
    const flag = document.createDocumentFragment();

    flag.appendChild(DocHeader.get());

    Doc.clearDivs();

    for (let i = 0; i < Doc.lines.length; i++) {
      const div = Chunk.create(i);
      flag.appendChild(div);

      Doc.getDivs().push(div);
    }

    lPanel.innerHTML = "";
    lPanel.appendChild(flag);

    DocHeader.calcHeight();

    for(let i = 0; i < Doc.getLines().length; i++){
      TextBody.resetParaHeights(i);
      TextBody.resetCommentPos(i);
      TextBody.resetResponsePos(i);
    }
    AudioInput.showPlayLine();
  }

  static speaker(){
    Speaker.get().forEach(data => {
      speakers.appendChild(Speaker.create(data.name));
    });
  }

  static config(){
    configList.innerHTML = "";
    Config.create().forEach( i => {
      configList.appendChild(i);
    });
    configOverlay.classList.add("show");
  }

  static syncRowHeights() {
    // const lDivs = lSide.divs;
    // const rDivs = rSide.divs;

    for(let i = 0; i < Doc.getDivs().length; i++){
      // const lDiv = lDivs[i];
      // // const rDiv = rDivs[i];
      
      // lDiv.style.height = "auto";
      // // rDiv.style.height = "auto";

      // // const maxHeight = Math.max(lDiv.offsetHeight, rDiv.offsetHeight);
      // // lDiv.style.height = maxHeight + 'px';
      // lDiv.style.height = lDiv.offsetHeight + 'px';
      // rDiv.style.height = maxHeight + 'px';
    }
  }
}