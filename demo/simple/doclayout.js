(function() {
  "use strict";

  var ENTER_KEY_CODE = 13;
  var queryInput, resultDiv, sidebarDiv, isMute, muteButton, applicationImageContainer, applicationImage;
  //var applicationImage;
  var arrImageURL = new Array();

  window.onload = init;

  function init() {
    queryInput = document.getElementById("q");
    resultDiv = document.getElementById("result");
    sidebarDiv = document.getElementById("sidebarContainer");
    applicationImageContainer = document.getElementById("applicationImageContainer");
    applicationImage = document.getElementById("applicationImage");
    muteButton = document.getElementById("un-mute");
    muteButton.addEventListener("click",onChangeHandler);
    muteButton.dataset.condition = "mute";

  //   if(applicationImage){
     applicationImageContainer.addEventListener("click",clickEvent);
  // }
    queryInput.addEventListener("keydown", queryInputKeyDown);
    setAccessToken();
      
          welcome("WELCOMEDOCS");
      
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
   // alert("clicked");
  
  }
  function setAccessToken() {
    document.getElementById("main-wrapper").style.display = "block";
    window.init('cf033add73ea47d0a1e6b62eced40f71');
  }

  function welcome(eventName) {
    var responseNode = createResponseNode();
    sendEvent(eventName)
    .then(function(response) {
      var result,videoID;
      var imageURL = new Array ();
      try {
          //alert(JSON.stringify(response, null, 2));
          result = response.result.fulfillment.speech;
          videoID= response.result.fulfillment.messages[1].payload.video_ID;
          
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
         if (imageURL.length>0){
          
          applicationImage.dataset.originalSrc = imageURL[0];
        }
        
       } catch(error) {
        console.log(error);
        result = "";
      }
      setResponseJSON(response);
        if(imageURL.length> 0){
      setResponseOnNode(result, responseNode, videoID, imageURL);
        }else{
            setResponseOnNode(result, responseNode, videoID);
        }
    })
    .catch(function(err) {
      //alert(err);
      setResponseJSON(err);
      setResponseOnNode("Something goes wrong", responseNode);
        console.log(err);
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
           //alert(imageURL);
        }

      } catch(error) {
        result = "";
        //alert(error);
      }
      setResponseJSON(response);
      if (imageURL.length > 0){
          
        setResponseOnNode(result, responseNode,null, imageURL, true);
      
      }else{
        setResponseOnNode(result, responseNode);
      }
    })
    .catch(function(err) {
      setResponseJSON(err);
      //alert(err);
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
 
    console.log("start timer");
    var i = 1;
    console.log("i:"+ i)
    var changeImage = setInterval(function(){

      
      if (i == (imageURL.length + 1 )){
        console.log("index is:"+imageURL.length+",i"+i);
       
        applicationImage.style.display = "none";
        applicationCode.style.display = "block"
        clearInterval(changeImage);
      }else{
        //alert("displayNextImage:"+i);
        //alert(imageURL[i]);

 //var applicationImage = document.getElementById("applicationImage");
      // applicationImage.src = imageURL[i];
        applicationImage.style.backgroundImage = "url("+imageURL[i]+")";
        i++;
      }


    },2000);

     //}
   }

  function setResponseOnNode(response, node, videoID,imageURL, isAnimated) {
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
      // var applicationImage = document.createElement('img');
      // applicationImage.style.width = applicationImageContainer.style.width;
      //  applicationImage.style.height = applicationImageContainer.style.height;
      // applicationImageContainer.appendChild(applicationImage);

//alert("here");
      applicationImage.src = imageURL[0];
     // alert(imageURL[0]);
      applicationImage.style.display = "block";
      applicationCode.style.display ="none";
      //var image = document.createElement("img");

      applicationImage.style.backgroundImage = "url("+imageURL[0]+")";//imageURL[0];
       // applicationImage.src = imageURL[0];
      //console.log(applicationImage.style);
     // applicationImage.style.height = 100vh;
      if(imageURL.length>1){
        if(isAnimated){

        startTimer(imageURL);
      }
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
