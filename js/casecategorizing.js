class CaseCategorizing {
  static ctx = null;
  static drawing = false;
  static currentPoints = [];
  static paths = [];
  static currentHexColor = null;
  static CASE_ID_SEPARATOR = " / ";
  static CANVAS_W = 1810;
  static CANVAS_H = 634;

  static hide(){
    caseCategorizingOverlay.classList.add("hide");
  }
  static show(){
    caseCategorizingOverlay.classList.remove("hide");
  }

  static getCategoryResultItemW(){
    const categoryResultItem = document.querySelector(".category-result-item");
    return categoryResultItem.clientWidth
      - parseFloat(getComputedStyle(categoryResultItem).paddingLeft) * 2;
  }

  static getCategoryResultColorOffsetW(){
    return document.querySelector(".category-result-color").offsetWidth;
  }

  static getCategoryResultItemGap(){
    return parseFloat(getComputedStyle(document.querySelector(".category-result-item")).gap);
  }

  static setCategoryResultCaseIdsMaxW(){
    document.querySelectorAll(".category-result-case-ids")
      .forEach(el => 
        el.style.maxWidth = `${this.getCategoryResultItemW()
          - this.getCategoryResultColorOffsetW()
          - this.getCategoryResultItemGap()}px`
      );
  }

  static init(){
    this.ctx = categorizingCanvas.getContext("2d");
    this.currentHexColor = Convert.rgbToHex(
      ...Convert.rgbSyntaxToRGB(document.querySelector(".category-color-btn").style.backgroundColor)
    );

    categorizingCanvas.addEventListener("mouseenter", () => {
      drawPointer.classList.remove("hide");
    });

    categorizingCanvas.addEventListener("mouseleave", () => {
      drawPointer.classList.add("hide");
    });

    categorizingCanvas.addEventListener("mousedown", e => {
      if(e.button === 2) return;
      this.drawing = true;
      this.currentPoints.length = 0;
      this.currentPoints.push(this.getPos(e));
    });

    categorizingCanvas.addEventListener("mousemove", e => {
      const pos = this.getPos(e);
      this.trackPointer(pos);
      this.updateHover(pos);

      if(!this.drawing) return;
      this.currentPoints.push(pos);
      this.drawTemp();
    });

    categorizingCanvas.addEventListener("mouseup", e => {
      if(!this.drawing) return;
      this.drawing = false;

      if(this.currentPoints.length < 3) return;

      const p2d = this.buildPath2D(this.currentPoints);
      this.paths.push({
        color: this.currentHexColor,
        points: this.currentPoints,
        path2d: p2d,
        hovered: false
      });

      this.drawAll();
      this.updateResult();

      const duplicatedIds = this.getDuplicatedCaseIds();

      document.querySelectorAll(".be-categorized-item").forEach(el => {
        const isDuplicated = duplicatedIds.includes(el.dataset.caseid);
        el.classList.toggle("duplicated", isDuplicated);
      });

      categoryOKBtn.classList.toggle("disabled", duplicatedIds.length !== 0);
    });

    categorizingCanvas.addEventListener("contextmenu", e => {
      e.preventDefault();
      const pos = this.getPos(e);
      for(let j = this.paths.length - 1; j >= 0; j--){
        if(!this.ctx.isPointInPath(this.paths[j].path2d, pos.x, pos.y)) continue;
        this.paths.splice(j, 1);
        break;
      }

      this.drawAll();
      this.updateResult();
      
      const duplicatedIds = this.getDuplicatedCaseIds();

      document.querySelectorAll(".be-categorized-item").forEach(el => {
        const isDuplicated = duplicatedIds.includes(el.dataset.caseid);
        el.classList.toggle("duplicated", isDuplicated);
      });

      categoryOKBtn.classList.toggle("disabled", duplicatedIds.length !== 0);
    });

    document.querySelectorAll(".category-color-btn").forEach( btn => {
      btn.addEventListener("click", () => {
        this.currentHexColor = btn.dataset.color;
        drawPointer.style.backgroundColor = this.currentHexColor;
        document.querySelectorAll(".category-color-btn").forEach( b => {
          b.classList.remove("active");
        });
        btn.classList.add("active");
      });
      btn.dataset.color = Convert.rgbToHex(...Convert.rgbSyntaxToRGB(btn.style.backgroundColor));

      const categoryResultItem = Elem.create("div", {cl: "category-result-item"});

      const categoryResultColor = Elem.create("div", {cl: "category-result-color"});
      categoryResultColor.style.backgroundColor = btn.dataset.color;
      categoryResultColor.dataset.color = btn.dataset.color;
      categoryResultColor.addEventListener("mousemove", e => {
        const myCaseIds = e.target.parentElement.querySelector(".category-result-case-ids")
          .textContent
          .split(this.CASE_ID_SEPARATOR);
        
        [...document.querySelectorAll(".be-categorized-item")]
          .filter(el => myCaseIds.includes(el.dataset.caseid))
          .forEach(el => el.classList.add("emphasize"));
      });
      categoryResultColor.addEventListener("mouseleave", () => {
        document.querySelectorAll(".be-categorized-item").forEach(el => {
          el.classList.remove("emphasize");
        });
      });

      const categoryResultCaseIds = Elem.create("div", {cl: "category-result-case-ids"});

      categoryResultItem.appendChild(categoryResultColor);
      categoryResultItem.appendChild(categoryResultCaseIds);

      categoryResult.appendChild(categoryResultItem);
    });

    categoryOKBtn.addEventListener("click", () => {
      if(categoryOKBtn.classList.contains("disabled")){
        alert(`2つ以上のグループに含まれる管理番号があります。
[ ${this.getDuplicatedCaseIds().join(this.CASE_ID_SEPARATOR)} ]
`);
      }else{
        caseCategorizingOverlay.classList.add("hide");

        if(CRList.group.length !== 0 && CRList.compressCaseTitles !== 0){
          CRList.compare();
        }else{
          CRList.setGroup(CRList.createGroup());
          CRList.setCompressCaseTitles(CRList.createCompressCaseTitles());
          CRList.init();
        }
      }
    });

    drawPointer.style.backgroundColor = this.currentHexColor;
  }

  static restore(paths){
    this.paths.length = 0;
    this.paths.push(...structuredClone(paths));
    if(this.paths.length === 0) return;

    for(let j = 0; j < this.paths.length; j++){
      this.paths[j].path2d = this.buildPath2D(this.paths[j].points);
    }
  }

  static trackPointer(pos){
    drawPointer.style.left = pos.x + "px";
    drawPointer.style.top = pos.y + "px";
  }

  static createItems(){
    const items = [];
    const crlist = CRList.get();
    for(let j = 0; j < crlist.length; j++){
      const caseId = crlist[j].case_id;
      const item = Elem.create("div", {cl: "be-categorized-item"});
      item.dataset.caseid = caseId;

      const title = Elem.create("div", {cl: "be-categorized-case-id"});
      title.textContent = caseId;
      const name = Elem.create("div", {cl: "be-categorized-case-name"});
      name.textContent = crlist[j].case_name;

      item.appendChild(title);
      item.appendChild(name);

      items.push(item);
    }

    return items;
  }

  static updateHover(pos){
    let hoverdHexColor = null;
    for(let j = this.paths.length - 1; j >= 0; j--){
      const path = this.paths[j];
      if(!this.ctx.isPointInPath(path.path2d, pos.x, pos.y)) continue;
      hoverdHexColor = path.color;
      break;
    }

    for(let j = 0; j < this.paths.length; j++){
      this.paths.hoverd = (hoverdHexColor === this.paths.color);
    }
    this.drawAll();
    if (hoverdHexColor) this.fillGroup(hoverdHexColor);
  }

  static fillGroup(color) {
    this.ctx.save();
    this.ctx.globalCompositeOperation = "source-over";
    for (let p of this.paths) {
      if (p.color === color) {
        this.ctx.fillStyle = Convert.hexToRgba(color, 0.18);
        this.ctx.fill(p.path2d);
      }
    }
    this.ctx.restore();
  }

  static drawAll(){
    this.ctx.clearRect(0, 0, categorizingCanvas.width, categorizingCanvas.height);
    for(let j = 0; j < this.paths.length; j++){
      const path = this.paths[j];
      if(!path.hovered) continue;
      this.ctx.fillStyle = Convert.hexToRgba(path.color, 0.18);
      this.ctx.fill(path.path2d);
    }
    for(let j = 0; j < this.paths.length; j++){
      const path = this.paths[j];
      this.ctx.lineWidth = 10;
      this.ctx.strokeStyle = path.color;
      this.ctx.stroke(path.path2d);
    }
  }

  static drawTemp(){
    if(this.currentPoints.length < 2) return;
    this.ctx.beginPath();
    this.ctx.moveTo(this.currentPoints[0].x, this.currentPoints[0].y);
    for (let j = 0; j < this.currentPoints.length; j++){
      this.ctx.lineTo(this.currentPoints[j].x, this.currentPoints[j].y);
    }
    this.ctx.strokeStyle = Convert.hexToRgba(this.currentHexColor, 0.95);
    this.ctx.lineWidth = 10;
    this.ctx.stroke();
  }

  static buildPath2D(points) {
    const p2d = new Path2D();
    p2d.moveTo(points[0].x, points[0].y);
    for (let p of points) p2d.lineTo(p.x, p.y);
    p2d.closePath();
    return p2d;
  }

  static resize(){
    // const w = categorizingArea.clientWidth;
    // const h = Math.max(beCategorizedItems.clientHeight, categorizingArea.clientHeight);
    categorizingCanvas.width = this.CANVAS_W;
    categorizingCanvas.height = this.CANVAS_H;
    beCategorizedItems.width = Convert.numToPx(this.CANVAS_W);
  }

  static getPos(e){
    const rect = e.target.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  static updateResult(){
    const colors = [...new Set(this.paths.map(p => p.color))];
    const categorizedItems = document.querySelectorAll(".be-categorized-item");
    const result = new Array(colors.length).fill(null).map(v => ({}));
    const canvasRect = categorizingCanvas.getBoundingClientRect();

    for(let j = 0; j < colors.length; j++){
      result[j].color = colors[j];
      result[j].case_ids = [];
      const paths = this.paths.filter(p => p.color === colors[j]);
      for(let k = 0; k < paths.length; k++){
        for(let l = 0; l < categorizedItems.length; l++){
          const rect = categorizedItems[l].getBoundingClientRect();
          const cx = rect.left + rect.width/2 - canvasRect.left;
          const cy = rect.top + rect.height/2 - canvasRect.top;
          if(!this.ctx.isPointInPath(paths[k].path2d, cx, cy)) continue;
          const caseId = categorizedItems[l].querySelector(".be-categorized-case-id").textContent;
          if(result[j].case_ids.includes(caseId))continue;
          result[j].case_ids.push(caseId);
        }
      }
    }

    document.querySelectorAll(".category-result-case-ids")
      .forEach(el => el.textContent = "");

    const categoryResultItems = document.querySelectorAll(".category-result-item");
    for(let j = 0; j < categoryResultItems.length; j++){
      const color = categoryResultItems[j].querySelector(".category-result-color").dataset.color;
      for(let k = 0; k < result.length; k++){
        if(result[k].color !== color) continue;
        const caseIdSpans = result[k].case_ids
          .sort()
          .map(caseId => {
            const span = Elem.create("span");
            span.dataset.caseid = caseId;
            span.textContent = caseId;
            span.addEventListener("mousemove", () => console.log("fdfdfd"))
            span.addEventListener("mouseenter", e => {
              [...document.querySelectorAll(".be-categorized-item")]
                .find(el => el.dataset.caseid === e.target.dataset.caseid)
                .classList.add("emphasize");
            });
            span.addEventListener("mouseleave", e => {
              [...document.querySelectorAll(".be-categorized-item")]
                .find(el => el.dataset.caseid === e.target.dataset.caseid)
                .classList.remove("emphasize");
            });
            return span;
          })
          .map(span => span.outerHTML)
          .join(this.CASE_ID_SEPARATOR);
        const categoryResultCaseIds = categoryResultItems[j].querySelector(".category-result-case-ids");
        categoryResultCaseIds.innerHTML = caseIdSpans;
        this.setMouseEventToSpan();
        break;
      }
    }
  }

  static setMouseEventToSpan(){
    document.querySelectorAll(".category-result-case-ids").forEach(el =>
      el.querySelectorAll("span").forEach(span => {
        span.addEventListener("mouseenter", e => {
          [...document.querySelectorAll(".be-categorized-item")]
              .find(el => el.dataset.caseid === e.target.dataset.caseid)
              .classList.add("emphasize");
        });
        span.addEventListener("mouseleave", e => {
          [...document.querySelectorAll(".be-categorized-item")]
              .find(el => el.dataset.caseid === e.target.dataset.caseid)
              .classList.remove("emphasize");
        });
      })
    );
  }

  static getDuplicatedCaseIds(){
    const mergedCategories = [...document.querySelectorAll(".category-result-case-ids")]
      .reduce( (acc, cur) => {
        if(cur.textContent === "") return acc;
        acc.push(...cur.textContent.split(this.CASE_ID_SEPARATOR));
        return acc;
      }, []);

    const counts = mergedCategories.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

    const duplicates = Object.keys(counts).filter(key => counts[key] > 1);

    return duplicates;
  }
}