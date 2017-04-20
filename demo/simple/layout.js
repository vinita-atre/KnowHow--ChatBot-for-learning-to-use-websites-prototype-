(function() {
  "use strict";

  var ENTER_KEY_CODE = 13;
  var queryInput, resultDiv, sidebarDiv, applicationImage,isMute, muteButton;
  var arrImageURL = new Array();

  window.onload = init;

  function init() {
    queryInput = document.getElementById("q");
    resultDiv = document.getElementById("result");
    sidebarDiv = document.getElementById("sidebarContainer");
    applicationImage = document.getElementById("applicationImage");
    muteButton = document.getElementById("un-mute");
    muteButton.addEventListener("click",onChangeHandler);
    muteButton.dataset.condition = "mute";

    applicationImage.addEventListener("click",clickEvent);
    queryInput.addEventListener("keydown", queryInputKeyDown);
    setAccessToken();
    welcome();
  }
  function onChangeHandler(){
 //  alert("clicked");
   // alert(this);
    //alert(muteButton.value);
    if(muteButton.dataset.condition == "mute"){
      alert("Speech Muted");
      isMute = "true";
      muteButton.dataset.condition = "un-mute"
      muteButton.name = "Unmute"
    }
    else{
      alert("Speech un-muted");
      isMute = "false";
      muteButton.dataset.condition = "mute"
    }
  }
  function clickEvent(){
    window.open("indexDoc.html");
    // if (applicationImage.src == applicationImage.dataset.secondSrc){
    //   applicationImage.src = applicationImage.dataset.thirdSrc;
    //   //
    // }else if (applicationImage.src == applicationImage.dataset.thirdSrc){
    //   applicationImage.src = applicationImage.dataset.originalSrc;
    //   alert("Did you get it? You can ask me again if you like");

    // }else if (applicationImage.src == applicationImage.dataset.originalSrc){
    //   applicationImage.src = applicationImage.dataset.fourthSrc;
    // }else if (applicationImage.src == applicationImage.dataset.fourthSrc){
    //   applicationImage.src = applicationImage.dataset.fifthSrc;
    // }else if (applicationImage.src == applicationImage.dataset.firstSrc){
    //   applicationImage.src = applicationImage.dataset.secondSrc;
    // }
  }
  function setAccessToken() {
    document.getElementById("main-wrapper").style.display = "block";
    window.init('cf033add73ea47d0a1e6b62eced40f71');
  }

  function welcome() {
    var responseNode = createResponseNode();
    sendEvent('WELCOME')
    .then(function(response) {
      var result,videoID;
      var imageURL = new Array ();
      try {
          //alert(JSON.stringify(response, null, 2));
          result = response.result.fulfillment.speech;
          videoID= response.result.fulfillment.messages[1].payload.video_ID;
          //alert(result);
          imageURL.push(response.result.fulfillment.messages[2].imageUrl)
          applicationImage.dataset.originalSrc = imageURL[0];
          //arrImageURL.push(response.result.fulfillment.messages[2].imageUrl);
         // alert(response.result.fulfillment.messages[2].imageUrl);
       } catch(error) {
        console.log(error);;
        result = "";
      }
      setResponseJSON(response);
      setResponseOnNode(result, responseNode, videoID, imageURL);
    })
    .catch(function(err) {
      setResponseJSON(err);
      setResponseOnNode("Something goes wrong", responseNode);
    });
  }

  function queryInputKeyDown(event) {
    if (event.which !== ENTER_KEY_CODE) {
      return;
    }

    var value = queryInput.value;
    queryInput.value = "";

    createQueryNode(value);
    var responseNode = createResponseNode();

    sendText(value)
    .then(function(response) {
      var result;
      var imageURL = new Array();
      try {
          //alert(JSON.stringify(response, null, 2));
          result = response.result.fulfillment.speech;
         // alert(result);
         
         if (response.result.fulfillment.messages){
          var arrMessages = response.result.fulfillment.messages
          
          for (var i = 0; i < arrMessages.length; i++){
            if (arrMessages[i].type == "3"){

            imageURL.push(arrMessages[i].imageUrl)
            //alert("pushing "+i+" imageURL" + imageURL);
          }
          }
          // alert(imageURL);
        }

      } catch(error) {
        result = "";
      }
      setResponseJSON(response);
      if (imageURL.length > 0){
        setResponseOnNode(result, responseNode,null, imageURL);
      }else{
        setResponseOnNode(result, responseNode);
      }
    })
    .catch(function(err) {
      setResponseJSON(err);
      setResponseOnNode("Something goes wrong", responseNode);
    });
  }

  function createQueryNode(query) {
    var node = document.createElement('div');
    

    node.className = "clearfix left-align left card-panel green accent-1";
    node.innerHTML = query;
    resultDiv.appendChild(node);
    scrollToBottom("result");
  }

  function createResponseNode() {
    var node = document.createElement('div');
    
    node.className = "clearfix right-align right card-panel blue-text text-darken-2 hoverable";
    node.innerHTML = "...";
    resultDiv.appendChild(node);
    scrollToBottom("result");
    return node;
  }
  function openDrawer(){

  }

  function scrollToBottom(id){
   var div = document.getElementById(id);
   div.scrollTop = div.scrollHeight - div.clientHeight;
 }
 function startTimer(imageURL){
   alert("setInterval");

    // for (var i=1; i<imageURL.length; i++){
    //   alert("in for");
    var i = 1;
    var changeImage = setInterval(function(){

      // displayNextImage(imageURL,i);
      if (i == (imageURL.length)){
        applicationImage.src = applicationImage.dataset.originalSrc;
        clearInterval();
      }else{
        alert("displayNextImage:"+i);
        alert(imageURL[i]);


        applicationImage.src = imageURL[i];
        i++;
      }


    },3000);

     //}
   }

  function setResponseOnNode(response, node, videoID,imageURL) {
    node.innerHTML = response ? response : "[empty response]";
    node.setAttribute('data-actual-response', response);
    if(videoID) {

      var videoNode = document.createElement('iframe');
      videoNode.height=300;
      videoNode.width=300;
      videoNode.allowFullScreen="true";
      videoNode.allowfullscreen="true";
      videoNode.allowFullScreen="allowFullScreen";
      videoNode.allowfullscreen="allowfullscreen";
      videoNode.frameBorder=0;
      videoNode.src='http://www.youtube.com/embed/'+videoID;
      node.appendChild(videoNode);
    }
    if(imageURL){

      applicationImage.src = imageURL[0]
      if(imageURL.length>1){
        startTimer(imageURL);
      }
  

  }
  var speaking = false;
  function speakNode() {
    if (!response || speaking) {
      return;
    }
    speaking = true;
    tts(response)
    .then(function () {speaking = false})
    .catch(function (err) {
      speaking = false;
      Materialize.toast(err, 2000, 'red lighten-1');
    });
  }

  node.addEventListener("click", speakNode);
  if(!isMute){
    speakNode();
  }
}

function setResponseJSON(response) {
    //var node = document.getElementById("jsonResponse");
    //node.innerHTML = JSON.stringify(response, null, 2);
  }

  function sendRequest() {

  }

})();
