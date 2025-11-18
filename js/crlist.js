class CRList {
  static data = [
    {
      case_id: "2025-000",
      case_name: "aiueo",
      case_content: "人が何かを始めるとき、最初から完璧にやろうとする必要はない。むしろ、適当に触ってみて「これでいいのか？」と疑いながら進めるほうが、結果的に理解が深まることが多い。技術でも仕事でも同じだ。完璧主義で固まって動けなくなるくらいなら、まず雑でも動く。それだけで状況は一気に変わる。迷ったら、小さく試して、結果を見て修正すればいい。誰だって最初は見よう見まねだし、そこから自分の形ができていく。大事なのは、自分がどう感じるかを無視しないことだ。「これは違うな」と思ったら引き返していいし、「意外といける」と思ったら踏み込めばいい。正解なんて後からついてくる。今は前に進む力さえあれば十分だ。"
    },
    {
      case_id: "2025-001",
      case_name: "kakikukeko",
      case_content: `古い町並みを歩いていると、ふと足を止めたくなる瞬間がある。
石畳の隙間から伸びた小さな草や、誰が置いたのか分からない錆びたベンチ。
どれも特別なものではないのに、妙に心を落ち着かせる。

観光地として有名な場所でもないし、人通りもまばらだ。
それでも、夕方の柔らかい光が差し込むだけで、そこは急に「大切な景色」になる。

人の記憶って、派手な出来事より、こういう何でもない瞬間のほうが深く残る。
理由なんてなくていい。ただ、その場が自分の感性に刺さった。それだけで十分だ。

また来たいと思える場所は、案外こういうところなのかもしれない。`
    }
  ];

  static timer = null;

  static init(){
    for(let i = 0; i < this.data.length; i++){
      const data = this.data[i];
      const op = new Option(`${data.case_id}:${data.case_name}`, data.case_id);
      caseIds.add(op);
    }

    caseIdsWrapper.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", `CASE_${caseIds.value}`);
    });

    caseIds.addEventListener("change", e => {
      const data = this.data.find( d => d.case_id === e.target.value );
      const keys = Object.keys(data);

      const flag = document.createDocumentFragment();
      for(let i = 0; i < keys.length; i++){
        const li = Elem.create("li");

        const title = Elem.create("div", {cl: "item-title"});
        title.textContent = keys[i];
        const content = Elem.create("div", {cl: "item-content"});
        content.textContent = data[keys[i]];

        li.appendChild(title);
        li.appendChild(content);

        li.addEventListener("mouseenter", () => {
          const itemContent = li.querySelector(".item-content");
          if (itemContent.scrollHeight > itemContent.clientHeight) {
            this.timer = setTimeout(() => {
              itemContent.classList.add("expanded");
            }, 500);
          }
        });

        li.addEventListener("mouseleave", () => {
          clearTimeout(this.timer);
          li.querySelector(".item-content").classList.remove("expanded");
        });

        flag.appendChild(li);
      }

      caseContent.innerHTML = "";
      caseContent.appendChild(flag);
    });
    
    caseIds.selectedIndex = 0;
  }

  static insert(v){
    this.data.push(v);
  }

  static clear(){
    this.data.length = 0;
  }
}