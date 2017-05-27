function setupCanvas(videoSourceId) {
  var video = document.createElement('video');
  video.setAttribute('id', 'passthroughVideo');
  video.setAttribute('autoplay', true);
  video.setAttribute('width', '640');
  video.setAttribute('height', '480');
  video.setAttribute('src', '');

  var assets = document.getElementsByTagName('a-assets')[0];
  assets.appendChild(video);

  // var passthroughEl = self.el;
  // passthroughEl.setAttribute('src', '#passthroughVideo')

  var phoneConfig = {
    video: {
      optional: [{
        sourceId: videoSourceId
      }]
    }
  }

  var mediaConfig = videoSourceId ? phoneConfig : {video: true};
  var errBack = function(e) {
    console.log('An error has occurred!', e)
  };

  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(mediaConfig).then(function(stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
    });
  }
  else if(navigator.getUserMedia) { // Standard
    navigator.getUserMedia(mediaConfig, function(stream) {
      video.src = stream;
      video.play();
    }, errBack);
  } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia(mediaConfig, function(stream){
      video.src = window.webkitURL.createObjectURL(stream);
      video.play();
    }, errBack);
  } else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
    navigator.mozGetUserMedia(mediaConfig, function(stream){
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }, errBack);
  }
}

function withBackCamera(sourceInfos) {
  var videoSourceId;
  for (var i = 0; i != sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    if (sourceInfo.kind == "video" && sourceInfo.facing == "environment") {
      videoSourceId = sourceInfo.id;
    }
  }
  setupCanvas(videoSourceId);
}

function startPassthrough() {
  if(MediaStreamTrack && MediaStreamTrack.getSources) {
    MediaStreamTrack.getSources(withBackCamera);
  } else {
    setupCanvas(null);
  }
}

$(document).ready(function() {
  startPassthrough();
});

