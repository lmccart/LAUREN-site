AFRAME.registerComponent('setup', {
  schema: {},
  init: function () {
    setTimeout(function() {
      var sky = document.querySelector('#image-360');
      console.log(sky)
      sky.emit('startRotateSky');
      var homes = document.querySelector('#links');
      homes.emit('startRotateHomes');
    }, 3000);
  }
});