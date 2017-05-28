var phrase = 'Hi, I\'m Lauren and I want to be your smart home.';

function nextChar(i){
  $('#greeting').text(phrase.substring(0, i));
  if(i < phrase.length){
    setTimeout('nextChar(' + (i + 1) + ')', 100);   
  }
}

function exitIntro() {
  $('#intro').slideToggle(500);
  blink(true);
}

var timeout, interval;
function blink(val) {
  if (val) {
    interval = setInterval(function() { $('#lauren').css('font-weight', '800'); }, 3000);
    timeout = setTimeout( function() { 
      setInterval(function() { $('#lauren').css('font-weight', '300'); }, 3000);
    }, 1500);
  }
}

function getLauren() {
  if ($('#getlauren-content').is(':hidden')) {
    $('#getlauren-thankyou').hide();
    $('#learnmore-content').hide();
    $('#getlauren-content').show();
    $('#plate').slideDown(500, function() { $('#close').show(); });
  } else {
    $('#plate').slideUp(500);
  }
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
  nextChar(0);
  setTimeout(exitIntro, phrase.length*100+1500);

  $('#lauren').mouseover(function() {
    $('#lauren').css('font-weight', '800');
    $('#options').stop().fadeIn();
  });

  $('nav').mouseleave(function() {
    $('#options').stop().fadeOut();
    var val = $('#plate').is(':hidden');
  });

  $('#lauren').click(function() {
    window.location = '/';
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
  });
});

