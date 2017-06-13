var plate = 0; // 1 - learnmore, 2 - getlauren
var h;

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

function closeHome() {
  var sky = document.querySelector('#image-360');
  var currentId = sky.getAttribute('src');
  var currentHome = $('#links').find('[data-src="' + currentId + '"]')[0].children[0].getChildren()[0];
  currentHome.emit('close');
  $('#closeHome').hide();
  toggleHomes(true);

}

function getLauren(val) {
  toggleHomes(!val);
  var sky = document.querySelector('#image-360');
  if (val) {
    sky.setAttribute('material', 'shader: standard; src: #lauren-listening');
    sky.emit('stopRotateSky');
    sky.emit('rotateRecordSky');
    document.querySelector('#camera').emit('rotateRecordCamera');
    document.querySelector('#passthroughVideo-sphere').emit('scaleIn');
  } else {
    sky.setAttribute('material', 'shader: flat; src: #lauren-video');
    sky.emit('startRotateSky');
    document.querySelector('#camera').emit('unrotateRecordCamera');
    document.querySelector('#passthroughVideo-sphere').emit('scaleOut');
  }
}

function hideVideo() {
  $('#video-top').hide();
  $('#overlay').hide();
  $('nav').show();
  $('#overlay-gradient').show();
  $('a-scene').removeClass('blur');
  $('#video').animate({ top: -h }, function() {
    $('#video').remove();
  });
}

$(document).ready(function() {

  $('video').on('error', function() {
    $(this)[0].load();
  });

  // hideVideo();
  // setTimeout(function() { $('#getlauren').trigger('click'); }, 1000);
  startPassthrough();

  $('#lauren').click(function() { window.location = './'; });

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
    startRecording();
  });

  $('#submit').click(function() {
    $('#getlauren-content').hide();
    $('#record').show();
    $('#submit').hide();
    $('#getlauren-thankyou').show();
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
  var player = new Vimeo.Player(iframe);

  player.on('ended', function() {
    console.log('ended the video!');
    hideVideo();
  });

  $(window).resize(function() {
    resizeDOM();
  });

  $('#video-close-button').click(function() {
    hideVideo();
  });

  $('#video-close').mousemove(function() {
    if ($('.popper').is(':hidden')) $('.popper').show(0).delay(1000).hide(0);
  });

  $('#video-close').mouseout(function() {
    $('.popper').stop().hide(0);
  });

  // $('#overlay').click(function() {
  //   hideVideo();
  // });

  function resizeDOM() {
    var w = document.documentElement.clientWidth;
    $('iframe').width(w);
    h = w*320/640;
    $('iframe').height(h);

    $('#video-close').css('top', $('iframe').height()*0.65);
    $('#video-close').css('height', Math.min($('iframe').height()*0.35, window.innerHeight - $('iframe').height()*0.65));
    $('#video-close-button').css('margin-top', $('#video-close').height() - $('#video-close-button').height());

    var lw = $('#learnmore-plate').width();
    $('#learnmore-plate').css('left', (window.innerWidth - lw)/2);
  }

  resizeDOM();
  player.play();
});

