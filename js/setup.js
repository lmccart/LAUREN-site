AFRAME.registerComponent('setup', {
  schema: {},
  init: function () {
    var sky = document.querySelector('#image-360');
    console.log(sky)
    sky.emit('startRotateSky');
  }
});