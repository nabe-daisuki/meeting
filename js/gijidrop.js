class GijiDrop {
  static init(){
    // ドラッグが画面に入ったとき
    window.addEventListener('dragenter', (e) => {
      e.preventDefault();
      fileDropOverlay.classList.add('active');
    });

    // ドラッグが画面から出たとき
    window.addEventListener('dragleave', (e) => {
      e.preventDefault();
      // relatedTargetがnullまたはbodyなら外に出たと判断
      if (!e.relatedTarget || e.relatedTarget === document.body) {
        fileDropOverlay.classList.remove('active');
      }
    });

    // ドラッグオーバー（ドロップを許可）
    window.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    // ドロップされたとき
    window.addEventListener('drop', (e) => {
      e.preventDefault();
      fileDropOverlay.classList.remove('active');

      const files = e.dataTransfer.files;
      if(files.length >= 2){
        alert("1つのファイル(.giji)をドロップ下さい。");
        return;
      }

      const file = files[0];
      const item = e.dataTransfer.items[0];
      
      if(item.webkitGetAsEntry().isDirectory){
        alert("フォルダではなくファイル(.giji)をドロップ下さい。");
        return;
      }
      const ext = file.name.split('.').pop().toLowerCase();
      console.log(`ファイル名: ${file.name}, 拡張子: ${ext}`);

    });
  }
}