var plate = 0; // 1 - learnmore, 2 - getlauren

function toggleHomes(val) {
  var links = document.querySelector('#links').getChildren();
  for (var i=0; i<links.length; i++) {
    if(links[i].tagName === 'A-ENTITY') {
      if (val) links[i].getChildren()[0].emit('scaleIn');
      else links[i].getChildren()[0].emit('scaleOut');
    }
  }
}

function closeHome() {
  $('#closeHome').hide();
  toggleHomes(true);
  var sky = document.querySelector('#image-360');
  sky.setAttribute('material', 'shader: standard; src: #lauren-video');
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


function startRecording() {
  var links = document.querySelector('#links');
  links.children[3].children[0].emit('record');
  setTimeout(function() {
    $('#record').hide();
    $('#submit').show();
    $('#plate').animate({ top: '10%' });
    links.children[1].children[0].emit('click');
  }, 5000);
}

$(document).ready(function() {

  var w = document.documentElement.clientWidth;
  $('iframe').width(w);
  var h = w*360/640;
  $('iframe').height(h);

  $('a-scene').click(function() {
    $('#video').animate({ top: -h }, function() {
      $('#video').remove();
    });
  });


  startPassthrough();

  $('#learnmore').click(function() {
    if (plate == 1) {
      $('#learnmore-plate').animate({ top: -$('#learnmore-plate').height() });
      plate = 0;
    } else {
      if (plate == 2) {
        getLauren(false);
        $('#getlauren-plate').animate({ top: -$('#getlauren-plate').height() });
      }
      $('#learnmore-plate').animate({ top:'10%' });
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
      $('#getlauren-plate').animate({ top:'10%' });
      plate = 2;
    }
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

});

