class Theme {
  static THEMES = ["デフォルト", "ダーク"];
  static SUB_THEMES = ["レッド", "オレンジ", "グリーン", "シアン", "パープル", "ピンク"];
  
  static currTheme = "ダーク";
  static prevTheme = "";

  static currSubTheme = "イエロー";
  static prevSubTheme = "";

  static subThemeColor = {
    normal: null,
    hover: null
  }

  static getSub(){
    return this.currSubTheme;
  }
  static getPrevSub(){
    return this.prevSubTheme;
  }
  static setSub(v){
    this.prevSubTheme = this.currSubTheme;
    this.currSubTheme = v;
  }

  /**
   * テーマが存在するか判定する
   * @param {string} theme 判定するテーマ
   * @returns {boolean} true: 存在する / false: 存在しない
   */
  static existsTheme(theme){
    return this.THEMES.includes(theme);
  }
  /**
   * 適用中のテーマの取得
   * @returns {string}
   */
  static get(){
    return this.currTheme;
  }
  /**
   * 以前適用されたテーマの取得
   * @returns {string}
   */
  static getPrev(){
    return this.prevTheme;
  }
  /**
   * テーマの設定
   * @param {string} _theme 設定するテーマ
   * @returns {boolean} true: 成功 / false: 失敗
   */
  static set(_theme){
    if(!this.existsTheme(_theme)) return System.fail(`テーマ(${_theme})は存在しないため、設定できませんでした。`);
    this.prevTheme = this.currTheme;
    this.currTheme = _theme;
    return true;
  }
  static jpnToCode(v){
    if(v === "ダーク") return "dark";
    else if(v === "デフォルト") return "default";
    else if(v === "イエロー") return "yellow";
    else if(v === "レッド") return "red";
    else if(v === "オレンジ") return "orange";
    else if(v === "シアン") return "cyan";
    else if(v === "グリーン") return "green";
    else if(v === "パープル") return "purple";
    else if(v === "ピンク") return "pink";
    else return "default";
  }

  static apply(){
    const currTheme = this.jpnToCode(this.get());
    const prevTheme = this.jpnToCode(this.getPrev());

    //
    // remove
    //

    // header
    header.classList.remove(`HEADER_${prevTheme}`);
    header.querySelector("hr").classList.remove(`HEADER_HR_${prevTheme}`);
    
    for(const el of Array.from(document.querySelectorAll(".slider"))){
      el.classList.remove(`SLIDER_${prevTheme}`);
    }
    for(const el of Array.from(document.querySelectorAll(".slider-label"))){
      el.classList.remove(`SL_${prevTheme}`);
    }
    document.getElementById("auto-scroll-box").classList.remove(`ASB_${prevTheme}`);

    for(const el of Array.from(document.querySelectorAll("#main-tools > div"))){
      el.classList.remove(`MTS_DIV_${prevTheme}`);
    }

    // panel
    editorPanel.classList.remove(`EP_${prevTheme}`);
    rPanel.classList.remove(`RP_${prevTheme}`);
    for(const el of Array.from(document.getElementsByClassName("panel"))){
      el.classList.remove(`PANEL_${prevTheme}`);
    }

    // left-panel
    if(DocHeader.get()) DocHeader.get().classList.remove(`DC_${prevTheme}`);
    for(const j in Doc.getDivs()){
      Doc.getDiv(j).classList.remove(`CHUNK_${prevTheme}`);
      Doc.getTimeStamp(j).classList.remove(`TS_${prevTheme}`);
      Doc.getBadged(j).classList.remove(`BADGED_${prevTheme}`);
      Doc.getTextBodyBG(j).classList.remove(`TBB_${prevTheme}`);
      Doc.getTextBody(j).classList.remove(`TB_${prevTheme}`);

      for(const el of Doc.getTextBodyBG(j).querySelectorAll(".has-replace")){
        el.classList.remove(`HR_${prevTheme}`);
      }
    }

    // resize-bar
    resizeBar.classList.remove(`RB_${prevTheme}`);

    // sub-tool
    for(const el of Array.from(document.getElementsByClassName("sub-tool-section"))){
      el.classList.remove(`STS_${prevTheme}`);
    }
    for(const el of Array.from(document.getElementsByClassName("sub-tool-header"))){
      el.classList.remove(`STH_${prevTheme}`);
    }
    if(Speaker.getBtns()){
      for(const el of Speaker.getBtns()){
        el.classList.remove(`STB_BTN_${prevTheme}`);
      }
    }

    repInfosUl.classList.remove(`REPINFOS_${prevTheme}`);
    if(Replace.getList()){
      for(const el of Replace.getList()){
        el.classList.remove(`REPINFOS_LI_${prevTheme}`);
      }
    }

    //
    // add
    //

    // header
    header.classList.add(`HEADER_${currTheme}`);
    header.querySelector("hr").classList.add(`HEADER_HR_${currTheme}`);

    for(const el of Array.from(document.querySelectorAll(".slider"))){
      el.classList.add(`SLIDER_${currTheme}`);
    }
    for(const el of Array.from(document.querySelectorAll(".slider-label"))){
      el.classList.add(`SL_${currTheme}`);
    }
    document.getElementById("auto-scroll-box").classList.add(`ASB_${currTheme}`);
    document.querySelector("#auto-scroll-box img").src = `img/theme/${currTheme}/auto-scroll.png`;

    config.src = `img/theme/${currTheme}/config.png`;
    help.src = `img/theme/${currTheme}/help.png`;

    playBtn.src = `img/theme/${currTheme}/play.png`;
    pauseBtn.src = `img/theme/${currTheme}/pause.png`;
    stopBtn.src = `img/theme/${currTheme}/stop.png`;
    unmuteBtn.src = `img/theme/${currTheme}/volume.png`;
    muteBtn.src = `img/theme/${currTheme}/mute.png`;
    normalSpeedBtn.src = `img/theme/${currTheme}/speed.png`;

    for(const el of Array.from(document.querySelectorAll("#main-tools > div"))){
      el.classList.add(`MTS_DIV_${currTheme}`);
    }

    document.querySelector("#text-file-input-box img").src = `img/theme/${currTheme}/input-text.png`;
    document.querySelector("#audio-file-input-box img").src = `img/theme/${currTheme}/input-audio.png`;
    document.querySelector("#reload-file-input-box img").src = `img/theme/${currTheme}/load.png`;

    checkedSetGreen.querySelector("img").src = `img/theme/${currTheme}/check-to-hatch.png`;
    checkedShow.querySelector("img").src = `img/theme/${currTheme}/check-to-show.png`;
    checkedHide.querySelector("img").src = `img/theme/${currTheme}/check-to-hide.png`;
    editedSetGreen.querySelector("img").src = `img/theme/${currTheme}/edited-to-hatch.png`;

    saveBtn.querySelector("img").src = `img/theme/${currTheme}/save.png`;
    namedSaveBtn.querySelector("img").src = `img/theme/${currTheme}/named-save.png`;

    configToExport.querySelector("img").src = `img/theme/${currTheme}/config-to-export.png`;
    hatchToExport.querySelector("img").src = `img/theme/${currTheme}/hatch-to-export.png`;
    editedToExport.querySelector("img").src = `img/theme/${currTheme}/edited-to-export.png`;

    // panel
    editorPanel.classList.add(`EP_${currTheme}`);
    rPanel.classList.add(`RP_${currTheme}`);
    for(const el of Array.from(document.getElementsByClassName("panel"))){
      el.classList.add(`PANEL_${currTheme}`);
    }

    // left-panel
    if(DocHeader.get()) DocHeader.get().classList.add(`DC_${currTheme}`);
    for(const j in Doc.getDivs()){
      Doc.getDiv(j).classList.add(`CHUNK_${currTheme}`);
      Doc.getTimeStamp(j).classList.add(`TS_${currTheme}`);
      Doc.getBadged(j).classList.add(`BADGED_${currTheme}`);
      Doc.getTextBodyBG(j).classList.add(`TBB_${currTheme}`);
      Doc.getTextBody(j).classList.add(`TB_${currTheme}`);

      for(const el of Doc.getTextBox(j).querySelectorAll(".mini-comment img")){
        el.src = `img/theme/${currTheme}/comment-mini.png`;
      }
      for(const el of Doc.getTextBox(j).querySelectorAll(".mini-response img")){
        el.src = `img/theme/${currTheme}/response-mini.png`;
      }
      for(const el of Doc.getTextBodyBG(j).querySelectorAll(".has-replace")){
        el.classList.add(`HR_${currTheme}`);
      }
    }

    
    // resize-bar
    resizeBar.classList.add(`RB_${currTheme}`);


    // sub-tool
    for(const el of Array.from(document.getElementsByClassName("sub-tool-section"))){
      el.classList.add(`STS_${currTheme}`);
    }
    for(const el of Array.from(document.getElementsByClassName("sub-tool-header"))){
      el.classList.add(`STH_${currTheme}`);
    }
    if(Speaker.getBtns()){
      for(const el of Speaker.getBtns()){
        el.classList.add(`STB_BTN_${currTheme}`);
      }
    }

    repInfosUl.classList.add(`REPINFOS_${currTheme}`);
    if(Replace.getList()){
      for(const el of Replace.getList()){
        el.classList.add(`REPINFOS_LI_${currTheme}`);
      }
    }


    // sub
    const currSubTheme = this.jpnToCode(this.getSub());
    const prevSubTheme = this.jpnToCode(this.getPrevSub());

    // remove(sub)
    const preClass = `${prevTheme}_theme_${prevSubTheme}`;

    currentTime.classList.remove(preClass);
    playbackSlider.classList.remove(preClass);
    volumeSlider.classList.remove(preClass);
    speedSlider.classList.remove(preClass);
    
    pdfControls.classList.remove(preClass);
    pdfView.classList.remove(preClass);
    pdfTexts.classList.remove(preClass);

    lPanel.classList.remove(preClass);

    const allSelector = document.getElementById("all-selector");
    if(allSelector) allSelector.classList.remove(preClass);

    for(const j in Doc.getDivs()){
      Doc.getSelector(j).classList.remove(preClass);
    }

    for(const el of document.querySelectorAll(".sub-tool-section")){
      el.classList.remove(preClass);
    }
    caseContent.classList.remove(preClass);
    output.classList.remove(preClass);
    repInfosUl.classList.remove(preClass);

    categorizingArea.classList.remove(preClass);
    for(const el of document.querySelectorAll(".category-result-case-ids")){
      el.classList.remove(preClass);
    }
    shortCutList.classList.remove(preClass);

    canMoveAudioBtn.classList.remove(preClass);

    replaceCompare.classList.remove(preClass);
    for(const el of document.querySelectorAll("#replace-compare .replace-selector")){
      el.classList.remove(preClass);
    }



    // add(sub)
    const newClass = `${currTheme}_theme_${currSubTheme}`;

    currentTime.classList.add(newClass);
    playbackSlider.classList.add(newClass);
    volumeSlider.classList.add(newClass);
    speedSlider.classList.add(newClass);

    pdfControls.classList.add(newClass);
    pdfView.classList.add(newClass);
    pdfTexts.classList.add(newClass);

    lPanel.classList.add(newClass);

    if(allSelector) allSelector.classList.add(newClass);

    for(const j in Doc.getDivs()){
      Doc.getSelector(j).classList.add(newClass);
    }

    for(const el of document.querySelectorAll(".sub-tool-section")){
      el.classList.add(newClass);
    }
    caseContent.classList.add(newClass);
    output.classList.add(newClass);
    repInfosUl.classList.add(newClass);

    categorizingArea.classList.add(newClass);
    for(const el of document.querySelectorAll(".category-result-case-ids")){
      el.classList.add(newClass);
    }
    shortCutList.classList.add(newClass);
    
    canMoveAudioBtn.classList.add(newClass);

    replaceCompare.classList.add(newClass);
    for(const el of document.querySelectorAll("#replace-compare .replace-selector")){
      el.classList.add(newClass);
    }

  
    // sub-theme-color
    const subThemeStyle = getComputedStyle(currentTime);
    this.subThemeColor.normal = subThemeStyle.getPropertyValue('--sub-theme').trim();
    this.subThemeColor.hover = subThemeStyle.getPropertyValue('--sub-theme-hover').trim();
    
    playbackSlider.style.setProperty("--sub-theme", this.subThemeColor.normal);
    volumeSlider.style.setProperty("--sub-theme", this.subThemeColor.normal);
    speedSlider.style.setProperty("--sub-theme", this.subThemeColor.normal);
  }
}