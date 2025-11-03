class Replace {
  static table = []

  static set(t){
    this.table.length = 0;
    this.table.push(...t);
  }
}