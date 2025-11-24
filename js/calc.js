class Calc {
  static sub(a, b){
    const num1 = Array.isArray(a) ? this.sumArr(a) : a;
    const num2 = Array.isArray(b) ? this.sumArr(b) : b;
    return num1 - num2;
  }

  static sumArr(arr){
    return arr.reduce((acc, cur) => acc + cur, 0);
  }
}