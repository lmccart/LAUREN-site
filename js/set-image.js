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
        data.target.setAttribute('material', 'shader: flat; color: #ffffff; src: '+data.src);
        toggleHomes(false);
        $('#closeHome').show();
      }
    });

    el.addEventListener('close', function() {
      console.log('CLOSE')
      console.log(el.components.sound)
      el.components.sound.stopSound();
    });
  }
});