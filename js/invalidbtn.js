class InvalidBtn {
  static create(i){
    const line = Doc.getLine(i);
    
    const elem = Elem.create("span", {cl: "invalid-button"});
    elem.textContent = '×';

    elem.addEventListener("click", e => {
      Doc.setDisabled(i, !line.disabled);
      const div = Doc.getDiv(i);
      if(line.disabled){
        e.target.textContent = "×解除";
        Hatching.remove(i);
        Selector.disable(i);
        div.classList.add("disabled");
      }else{
        e.target.textContent = "×";
        Selector.enable(i);
        div.classList.remove("disabled");
      }
      Render.syncRowHeights();
    });

    return elem;
  }
}