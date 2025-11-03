class Speaker {
  static table = [];

  // static init(){
  //   moriSpeaker.addEventListener("dragstart", e => {
  //     e.dataTransfer.setData("text/plain", "森_SPEAKER");
  //     e.dataTransfer.effectAllowed = "copy";
  //   });

  //   tanakaSpeaker.addEventListener("dragstart", e => {
  //     e.dataTransfer.setData("text/plain", "田中_SPEAKER");
  //     e.dataTransfer.effectAllowed = "copy";
  //   });

  //   satoSpeaker.addEventListener("dragstart", e => {
  //     e.dataTransfer.setData("text/plain", "佐藤_SPEAKER");
  //     e.dataTransfer.effectAllowed = "copy";
  //   });
  // }

  static get(){
    return this.table;
  }
  static set(t){
    this.table.length = 0;
    this.table.push(...t);
  }

  static create(name){
    const el = Elem.create("button");
    el.draggable = true;
    el.textContent = `（${name}）`;
    el.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", `${name}_SPEAKER`);
      e.dataTransfer.effectAllowed = "copy";
    });
    return el;
  }
}