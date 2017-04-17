(function() {
  "use strict";

  var ENTER_KEY_CODE = 13;
  var queryInput, resultDiv;

  window.onload = init;

  function init() {
    queryInput = document.getElementById("q");
    resultDiv = document.getElementById("result");
    queryInput.addEventListener("keydown", queryInputKeyDown);
    setAccessToken();
    welcome();
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
        try {
          result = response.result.fulfillment.speech;
          videoID= response.result.fulfillment.messages[1].payload.video_ID
        } catch(error) {
          console.log(error);;
          result = "";
        }
        setResponseJSON(response);
        setResponseOnNode(result, responseNode, videoID);
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
        try {
          result = response.result.fulfillment.speech
        } catch(error) {
          result = "";
        }
        setResponseJSON(response);
        setResponseOnNode(result, responseNode);
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
  }

  function createResponseNode() {
    var node = document.createElement('div');
    node.className = "clearfix right-align right card-panel blue-text text-darken-2 hoverable";
    node.innerHTML = "...";
    resultDiv.appendChild(node);
    return node;
  }

  function setResponseOnNode(response, node, videoID) {
    node.innerHTML = response ? response : "[empty response]";
    node.setAttribute('data-actual-response', response);
    if(videoID) {
      var videoNode = document.createElement('iframe');
      videoNode.height=200;
      videoNode.width=200;
      videoNode.src='http://www.youtube.com/embed/$videoID'
      node.appendChild(videoNode);
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
    speakNode();
  }

  function setResponseJSON(response) {
    var node = document.getElementById("jsonResponse");
    node.innerHTML = JSON.stringify(response, null, 2);
  }

  function sendRequest() {

  }

})();
