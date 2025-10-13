class LineDiv {
  static getPaddingTop(){
    return parseInt(getComputedStyle(lSide.divs[0]).paddingTop.slice(0, -2));
  }
  static getBorderWidth(){
    return parseInt(getComputedStyle(lSide.divs[0]).borderWidth.slice(0, -2));
  }

  static create(Side, idx){
    const line = Side.lines[idx];
    const div = document.createElement('div');
    div.className = "line";
    if(line.disabled) div.classList.add("disabled");
    if(line.color === "g") div.classList.add("green-hatch");
    if(line.color === "r") div.classList.add("red-hatch");
    div.oncontextmenu = e => {
      Hatching.green(Side, idx);
      e.preventDefault();
    }

    const effector = Effector.create(Side, idx, line.disabled);

    const tsAndBadged = document.createElement("div");
    tsAndBadged.style.display = "flex";
    tsAndBadged.style.flexDirection = "column";

    const ts = TimeStamp.create(Side, idx);

    const badged = Badged.create(Side, idx);

    const textSpan = TextSpan.create(Side, idx);

    const invalidBtn = InvalidBtn.create(Side, div, idx);

    // div.addEventListener("dragover", e => e.preventDefault())
    div.addEventListener("drop", e => {
      const droppedData = e.dataTransfer.getData("text/plain");
      if(droppedData === "ATTACHMENT_BADGE"){
        if(line.badges.includes("a")) return;
        const smallBadge = document.createElement("div");
        smallBadge.className = "badge small-badge attachment-badge";
        const batchIcon = document.createElement("img");
        batchIcon.src = "img/attachment.png";

        smallBadge.appendChild(batchIcon);
        badged.appendChild(smallBadge);

        console.log(badged);
        line.badges += "a";
        line.badges = line.badges.split("").sort().join("");

        const bufElem = badged.querySelectorAll("badge");
        line.badges.split("").forEach(keyword => {
          if(keyword === "n") return;
          const badge = Array.from(bufElem)
            .filter(div => {
              const parts = div.querySelector("img").src.split("/")[1];
              const part = parts[0];
              return part === keyword;
            });
          badged.appendChild(badge);
        });
      }
    });
    
    tsAndBadged.appendChild(ts);
    tsAndBadged.appendChild(badged);

    div.appendChild(effector);
    div.appendChild(tsAndBadged);
    div.appendChild(textSpan);
    div.appendChild(invalidBtn);

    return div;
  }
}