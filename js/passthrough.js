var passthroughStream;

function setupCanvas(videoSourceId) {
  var video = document.createElement('video');
  video.setAttribute('id', 'passthroughVideo');
  video.setAttribute('autoplay', true);
  video.setAttribute('width', '1280');
  video.setAttribute('height', '720');
  video.setAttribute('src', '');

  var assets = document.getElementsByTagName('a-assets')[0];
  assets.appendChild(video);

  // var passthroughEl = self.el;
  // passthroughEl.setAttribute('src', '#passthroughVideo')

  var mediaConfig = {
    video: {
      width: {min: 1280, ideal: 1280, max: 1920},
      height: {min: 720, ideal: 720, max: 1080}
    }
  }

  if (videoSourceId) mediaConfig.video.option= [{ sourceId: videoSourceId }];

  var errBack = function(e) {
    console.log('An error has occurred!', e)
  };

  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(mediaConfig).then(function(stream) {
      passthroughStream = stream;
      video.src = window.URL.createObjectURL(stream);
      video.play();
    });
  }
  else if(navigator.getUserMedia) { // Standard
    navigator.getUserMedia(mediaConfig, function(stream) {
      passthroughStream = stream;
      video.src = stream;
      video.play();
    }, errBack);
  } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia(mediaConfig, function(stream){
      passthroughStream = stream;
      video.src = window.webkitURL.createObjectURL(stream);
      video.play();
    }, errBack);
  } else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
    navigator.mozGetUserMedia(mediaConfig, function(stream){
      passthroughStream = stream;
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

function startRecording() {
    var mediaRecorder = new MediaStreamRecorder(passthroughStream);
    mediaRecorder.mimeType = 'video/webm';
    mediaRecorder.ondataavailable = function (blob) {
        // POST/PUT "Blob" using FormData/XHR2
        var blobURL = URL.createObjectURL(blob);
        document.write('<a href="' + blobURL + '">' + blobURL + '</a>');
        console.log(blobURL);
    };
    mediaRecorder.start(3000);
}
