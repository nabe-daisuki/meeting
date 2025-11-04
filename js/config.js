class Config {
  static schema = [
    {key:'enableNotifications', type:'checkbox', name:'通知を有効にする', hint:'重要なお知らせを受け取ります', default:true},
    {key:'username', type:'text', name:'ユーザー名', hint:'表示名を設定します', default:'ゲスト'},
    {key:'theme', type:'select', name:'テーマ', hint:'UIテーマを選択します', options:['ライト','ダーク','システム'], default:['ライト']},
    {key:'language', type:'multiselect', name:'使用言語', hint:'複数選択可能', options:['日本語','英語','中国語'], default:['中国語']},
    {key:'autoUpdate', type:'checkbox', name:'自動更新', hint:'アプリを自動的に更新', default:true}
  ];

  static user = [];

  static init(){
    config.addEventListener("click", () => {
      this.open();
    });
    configX.addEventListener("click", () => {
      this.close();
    });
    configOk.addEventListener("click", () => {
      this.close();
    });
    configCancel.addEventListener("click", () => {
      this.close();
    });

    configList.querySelectorAll("input,select").forEach( el => {
      el.addEventListener("change", e => {
        const key=e.target.dataset.key;
        if(e.target.type==="checkbox") working[key]=e.target.checked;
        else if(e.target.multiple) working[key]=Array.from(e.target.selectedOptions).map(o=>o.value);
        else working[key]=e.target.value;
      });
    });

    for(const s of this.schema){
      this.user.push({
        key: s.key,
        value: null,
        lock: false
      })
    }
  }

  static create(){
    const items = [];
    for(const s of this.schema){
      const item = Elem.create("div", {cl: "config-item"});
      const control = Elem.create("label", {cl: `config-${s.type}`});;
      if(["checkbox", "text"].includes(s.type)){
        const input = Elem.create("input");
        input.type = s.type;
        input.dataset.key = s.key;

        if(s.type === "checkbox") input.checked = s.default;
        if(s.type === "text") input.text = s.default;

        control.appendChild(input);
      }else if(["select", "multiselect"].includes(s.type)){
        const select = Elem.create("select");
        select.dataset.key = s.key;
        if(s.type === "multiselect") select.multiple = true;

        for(const o of s.options){
          const option = Elem.create("option");
          option.value = o;
          option.textContent = o;

          if(s.default.includes(o)) option.selected = true;

          select.appendChild(option);
        };

        control.appendChild(select);
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

      items.push(item);
    }

    return items;
  }

  static open(){
    Render.config();
  }

  static close(){
    configOverlay.classList.remove("show");
  }
}