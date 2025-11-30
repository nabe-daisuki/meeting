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
      TextBody.resetMiniBadges(i);
      if(Doc.getLine(i).badges !== "n") Badged.set(i, Badged.createBadges(i));
    }
    AudioInput.showPlayLine();
  }

  static speaker(){
    Speaker.get().forEach(data => {
      speakers.appendChild(Speaker.create(data.name));
    });
  }

  static beCategorizedItems(){
    const items = CaseCategorizing.createItems();
    for(let j = 0; j < items.length; j++){
      beCategorizedItems.appendChild(items[j]);
    }
  }

  static userSelect(){
    const btns = UserSelect.createBtns();
    for(let j = 0; j < btns.length; j++){
      userButtons.appendChild(btns[j]);
    }
  }

  static config(){
    configList.innerHTML = "";
    Config.create().forEach( i => {
      configList.appendChild(i);
    });
    configOverlay.classList.add("show");
  }

  static shortCutHelper(){
    shortCutList.innerHTML = "";
    for(const item of ShortCutHelper.create()){
      shortCutList.appendChild(item);
    }    
  }

  static mainTool(){
    for(const s of Config.get()){
      let el = null;
      switch(s.key){
        case "hideInputText":
          el = document.getElementById("text-file-input-box");
          break;
        case "hideInputAudio":
          el = document.getElementById("audio-file-input-box");
          break;
        case "hideLoad":
          el = document.getElementById("reload-file-input-box");
          break;
        case "hideInputConfig":
          el = document.getElementById("config-input-box");
        default:
          break;
      }
      
      if(!el) continue;
      if(s.value) el.classList.add("hide");
      else el.classList.remove("hide");
    }

    if(Array.from(document.querySelectorAll("#inputer>div")).every(d => d.classList.contains("hide"))){
      document.getElementById("inputer").classList.add("hide");
    }else{
      document.getElementById("inputer").classList.remove("hide");
    }
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