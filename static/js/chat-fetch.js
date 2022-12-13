// ページの読み込みが完了してから
window.addEventListener( "DOMContentLoaded",  function() {
  // 一定時間ごとに処理を実行
  setInterval(()=>{

    const url = `${location.origin}/async_get_message`;
    const option = { method: "POST", body: channel.id };

    // データ取得
    function getMessageData( url, opthon ){
      return fetch( url, opthon )
        .then( response => {
          if(!response.ok){
            console.log("レスポンスエラー");
          } else {
            return response.json();
          }
        }).catch(error => {
          console.log(error);
        });
    }

    // 非同期処理
    async function getMessage( url, option ){
      const response = await getMessageData( url, option);

      if( response === ""){
        return
      }

      console.log(response);

      // (messages-response).forEach(message => {
      //   const messageArea = document.querySelector(".nessage-area");
      //   const messageDiv = document.createElement("div");
      //   const userName = document.createElement("p");
      //   const timeDiv = document.createElement("div");
      //   const iconDiv = document.createElement("div");
      //   const boxDiv = document.createElement("div");
        

      //   messageArea.appendChild
      // });
    }

    getMessage( url, option );

  }, 5000);

});
