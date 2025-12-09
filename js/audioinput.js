class AudioInput {
  static init() {
    audioFileInput.addEventListener("change", async(e) => {
      const file = e.target.files[0];
      if(!file){
        alert("音声ファイルを開けませんでした。");
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      this.input(file.name, bytes);
    });

    audio.addEventListener("play", () => {
      AudioState.play();
    });

    audio.addEventListener("pause", () => {
      if(isWindowBlur)return;
      AudioState.pause();
    });

    audio.addEventListener("volumechange", e => {
      if(e.target.muted) AudioState.mute();
      else AudioState.unmute();
    });

    audio.addEventListener("timeupdate", () => {
      const curTime = AudioState.getTime();
      const percent = Convert.secToPercent(curTime, AudioFile.getDuration());
      AudioController.updatePlaybackSlider(percent);
      AudioController.setPlaybackLabel(curTime);
      AudioState.setPos(curTime);
      if(Scroll.isAuto){
        let offset = 0;
        const i = Doc.getLines().findIndex( (l, j) => {
          if(j !== 0){
            offset = Doc.getLine(j - 1).endSec;
          }
          return offset <= curTime && curTime <= l.endSec;
        });
        Scroll.scrollToLine(i);
      }
      this.showPlayLine();

      if(!outputCanMoveAudioBtn.classList.contains("disabled") && !Output.isDirectEditing){
        let offset = 0;
        const i = Doc.getLines().findIndex( (l, j) => {
          if(j !== 0){
            offset = Doc.getLine(j - 1).endSec;
          }
          return offset <= curTime && curTime <= l.endSec;
        });
        if(i != null && Doc.getEditedText(i)){
          Selection.relocateHighlight(i);
          const textLen = Doc.getTextBody(i).value.length;
          TextBody.select(i, textLen, textLen);
          Output.scroll();
        }
      }
    });

    audio.addEventListener("loadedmetadata", () => {
      let totalSeconds = Math.floor(audio.duration);
      const hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      const formattedTime = `${hours}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      AudioFile.setLen(formattedTime);
      AudioFile.setDuration(audio.duration);
      AudioController.setDuration(audio.duration);
    });

    audio.addEventListener("focus", () => audio.blur());
  }

  static isPlayingLine(time, line){
    return time >= line.startSec && time < line.endSec && !line.disabled
  }

  static showPlayLine() {
    for(let i = 0; i < Doc.getLines().length; i++){
      if(this.isPlayingLine(AudioState.getTime(), Doc.getLine(i))) Hatching.yellow(Doc.getDiv(i));
      else Hatching.remove(i, true);
    }
  }

  static input(filename, bytes){
    const byteLen = bytes.byteLength;

    const audioData = {length: ""};
    audioData.bytes = bytes;
    audioData.b = byteLen.toLocaleString();
    audioData.kb = (byteLen / 1024).toFixed(2);
    audioData.mb = (byteLen / 1024 / 1024).toFixed(2);
    audioData.name = filename;

    AudioFile.set(audioData);

    const blob = Convert.bytesToBlob(AudioFile.getBytes());
    const url = URL.createObjectURL(blob);
    audio.src = url;
    audio.load();

    const initVolume = AudioState.getInitVolume();
    AudioController.setVolumeLabel(initVolume);
    AudioController.updateVolumeSlider(initVolume);
    AudioController.setVolume(initVolume);
    AudioState.setVolume(initVolume);

    const initSpeed = AudioState.getInitSpeed();
    AudioController.setSpeedLabel(initSpeed);
    AudioController.updateSpeedSlider(initSpeed);
    AudioController.setSpeed(initSpeed);
    AudioState.setSpeed(initSpeed);

    Meta.resetTitle();
  }

  static async getBytes(){
    const url = audio.src;
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    return bytes;
  }
}