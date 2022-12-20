// ページ読み込み時に自動で下までスクロールする
window.addEventListener( "DOMContentLoaded",  function() {
  const elm = document.documentElement;

  // scrollHeight ページの高さ clientHeight ブラウザの高さ
  const bottom = elm.scrollHeight - elm.clientHeight;

  // 垂直方向へ移動
  window.scroll(0, bottom);
});
