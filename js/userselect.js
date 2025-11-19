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
        Config.set(cData.shortCut);

        Config.active();
        userSelectOverlay.classList.add("hide");
      });
      btns.push(btn);
    }

    const btn = Elem.create("div", {cl: "user-btn"});
    btn.textContent = "ゲスト";
    btn.addEventListener("click", () => {
      Config.active();
      userSelectOverlay.classList.add("hide");
    });
    btns.push(btn);

    return btns;
  }

  static add(_data){
    this.data.push(...data);
  }

  // static getUserNames(){
  //   const userNames = [];
  //   for(let j = 0; j < this.data.length; j++){
  //     userNames.push(this.data[j].user_name);
  //   }

  //   return userNames;
  // }

  // static get(){
  //   return this.data;
  // }
}