
var timeout, interval;
function blink(val) {
  if (val) {
    interval = setInterval(function() { $('#lauren').css('font-weight', '800'); }, 3000);
    timeout = setTimeout( function() { 
      setInterval(function() { $('#lauren').css('font-weight', '300'); }, 3000);
    }, 1500);
  }
}

function hideHomes() {
  var links = document.querySelector('#links').getChildren();
  for (var i=0; i<links.length; i++) {
    links[i].getChildren()[0].emit('scaleOut');
  }
}

function getLauren() {
  hideHomes();
  var sky = document.querySelector('#image-360');

  sky.setAttribute('material', 'shader: standard; src: #lauren-listening');
  sky.emit('stopRotateSky');
  sky.emit('rotateRecordSky');
  document.querySelector('#camera').emit('rotateRecordCamera');
  document.querySelector('#passthroughVideo-sphere').emit('scaleIn');
  $('#closeHome').hide();
  $('#getlauren-thankyou').hide();
  $('#getlauren-content').show();
  $('#plate').show();
  $('#close').show();
}

function startRecording() {
  $('#plate').slideUp(500);
  var links = document.querySelector('#links');
  links.children[3].children[0].emit('record');
  setTimeout(function() {
  $('#record').hide();
  $('#submit').show();
    $('#plate').slideDown(500);
    links.children[1].children[0].emit('click');
  }, 5000);
}

$(document).ready(function() {
  startPassthrough();

  $('#lauren').mouseover(function() {
    $('#lauren').css('font-weight', '800');
    $('#options').stop().fadeIn();
  });

  $('nav').mouseleave(function() {
    $('#options').stop().fadeOut();
    var val = $('#plate').is(':hidden');
  });

  $('#lauren').click(function() {
    window.location = './';
  });

  $('#learnmore').click(function() {
    if ($('#learnmore-content').is(':hidden')) {
      $('#getlauren-content').hide();
      $('#learnmore-content').show();
      $('#plate').slideDown(500, function() { $('#close').show(); });
    } else {
      $('#plate').slideUp(500);
    }
  });

  $('#getlauren').click(function() {
    getLauren();
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

  $('#close').click(function() {
    $('#close').hide();
    $('#plate').slideUp(500);
    document.querySelector('#passthroughVideo-sphere').emit('scaleOut');
  });

  $('#closeHome').click(function() {
    $('#closeHome').hide();
    var links = document.querySelector('#links').getChildren();
    for (var i=0; i<links.length; i++) {
      links[i].getChildren()[0].emit('scaleIn');
    }
    var sky = document.querySelector('#image-360');
    sky.setAttribute('material', 'shader: standard; src: #lauren-video');
  });

});

