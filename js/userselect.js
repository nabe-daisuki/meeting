class UserSelect {
  static data = [];

  static createBtns(){
    const btns = [];

    for(let j = 0; j < this.data.length; j++){
      const btn = Elem.create("div", {cl: "user-btn"});
      btn.textContent = this.data[j].user_name;
      btn.addEventListener("click", () => {
        const cData = this.data[j];
        Config.set(cData.general);
        Config.setShortCuts(cData.shortCut);
        Config.setTBShortCuts(cData.tbShortCut);

        Config.active();
        Config.userName = this.data[j].user_name;
        
        caseCategorizingOverlay.classList.remove("hide");
        Render.beCategorizedItems();
        CaseCategorizing.resize();
        CaseCategorizing.setCategoryResultCaseIdsMaxW();
        CaseCategorizing.drawAll();
        CaseCategorizing.updateResult();

        userSelectOverlay.classList.add("hide");
      });
      btns.push(btn);
    }

    const btn = Elem.create("div", {cl: "user-btn"});
    btn.textContent = "ゲスト";
    btn.addEventListener("click", () => {
      Config.active();
      Config.userName = "ゲスト";

      caseCategorizingOverlay.classList.remove("hide");
      Render.beCategorizedItems();
      CaseCategorizing.resize();
      CaseCategorizing.setCategoryResultCaseIdsMaxW();
      CaseCategorizing.drawAll();
      CaseCategorizing.updateResult();
      
      userSelectOverlay.classList.add("hide");
    });
    btns.push(btn);

    return btns;
  }

  static add(_data){
    this.data.push(..._data);
  }

}