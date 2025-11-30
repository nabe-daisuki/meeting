class System {
  /**
   * アラートを出し、偽を返す
   * @param {string} msg 出力メッセージ
   * @returns {boolean} falseのみ
   */
  static fail(msg){
    alert(msg);
    return false;
  }

  /**
   * 警告をコンソールに出力し、偽を返す
   * @param {string} msg 警告メッセージ 
   * @returns {boolean} falseのみ
   */
  static warn(msg){
    console.warn(msg);
    return false;
  }

  /**
   * エラーアラートを出し、プログラムを止める
   * @param {string} msg エラーメッセージ 
   */
  static err(msg){
    alert(msg);
    throw new Error(msg);
  }
}