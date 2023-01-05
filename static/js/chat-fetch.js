// ページの読み込みが完了してから
window.onload = function() {

  const elm = document.documentElement;
  let barTop;
  let lastId = messages[messages.length-1].id;
  let messageIM = [];

  messages.forEach(message=>{
    messageIM.push({id:message.id,mes:message.message});
  });
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
      const responses = await getMessageData( url, option);

      if( responses !== false ) {
        
        let messageIMDiff = [...messageIM];
        let num = 0;

        responses.forEach(response=>{

          // メッセージ追加
          if( response.id > lastId ){

            const messageArea = document.querySelector(".message-area");
            const messagesDiv = document.createElement("div");
            const userName = document.createElement("p");
            const timeDiv = document.createElement("div");
            const timeP = document.createElement("p");
            const iconDiv = document.createElement("div");
            const iconImg = document.createElement("img");
            const boxDiv = document.createElement("div");
            const messageP = document.createElement("p");
            const reactionBtn = document.createElement("button");
            const reactionImg1 = document.createElement("img");
            const reactionImg2 = document.createElement("img");
            
            messagesDiv.classList.add("messages");
            messagesDiv.setAttribute("id",`other-message-${response.id}`);
            // ユーザ名表示
            userName.classList.add("user-name");
            userName.innerText = response.user_name;
            messagesDiv.appendChild(userName);
            // 投稿時間
            timeDiv.classList.add("other-message-updatetime");
            timeP.classList.add("message-updatetime-left");
            timeP.innerText = response.created_at;
            timeDiv.appendChild(timeP);
            if( response.created_at !== response.updated_at){
              const timeEditP = document.createElement("p");
              timeEditP.classList.add("message-updatetime-left-edit");
              timeEditP.innerText = "編集:"+ response.updated_at;
              timeDiv.appendChild(timeEditP);
            }
            messagesDiv.appendChild(timeDiv);
            // ユーザアイコン
            iconDiv.classList.add("other-icon");
            iconImg.setAttribute("src",`${location.origin}/static/${response.user_icon_path}`);
            iconDiv.appendChild(iconImg);
            messagesDiv.appendChild(iconDiv);
            // メッセージ
            boxDiv.classList.add("box-left");
            messageP.classList.add("other-message-message");
            messageP.innerText = response.message;
            boxDiv.appendChild(messageP);
            // リアクションボタン
            reactionBtn.classList.add("reaction-btn-fetch");
            reactionImg1.setAttribute("src",`${location.origin}/static/img/reactionPlusB-hover.png`);
            reactionImg2.setAttribute("src",`${location.origin}/static/img/reactionPlusB.png`);
            reactionBtn.appendChild(reactionImg1);
            reactionBtn.appendChild(reactionImg2);
            boxDiv.appendChild(reactionBtn);
            // １つのメッセージ作成
            messagesDiv.appendChild(boxDiv);
            reactionBtn.addEventListener("click", () => {
              modalOpen("reaction-fetch");
              const reactionMessageId = document.getElementsByClassName("reaction-messageid-confirm-fetch");
              for(let i=0;i<reactionMessageId.length;i++){
                reactionMessageId[i].setAttribute("value", response.id);
              }
            });
            if( elm.scrollTop === elm.scrollHeight - elm.clientHeight ) {
              barTop = "True";
            } else {
              barTop = "False";
            }
            messageArea.appendChild(messagesDiv);
            messageIM.push({id:response.id,mes:response.message});
          }
          // メッセージ編集、削除用
          else {
            let idNum = -1;
            messageIMDiff.forEach((IMDiff,i)=>{
              if( IMDiff.id == response.id ){
                idNum = i;
                if( uid != response.uid && IMDiff.mes != response.message ){
                  const messageEdit = document.querySelector(`#other-message-${IMDiff.id} .other-message-message`);
                  messageEdit.innerText = response.message;
                  const messageTimeEditOld = document.querySelector(`#other-message-${IMDiff.id} .message-updatetime-left-edit`);
                  if( messageTimeEditOld ){
                    messageTimeEditOld.innerText = "編集:"+ response.updated_at;
                  } else {
                    const messageTimeEdit = document.querySelector(`#other-message-${IMDiff.id} .other-message-updatetime`);
                    const timeEditP = document.createElement("p");
                    timeEditP.classList.add("message-updatetime-left-edit");
                    timeEditP.innerText = "編集:"+ response.updated_at;
                    messageTimeEdit.appendChild(timeEditP);
                  }
                  messageIM[num].mes = response.message;
                }
              }
            });
            messageIMDiff.splice(idNum, 1);
          }
          num++;
        });
        // 最後のid更新
        if( lastId < responses[responses.length-1].id ){
          lastId = responses[responses.length-1].id;
        }
        // メッセージ削除
        if( messageIMDiff ){
          for(let j=0;j<messageIMDiff.length;j++){
            document.getElementById(`other-message-${messageIMDiff[j].id}`).style.display = "none";
            messageIM.splice(messageIMDiff.indexOf(messageIMDiff[j],1));
          }
        }
        // スクロール
        if( barTop === "True" ){
          elm.scrollTop = elm.scrollHeight;
        }
        barTop = "False";
      }
    }

    getMessage( url, option );

  }, 5000);

};
