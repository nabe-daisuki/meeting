class Elem{
  static create(t, {id = null, cl = null} = {}){
    const elem = document.createElement(t);
    if(id) elem.id = id;
    if(cl) elem.className = cl;
    return elem;
  }

  static createT(text){
    return document.createTextNode(text);
  }
}