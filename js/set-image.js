/* global AFRAME */

/**
 * Component that listens to an event, fades out an entity, swaps the texture, and fades it
 * back in.
 */
AFRAME.registerComponent('set-image', {
  schema: {
    on: {type: 'string'},
    target: {type: 'selector'},
    src: {type: 'string'},
    dur: {type: 'number', default: 300}
  },

  init: function () {
    var data = this.data;
    var el = this.el;

    el.addEventListener('record', function () {
      data.target.setAttribute('material', 'src', data.src);
    });

    el.addEventListener(data.on, function () {
      if (el.id === '#passthroughVideo-sphere') {
        getLauren();
      } else {
        data.target.setAttribute('src', data.src);
        data.target.emit('stopRotateSky');
        data.target.emit('startRotateHome');
        toggleHomes(false);
        $('#closeHome').show();
        if (videoPlaying || $('#volume').attr('src') === 'img/volume-off.png') el.setAttribute('sound', 'volume', '0');
        else el.setAttribute('sound', 'volume', '5');
        data.target.setAttribute('material', 'shader: flat; opacity: 0; src: '+data.src);
        setTimeout(function() { data.target.setAttribute('material', 'opacity', '1.0'); }, 300);
      }
    });

    el.addEventListener('close', function() {
      console.log('CLOSE')
      el.components.sound.stopSound();
      var opac = videoPlaying ? 0 : 1;
      data.target.setAttribute('material', 'shader: standard; src: #lauren-video; opacity:'+opac);
      data.target.emit('stopRotateHome');
      data.target.emit('startRotateSky');
    });
  }
});