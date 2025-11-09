class Theme {
  static type = "default";
  static preType = "";

  static get(){
    return this.type;
  }
  static getPre(){
    return this.preType;
  }
  static set(v){
    this.preType = this.type;
    this.type = v;
  }
  static jpnToCode(v){
    if(v === "ダーク") return "dark";
    else if(v === "デフォルト") return "default";
    else return "default";
  }

  static apply(){
    const type = this.get();
    const preType = this.getPre();

    //
    // remove
    //

    // header
    header.classList.remove(`HEADER_${preType}`);
    header.querySelector("hr").classList.remove(`HEADER_HR_${preType}`);
    
    for(const el of Array.from(document.querySelectorAll(".slider"))){
      el.classList.remove(`SLIDER_${preType}`);
    }
    for(const el of Array.from(document.querySelectorAll(".slider-label"))){
      el.classList.remove(`SL_${preType}`);
    }
    document.getElementById("auto-scroll-box").classList.remove(`ASB_${preType}`);

    for(const el of Array.from(document.querySelectorAll("#main-tools > div"))){
      el.classList.remove(`MTS_DIV_${preType}`);
    }

    // panel
    editorPanel.classList.remove(`EP_${preType}`);
    rPanel.classList.remove(`RP_${preType}`);
    for(const el of Array.from(document.getElementsByClassName("panel"))){
      el.classList.remove(`PANEL_${preType}`);
    }

    // left-panel
    if(DocHeader.get()) DocHeader.get().classList.remove(`DC_${preType}`);
    for(const j in Doc.getDivs()){
      Doc.getDiv(j).classList.remove(`CHUNK_${preType}`);
      Doc.getTimeStamp(j).classList.remove(`TS_${preType}`);
      Doc.getBadged(j).classList.remove(`BADGED_${preType}`);
      Doc.getTextBodyBG(j).classList.remove(`TBB_${preType}`);
      Doc.getTextBody(j).classList.remove(`TB_${preType}`);

      for(const el of Doc.getTextBodyBG(j).querySelectorAll(".has-replace")){
        el.classList.remove(`HR_${preType}`);
      }
    }

    // sub-tool
    for(const el of Array.from(document.getElementsByClassName("sub-tool-section"))){
      el.classList.remove(`STS_${preType}`);
    }
    for(const el of Array.from(document.getElementsByClassName("sub-tool-header"))){
      el.classList.remove(`STH_${preType}`);
    }
    if(Speaker.getBtns()){
      for(const el of Speaker.getBtns()){
        el.classList.remove(`STB_BTN_${preType}`);
      }
    }

    repInfosUl.classList.remove(`REPINFOS_${preType}`);
    if(Replace.getList()){
      for(const el of Replace.getList()){
        el.classList.remove(`REPINFOS_LI_${preType}`);
      }
    }

    //
    // add
    //

    // header
    header.classList.add(`HEADER_${type}`);
    header.querySelector("hr").classList.add(`HEADER_HR_${type}`);

    for(const el of Array.from(document.querySelectorAll(".slider"))){
      el.classList.add(`SLIDER_${type}`);
    }
    for(const el of Array.from(document.querySelectorAll(".slider-label"))){
      el.classList.add(`SL_${type}`);
    }
    document.getElementById("auto-scroll-box").classList.add(`ASB_${type}`);
    document.querySelector("#auto-scroll-box img").src = `img/theme/${type}/auto-scroll.png`;

    config.src = `img/theme/${type}/config.png`;
    help.src = `img/theme/${type}/help.png`;

    playBtn.src = `img/theme/${type}/play.png`;
    pauseBtn.src = `img/theme/${type}/pause.png`;
    stopBtn.src = `img/theme/${type}/stop.png`;
    unmuteBtn.src = `img/theme/${type}/volume.png`;
    muteBtn.src = `img/theme/${type}/mute.png`;
    normalSpeedBtn.src = `img/theme/${type}/speed.png`;

    for(const el of Array.from(document.querySelectorAll("#main-tools > div"))){
      el.classList.add(`MTS_DIV_${type}`);
    }

    document.querySelector("#text-file-input-box img").src = `img/theme/${type}/input-text.png`;
    document.querySelector("#audio-file-input-box img").src = `img/theme/${type}/input-audio.png`;
    document.querySelector("#reload-file-input-box img").src = `img/theme/${type}/load.png`;

    checkedSetGreen.querySelector("img").src = `img/theme/${type}/check-to-hatch.png`;
    checkedShow.querySelector("img").src = `img/theme/${type}/check-to-show.png`;
    checkedHide.querySelector("img").src = `img/theme/${type}/check-to-hide.png`;
    editedSetGreen.querySelector("img").src = `img/theme/${type}/edited-to-hatch.png`;

    saveBtn.querySelector("img").src = `img/theme/${type}/save.png`;
    namedSaveBtn.querySelector("img").src = `img/theme/${type}/named-save.png`;

    hatchToExport.querySelector("img").src = `img/theme/${type}/hatch-to-export.png`;
    editedToExport.querySelector("img").src = `img/theme/${type}/edited-to-export.png`;

    // panel
    editorPanel.classList.add(`EP_${type}`);
    rPanel.classList.add(`RP_${type}`);
    for(const el of Array.from(document.getElementsByClassName("panel"))){
      el.classList.add(`PANEL_${type}`);
    }

    // left-panel
    if(DocHeader.get()) DocHeader.get().classList.add(`DC_${type}`);
    for(const j in Doc.getDivs()){
      Doc.getDiv(j).classList.add(`CHUNK_${type}`);
      Doc.getTimeStamp(j).classList.add(`TS_${type}`);
      Doc.getBadged(j).classList.add(`BADGED_${type}`);
      Doc.getTextBodyBG(j).classList.add(`TBB_${type}`);
      Doc.getTextBody(j).classList.add(`TB_${type}`);

      for(const el of Doc.getTextBox(j).querySelectorAll(".mini-comment img")){
        el.src = `img/theme/${type}/comment-mini.png`;
      }
      for(const el of Doc.getTextBox(j).querySelectorAll(".mini-response img")){
        el.src = `img/theme/${type}/response-mini.png`;
      }
      for(const el of Doc.getTextBodyBG(j).querySelectorAll(".has-replace")){
        el.classList.add(`HR_${type}`);
      }
    }

    // sub-tool
    for(const el of Array.from(document.getElementsByClassName("sub-tool-section"))){
      el.classList.add(`STS_${type}`);
    }
    for(const el of Array.from(document.getElementsByClassName("sub-tool-header"))){
      el.classList.add(`STH_${type}`);
    }
    if(Speaker.getBtns()){
      for(const el of Speaker.getBtns()){
        el.classList.add(`STB_BTN_${type}`);
      }
    }

    repInfosUl.classList.add(`REPINFOS_${type}`);
    if(Replace.getList()){
      for(const el of Replace.getList()){
        el.classList.add(`REPINFOS_LI_${type}`);
      }
    }
  }
}