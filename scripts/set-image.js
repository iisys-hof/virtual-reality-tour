
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
    dur: {type: 'number', default: 300},
    maxImages: {type: 'number', default: 11},
    changeRate: {type: 'number', default: 820}
  },
  
  tick: function() {    
    var ticks = AFRAME.scenes[0].states.ticks++;
    var data = this.data;
    if(ticks<data.changeRate)
      return;
    AFRAME.scenes[0].states.ticks = 0;    
    var camera = document.querySelector("#myCam");
    // Fade out image.
    data.target.emit('set-image-fade');
    // Wait for fade to complete.
    setTimeout(function () {
      var currentImg = AFRAME.scenes[0].states.currentImg;
      if(true){
        if(currentImg==data.maxImages) {
            currentImg=1; 
        } else {
            currentImg++;
        }
      } 
      AFRAME.scenes[0].states.currentImg = currentImg;
      data.target.setAttribute('material', 'src', '#img' + currentImg);        
      camera.components["look-controls"].pitchObject.rotation.x = 0;
      camera.components["look-controls"].yawObject.rotation.y = 0;      
    }, data.dur);
  },

  init: function () {
    var data = this.data;
    var el = this.el;
    AFRAME.scenes[0].states.ticks = 0;
    // dieser Wert muss angepasst werden, damit alle Bilder angezeigt werden.    
    var camera = document.querySelector("#myCam");
    
    this.setupFadeAnimation();

    el.addEventListener(data.on, function () {
      // Fade out image.
      data.target.emit('set-image-fade');
      // Wait for fade to complete.
      setTimeout(function () {
        var currentImg = AFRAME.scenes[0].states.currentImg;
        if(data.src=='linkRight'){
          if(currentImg==data.maxImages) {
              currentImg=1; 
          } else {
              currentImg++;
          }
        } else if (data.src=='linkLeft'){
                  if (currentImg==1) {
                      currentImg=data.maxImages;  
                  }
                  else {
                      currentImg--;
                  }
        } 
        AFRAME.scenes[0].states.currentImg = currentImg;
        AFRAME.scenes[0].states.ticks = 0;
        data.target.setAttribute('material', 'src', '#img' + currentImg);        
        camera.components["look-controls"].pitchObject.rotation.x = 0;
        camera.components["look-controls"].yawObject.rotation.y = 0;       
      }, data.dur);
    });
  },

  /**
   * Setup fade-in + fade-out.
   */
  setupFadeAnimation: function () {
    var data = this.data;
    var targetEl = this.data.target;

    // Only set up once.
    if (targetEl.dataset.setImageFadeSetup) { return; }
    targetEl.dataset.setImageFadeSetup = true;

    // Create animation.
    targetEl.setAttribute('animation__fade', {
      property: 'material.color',
      startEvents: 'set-image-fade',
      dir: 'alternate',
      dur: data.dur,
      from: '#FFF',
      to: '#000'
    });
  }
});