var phrase = 'Hi, I\'m Lauren and I want to be your smart home.';

function nextChar(i){
  $('#greeting').text(phrase.substring(0, i));
  if(i < phrase.length){
    setTimeout('nextChar(' + (i + 1) + ')', 100);   
  }
}

function swap() {
  $('#intro').fadeOut(3000);
  //$('a-scene').fadeIn(1000);
}

$(document).ready(function() {
  //$('a-scene').hide();
  nextChar(0);
  setTimeout(swap, phrase.length*100+500);


  $('#lauren').click(function() {
    window.location = '/';
  });

  $('#learnmore').click(function() {
    $('#plate').slideToggle();
  });
});

