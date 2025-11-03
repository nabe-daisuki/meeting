class Config {
  static schema = [
    {key:'enableNotifications', type:'checkbox', name:'通知を有効にする', hint:'重要なお知らせを受け取ります', default:true},
    {key:'username', type:'text', name:'ユーザー名', hint:'表示名を設定します', default:'ゲスト'},
    {key:'theme', type:'select', name:'テーマ', hint:'UIテーマを選択します', options:['ライト','ダーク','システム'], default:'システム'},
    {key:'language', type:'multiselect', name:'使用言語', hint:'複数選択可能', options:['日本語','英語','中国語'], default:['日本語']},
    {key:'autoUpdate', type:'checkbox', name:'自動更新', hint:'アプリを自動的に更新', default:true}
  ];

  static init(){
    config.addEventListener("click", () => {
      this.open();
    });
    let persisted={},working={};

    // function loadSaved(){
    // const raw=localStorage.getItem('config_overlay_v2');
    // if(!raw)return SCHEMA.reduce((a,s)=>{a[s.key]=s.default;return a},{});
    // return Object.assign({},SCHEMA.reduce((a,s)=>{a[s.key]=s.default;return a},{}),JSON.parse(raw));
    // }
    // function save(obj){localStorage.setItem('config_overlay_v2',JSON.stringify(obj));}



    // function openOverlay(){working=Object.assign({},persisted);render();overlay.classList.add("show");}
    // function closeOverlay(){overlay.classList.remove("show");}
    // openBtn.onclick=openOverlay;closeX.onclick=()=>closeOverlay();cancelBtn.onclick=()=>closeOverlay();
    // okBtn.onclick=()=>{persisted=Object.assign({},working);save(persisted);closeOverlay();};


    // persisted=loadSaved();
  }

  static open(){
    Render.config();
    configOverlay.classList.add("show");
  }
}