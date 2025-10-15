class Speaker {
  static init(){
    moriSpeaker.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", "森_SPEAKER");
      e.dataTransfer.effectAllowed = "copy";
    });

    tanakaSpeaker.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", "田中_SPEAKER");
      e.dataTransfer.effectAllowed = "copy";
    });

    satoSpeaker.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", "佐藤_SPEAKER");
      e.dataTransfer.effectAllowed = "copy";
    });
  }
}