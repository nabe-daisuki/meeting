class MenuData {
  static _data = [
    { id: "comment", text: "コメント", icon: "comment-mini" },
    { text: "返答", icon: "response-mini" },
    { separator: true },
    { text: "削除" },
    { text: "翻訳", sub: ["英語", "日本語", "フランス語"] },
    { text: "削除" }
  ];

  static conversation = [
    { id: "comment", text: "コメント", sc: "Ctrl + Q", icon: "comment-mini" },
    { id: "response", text: "返答", sc: "Ctrl + R", icon: "response-mini" }
  ];

  static noSelection = [
    { id: "paste", text: "貼り付け", sc: "Ctrl + P", icon: "paste-mini" }
  ]

  static selection = [
    { id: "cut", text: "切り取り", sc: "Ctrl + X", icon: "cut-mini" },
    { id: "copy", text: "コピー", sc: "Ctrl + C", icon: "copy-mini" }
  ];

  static replace = [
    { id: "replace", text: "全置換", sc: "Ctrl + R", icon: "replace-mini" }
  ];

  static sep = [
    { separator: true }
  ];

  static get(){
    return this._data;
  }
}