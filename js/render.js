class Render {
  static render(){
    const flag = document.createDocumentFragment();

    flag.appendChild(DocHeader.get());

    Doc.clearDivs();

    for (let i = 0; i < Doc.lines.length; i++) {
      const div = Chunk.create(i);
      flag.appendChild(div);

      Doc.getDivs().push(div);
    }

    lPanel.innerHTML = "";
    lPanel.appendChild(flag);

    DocHeader.calcHeight();

    for(let i = 0; i < Doc.getLines().length; i++){
      TextBody.resetParaHeights(i);
      TextBody.resetCommentPos(i);
      TextBody.resetResponsePos(i);
    }
    AudioInput.showPlayLine();
  }

  static speaker(){
    Speaker.get().forEach(data => {
      speakers.appendChild(Speaker.create(data.name));
    });
  }

  static config(){
    configList.innerHTML = "";
    for(const s of Config.schema){
      const item = Elem.create("div", {cl: "config-item"});
      let control="";
      if(s.type==="checkbox"){
        control=`<label class="checkbox"><input type="checkbox"></label>`;
      }else if(s.type==="text"){
        control=`<label class="textinput"><input type="text"></label>`;
      }else if(s.type==="select"){
        control=`<label class="select"><select>${s.options.map(o=>`<option value="${o}" ${o===working[s.key]?"selected":""}>${o}</option>`).join("")}</select></label>`;
      }else if(s.type==="multiselect"){
        control=`<label class="multiselect"><select multiple>${s.options.map(o=>`<option value="${o}" ${working[s.key].includes(o)?"selected":""}>${o}</option>`).join("")}</select></label>`;
      }

      const left = Elem.create("div", {cl: "left"});
      const label = Elem.create("div", {cl: "label"});
      label.textContent = s.name;
      const hint = Elem.create("div", {cl: "hint"});
      hint.textContent = s.hint;

      left.appendChild(label);
      left.appendChild(hint);

      item.appendChild(left);
      item.innerHTML += control;

      configList.appendChild(item);
    }

    configList.querySelectorAll("input,select").forEach( el => {
      el.addEventListener("change", e => {
        const key=e.target.dataset.key;
        if(e.target.type==="checkbox") working[key]=e.target.checked;
        else if(e.target.multiple) working[key]=Array.from(e.target.selectedOptions).map(o=>o.value);
        else working[key]=e.target.value;
      });
    });
  }

  static syncRowHeights() {
    // const lDivs = lSide.divs;
    // const rDivs = rSide.divs;

    for(let i = 0; i < Doc.getDivs().length; i++){
      // const lDiv = lDivs[i];
      // // const rDiv = rDivs[i];
      
      // lDiv.style.height = "auto";
      // // rDiv.style.height = "auto";

      // // const maxHeight = Math.max(lDiv.offsetHeight, rDiv.offsetHeight);
      // // lDiv.style.height = maxHeight + 'px';
      // lDiv.style.height = lDiv.offsetHeight + 'px';
      // rDiv.style.height = maxHeight + 'px';
    }
  }
}