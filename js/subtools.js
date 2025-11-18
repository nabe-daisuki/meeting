class SubTools {
  static init(){
    subToolTabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        subToolTabButtons.forEach(b => b.classList.remove("active"));
        subToolTabContents.forEach(c => c.classList.remove("active"));

        // 選択したタブをアクティブ
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
      });
    });
  }
}