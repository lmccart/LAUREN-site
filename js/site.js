var plate = 0; // 1 - learnmore, 2 - getlauren
var h;
var videoPlaying = true;
var player;
var videoLoaded = false;
var sceneSetup = false;

function toggleHomes(val) {
  var links = document.querySelector('#links').getChildren();
  for (var i=0; i<links.length; i++) {
    if(links[i].tagName === 'A-ENTITY') {
      var obj = links[i].getChildren()[0];
      if (val) {
        obj.emit('scaleIn');
        obj.getChildren()[0].emit('scaleIn');
      } else {
        obj.emit('scaleOut');
        obj.getChildren()[0].emit('scaleOut');
      }
    }
  }
}

function closeHome(force) {
  var sky = document.querySelector('#image-360');
  var currentId = sky.getAttribute('src');
  var currentHome = $('#links').find('[data-src="' + currentId + '"]')[0].children[0].getChildren()[0];
  currentHome.emit('close');
  $('#closeHome').hide();
  if (!force) toggleHomes(true);
  if (videoPlaying) player.play();
}

function getLauren(val) {
  toggleHomes(!val);
  var sky = document.querySelector('#image-360');
  if (val) {
    $('#closeHome').hide();
    sky.setAttribute('material', 'shader: standard; src: #lauren-listening');
    sky.emit('stopRotateSky');
    sky.emit('rotateRecordSky');
    document.querySelector('#camera').emit('rotateRecordCamera');
    document.querySelector('#passthroughVideo-sphere').emit('scaleIn');
    if ($('#getlauren-thankyou').is(":visible")) {
      resetForm();
    }
  } else {
    if (videoPlaying) player.play();
    var opac = videoPlaying ? 0 : 1;
    sky.setAttribute('material', 'shader: flat; src: #lauren-video; opacity:'+opac);
    sky.emit('startRotateSky');
    document.querySelector('#camera').emit('unrotateRecordCamera');
    document.querySelector('#passthroughVideo-sphere').emit('scaleOut');
  }
}


function resetForm() {
  recordRTC = null;
  countdownInterval = null;
  submission_file = null;
  $('#input_name').val('');
  $('#input_email').val('');
  $('#input_city').val('');
  $('#input_response').val('');
  $('#record').text('RECORD');
  $('#submit-record').hide();
  $('#time').hide();
  $('#getlauren-content').show();
  $('#getlauren-thankyou').hide();
  $('#passthroughVideo')[0].src = window.URL ? window.URL.createObjectURL(passthroughStream) : passthroughStream;
}

function submit() {
  if (validate()) {
    $('#getlauren-content').hide();
    $('#getlauren-thankyou').show();
    var video_url = submitRecording();
    var s = {
      name: $('#input_name').val(),
      email: $('#input_email').val(),
      city: $('#input_city').val(),
      written: $('#input_response').val(),
      video: video_url 
    }
    $.post('https://lauren-server.herokuapp.com/submit', s, function(res) {
      console.log(res);
    });
  }
}

function validate() {
  if (!$('#input_name').val()) {
    alert('Please enter your name.');
  }
  else if (!$('#input_email').val()) {
    alert('Please enter your email.');
  }
  else if (!$('#input_city').val()) {
    alert('Please enter the city you live in.');
  }
  else if (!$('#input_response').val() && !submission_file) {
    alert('Please write or record a response explaining why you want to get LAUREN.');
  } else {
    return true;
  }
}

$(document).ready(function() {

  $('video').on('error', function() {
    $(this)[0].load();
  });

  startPassthrough();

  $('#lauren').click(function() { window.location = './'; });

  $('#volume').click(function() {
    if ($(this).attr('src') === 'img/volume-on.png') {
      $(this).attr('src', 'img/volume-off.png');
      player.setVolume(0);
    } else {
      $(this).attr('src', 'img/volume-on.png');
      player.setVolume(1);
    }
  });

  $('#learnmore').click(function() {
    if (plate == 1) {
      $('#learnmore-plate').animate({ top: -$('#learnmore-plate').height() });
      plate = 0;
    } else {
      if (plate == 2) {
        getLauren(false);
        $('#getlauren-plate').animate({ top: -$('#getlauren-plate').height() });
      }
      $('#learnmore-plate').animate({ top:'5%' });
      plate = 1;
    }
  });

  $('#getlauren').click(function() {
    if (plate == 2) {
      $('#getlauren-plate').animate({ top: -$('#getlauren-plate').height() });
      getLauren(false);
      plate = 0;
    } else {
      getLauren(true);
      if (plate == 1) {
        $('#learnmore-plate').animate({ top: -$('#getlauren-plate').height() });
      }
      $('#getlauren-plate').animate({ top:'5%' });
      plate = 2;
    }
  });

  $('#write-switch').click(function() {
    $('#write-content').show();
    $('#record-content').hide();
  });

  $('#record-switch').click(function() {
    $('#record-content').show();
    $('#write-content').hide();
  });


  $('#record').click(function() {
    if (!recordRTC) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  $('#submit-record').click(function() {
    submit();
  });
  $('#submit-write').click(function() {
    submit();
  });

  $('.close').click(function() {
    if (plate == 1) {
      $('#learnmore-plate').animate({ top: -$('#learnmore-plate').height() });
    }
    else if (plate == 2) {
      $('#getlauren-plate').animate({ top: -$('#getlauren-plate').height() });
      getLauren(false);
    }
    plate = 0;
  });

  $('#closeHome').click(function() {
    closeHome();
  });

  // VIMEO STUFF
  var iframe = document.querySelector('iframe');
  player = new Vimeo.Player(iframe);
  player.on('loaded', function() {
    videoLoaded = true;
    if (sceneSetup) {
      setTimeout(function() { $('#overlay').hide(); }, 2500);
    }
  });
  player.addCuePoint(9, {type: 'show'});
  player.addCuePoint(184, {type: 'end'});
  player.on('cuepoint', function(e) {
    console.log(e.data);
    if (e.data.type === 'show') {
      document.querySelector('#image-360').emit('hide360');
      document.querySelector('#links').emit('lower');
    }
    else if (e.data.type === 'end') {
      videoPlaying = false;
      player.pause();
      document.querySelector('#image-360').emit('show360');
      document.querySelector('#links').emit('raise');
      console.log('ended the video!');
    }
  });
  player.play();

  $(window).resize(function() {
    resizeDOM();
  });
  resizeDOM();


  if (!hasGetUserMedia() || document.documentElement.clientWidth <= 600) {
    $('#write-content').show();
    $('#record-content').hide();
    $('#record-switch').hide();
  }

});

function resizeDOM() {
  console.log('ISMOBILE ='+AFRAME.utils.device.isMobile())
  if (AFRAME.utils.device.isMobile()) {
    if (document.documentElement.clientWidth < document.documentElement.clientHeight) {
      $('#non-scene').css('transform', 'rotate(90deg)');

      var angle = angle_in_degrees * Math.PI / 180,
          sin   = Math.sin(angle),
          cos   = Math.cos(angle);

      // (0,0) stays as (0, 0)

      // (w,0) rotation
      var x1 = cos * width,
          y1 = sin * width;

      // (0,h) rotation
      var x2 = -sin * height,
          y2 = cos * height;

      // (w,h) rotation
      var x3 = cos * width - sin * height,
          y3 = sin * width + cos * height;

      var minX = Math.min(0, x1, x2, x3),
          maxX = Math.max(0, x1, x2, x3),
          minY = Math.min(0, y1, y2, y3),
          maxY = Math.max(0, y1, y2, y3);

      var rotatedWidth  = maxX - minX,
          rotatedHeight = maxY - minY;

      $('#container').width(rotatedWidth);
      $('#container').height(rotatedHeight);
      console.log(rotatedWidth+' -- '+rotatedHeight)
    }
  } 
  var minDir = document.documentElement.clientWidth/document.documentElement.clientHeight > 640/320 ? 0 : 1;
  if (minDir) {
    var h = document.documentElement.clientHeight;
    $('iframe').height(h);
    var w = h*640/320;
    var off = -0.5 * (w - document.documentElement.clientWidth);
    $('iframe').width(w);
    $('iframe').css('left', off);
  } else {
    var w = document.documentElement.clientWidth;
    $('iframe').width(w);
    var h = w*320/640;
    var off = -0.5 * (h - document.documentElement.clientHeight);
    $('iframe').height(h);
    $('iframe').css('top', off);
  }

  var lw = $('#learnmore-plate').width();
  $('#learnmore-plate').css('left', (window.innerWidth - lw)/2);
}
