class Badged {
  static target = ["a", "d", "s"];
  static create(i){
    const line = Doc.getLine(i);

    const elem = Elem.create("div", {cl: `badged BADGED_${Theme.get()}`});
    if(line.hided) elem.style.display = "none";
    elem.addEventListener("dragover", e => e.preventDefault());
    return elem;
  }

  static init(i){
    this.set(i, []);
  }

  static set(i, htmls){
    const badged = Doc.getBadged(i);
    badged.innerHTML = "";
    
    htmls.forEach( html => {
      badged.appendChild(html);
    });
  }

  static can(t){
    return this.target.includes(t.slice(0, 1).toLowerCase())
  }

  static createBadges(i){
    return Doc.getBadges(i).split("").filter(c => c !== "n").map( c => {
      return Badge.createSmall(i, c);
    });
  }
}