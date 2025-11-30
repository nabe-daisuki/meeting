class Type {
  static isArr(v){
    return Array.isArray(v);
  }
  static isObj(v){
    return v !== null && typeof v === "object" && v.constructor === Object;
  }
}