class Badge {
  static init(){
    attachmentBadge.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", "ATTACHMENT_BADGE");
      e.dataTransfer.effectAllowed = "copy";
    });

    commentBadge.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", "COMMENT_BADGE");
      e.dataTransfer.effectAllowed = "copy";
    });
  }
}