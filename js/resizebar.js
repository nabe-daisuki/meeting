class ResizeBar {
  static isDragging = false;

  static init(){
    resizeBar.addEventListener("mousedown", e => {
      this.isDragging = true;
      resizeBar.classList.add("active")
      document.body.classList.add("active");
      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener("mouseup", e => {
      if(!this.isDragging) return;
      this.isDragging = false;
      resizeBar.classList.remove("active");
      document.body.classList.remove("active");
      
      for(let i = 0; i < Doc.getLines().length; i++){
        TextBody.resetCharsPerPara(i);
        TextBody.resetParaHeights(i);
        TextBody.resetMiniBadges(i);
      }

      CRList.setCaseContentLiW();
      CRList.setCaseIdsW();

      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener("mousemove", e => {
      if (!this.isDragging) return;

      const rect = editorPanel.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;

      const min = 50;
      const max = rect.width - 50;

      const leftWidth = Math.min(Math.max(offsetX, min), max);
      const rightWidth = rect.width - leftWidth - resizeBar.offsetWidth;

      lPanel.style.width = leftWidth + "px";
      rPanel.style.width = rightWidth + "px";
      
      CRList.setCaseContentLiW();
      CRList.setCaseIdsW();

      e.preventDefault();
      e.stopPropagation();
    });
  }
}