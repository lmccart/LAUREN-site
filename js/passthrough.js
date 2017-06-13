var passthroughStream;

function startPassthrough() {
  var video = document.createElement('video');
  video.setAttribute('id', 'passthroughVideo');
  video.setAttribute('autoplay', true);
  video.setAttribute('width', '1280');
  video.setAttribute('height', '720');
  video.setAttribute('src', '');

  var assets = document.getElementsByTagName('a-assets')[0];
  assets.appendChild(video);

  document.querySelector('#passthroughVideo-sphere').setAttribute('src', '#passthroughVideo');
  document.querySelector('#passthroughVideo-sphere').setAttribute('material', 'src', '#passthroughVideo');

  var mediaConfig = {
    video: {
      width: {min: 1280, ideal: 1280, max: 1920},
      height: {min: 720, ideal: 720, max: 1080}
    }
  }

  var errBack = function(e) { console.log('An error has occurred!', e) };
  var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  if (getUserMedia) {
    getUserMedia = getUserMedia.bind(navigator);
    getUserMedia(mediaConfig, function(stream) {
      passthroughStream = stream;
      if (window.webkitURL) {
        video.src = window.webkitURL.createObjectURL(stream);
      } else if (window.URL) {
        video.src = window.URL.createObjectURL(stream);
      } else {
        video.src = stream;
      }
      video.play();
    }, errBack);
  }
}


function endPassthrough() {
  if (passthroughStream) {
    var track = passthroughStream.getTracks()[0];
    track.stop();
    $('#video').remove();
  }
}

function startRecording() {
  console.log('start')
  var mediaRecorder = new MediaStreamRecorder(passthroughStream);
  mediaRecorder.mimeType = 'video/webm';
  mediaRecorder.ondataavailable = function (blob) {
    // POST/PUT "Blob" using FormData/XHR2
    var blobURL = URL.createObjectURL(blob);
    $('#getlauren-content').append('<a href="' + blobURL + '">' + blobURL + '</a>');
    console.log(blobURL);
  };
  mediaRecorder.start(3000);
}
