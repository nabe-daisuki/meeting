class ContextMenu {
  static isShow = false;
  static offset = 20;

  static async reset(isSelection, isMultiLine){
    menuContainer.innerHTML = "";
    let menuData = [];
    if(isSelection){
      if(!isMultiLine) if(menuData.length === 0) menuData = [ ...menuData, ...MenuData.conversation ];
      else menuData = [ ...menuData, ...MenuData.sep, ...MenuData.conversation ];
    }else{
      if(menuData.length === 0) menuData = [ ...menuData, ...MenuData.conversation ];
      else menuData = [ ...menuData, ...MenuData.sep, ...MenuData.conversation ];
    }
    this.set(menuData);
  }

  static set(menuData){
    menuData.forEach(this.createMenuItem);
  }

  static createMenuItem(item) {
    // セパレーターの場合
    if (item.separator) {
      const sep = Elem.create("div", {cl: "separator"});
      menuContainer.appendChild(sep);
      return;
    }

    const menuRow = Elem.create("div", {cl: "menu-row"});
    menuRow.tabIndex = -1;
    menuRow.addEventListener("focusin", e => {
    });

    // 親項目
    const mainItem = Elem.create("div", {id: item.id, cl: "menu-item"});
    mainItem.addEventListener("click", e => {
      ContextMenu.click(e.target.id);
      ContextMenu.hide();
      TextBody.visible(TextBody.contextmenu.i);
      TextBody.unsetTransparent(TextBody.contextmenu.i);
    });

    const mainIconAndText = Elem.create("div");
    mainIconAndText.style.display = "flex";
    mainIconAndText.style.alignItems = "center";
    mainIconAndText.style.gap = "5px";
    mainIconAndText.style.pointerEvents = "none";

    if("icon" in item){
      const mainIcon = Elem.create("img");
      mainIcon.src = `img/${item.icon}.png`;
      mainIconAndText.appendChild(mainIcon);
    }
    const textNode = document.createTextNode(item.text);
    mainIconAndText.appendChild(textNode);

    const mainShortCut = Elem.create("div");
    mainShortCut.textContent = item.sc;
    mainShortCut.style.color = "#bbbbbb";
    mainShortCut.style.fontSize = "smaller";
    mainShortCut.style.fontWeight = "bold";
    mainShortCut.style.whiteSpace = "nowrap";
    mainShortCut.style.pointerEvents = "none";

    mainItem.appendChild(mainIconAndText);
    mainItem.appendChild(mainShortCut);

    menuRow.appendChild(mainItem);

    // サブメニューがある場合
    if (item.sub) {
      const subContainer = Elem.create("div", {cl: "sub-menu"});

      item.sub.forEach(subText => {
        const subDiv = Elem.create("div", {cl: "menu-item"});
        subDiv.textContent = subText;
        subDiv.addEventListener("click", () => {
          ContextMenu.click(subText);
          ContextMenu.hide();
          TextBody.visible(TextBody.contextmenu.i);
          TextBody.unsetTransparent(TextBody.contextmenu.i);
        });
        subContainer.appendChild(subDiv);
      });

      menuRow.appendChild(subContainer);

      // 親の高さをサブメニューに合わせる
      mainItem.style.height = "auto";
    }

    menuContainer.appendChild(menuRow);
  }

  static show(x, y){
    menuContainer.style.display = "block";

    menuContainer.style.left = "0px";
    menuContainer.style.top = "0px";
    const rect = menuContainer.getBoundingClientRect();

    let posX = x + this.offset;
    let posY = y + this.offset;

    if (posX + rect.width > window.innerWidth) {
      posX = x - rect.width - this.offset;
      if (posX < 0) posX = 0;
    }

    if (posY + rect.height > window.innerHeight) {
      posY = y - rect.height - this.offset;
      if (posY < 0) posY = 0;
    }

    menuContainer.style.left = posX + "px";
    menuContainer.style.top = posY + "px";

    menuContainer.querySelector(".menu-row").focus();

    this.isShow = true;
  }

  static hide(){
    menuContainer.style.display = "none";

    this.isShow = false;
  }

  static click(id){
    const i = Selection.idx;
    const paraNum = TextBody.getSelectionParaNum(i);

    console.log(id);
    switch(id){
      case "comment":
        if(TextBody.hasComment(i, paraNum) || !Doc.hasCharsInPara(i, paraNum)) return;
        if(TextBody.hasResponse(i, paraNum)){
          Doc.disableResponse(i, paraNum);
        }
        TextBody.setComment(i, paraNum);
        TextBody.resetResponsePos(i);
        break;
      case "response":
        if(TextBody.hasResponse(i, paraNum) || !Doc.hasCharsInPara(i, paraNum)) return;
        if(TextBody.hasComment(i, paraNum)){
          Doc.disableComment(i, paraNum);
        }
        TextBody.setResponse(i, paraNum);
        TextBody.resetCommentPos(i);
        break;
      case "cut":
        break;
      case "copy":
        break;
      case "paste":
        break;
    }
  }

  static replaceSelectionStr(destStr){
    const i = Selection.idx;
    const textBody = Doc.getTextBody(i);
    const textBodyBG = Doc.getTextBodyBG(i);    

    const prefix = textBody.value.slice(0, TextBody.selection.start);
    const suffix = textBody.value.slice(TextBody.selection.end);
    const replacedText = prefix + destStr + suffix;

    textBody.value = replacedText;
    textBodyBG.innerHTML = textBody.value;

    TextBody.setLineText(replacedText, i);

    const caretPos = prefix.length + destStr.length;
    textBody.setSelectionRange(caretPos, caretPos);
    textBody.focus();

    TextBody.resetCharsPerPara(i);
    TextBody.resetParaHeights(i);
    TextBody.resetCommentPos(i);
    TextBody.resetResponsePos(i);
  }
}
