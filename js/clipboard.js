class ClipBoard {
  static async hasText() {
    try {
      const text = await navigator.clipboard.readText();
      return text.length > 0; // 文字があるなら true
    } catch (err) {
      console.error("クリップボード読み取り失敗:", err);
      return false;
    }
  }
}