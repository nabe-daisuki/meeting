/**
 * ユーザー選択画面
 */
class UserSelect {
  static data = [];
  static currUser = null;


  /**
   * 有効なユーザーの名前を設定
   * @param {string} name 有効としたユーザー名 
   */
  static setCurrUser(name){
    this.currUser = name;
  }
  /**
   * 現在有効なユーザーの名前の取得
   * @returns {string}
   */
  static getCurrUser(){
    return this.currUser;
  }

  /**
   * ユーザーボタンの作成
   * @return {HTMLDivElement[]}
   */
  static createBtns(){
    const btns = [];

    const userdataList = User.getList();
    console.log(userdataList);
    for(let i = 0; i < User.count(); i++){
      const name = userdataList[i].name;
      const btn = Elem.create("div", {cl: "user-btn"});
      btn.textContent = name;
      btn.addEventListener("click", () => {
        this.setCurrUser(name)
        Config.load(userdataList[i].config);

        Config.active();
        
        console.log(CRList.isValid);

        if(CRList.isValid){
          CaseCategorizing.show();
          Render.beCategorizedItems();
          CaseCategorizing.resize();
          CaseCategorizing.setCategoryResultCaseIdsMaxW();
          CaseCategorizing.drawAll();
          CaseCategorizing.updateResult();
        }

        this.hide();
      });
      btns.push(btn);
    }

    return btns;
  }


  static add(_data){
    this.data.push(..._data);
  }

  /**
   * ユーザー選択画面の非表示
   */
  static hide(){
    userSelectOverlay.classList.add("hide");
  }
  /**
   * ユーザー選択画面の表示
   */
  static show(){
    userSelectOverlay.classList.remove("hide");
  }
}