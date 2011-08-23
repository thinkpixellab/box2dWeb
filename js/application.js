goog.require('Demo');
goog.require('Demo.FrameEvent');

$(document).ready(function() {
  var canvas = $('canvas')[0];
  canvas.onselectstart = function () {
    return false;
  };

  var demo = new Demo(canvas.getContext('2d'));
  $('#fps_limit').click(function() {
    demo.limitFps($('#fps_limit').attr('checked'));
  });
  $('#fps_limit').attr('checked', demo.limitFps());

  //
  // Buttons
  //
  $('#previous').click(function() {
    demo.nextDemo(-1);
  });
  $('#reload').click(function() {
    demo.nextDemo(0);
  });
  $('#next').click(function() {
    demo.nextDemo(1);
  });

  var frameCount = 1;
  demo.addEventListener(Demo.FrameEvent.Type, function(e) {
    if (frameCount === 0) {
      $('#fps').html(e.fps + 'fps');

      if (e.sleeping) {
        $('#fps').addClass('sleeping');
      } else {
        $('#fps').removeClass('sleeping');
      }
    }
    frameCount++;
    frameCount %= 30;
  });
});
