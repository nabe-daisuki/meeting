/**
 * 設定画面
 */
class Config {
  static general = [
    {key:"theme", type:"select", name:"テーマ", hint:"UIテーマを選択します。", options:["デフォルト", "ダーク"], value:["ダーク"]},
    {key:"subTheme", type:"select", name:"サブテーマ", hint:"UIサブテーマを選択します。", options:["レッド", "オレンジ", "イエロー", "グリーン", "シアン", "パープル", "ピンク"], value:["イエロー"]},
    {key:"keyconfig", type:"button", name:"キーコンフィグを開く", hint:"ショートカットキーを設定できます。", value:"設定画面を開く"},
    {key:"hideInputText", type:"checkbox", name:"テキスト(.txt)を読み込むことはない", hint:"「テキストの読込」を非表示にします。", value:true},
    {key:"hideInputAudio", type:"checkbox", name:"音声(.mp3)を読み込むことはない", hint:"「音声の読込」を非表示にします。", value:true},
    {key:"hideLoad", type:"checkbox", name:"保存したデータ(.txt)を読み込むことはない", hint:"「保存の読込」を非表示にします。", value:true},
    {key:"hideInputConfig", type:"checkbox", name:"保存した設定データ(.gijiconf)を読み込むことはない", hint:"「設定の読込」を非表示にします。", value:true},
    // {key:"username", type:"text", name:"ユーザー名", hint:"表示名を設定します", value:"ゲスト"},
    // {key:"language", type:"multiselect", name:"使用言語", hint:"複数選択可能", options:["日本語","英語","中国語"], value:["中国語"]}
  ];

  static GLOBAL_SHORT_CUT_TYPE = [
    {type:"seek-forward", range:"1,10", init:"1", step:"1", prefix:"", suffix:"秒 /",  name:"音声を指定秒数進める", hint:"1～10秒の間で指定できます。"},
    {type:"seek-backward", range:"1,10", init:"1", step:"1", prefix:"", suffix:"秒 /",name:"音声を指定秒数戻す", hint:"1～10秒の間で指定できます。"},
    {type:"speed", range:"0.10,2.00", init:"1.00", step:"0.01", prefix:"x", suffix:"/", name:"音声を指定速度に変更する", hint:"0.10～2.00の間で指定できます。"},
    {type:"volume", range:"1,100", init:"10", step:"1", prefix:"x", suffix:"/", name:"音声を指定音量に変更する", hint:"1～100の間で指定できます。"},
    {type:"save", name:"状態を保存する", hint:"現状を保存できます。"},
    {type:"play-pause", name:"再生/一時停止する", hint:"音声を再生/一時停止できます。"},
    {type:"seek-backward-and-play-pause", range:"1,10", init:"1", step:"1", prefix:"", suffix:"秒 /", name:"音声を指定秒数戻り再生及び一時停止する", hint:"音声を指定秒数戻し再生及び一時停止できます。"},
    {type:"named-save", name:"名前を付けて保存する", hint:"名前を付けて現状を保存できます。"},
  ];

  static globalShortCuts = [
    {key:"GSC01", type:"seek-forward", value:["2", "Ctrl+6"]},
    {key:"GSC02", type:"seek-backward", value:["3", "Ctrl+3"]},
    {key:"GSC03", type:"speed", value:["1.30", "Ctrl+2"]},
    {key:"GSC04", type:"speed", value:["1.00", "Ctrl+1"]},
    {key:"GSC05", type:"save", value:["Ctrl+S"]},
    {key:"GSC06", type:"named-save", value:["F12"]},
    {key:"GSC07", type:"play-pause", value:["Ctrl+Shift+Z"]}
  ];

  static TEXTBODY_SHORT_CUT_TYPE = [
    {type:"add-comment", name:"行をコメント行にする/解除する", hint:"行をコメント行にしたり、解除したりできます。"},
    {type:"add-response", name:"行を返答行にする/解除する", hint:"行を返答行にしたり、解除したりできます。"},
    {type:"add-speaker", name:"行末尾に発言者を登録順に追記する", hint:"行末尾に発言者を追記できます。"},
    {type:"add-speaker-reverse", name:"行末尾に発言者を登録の逆順に追記する", hint:"行末尾に発言者を追記できます。"},
    {type:"insert-time", name:"カーソル位置に時間を挿入する", hint:"書式は(mm:ss)で、範囲選択の場合は末尾に挿入します。"}
  ];

  static textBodyShortCuts = [
    {key:"TBSC01", type:"add-comment", value:["Ctrl+Q"]},
    {key:"TBSC02", type:"add-response", value:["Ctrl+R"]},
    {key:"TBSC03", type:"add-speaker", value:["F1"]},
    {key:"TBSC04", type:"add-speaker-reverse", value:["Shift+F1"]},
    {key:"TBSC05", type:"insert-time", value:["Ctrl+D"]}
  ];

  static isKeyConfig = false;
  static hasApplyKeyConfig = false;

  static init(){
    configInput.addEventListener("change", async(e) => {
      const files = e.target.files;
      if(files.length === 0) return System.warn("ファイルが選択されていません。");
      if(files.length != 1) return System.fail("1つのファイル(.gijiconf)を選択してください。");
      
      const file = files[0];
      const ext = file.name.split(".").pop().toLowerCase();
      if(ext !== "gijiconf") return System.fail(`ドロップされた拡張子は「.${ext}」です。ファイル(.gijiconf)をドロップ下さい。`);
      
      const sections = await GijiDecoder.decode(file);
      const configBytes = sections.config;
      if(!configBytes) return System.fail(`configタグが含まれていないため、読み込みに失敗しました。`);
      
      const config = Convert.bytesToArray(configBytes["bytes"]);
      if(!Type.isObj(config) || !("name" in config) || !("config" in config)) return System.fail("設定データが破損しているため、読み込みに失敗しました。");

      if(User.getList().some(d => d.name === config.name)){
        alert(`既に"${config.name}"の設定データは登録済のため、"${config.name}_1"として設定データを読み込まれました。`);
        config.name += "_1";
      }else{
        alert(`"${config.name}"の設定データが読み込まれました。`)
      }
      alert(`読み込まれた設定データは一時的なデータです。
本編集データを保存し、再度読み込まれた場合はユーザー選択画面にて表示されます。
しかし、別の議事録作成時は表示されませんので周囲の方に聞いてください。`);

      User.add(config);
      UserSelect.setCurrUser(config.name);
      Config.load(config.config);
      Config.active();
    });
    config.addEventListener("click", () => {
      this.open();
    });
    configX.addEventListener("click", () => {
      this.close();
    });
    configOk.addEventListener("click", () => {
      if(this.isKeyConfig){
        this.hasApplyKeyConfig = true;
        this.closeKeyConfig();
        return;
      }
      this.apply();
      Render.mainTool();

      const theme = this.get().find(s => s.key === "theme").value[0];
      const subTheme = this.get().find(s => s.key === "subTheme").value[0];
      Theme.set(theme);
      Theme.setSub(subTheme);
      Theme.apply();
      this.close();
    });
    configCancel.addEventListener("click", () => {
      if(this.isKeyConfig){
        this.closeKeyConfig();
        this.resetKeyConfig();
        return;
      }
      this.close();
    });
  }

  static resetKeyConfig(){
    document.getElementById("config-shortcut").remove();
    configList.appendChild(this.createKeyConfig());
  }


  /**
   * 設定の適用
   * @returns {void}
   */
  static apply(){
    configList.querySelector("#config-general").querySelectorAll("input,select").forEach(el => {
      const k = el.dataset.key;

      if(el.type === "checkbox"){
        this.update(k, el.checked);
      }else{
        this.update(k, [el.value]);
      }
    });

    if(!this.hasApplyKeyConfig) return;
    
    this.clearGlobalShortCuts();
    configList.querySelector("#config-global-shortcut").querySelectorAll(".config-item").forEach( (item, j) => {
      const type = item.dataset.type;
      const value = Array.from(item.querySelectorAll("input, select")).reduce( (acc, cur) => {
        acc.push(cur.value);
        return acc;
      }, []);

      if(!value.at(-1)) return;

      this.addGlobalShortCut(this.getGlobalShortCuts(), type, value);
    });

    
    this.clearTextBodyShortCuts();
    configList.querySelector("#config-textbody-shortcut").querySelectorAll(".config-item").forEach( (item, j) => {
      const type = item.dataset.type;
      const value = Array.from(item.querySelectorAll("input, select")).reduce( (acc, cur) => {
        acc.push(cur.value);
        return acc;
      }, []);

      if(!value.at(-1)) return;

      this.addTextBodyShortCut(this.getTextBodyShortCuts(), type, value);
    });

    this.hasApplyKeyConfig = false;
  }

  /**
   * 設定の反映
   */
  static active(){
    Render.mainTool();
    const theme = this.get().find(s => s.key === "theme").value[0];
    Theme.set(theme);
    const subTheme = this.get().find(c => c.key === "subTheme").value[0];
    Theme.setSub(subTheme);

    Theme.apply();
  }


  /**
   * 設定データを読込
   * @param {Object} data 設定データ
   * @param {Array<{key: string, value: boolean|Array<string>}>} data.general 一般設定
   * @param {Array<{type: string, value: Array<string>}>} [data.global_short_cut] グローバルショートカット
   * @param {Array<{type: string, value: Array<string>}>} [data.textbody_short_cut] 編集ブロックショートカット
   * @returns {boolean} true: 成功 / false: 失敗
   */
  static load(data){
    if(!Type.isObj(data)) return System.fail("Object型ではない設定データのため登録できませんでした。");

    const general = data.general;
    const globalShortCut = data.global_short_cut;
    const textbodyShortCut = data.textbody_short_cut;

    const userName = UserSelect.getCurrUser();

    if(general){
      general.forEach(c => this.update(c.key, c.value));
    }else{
      console.warn(`${userName}さんの「一般」の設定データはありません。`);
    }

    if(globalShortCut){
      this.resetGlobalShortCuts(globalShortCut);
    }else{
      console.warn(`${userName}さんの「グローバルショートカット」の設定データはありません。`);
    }

    if(textbodyShortCut){
      this.resetTextBodyShortCuts(textbodyShortCut);
    }else{
      console.warn(`${userName}さんの「編集ブロックショートカット」の設定データはありません。`);
    }
    return true;
  }


  static create(){
    const items = [];

    const general = Elem.create("div", {id: "config-general"});
    for(const s of this.get()){
      const item = Elem.create("div", {cl: "config-item"});
      const control = Elem.create("label", {cl: `config-${s.type}`});
      if(["checkbox", "text"].includes(s.type)){
        const input = Elem.create("input");
        input.type = s.type;
        input.dataset.key = s.key;

        if(s.type === "checkbox") input.checked = s.value;
        if(s.type === "text") input.text = s.value;

        control.appendChild(input);
      }else if(["select", "multiselect"].includes(s.type)){
        const select = Elem.create("select");
        select.dataset.key = s.key;
        if(s.type === "multiselect") select.multiple = true;

        for(const o of s.options){
          const option = Elem.create("option");
          option.value = o;
          option.textContent = o;

          if(s.value.includes(o)) option.selected = true;

          select.appendChild(option);
        }

        control.appendChild(select);
      }else if(["button"].includes(s.type)){
        const button = Elem.create("button", {id: `config-${s.key}`});
        button.dataset.key = s.key;
        switch(s.key){
          case "keyconfig":
            button.addEventListener("click", () => this.openKeyCondig());
            break;
          default:
            alert("無効な設定項目があります。");
        }

        for(const char of s.value.split("")){
          const span = Elem.create("span");
          span.textContent = char;
          button.appendChild(span);
        }

        control.appendChild(button);
      }

      const name = Elem.create("div", {cl: "name"});
      const nameLabel = Elem.create("div", {cl: "label"});
      nameLabel.textContent = s.name;
      const hint = Elem.create("div", {cl: "hint"});
      hint.textContent = s.hint;

      name.appendChild(nameLabel);
      name.appendChild(hint);

      item.appendChild(name);
      item.appendChild(control);

      general.appendChild(item);
    }

    items.push(general);

    items.push(this.createKeyConfig());

    return items;
  }

  static createKeyConfig(){
    const keyConfig = Elem.create("div", {id: "config-shortcut", cl: "hide"});

    const globalKeyConfig = Elem.create("div", {id: "config-global-shortcut"});
    for(const sc of this.getGlobalShortCuts()){
      globalKeyConfig.appendChild(this.createKeyConfigItem(sc.key, sc.type, sc.value));
    }

    const addController = Elem.create("div", {id: "config-add-controller"});
    const addSelection = Elem.create("select", {id: "config-add-selection"});
    this.getGlobalShortCutType().forEach( (scDefault, j) => {
      const option = Elem.create("option");
      option.value = scDefault.name;
      option.textContent = scDefault.name;

      if(j === 0) option.selected = true;

      addSelection.appendChild(option);
    });
    addController.appendChild(addSelection);

    const add = Elem.create("button", {id: "config-add", cl: "config-btn secondary config-focus-ring"})
    add.textContent = "＋";
    add.addEventListener("click", () => {
      const selection = addSelection.value;
      if(selection === ""){
        alert("ボタン左の項目を設定ください");
        return;
      }
      const nextShortCutKeyNum = Number(this.getGlobalShortCuts().at(-1).key.slice(-2)) + 1;
      const newKey = `GSC${nextShortCutKeyNum.toString().padStart(2, "0")}`;
      const newType = this.getGlobalShortCutType().find(scd => {
        return scd.name === selection;
      }).type;

      const parent = document.getElementById("config-global-shortcut");
      const target = parent.children[parent.children.length - 1];
      parent.insertBefore(this.createKeyConfigItem(newKey, newType, null), target);
    });
    addController.appendChild(add);

    globalKeyConfig.appendChild(addController);


    const textBodyKeyConfig = Elem.create("div", {id: "config-textbody-shortcut"});
    for(const sc of this.getTextBodyShortCuts()){
      textBodyKeyConfig.appendChild(this.createTBKeyConfigItem(sc.key, sc.type, sc.value));
    }

    const TBSCAddController = Elem.create("div", {id: "config-tbsc-add-controller"});
    const TBSCAddSelection = Elem.create("select", {id: "config-tbsc-add-selection"});
    this.getTextBodyShortCutType().forEach( (tbscDefault, j) => {
      const option = Elem.create("option");
      option.value = tbscDefault.name;
      option.textContent = tbscDefault.name;

      if(j === 0) option.selected = true;

      TBSCAddSelection.appendChild(option);
    });
    TBSCAddController.appendChild(TBSCAddSelection);

    const TBSCAdd = Elem.create("button", {id: "config-tbsc-add", cl: "config-btn secondary config-focus-ring"})
    TBSCAdd.textContent = "＋";
    TBSCAdd.addEventListener("click", () => {
      const selection = TBSCAddSelection.value;
      if(selection === ""){
        alert("ボタン左の項目を設定ください");
        return;
      }
      const nextShortCutKeyNum = Number(this.getTextBodyShortCuts().at(-1).key.slice(-2)) + 1;
      const newKey = `TBSC${nextShortCutKeyNum.toString().padStart(2, "0")}`;
      const newType = this.getTextBodyShortCutType().find(scd => {
        return scd.name === selection;
      }).type;

      const parent = document.getElementById("config-textbody-shortcut");
      const target = parent.children[parent.children.length - 1];
      parent.insertBefore(this.createTBKeyConfigItem(newKey, newType, null), target);
    });
    TBSCAddController.appendChild(TBSCAdd);

    textBodyKeyConfig.appendChild(TBSCAddController);


    keyConfig.appendChild(globalKeyConfig);
    keyConfig.appendChild(textBodyKeyConfig);
    return keyConfig;
  }

  static createKeyConfigItem(key, type, value){
    const scDefault = this.getGlobalShortCutType().find(d => d.type === type);

    const item = Elem.create("div", {cl: "config-item"});

    let classNames = [`config-${type}`, "config-shortcut-item"];
    if("init" in scDefault) classNames.push("config-with-value");
    else classNames.push("config-notwith-value");
    const control = Elem.create("div", {cl: classNames.join(" ")});
    item.dataset.key = key;
    item.dataset.type = type; 

    if("init" in scDefault){
      const prefix = Elem.createT(scDefault.prefix);
      
      const text = Elem.create("input");
      text.type = "number";
      [text.min, text.max] = scDefault.range.split(",");
      text.value = value ? value[0] : scDefault.init;
      text.step = scDefault.step;

      const suffix = Elem.createT(scDefault.suffix);

      const select = Elem.create("select");
      select.addEventListener("change", e => {
        for(const sl of document.querySelectorAll(".config-shortcut-item select")){
          if(sl === e.target) continue;
          if(sl.value !== e.target.value) continue;
          sl.selectedIndex = -1;
          break;
        }
        console.log("選択された値:", e.target.value);
      });
      for(const o of KeyBoard.shortCut){
        const option = Elem.create("option");
        option.value = o;
        option.textContent = o;

        if(value) if(value[1].includes(o)) option.selected = true;

        select.appendChild(option);
      }
      if(!value) select.selectedIndex = -1;

      control.appendChild(prefix);
      control.appendChild(text);
      control.appendChild(suffix);
      control.appendChild(select);
    }else{
      const select = Elem.create("select");
      select.addEventListener("change", e => {
        for(const sl of document.querySelectorAll(".config-shortcut-item select")){
          if(sl === e.target) continue;
          if(sl.value !== e.target.value) continue;
          sl.selectedIndex = -1;
          break;
        }
        console.log("選択された値:", e.target.value);
      });

      for(const o of KeyBoard.shortCut){
        const option = Elem.create("option");
        option.value = o;
        option.textContent = o;

        if(value) if(value[0].includes(o)) option.selected = true;

        select.appendChild(option);
      }
      if(!value) select.selectedIndex = -1;

      control.appendChild(select);
    }

    const shortCutDelete = Elem.create("button", {cl: "config-shortcut-delete"});
    shortCutDelete.textContent = "✕";
    shortCutDelete.addEventListener("click", () => {
      const item = Array.from(document.querySelectorAll("#config-shortcut .config-item")).find( item => {
        return key === item.dataset.key
      });
      item.remove();
    });
    control.appendChild(shortCutDelete);

    const name = Elem.create("div", {cl: "name"});
    const nameLabel = Elem.create("div", {cl: "label"});
    nameLabel.textContent = scDefault.name;
    const hint = Elem.create("div", {cl: "hint"});
    hint.textContent = scDefault.hint;

    name.appendChild(nameLabel);
    name.appendChild(hint);

    item.appendChild(name);
    item.appendChild(control);

    return item;
  }


  static createTBKeyConfigItem(key, type, value){
    const tbscDefault = this.getTextBodyShortCutType().find(d => d.type === type);

    const item = Elem.create("div", {cl: "config-item"});

    let classNames = [`config-${type}`, "config-shortcut-item"];
    if("init" in tbscDefault) classNames.push("config-with-value");
    else classNames.push("config-notwith-value");
    const control = Elem.create("div", {cl: classNames.join(" ")});
    item.dataset.key = key;
    item.dataset.type = type; 

    if("init" in tbscDefault){
      const prefix = Elem.createT(tbscDefault.prefix);
      
      const text = Elem.create("input");
      text.type = "number";
      [text.min, text.max] = tbscDefault.range.split(",");
      text.value = value ? value[0] : tbscDefault.init;
      text.step = tbscDefault.step;

      const suffix = Elem.createT(tbscDefault.suffix);

      const select = Elem.create("select");
      select.addEventListener("change", e => {
        for(const sl of document.querySelectorAll(".config-shortcut-item select")){
          if(sl === e.target) continue;
          if(sl.value !== e.target.value) continue;
          sl.selectedIndex = -1;
          break;
        }
        console.log("選択された値:", e.target.value);
      });
      for(const o of KeyBoard.shortCut){
        const option = Elem.create("option");
        option.value = o;
        option.textContent = o;

        if(value) if(value[1].includes(o)) option.selected = true;

        select.appendChild(option);
      }
      if(!value) select.selectedIndex = -1;

      control.appendChild(prefix);
      control.appendChild(text);
      control.appendChild(suffix);
      control.appendChild(select);
    }else{
      const select = Elem.create("select");
      select.addEventListener("change", e => {
        for(const sl of document.querySelectorAll(".config-shortcut-item select")){
          if(sl === e.target) continue;
          if(sl.value !== e.target.value) continue;
          sl.selectedIndex = -1;
          break;
        }
        console.log("選択された値:", e.target.value);
      });

      for(const o of KeyBoard.shortCut){
        const option = Elem.create("option");
        option.value = o;
        option.textContent = o;

        if(value) if(value[0].includes(o)) option.selected = true;

        select.appendChild(option);
      }
      if(!value) select.selectedIndex = -1;

      control.appendChild(select);
    }

    const shortCutDelete = Elem.create("button", {cl: "config-shortcut-delete"});
    shortCutDelete.textContent = "✕";
    shortCutDelete.addEventListener("click", () => {
      const item = Array.from(document.querySelectorAll("#config-shortcut .config-item")).find( item => {
        return key === item.dataset.key
      });
      item.remove();
    });
    control.appendChild(shortCutDelete);

    const name = Elem.create("div", {cl: "name"});
    const nameLabel = Elem.create("div", {cl: "label"});
    nameLabel.textContent = tbscDefault.name;
    const hint = Elem.create("div", {cl: "hint"});
    hint.textContent = tbscDefault.hint;

    name.appendChild(nameLabel);
    name.appendChild(hint);

    item.appendChild(name);
    item.appendChild(control);

    return item;
  }


  /* =====================
   一般設定
   ===================== */

  /**
   * 一般設定の取得
   * @returns {Array<{key: string, type: string, hint: string, options?: Array<string>, value: string|boolean|Array<string>}>}
   */
  static get(){
    return this.general;
  }
  static clear(){
    this.get().length = 0;
  }
  /**
   * 一般設定の更新
   * @param {string} k キー
   * @param {Array<string>|boolean} v 更新データ
   * @returns {boolean} true: 成功 / false: 失敗
   */
  static update(k, v){
    const config = this.get().find(c => c.key === k);
    if(!config) return System.fail(`キー(${k})が存在しないため、一般設定を更新できませんでした。`);
    
    if(Type.isArr(v)) config.value = [...v];
    else config.value = v;
    return true;
  }
  
  static set(v){
    this.clear();
    this.general.push(...structuredClone(v));
  }

  /* =====================
   グローバルショートカット
   ===================== */

  /**
   * グローバルショートカットのキー名の作成
   * @param {number} i キー化する数値(0-99)
   * @returns {string}
   */
  static makeGSCKey(i){
    if(i <= 0 || i > 99) System.err(`数値(${i})が1～99の間ではないため、グローバルショートカットのキーを作成できませんでした。`);
    return "GSC" + i.toString().padStart(2, "0");
  }
  /**
   * グローバルショートカットのタイプが存在するか判定する
   * @param {string} type 判定するタイプ名
   * @returns {boolean} true: 存在する / false: 存在しない
   */
  static existsGlobalShortCutType(type){
    return this.getGlobalShortCutType().some(t => type === t.type);
  }
  /**
   * グローバルショートカットの全削除
   */
  static clearGlobalShortCuts(){
    this.getGlobalShortCuts().length = 0;
  }
  /**
   * 全てのグローバルショートカットの取得
   * @returns {Array<{ key: string, type: string, value: Array<string> }>}
   */
  static getGlobalShortCuts(){
    return this.globalShortCuts;
  }
  /**
   * グローバルショートカットを設定する
   * @param {Array} shortCutList グローバルショートカット一覧 
   */
  static setGlobalShortCuts(shortCutList){
    this.clearGlobalShortCuts();
    this.globalShortCuts.push(...structuredClone(shortCutList));
  }
  /**
   * グローバルショートカットを再設定する
   * @param {Array<{type: string, value: Array<string>}>} shortCutList グローバルショートカット一覧 
   */
  static resetGlobalShortCuts(shortCutList){
    if(!Type.isArr(shortCutList)) System.fail("Array型ではないため「グローバルショートカット」を再設定できませんでした。");
    
    const tempList = [];
    shortCutList.forEach(shortCut => {
      this.addGlobalShortCut(tempList, shortCut.type, shortCut.value);
    });
    this.clearGlobalShortCuts();
    this.globalShortCuts.push(...structuredClone(tempList));
  }
  /**
   * グローバルショートカットの追加
   * @param {Array<{key: string, type: string, value: Array<string>}>} destArr 追加先の配列 
   * @param {string} type グローバルショートカットのタイプ
   * @param {Array<string>} value グローバルショートカットの値
   * @returns {boolean} true: 成功 / false: 失敗
   */
  static addGlobalShortCut(destArr, type, value){
    if(!this.existsGlobalShortCutType(type)) return System.fail(`タイプ(${type})が存在しないため、グローバルショートカットを追加できませんでした。`);
    if(!Type.isArr(value)) return System.fail("valueがArray型でないため、グローバルショートカットを追加できませんでした。");
    const count = destArr.length;
    const key = this.makeGSCKey(count + 1);
    destArr.push({
      key,
      type,
      value: [...value]
    });
    return true;
  }
  /**
   * グローバルショートカットのタイプリストの取得
   * 各要素はタイプの設定情報
   * @returns {Array<{type: string, range?: string, init?: string, step?: string, prefix?: string, suffix?: string, name: string, hint: string}>}
   */
  static getGlobalShortCutType(){
    return this.GLOBAL_SHORT_CUT_TYPE;
  }


  /* =====================
   編集ブロックショートカット
   ===================== */

  /**
   * 編集ブロックショートカットのキー名の作成
   * @param {number} i キー化する数値(0-99)
   * @returns {string}
   */
  static makeTBSCKey(i){
    if(i <= 0 || i > 99) System.err(`数値(${i})が1～99の間ではないため、編集ブロックショートカットのキーを作成できませんでした。`);
    return "TBSC" + i.toString().padStart(2, "0");
  }
  /**
   * 編集ブロックショートカットのタイプが存在するか判定する
   * @param {string} type 判定するタイプ名
   * @returns {boolean} true: 存在する / false: 存在しない
   */
  static existsTextBodyShortCutType(type){
    return this.getTextBodyShortCutType().some(t => type === t.type);
  }
  /**
   * 編集ブロックショートカットの全削除
   */
  static clearTextBodyShortCuts(){
    this.getTextBodyShortCuts().length = 0;
  }
  /**
   * 全ての編集ブロックショートカットの取得
   * @returns {Array<{ key: string, type: string, value: Array<string> }>}
   */
  static getTextBodyShortCuts(){
    return this.textBodyShortCuts;
  }
  static setTBShortCuts(v){
    this.clearTextBodyShortCuts();
    this.textBodyShortCuts.push(...structuredClone(v));
  }
  /**
   * 編集ブロックショートカットを再設定する
   * @param {Array<{type: string, value: Array<string>}>} shortCutList 編集ブロックショートカット一覧 
   */
  static resetTextBodyShortCuts(shortCutList){
    if(!Type.isArr(shortCutList)) System.fail("Array型ではないため「編集ブロックショートカット」を再設定できませんでした。");
    
    const tempList = [];
    shortCutList.forEach(shortCut => {
      this.addTextBodyShortCut(tempList, shortCut.type, shortCut.value);
    });
    this.clearTextBodyShortCuts();
    this.textBodyShortCuts.push(...structuredClone(tempList));
  }
  /**
   * 編集ブロックショートカットの追加
   * @param {Array<{key: string, type: string, value: Array<string>}>} destArr 追加先の配列 
   * @param {string} type 編集ブロックショートカットのタイプ
   * @param {Array<string>} value 編集ブロックショートカットの値
   * @returns {boolean} true: 成功 / false: 失敗
   */
  static addTextBodyShortCut(destArr, type, value){
    if(!this.existsTextBodyShortCutType(type)) return System.fail(`タイプ(${type})が存在しないため、編集ブロックショートカットを追加できませんでした。`);
    if(!Type.isArr(value)) return System.fail("valueがArray型でないため、編集ブロックショートカットを追加できませんでした。");
    const count = destArr.length;
    const key = this.makeTBSCKey(count + 1);
    destArr.push({
      key,
      type,
      value: [...value]
    });
    return true;
  }
  /**
   * 編集ブロックショートカットのタイプリストの取得
   * 各要素はタイプの設定情報
   * @returns {Array<{type: string, name: string, hint: string}>}
   */
  static getTextBodyShortCutType(){
    return this.TEXTBODY_SHORT_CUT_TYPE;
  }

  /**
   * 設定画面を開く
   */
  static open(){
    Render.config();
  }
  /**
   * 設定画面を閉じる
   */
  static close(){
    configOverlay.classList.remove("show");
  }

  /**
   * キー設定画面を開く
   */
  static openKeyCondig(){
    document.getElementById("config-general").classList.add("hide");
    document.getElementById("config-shortcut").classList.remove("hide");
    this.isKeyConfig = true;
  }
  /**
   * キー設定画面を閉じる
   */
  static closeKeyConfig(){
    document.getElementById("config-general").classList.remove("hide");
    document.getElementById("config-shortcut").classList.add("hide");
    this.isKeyConfig = false;
  }

  static getConfigData(){
    const data = {};
    data.general = this.general
      .filter(c => c.key !== "keyconfig")
      .map( ({key, value}) => ({
        key,
        value: Type.isArr(value) ? [...value] : value
      }));
    
    data.global_short_cut = structuredClone(this.getGlobalShortCuts());
    data.textbody_short_cut = structuredClone(this.getTextBodyShortCuts());

    return data;
  }

  static isSameConfig(config){
    return User.getList().some(d => Compare.deepEqual(d.config, config));
  }

}