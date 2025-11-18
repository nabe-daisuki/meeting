class SeekLabel {
  static pos = [];

  static create(_pos){
    const label = Elem.create("div", {cl: "seek-label"});
    const percent = Convert.secToPercent(_pos, AudioFile.getDuration());
    const sliderW = AudioController.getPlaybackSliderW();
    const sliderMarginLeft = AudioController.getPlaybackSliderMarginLeft();

    const left = (sliderW * percent * 0.01) + sliderMarginLeft;
    label.style.left = `${left}px`;
    label.addEventListener("click", () => {
      AudioController.setTime(_pos);
      AudioController.setPlaybackLabel(_pos);
      AudioState.setPos(_pos);
    });
    console.log(left);

    const labelImg = Elem.create("img", {cl: "seek-label-img"});
    labelImg.src = "img/theme/dark/yellow_label.png";

    label.appendChild(labelImg);

    this.add(_pos);
    return label;
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