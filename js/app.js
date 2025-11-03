const isTest = true;

const header = document.getElementById("header");

const editorPanel = document.getElementById("editor-panel");
const fileDropOverlay = document.getElementById('file-drop-overlay');

const lPanel = document.getElementById('left-panel');
const audio = document.getElementById("audio");
const volumeSlider = document.getElementById("volume-slider");
const volumeLabel = document.getElementById("volume-label");
const speedSlider = document.getElementById("speed-slider");
const speedLabel = document.getElementById("speed-label");

const config = document.getElementById("config");

const audioFileInput = document.getElementById("audio-file-input");
const audioFileName = document.getElementById("audio-file-name");
const autoScrollCheckbox = document.getElementById('auto-scroll');

let isWindowBlur = false;
let isWindowResize = false;

const checkedSetGreen = document.getElementById("checked-set-green");
const checkedShow = document.getElementById("checked-show");
const checkedHide = document.getElementById("checked-hide");

const saveBtn = document.getElementById("save-btn");
const namedSaveBtn = document.getElementById("named-save-btn");

const exportGreen = document.getElementById('export-green');

const reloadFileInput = document.getElementById('reload-file-input');

const textFileInput = document.getElementById("text-file-input");
const textFileName = document.getElementById("text-file-name");

const menuContainer = document.getElementById('menu');

const speakers = document.getElementById("speakers");

const badges = document.getElementById("badges");
const attachmentBadge = document.getElementById("attachment-badge");
const commentBadge = document.getElementById("comment-badge");
const startBadge = document.getElementById("start-badge");

const repInfosUl = document.getElementById("repinfos");

const configOverlay=document.getElementById("config-overlay");
const configList=document.getElementById("config-list");
const configOk=document.getElementById("config-ok");
const configCancel=document.getElementById("config-cancel");
const configX=document.getElementById("config-x");

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

let docHeader = null;

window.onload= () =>{
  setEditorPanelH();

  GijiInput.init();
  TextInput.init();
  AudioInput.init();
  Effector.init();
  Scroll.init();
  Save.init();
  Load.init();
  // Speaker.init();
  Config.init();
  Badge.init();
  Export.init();
  AudioController.init();
  
  ContextMenu.set();
}

window.addEventListener("resize", () => {
  isWindowResize = true;
  setEditorPanelH();
  Render.syncRowHeights();

  for(let i = 0; i < Doc.getLines().length; i++){
    TextBody.resetCharsPerPara(i);
    TextBody.resetParaHeights(i);
    TextBody.resetCommentPos(i);
    TextBody.resetResponsePos(i);
  }
  isWindowResize = false;
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

document.addEventListener('click', () => {
  menuContainer.style.display = 'none';
  TextBody.visible();
});

window.addEventListener("mouseup", e => {
  if(e.button !== 0) return;

  if(TextBody.dragover.i === -1){
    for(let j = 0; j < Doc.getDivs().length; j++){
      Array.from(Doc.getTextBodyBG(j).querySelectorAll("span")).forEach((_, k) => {
        TextBody.unemphasizeText(j, k);
      });
    }
    TextBody.initDragover();
  }  
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