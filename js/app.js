const isTest = true;

const header = document.getElementById("header");

const editorPanel = document.getElementById("editor-panel");
const fileDropOverlay = document.getElementById('file-drop-overlay');

const lPanel = document.getElementById('left-panel');
// const rPanel = document.getElementById('right-panel');
const audio = document.getElementById("audio");
const volumeSlider = document.getElementById("volume-slider");
const volumeLabel = document.getElementById("volume-label");

const audioFileInput = document.getElementById("audio-file-input");
const audioFileName = document.getElementById("audio-file-name");
const autoScrollCheckbox = document.getElementById('auto-scroll');
// const greenHatchingLeftBtn = document.getElementById("green-hatching-left-btn");
// const greenHatchingRightBtn = document.getElementById("green-hatching-right-btn");

let isWindowBlur = false;

const checkGreenHatch = document.getElementById("checked-green-hatch");
const checkedShow = document.getElementById("checked-show");
const checkedHide = document.getElementById("checked-hide");

const saveBtn = document.getElementById("save-btn");
const namedSaveBtn = document.getElementById("named-save-btn");

const exportGreen = document.getElementById('export-green');

const reloadFileInput = document.getElementById('reload-file-input');

const textFileInput = document.getElementById("text-file-input");
const textFileNames = document.getElementById("text-file-names");

const menuContainer = document.getElementById('menu');

const moriSpeaker = document.getElementById("mori-speaker");
const tanakaSpeaker = document.getElementById("tanaka-speaker");
const satoSpeaker = document.getElementById("sato-speaker");

const attachmentBadge = document.getElementById("attachment-badge");
const commentBadge = document.getElementById("comment-badge");
const startBadge = document.getElementById("start-badge");

const audioInfo = {
  fileName: "",
  bytes: "",
  KB: 0,
  MB: 0,
  length: ""
}

function setEditorPanelH(){
  editorPanel.style.height = `calc(100vh - ${header.offsetHeight}px)`;
}

const lSide = new Side("left");
// const rSide = new Side("right");

window.onload= () =>{
  setEditorPanelH();

  // GijiDrop.init();
  TextInput.init();
  AudioInput.init();
  Hatching.init();
  Effect.init();
  Scroll.init();
  Save.init();
  Load.init();
  Speaker.init();
  Badge.init();
  Export.init();
  AudioController.init();
  
  ContextMenu.set();
}

window.addEventListener("resize", () => {
  setEditorPanelH();
  Render.syncRowHeights();
  for(let i = 0; i < lSide.lines.length; i++){
    TextSpan.resetCharCounts(i);
    TextSpan.resetParagraphs(i);
    TextSpan.resetCommnetPos(i);
  }
});

window.addEventListener("focus", () => {
  isWindowBlur = false;
  setTimeout(() => {
    document.getElementById("inactive-overlay").style.display = "none";
    if(AudioInput.isPlaying) audio.play();
  },500);
});

window.addEventListener("blur", () => {
  if(isTest) return;
  isWindowBlur = true;
  document.getElementById("inactive-overlay").style.display = "flex";
  if(!audio.paused) audio.pause();
});

document.addEventListener('click', function() {
  menuContainer.style.display = 'none';
  TextSpan.initSelection();
});

// fetch("http://localhost:20000", {
//   method: "POST",
//   headers: {
//     "Content-Type": "text/plain; charset=UTF-8" // 文字コードは明示的にUTF-8
//   },
//   body: "cr_downloading"
// })
// .then(response => response.text())
// .then(data => console.log(data))
// .catch(error => console.error(error));
// const url = encodeURIComponent('https://example.com/api/data');
// fetch(`http://localhost:3000/proxy?url=${url}`)
//   .then(res => res.text())
//   .then(data => console.log(data));