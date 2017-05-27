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
  } else {
    clearInterval(interval);
    clearTimeout(timeout);
  }
}

$(document).ready(function() {
  nextChar(0);
  setTimeout(exitIntro, phrase.length*100+1500);

  $('#lauren').mouseover(function() {
    $('#lauren').css('font-weight', '800');
    blink(false);
    $('#options').stop().fadeIn();
  });

  $('nav').mouseleave(function() {
    $('#options').stop().fadeOut();
    var val = $('#plate').is(':hidden');
    blink(true);
  });

  $('#lauren').click(function() {
    window.location = '/';
  });

  $('#learnmore').click(function() {
    $('#plate').slideToggle(500);
  });
});

