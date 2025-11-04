class Speaker {
  static table = [];

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