class ShortCutHelper {
  static create(){
    const shortCuts = Config.getGlobalShortCuts();
    const items = [];
    if(shortCuts === 0){
      const item = Elem.create("div");
      const desc = Elem.createT("ショートカットキーは登録されていません。");
      item.appendChild(desc);
      items.push(item);
      return items;
    }

    for(const sc of shortCuts){
      const item = Elem.create("div");

      let imgName = "";
      let text = "";
      switch(sc.type){
        case "seek-forward":
          imgName = "seek-forward";
          text = `音声を${sc.value[0]}秒進める`;
          break;
        case "seek-backward":
          imgName = "seek-backward";
          text = `音声を${sc.value[0]}秒戻す`;
          break;
        case "speed":
          imgName = "speed";
          text = `音声速度を${sc.value[0]}倍に`;
          break;
        case "volume":
          imgName = "volume";
          text = `音量を${sc.value[0]}％に`;
          break;
        case "save":
          imgName = "save";
          text = "状態を保存";
          break;
        case "named-save":
          imgName = "named-save";
          text = "名前を付けて状態を保存"
          break;
        case "play-pause":
          imgName = "play-pause";
          text = "音声の再生/一時停止";
          break;
        case "seek-backward-and-play-pause":
          imgName = "play-pause";
          text = `音声を${sc.value[0]}秒戻し再生及び一時停止`;
          break;
        default:
          alert("ヘルパーで表示できないショートカットがあります。");
          continue;
      }

      const img = Elem.create("img");
      img.src = `img/theme/dark/${imgName}.png`;
      const desc = Elem.createT(text);
      const shortCutKey = Elem.create("span");
      shortCutKey.textContent = `（${sc.value.at(-1)}）`;

      item.appendChild(img);
      item.appendChild(desc);
      item.appendChild(shortCutKey);

      items.push(item);
    }

    return items;
  }

  static show(){
    Render.shortCutHelper();
    shortCutHelper.classList.remove("hide");
  }

  static hide(){
    shortCutHelper.classList.add("hide");
  }
}