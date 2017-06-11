AFRAME.registerComponent('setup', {
  schema: {},
  init: function () {
    document.querySelector('#image-360').emit('startRotateSky');
    var links = document.querySelector('#links');
    links.addEventListener('animationcomplete', function () {
      var rot = links.getAttribute('rotation').y + 72;
      links.setAttribute('animation', 'to', '0 '+rot+' 0');
      setTimeout(function() { links.emit('startRotateHomes'); }, 3000);
    });
    links.emit('startRotateHomes');
  }
});