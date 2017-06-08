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
      // Wait for fade to complete.
      data.target.setAttribute('material', 'src', data.src);
    });

    el.addEventListener(data.on, function () {
      if (el.id === '#passthroughVideo-sphere') {
        getLauren();
      } else {
        // Wait for fade to complete.
        data.target.setAttribute('material', 'shader: flat; color: #ffffff; src: '+data.src);
        toggleHomes(false);
        // Pop in close button
        $('#closeHome').show();
        console.log(data.target)

      }
    });
  }
});