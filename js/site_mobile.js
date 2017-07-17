var plate = 0; // 1 - learnmore, 2 - getlauren
var h;

function getLauren(val) {
  toggleHomes(!val);
  var sky = document.querySelector('#image-360');
  if (val) {
    sky.setAttribute('material', 'shader: standard; src: #lauren-listening');
    sky.emit('stopRotateSky');
    sky.emit('rotateRecordSky');
    document.querySelector('#camera').emit('rotateRecordCamera');
    document.querySelector('#passthroughVideo-sphere').emit('scaleIn');
    if ($('#getlauren-thankyou').is(":visible")) {
      resetForm();
    }
  } else {
    sky.setAttribute('material', 'shader: flat; src: #lauren-video');
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

  $('#lauren').click(function() { window.location = './'; });

  $('#learnmore').click(function() {
    $(window).scroll('#getlauren-content');
  });

  $('#getlauren').click(function() {
    $(window).scroll('#getlauren-content');
  });

  $('#submit-write').click(function() {
    submit();
  });

  // VIMEO STUFF
  var iframe = document.querySelector('iframe');
  var player = new Vimeo.Player(iframe);

  $(window).resize(function() {
    resizeDOM();
  });

  function resizeDOM() {
    var w = 0.8*document.documentElement.clientWidth;
    var off = 0.1*document.documentElement.clientWidth;
    $('iframe').width(w);
    h = w*320/640;
    $('iframe').height(h);
    $('iframe').css('margin-left', off);
  }

  resizeDOM();
  //player.play();
});


