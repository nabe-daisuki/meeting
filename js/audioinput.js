class AudioInput {
  static isPlaying = false;

  static init() {
    audioFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if(!file){
        alert("音声ファイルを開けませんでした。");
        return;
      }

      let bytes = file.size;
      audioInfo.bytes = bytes.toLocaleString();
      audioInfo.KB = (bytes / 1024).toFixed(2);
      audioInfo.MB = (bytes / 1024 / 1024).toFixed(2);

      audioInfo.fileName = file.name;
      audioFileName.textContent = audioInfo.fileName;

      const url = URL.createObjectURL(file);
      audio.src = url;
      audio.load();

      volumeSlider.value = 10;
      AudioController.updateSliderBackground();
    });

    audio.addEventListener("play", () => {
      this.isPlaying = true;
    });

    audio.addEventListener("pause", () => {
      if(isWindowBlur)return;
      this.isPlaying = false;
    });

    audio.ontimeupdate = () => {
      if(Scroll.isAuto){
        const i = Doc.getLines().findIndex(l => this.isPlayingLine(AudioController.getTime(), l));
        Scroll.scrollToLine(i);
      }
      this.showPlayLine();
    }

    audio.addEventListener("loadedmetadata", () => {
      let totalSeconds = Math.floor(audio.duration);
      const hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      const formattedTime = `${hours}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      audioInfo.length = formattedTime;
    });

    audio.addEventListener("focus", () => audio.blur());
  }

  static isPlayingLine(time, line){
    return time >= line.startSec && time < line.endSec && !line.disabled
  }

  static showPlayLine() {
    for(let i = 0; i < Doc.getLines().length; i++){
      if(this.isPlayingLine(AudioController.getTime(), Doc.getLine(i))) Hatching.yellow(Doc.getDiv(i));
      else Hatching.remove(i, true);
    }
  }

  static inputAudio(buffer, sections){
    const audioBytes = buffer.slice(sections.audio.start, sections.audio.end);
    const byteLen = audioBytes.byteLength;

    audioInfo.bytes = byteLen.toLocaleString();
    audioInfo.KB = (byteLen / 1024).toFixed(2);
    audioInfo.MB = (byteLen / 1024 / 1024).toFixed(2);

    audioInfo.fileName = "aiueo";
    audioFileName.textContent = "aiueo";

    // Blob化して再生
    const blob = new Blob([audioBytes], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    audio.src = url;
    audio.load();

    audio.volume = 0.1;

    volumeSlider.value = 10;
  }
}