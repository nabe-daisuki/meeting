class Config {
  static schema = [
    {key:"theme", type:"select", name:"テーマ", hint:"UIテーマを選択します。", options:["デフォルト", "ダーク"], value:["ダーク"]},
    {key:"keyconfig", type:"button", name:"キーコンフィグを開く", hint:"ショートカットキーを設定できます。", value:"設定画面を開く"},
    {key:"hideInputText", type:"checkbox", name:"テキスト(.txt)を読み込むことはない", hint:"「テキストの読込」を非表示にします。", value:true},
    {key:"hideInputAudio", type:"checkbox", name:"音声(.mp3)を読み込むことはない", hint:"「音声の読込」を非表示にします。", value:true},
    {key:"hideLoad", type:"checkbox", name:"保存したデータ(.txt)を読み込むことはない", hint:"「保存の読込」を非表示にします。", value:true},
    // {key:"username", type:"text", name:"ユーザー名", hint:"表示名を設定します", value:"ゲスト"},
    // {key:"language", type:"multiselect", name:"使用言語", hint:"複数選択可能", options:["日本語","英語","中国語"], value:["中国語"]}
  ];

  static SCDefaults = [
    {type:"seek-forward", range:"1,10", init:"1", step:"1", prefix:"", suffix:"秒/",  name:"音声を指定秒数進める", hint:"1～10秒の間で指定できます。"},
    {type:"seek-backward", range:"1,10", init:"1", step:"1", prefix:"", suffix:"秒/",name:"音声を指定秒数戻す", hint:"1～10秒の間で指定できます。"},
    {type:"speed", range:"0.10,2.00", init:"1.00", step:"0.01", prefix:"x", suffix:"/", name:"音声を指定速度に変更する", hint:"0.10～2.00の間で指定できます。"},
    {type:"volume", range:"1,100", init:"10", step:"1", prefix:"x", suffix:"/", name:"音声を指定音量に変更する", hint:"1～100の間で指定できます。"},
    {type:"save", name:"状態を保存する", hint:"現状を保存できます。"},
    {type:"play-pause", name:"再生/一時停止する", hint:"音声を再生/一時停止できます。"},
    {type:"named-save", name:"名前を付けて保存する", hint:"名前を付けて現状を保存できます。"},
  ];

  static shortCuts = [
    {key:"SC01", type:"seek-forward", value:["2", "Ctrl+6"]},
    {key:"SC02", type:"seek-backward", value:["3", "Ctrl+3"]},
    {key:"SC03", type:"speed", value:["1.30", "Ctrl+2"]},
    {key:"SC04", type:"speed", value:["1.00", "Ctrl+1"]},
    {key:"SC05", type:"save", value:["Ctrl+S"]},
    {key:"SC06", type:"named-save", value:["F12"]},
    {key:"SC07", type:"play-pause", value:["Ctrl+Shift+Z"]}
  ];

  static TBSCDefault = [

  ];

  static textBodyShortCut = [

  ];

  static isKeyConfig = false;
  static hasApplyKeyConfig = false;

  static init(){
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

      const theme = Theme.jpnToCode(this.get().find(s => s.key === "theme").value[0]);
      Theme.set(theme);
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
    
    Render.mainTool();
  }

  static openKeyCondig(){
    document.getElementById("config-general").classList.add("hide");
    document.getElementById("config-shortcut").classList.remove("hide");
    this.isKeyConfig = true;
  }
  static closeKeyConfig(){
    document.getElementById("config-general").classList.remove("hide");
    document.getElementById("config-shortcut").classList.add("hide");
    this.isKeyConfig = false;
  }

  static resetKeyConfig(){
    document.getElementById("config-shortcut").remove();
    configList.appendChild(this.createKeyConfig());
  }

  static apply(){
    configList.querySelectorAll("#config-general input,select").forEach(el => {
      const k = el.dataset.key;

      if(el.type === "checkbox"){
        this.update(k, el.checked);
      }else{
        this.update(k, [el.value]);
      }
    });

    if(!this.hasApplyKeyConfig) return;
    
    this.clearShortCuts();
    configList.querySelectorAll("#config-shortcut .config-item").forEach( (item, j) => {
      const type = item.dataset.type;
      const value = Array.from(item.querySelectorAll("input, select")).reduce( (acc, cur) => {
        acc.push(cur.value);
        return acc;
      }, []);

      this.addShortCut(j, type, value);
    });

    this.hasApplyKeyConfig = false;
  }

  static addShortCut(j, type, value){
    this.getShortCuts().push({
      key: j.toString().padStart(2, "0"),
      type,
      value: [...value]
    });
  }

  static update(k, v){
    for(const s of this.get()){
      if(k !== s.key) continue;
      s.value = v;
      break;
    }
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

    for(const sc of this.getShortCuts()){
      keyConfig.appendChild(this.createKeyConfigItem(sc.key, sc.type, sc.value));
    }

    const addController = Elem.create("div", {id: "config-add-controller"});
    const addSelection = Elem.create("select", {id: "config-add-selection"});
    this.SCDefaults.forEach( (scDefault, j) => {
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
      const nextShortCutKeyNum = Number(this.getShortCuts().at(-1).key.slice(-2)) + 1;
      const newKey = `SC${nextShortCutKeyNum.toString().padStart(2, "0")}`;
      const newType = this.getSCDefaults().find(scd => {
        return scd.name === selection;
      }).type;

      const parent = document.getElementById("config-shortcut");
      const target = parent.children[parent.children.length - 1];
      parent.insertBefore(this.createKeyConfigItem(newKey, newType, null), target);
    });
    addController.appendChild(add);

    keyConfig.appendChild(addController);

    return keyConfig;
  }

  static createKeyConfigItem(key, type, value){
    const scDefault = this.SCDefaults.find(d => d.type === type);

    const item = Elem.create("div", {cl: "config-item"});
    const control = Elem.create("div", {cl: `config-${type}`});
    item.dataset.key = key;
    item.dataset.type = type; 
    if(["seek-forward", "seek-backward", "speed"].includes(type)){
      const prefix = Elem.createT(scDefault.prefix);
      
      const text = Elem.create("input");
      text.type = "number";
      [text.min, text.max] = scDefault.range.split(",");
      text.value = value ? value[0] : scDefault.init;
      text.step = scDefault.step;

      const suffix = Elem.createT(scDefault.suffix);

      const select = Elem.create("select");
      for(const o of KeyBoard.shortCut){
        const option = Elem.create("option");
        option.value = o;
        option.textContent = o;

        if(value) if(value[1].includes(o)) option.selected = true;

        select.appendChild(option);
      }

      control.appendChild(prefix);
      control.appendChild(text);
      control.appendChild(suffix);
      control.appendChild(select);
    }else if(["save", "named-save", "play-pause"].includes(type)){
      const select = Elem.create("select");

      for(const o of KeyBoard.shortCut){
        const option = Elem.create("option");
        option.value = o;
        option.textContent = o;

        if(value) if(value[0].includes(o)) option.selected = true;

        select.appendChild(option);
      }

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

  static clear(){
    console.log(this.get());
    this.get().length = 0;
  }
  static get(){
    return this.schema;
  }
  static set(v){
    this.clear();
    this.schema.push(...structuredClone(v));
  }
  static clearShortCuts(){
    this.getShortCuts().length = 0;
  }
  static getShortCuts(){
    return this.shortCuts;
  }
  static setShortCuts(v){
    this.clearShortCuts();
    this.shortCuts.push(...structuredClone(v));
  }
  static getSCDefaults(){
    return this.SCDefaults;
  }

  static open(){
    Render.config();
  }

  static close(){
    configOverlay.classList.remove("show");
  }
}