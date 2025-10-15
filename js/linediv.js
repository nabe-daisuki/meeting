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
        line.badges += "a";
        line.badges = line.badges.split("").sort().join("");

        // const smallBadge = document.createElement("div");
        // smallBadge.className = "badge small-badge attachment-badge";
        // smallBadge.addEventListener("contextmenu", e => {
        //   e.stopPropagation();
        //   e.preventDefault();
        //   e.target.remove();
        //   line.badges = line.badges.replace("a", "");
        // });
        // const batchIcon = document.createElement("img");
        // batchIcon.src = "img/attachment.png";

        // smallBadge.appendChild(batchIcon);
        // badged.appendChild(smallBadge);
        badged.innerHTML = "";
        // const bufElem = badged.children;
        line.badges.split("").forEach(keyword => {
          if(keyword === "n") return;
          // const badge = Array.from(bufElem)
          //   .find(div => {
          //     const parts = div.querySelector("img").src.split("/")[1];
          //     const part = parts[0];
          //     return part === keyword;
          //   });
          // console.log(badge);
          
          badged.appendChild(this.createSmallBadge(keyword));
        });
      }else if(droppedData === "START_BADGE"){
        if(line.badges.includes("s")) return;
        line.badges += "s";
        line.badges = line.badges.split("").sort().join("");
        // const smallBadge = document.createElement("div");
        // smallBadge.className = "badge small-badge start-badge";
        // smallBadge.addEventListener("contextmenu", e => {
        //   e.stopPropagation();
        //   e.preventDefault();
        //   e.target.remove();
        //   line.badges = line.badges.replace("s", "");
        // });
        // const batchIcon = document.createElement("img");
        // batchIcon.src = "img/start.png";

        // smallBadge.appendChild(batchIcon);
        // badged.appendChild(smallBadge);

        // console.log(badged);

        // const bufElem = badged.querySelectorAll("badge");
        badged.innerHTML = "";
        line.badges.split("").forEach(keyword => {
          if(keyword === "n") return;
          // const badge = Array.from(bufElem)
          //   .find(div => {
          //     const parts = div.querySelector("img").src.split("/")[1];
          //     const part = parts[0];
          //     return part === keyword;
          //   });
            
          // console.log(badge);
          badged.appendChild(this.createSmallBadge(keyword));
        });
      }
      console.log(lSide.lines[idx].badges);
    });
    
    tsAndBadged.appendChild(ts);
    tsAndBadged.appendChild(badged);

    div.appendChild(effector);
    div.appendChild(tsAndBadged);
    div.appendChild(textSpan);
    div.appendChild(invalidBtn);

    return div;
  }

  static createSmallBadge(keyword){
    const smallBadge = document.createElement("div");
    smallBadge.className = "badge small-badge";
    if(keyword === "a"){
      smallBadge.classList.add("attachment-badge");
    }else if(keyword === "s"){
      smallBadge.classList.add("start-badge");
    }
    smallBadge.addEventListener("contextmenu", e => {
      e.stopPropagation();
      e.preventDefault();
      e.target.remove();
      line.badges = line.badges.replace(keyword, "");
    });
    const batchIcon = document.createElement("img");
    
    if(keyword === "a"){
      batchIcon.src = "img/attachment.png";
    }else if(keyword === "s"){
      batchIcon.src = "img/start.png";
    }

    smallBadge.appendChild(batchIcon);
    return smallBadge;
  }
}