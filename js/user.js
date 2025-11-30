/**
 * ユーザー管理
 */
class User {
  static COMMON_USER_NAME = "ユーザー";

  /** ユーザーデータ一覧 */
  static data = [
    {
      name: "ゲスト",
      config: {
        general: [
          {key: "theme", value: ["ダーク"]},
          {key: "subTheme", value: ["イエロー"]},
          {key: "hideInputText", value: true},
          {key: "hideInputAudio", value: true},
          {key: "hideLoad", value: true},
          {key: "hideInputConfig", value: true}
        ],
        global_short_cut: [
          {type: "seek-forward", value: ["2", "Ctrl+6"]},
          {type: "seek-backward", value: ["3", "Ctrl+3"]},
          {type: "speed", value: ["1.30", "Ctrl+2"]},
          {type: "speed", value: ["1.00", "Ctrl+1"]},
          {type: "save", value: ["Ctrl+S"]},
          {type: "named-save", value: ["F12"]},
          {type: "play-pause", value: ["Ctrl+Shift+Z"]}
        ],
        textbody_short_cut: [
          {type: "add-comment", value: ["Ctrl+Q"]},
          {type: "add-response", value: ["Ctrl+R"]},
          {type: "add-speaker", value: ["F1"]},
          {type: "add-speaker-reverse", value: ["Shift+F1"]},
          {type: "insert-time", value: ["Ctrl+D"]}
        ]
      }
    }
  ];

  /**
   * データを追加
   * @param {Object} user ユーザーデータ
   */
  static add(user){
    if(!Type.isObj(user)) return System.fail("Object型ではないユーザーデータのため登録できませんでした。");
    this.data.push(structuredClone(user));
  }

  /**
   * データ数の取得
   * @returns {number}
   */
  static count(){
    return this.data.length;
  }

  /**
   * 全てのデータの取得
   * @returns {Array<{ name: string, config: Object}>}
   */
  static getList(){
    return this.data;
  }

  static createUserName(){
    const commonUserCount = this.getList()
      .filter(d => d.name.includes(this.COMMON_USER_NAME))
      .length;
    
    return `${this.COMMON_USER_NAME}${(commonUserCount + 1).toString().padStart(2, "0")}`;
  }
}