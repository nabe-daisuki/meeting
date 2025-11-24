class PDFViewer {
  static pdf = null;
  static scale = null;
  static pageCanvases = [];
  static pageTexts = {};
  static isEnabled = false;
  static isPanning = false;
  static pan = {
    startX: 0,
    startY: 0,
    scrollL: 0,
    scrollT: 0
  }
  
  static prevPdf = {
    caseid: "",
    name: null,
    size: 0
  }
  static scroll = {
    top: 0,
    left: 0
  }
  static pageNum = 1;

  static initProp(){
    this.prevPdf.caseid = "";
    this.prevPdf.name = null;
    this.prevPdf.size = 0;
    this.scroll.top = 0;
    this.scroll.left = 0;
    this.pageNum = 1;
  }

  static init(){
    pdfjsLib.GlobalWorkerOptions.workerSrc = "js/pdfjs/pdf.worker.min.js";
    this.scale = 1;

    zoomInBtn.addEventListener("click", async() => {
      if(!this.pdf) return;
      this.scale += 0.1;
      await this.readerAllPages(this.pdf, true);
    });
    zoomOutBtn.addEventListener("click", async() => {
      if(!this.pdf) return;
      this.scale = Math.max(0.2, this.scale - 0.2);
      await this.readerAllPages(this.pdf, true);
    });

    moveTopPage.addEventListener("click", () => {
      this.movePage(1);
    });
    movePrevPage.addEventListener("click", () => {
      const current = this.getCurrentPage();
      if(current <= 1) return; 
      this.movePage(current - 1);
    });
    currentPageNum.addEventListener("input", e => {
      const num = parseInt(e.target.value);
      if(Number.isNaN(num)) return;
      if(num > this.pdf.numPages || num <= 0) return;
      this.movePage(num);
    });
    moveNextPage.addEventListener("click", () => {
      const current = this.getCurrentPage();
      if(current >= this.pdf.numPages) return;
      this.movePage(current + 1);
    });
    moveBottomPage.addEventListener("click", () => {
      this.movePage(this.pdf.numPages);
    });
    pagePostBtn.addEventListener("click", () => {
      if(TextBody.selection.start === -1) return;
      const page = `添付資料「${this.prevPdf.name}」の${this.pageNum}ページ目`;
      const i = Selection.idx;
      TextBody.insert(page, i);
    });

    pdfView.addEventListener("mousedown", e => {
      this.isPanning = true;
      pdfView.classList.add("panning");

      this.pan.startX = e.pageX - pdfView.offsetLeft;
      this.pan.startY = e.pageY - pdfView.offsetTop;
      this.pan.scrollL = pdfView.scrollLeft;
      this.pan.scrollT = pdfView.scrollTop;
    });
    pdfView.addEventListener("mouseup", () => {
      this.isPanning = false;
      pdfView.classList.remove("panning");
    });
    pdfView.addEventListener("mousemove", e => {
      if(!this.isPanning) return;

      const x = e.pageX - pdfView.offsetLeft;
      const y = e.pageY - pdfView.offsetTop;

      const walkX = (x - this.pan.startX) * -1;
      const walkY = (y - this.pan.startY) * -1;

      pdfView.scrollLeft = this.pan.scrollL + walkX;
      pdfView.scrollTop = this.pan.scrollT + walkY;
    });

    pdfView.addEventListener("scroll", () => {
      if(!this.pdf) return;
      this.updateCurrentPage();
      this.scroll.top = pdfView.scrollTop;
      this.scroll.left = pdfView.scrollLeft;
    });

    pdfCloseBox.addEventListener("click", () => {
      this.hide();
    });
  }

  static deletePDF(){
    pdfView.innerHTML = "";
  }

  static async inputPDF(file){
    const ext = file.name.slice(-3).toLowerCase();
    if(ext !== "pdf" || file.type !== "application/pdf"){
      alert(`ドロップされた拡張子は「.${ext}」です。ファイル(.pdf)をドロップ下さい。`);
      return;
    }

    const caseId = CRList.loadingPDFCaseId;
    const filenameWithoutExt = file.name.slice(0, -4);
    const filesize = file.size;
    if(CRList.isDuplicatedPDF(caseId, filenameWithoutExt, filesize)){
      const buf = CRList.getAttachmentBin(caseId, filenameWithoutExt);
      if(!buf) return;
      await this.loadPDF(buf);
      const attachment = CRList.getAttachment(caseId, filenameWithoutExt);
      this.prevPdf.caseid = caseId;
      this.prevPdf.name = filenameWithoutExt;
      this.prevPdf.size = attachment.size;
      return;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async ev => {
        try{
          const buf = ev.target.result;
          const copyBuf = structuredClone(buf);
          await this.loadPDF(buf);
          CRList.addAttachment(filenameWithoutExt, filesize, copyBuf);
          this.prevPdf.caseid = caseId;
          this.prevPdf.name = filenameWithoutExt;
          this.prevPdf.size = filesize;
          resolve(file.name);
        } catch(err){
          console.error(err);
          resolve(null);
        }
      };
      reader.onerror = resolve(null);
      reader.readAsArrayBuffer(file);
    });
  }

  static async loadPDF(_data){
    await pdfjsLib.getDocument({data: _data}).promise.then(async(pdfDoc) => {
      this.pdf = pdfDoc;
      await this.readerAllPages(this.pdf, false);

      totalPageNum.textContent = this.pdf.numPages;
    });
    this.show();
  }

  static show(){
    playbackBox.classList.add("slim");
    audioController.classList.add("hide");
    userTool.classList.add("hide");

    pdfViewer.classList.remove("hide");
    mainToolsArea.classList.add("hide");

    Panel.setEditorPanelH();
    
    SubTools.setPreReplaceH();
    SubTools.setCaseContentH();

    CRList.pdfLoaderDisableSticky();

    this.isEnabled = true;
  }

  static hide(){
    playbackBox.classList.remove("slim");
    audioController.classList.remove("hide");
    userTool.classList.remove("hide");
    
    pdfViewer.classList.add("hide");
    mainToolsArea.classList.remove("hide");

    Panel.setEditorPanelH();
    
    SubTools.setPreReplaceH();
    SubTools.setCaseContentH();

    CRList.pdfLoaderEnableSticky();

    this.isEnabled = false;
  }

  static clearPageCanvases(){
    this.pageCanvases.length = 0;
  }
  static clearPageTexts(){
    this.pageTexts = {};
  }

  static movePage(num){
    const target = this.pageCanvases.find(p => p.pageNum === num);
    if(target) target.wrapper.scrollIntoView({block: "start"});
  }

  static async readerAllPages(pdfDoc, preservePage = true){
    let currentPageBefore = 1;
    if(preservePage) currentPageBefore = this.getCurrentPage();

    const flag = document.createDocumentFragment();
    this.clearPageTexts();
    this.clearPageCanvases();

    for(let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++){
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({scale: this.scale});

      const wrapper = Elem.create("div", {cl: "page-wrapper"});

      const canvas = Elem.create("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      wrapper.appendChild(canvas);
      flag.appendChild(wrapper);

      this.pageCanvases.push({canvas, wrapper, pageNum});

      await page.render({canvasContext: ctx, viewport}).promise;

      const textContent = await page.getTextContent();
      this.pageTexts[pageNum] = textContent.items
        .map(i => i.str.trim())
        .filter(str => str.length > 0);
    }
    
    this.deletePDF();
    pdfView.appendChild(flag);

    this.movePage(currentPageBefore);
    const interval = setInterval(() => {
      console.log(this.isLayOutUnstable());
      if(this.isLayOutUnstable()) return;
      clearInterval(interval);
      this.updateCurrentPage();
    }, 100);
  }

  static showPageText(pageNum){
    pdfTexts.innerHTML = "";
    const lines = (this.pageTexts[pageNum] || []).filter(t => t.trim().length > 0);
    for(const line of lines){
      const text = Elem.createT(line);
      pdfTexts.appendChild(text);
    }
  }

  static isLayOutUnstable(){
    let lastTop = null;

    for (const { wrapper } of this.pageCanvases) {
      const top = wrapper.getBoundingClientRect().top;

      if (lastTop !== null && top === lastTop) {
        return true;
      }
      lastTop = top;
    }
    return false;
  }

  static getCurrentPage(){
    const pdfViewTop = pdfView.getBoundingClientRect().top;
    let current = 1;

    for(const { wrapper, pageNum } of this.pageCanvases){
      const wrapperTop = wrapper.getBoundingClientRect().top - pdfViewTop;
      if(wrapperTop <= 20) current = pageNum;
      else break;
    }
    return current;
  }

  static updateCurrentPage(){
    const current = this.getCurrentPage();
    currentPageNum.value = current;
    this.showPageText(current);
    this.pageNum = current;
  }

  static initScroll(){
    pdfView.scrollTop = this.scroll.top;
    pdfView.scrollLeft = this.scroll.left;
  }
}