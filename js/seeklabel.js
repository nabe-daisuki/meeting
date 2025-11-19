class SeekLabel {
  static pos = [];

  static create(_pos){
    const label = Elem.create("div", {cl: "seek-label"});

    label.style.left = this.calcLeft(_pos);
    label.dataset.pos = _pos;
    label.addEventListener("click", () => {
      AudioController.setTime(_pos);
      AudioController.setPlaybackLabel(_pos);
      AudioState.setPos(_pos);
    });
    label.addEventListener("contextmenu", e => {
      this.remove(e.target.dataset.pos);
      e.target.remove();
    });

    const labelImg = Elem.create("img", {cl: "seek-label-img"});
    labelImg.src = "img/theme/dark/yellow_label.png";

    label.appendChild(labelImg);

    this.add(_pos);
    return label;
  }

  static calcLeft(pos){
    const percent = Convert.secToPercent(pos, AudioFile.getDuration());
    const sliderW = AudioController.getPlaybackSliderW();
    const sliderMarginLeft = AudioController.getPlaybackSliderMargin();
    const sliderThumbW = AudioController.getPlaybackSliderThumbW();
    const sliderThumbBorderW = AudioController.getPlaybackSliderThumbBorderW();

    const left = (sliderW * percent * 0.01)
      + sliderMarginLeft
      + (sliderThumbW / 2 + sliderThumbBorderW) * (-percent + 50) / 50;
    
    return `${left}px`;
  }

  static reposition(){
    if(this.pos.length === 0)return;

    for(let j = 0; j < this.pos.length; j++){
      const label = Array.from(document.querySelectorAll(".seek-label")).find(l => {
        return l.dataset.pos === this.pos[j].toString();
      });

      label.style.left = this.calcLeft(this.pos[j]);
    }
  }

  static add(_pos){
    this.pos.push(_pos);
  }
  static remove(_pos){
    const idx = this.pos.indexOf(_pos);
    if(idx === -1) return;
    this.pos.splice(idx, 1);
  }

  static exists(_pos){
    return this.pos.includes(_pos);
  }
}