class Selection {
  static idx = 0;
  static preIdx = 0;

  static highlight(div){
    div.classList.add("selected");
  }

  static unhighlight(div){
    div.classList.remove("selected");
  }

  static relocateHighlight(i){
    this.idx = i;

    this.unhighlight(Doc.getDiv(this.preIdx));
    this.highlight(Doc.getDiv(this.idx));

    this.preIdx = this.idx;
  }
}