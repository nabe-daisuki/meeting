const isTest = true;
const isGijiTest = false;

const header = document.getElementById("header");

const editorPanel = document.getElementById("editor-panel");
const fileDropOverlay = document.getElementById("file-drop-overlay");
const gijiFileInput = document.getElementById("giji-file-input");

const lPanel = document.getElementById("left-panel");
const resizeBar = document.getElementById("resize-bar");
const rPanel = document.getElementById("right-panel");

const audio = document.getElementById("audio");

const playbackBox = document.getElementById("playback-box");

const audioController = document.getElementById("audio-controller");
const volumeBox = document.getElementById("volume-box");
const speedBox = document.getElementById("speed-box");

const playbackSliderBox = document.getElementById("playback-slider-box");
const playbackSlider = document.getElementById("playback-slider");
const volumeSlider = document.getElementById("volume-slider");
const volumeLabel = document.getElementById("volume-label");
const speedSlider = document.getElementById("speed-slider");
const speedLabel = document.getElementById("speed-label");

const autoScrollCheckbox = document.getElementById("auto-scroll");

const currentTime = document.getElementById("current-time");
const durationTime = document.getElementById("duration-time");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const stopBtn = document.getElementById("stop-btn");
const unmuteBtn = document.getElementById("unmute-btn");
const muteBtn = document.getElementById("mute-btn");
const normalSpeedBtn = document.getElementById("normal-speed-btn");

const userTool = document.getElementById("user-tool");
const config = document.getElementById("config");
const help = document.getElementById("help");

const mainToolsArea = document.getElementById("main-tools");

const inputerArea = document.getElementById("inputer");
const textFileInput = document.getElementById("text-file-input");
const audioFileInput = document.getElementById("audio-file-input");
const reloadFileInput = document.getElementById("reload-file-input");
const configInput = document.getElementById("config-input");

let isWindowBlur = false;
let isWindowResize = false;

const effectArea = document.getElementById("effect");
const checkedSetGreen = document.getElementById("checked-set-green");
const checkedShow = document.getElementById("checked-show");
const checkedHide = document.getElementById("checked-hide");
const editedSetGreen = document.getElementById("edited-set-green");

const saveArea = document.getElementById("save");
const saveBtn = document.getElementById("save-btn");
const namedSaveBtn = document.getElementById("named-save-btn");

const openVODBtn = document.getElementById("open-vod");
const openSystemBtn = document.getElementById("open-system"); 

const exportArea = document.getElementById("export");
const configToExport = document.getElementById("config-to-export");
const hatchToExport = document.getElementById("hatch-to-export");
const editedToExport = document.getElementById("edited-to-export");

const showReplaceCandidateBtn = document.getElementById("show-replace-candidate");

const mainToolOpenCloseBtn = document.getElementById("main-tool-open-close");

const pdfViewer = document.getElementById("pdf-viewer");
const pdfControls = document.getElementById("pdf-controls");
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");
const rotateRightBtn = document.getElementById("rotate-right");
const rotateLeftBtn = document.getElementById("rotate-left");
const moveTopPage = document.getElementById("move-top-page");
const movePrevPage = document.getElementById("move-prev-page");
const currentPageNum = document.getElementById("current-page-num");
const totalPageNum = document.getElementById("total-page-num");
const moveNextPage = document.getElementById("move-next-page");
const moveBottomPage = document.getElementById("move-bottom-page");
const printPageBtn = document.getElementById("print-page");
const pagePostBtn = document.getElementById("page-post");
const pdfView = document.getElementById("pdf-view");
const pdfTexts = document.getElementById("pdf-texts");
const pdfCloseBox = document.getElementById("pdf-close-box");

const menuContainer = document.getElementById("menu");

const tabs = document.getElementById("tabs");
const subTools = document.getElementById("sub-tools");

const subToolTabButtons = document.querySelectorAll("#tabs .tab-btn");
const subToolTabContents = document.querySelectorAll("#sub-tools .tab-content");

const speakers = document.getElementById("speakers");

const badges = document.getElementById("badges");
const attachmentBadge = document.getElementById("attachment-badge");
const commentBadge = document.getElementById("comment-badge");
const startBadge = document.getElementById("start-badge");

const caseIdsSelector = document.getElementById("case-ids-selector");
const caseIdsWrapper = document.getElementById("case-ids-wrapper");
const caseIdsHandle = document.getElementById("case-ids-handle");
const caseIds = document.getElementById("case-ids");
const caseIdsSwitcher = document.getElementById("case-ids-switcher");
const prevCaseBtn = document.getElementById("prev-case-btn");
const nextCaseBtn = document.getElementById("next-case-btn");
const categorizeUpdateBtn = document.getElementById("categorize-update-btn");
const caseContent = document.getElementById("case-content");

const output = document.getElementById("output");
const outputZoomInBtn = document.getElementById("output-zoom-in");
const outputZoomOutBtn = document.getElementById("output-zoom-out");
const outputCanMoveAudioBtn = document.getElementById("output-can-move-audio");

const repInfosUl = document.getElementById("repinfos");

const caseCategorizingOverlay = document.getElementById("case-categorizing-overlay");
const categorizingArea = document.getElementById("categorizing-area");
const categorizingCanvas = document.querySelector("#categorizing-area canvas");
const beCategorizedItems = document.getElementById("be-categorized-items");
const drawPointer = document.getElementById("draw-pointer");
const categoryResult = document.getElementById("category-result");
const categoryOKBtn = document.getElementById("category-ok-btn");

const userSelectOverlay = document.getElementById("user-select-overlay");
const userButtons = document.getElementById("user-buttons");

const configOverlay=document.getElementById("config-overlay");
const configList=document.getElementById("config-list");
const configOk=document.getElementById("config-ok");
const configCancel=document.getElementById("config-cancel");
const configX=document.getElementById("config-x");

const shortCutHelper = document.getElementById("shortcut-helper");
const shortCutList = document.getElementById("shortcut-list");

const searchHelper = document.getElementById("search-helper");
const searchContainer = document.getElementById("search-container");
const searchInput = document.getElementById("search-input");
const searchResult = document.getElementById("search-result");
const canMoveAudioBtn = document.getElementById("can-move-audio");
const searchCloseBtn = document.getElementById("search-close");

const replaceHelper = document.getElementById("replace-helper");
const replaceContainer = document.getElementById("replace-container");
const replaceInput = document.getElementById("replace-input");
const replacingBtn = document.getElementById("replacing");
const replaceCompare = document.getElementById("replace-compare");
const replaceCloseBtn = document.getElementById("replace-close");

const replaceSelectorSection = document.getElementById("replace-selector-section");
const rBack = document.getElementById("r-back");

window.onload= () =>{
  Header.init();
  ResizeBar.init();
  Panel.init();
  SubTools.init();
  Output.init();
  GijiInput.init();
  TextInput.init();
  AudioInput.init();
  Effector.init();
  Scroll.init();
  Save.init();
  Load.init();
  Config.init();
  Badge.init();
  External.init();
  Export.init();
  AudioController.init();
  SearchHelper.init();
  ReplaceHelper.init();
  Meta.init();
  CaseCategorizing.init();
  PDFViewer.init();
  Replace.init();
}

window.addEventListener("resize", () => {
  isWindowResize = true;
  Panel.setEditorPanelH();
  SeekLabel.reposition();
  Render.syncRowHeights();

  for(let i = 0; i < Doc.getLines().length; i++){
    TextBody.resetCharsPerPara(i);
    TextBody.resetParaHeights(i);
    TextBody.resetMiniBadges(i);
  }

  if(!caseCategorizingOverlay.classList.contains("hide")){
    CaseCategorizing.resize();
    CaseCategorizing.setCategoryResultCaseIdsMaxW();
  }
  
  CRList.setCaseIdsW();
  SubTools.setCaseContentH();
  Output.setOutputH();
  SubTools.setPreReplaceH();
  
  isWindowResize = false;
});

window.addEventListener("focus", () => {
  if(isTest) return;
  isWindowBlur = false;
  setTimeout(() => {
    document.getElementById("inactive-overlay").style.display = "none";
    if(AudioState.isPlaying() && !AudioState.isMuted()) AudioController.play();
    Meta.resetTitle();
  },500);
});

window.addEventListener("blur", () => {
  if(isTest) return;
  isWindowBlur = true;
  document.getElementById("inactive-overlay").style.display = "flex";
  if(AudioState.isPlaying()) AudioController.pause();
  Meta.resetTitle();
});

document.addEventListener('click', () => {
  ContextMenu.hide();
});

window.addEventListener("mouseup", e => {
  if(e.button !== 0) return;

  if(TextBody.dragover.i !== -1){
    for(let j = 0; j < Doc.getDivs().length; j++){
      Array.from(Doc.getTextBodyBG(j).querySelectorAll("span")).forEach((_, k) => {
        TextBody.unemphasizeText(j, k);
      });
    }
  }  
});

window.addEventListener("beforeunload", (e) => {
  e.preventDefault();
  e.returnValue = "";
});
