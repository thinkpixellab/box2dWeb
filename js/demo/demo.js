goog.provide('Demo');
goog.provide('Demo.FrameEvent');

goog.require('box2d.AABB');
goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.World');

goog.require('demoDraw');
goog.require('demos.compound');
goog.require('demos.crank');
goog.require('demos.pendulum');
goog.require('demos.stack');
goog.require('demos.top');

goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.math.Vec2');

goog.require('pixelLab.FpsLogger');

/**
 @constructor
 @extends {goog.events.EventTarget}
 */
Demo = function(canvasContext) {
  this.m_canvasContext = canvasContext;
  this.m_canvasContext.fillStyle = this.m_canvasContext.strokeStyle = '#666';

  this.m_demos = [demos.compound, demos.crank, demos.stack, demos.pendulum, demos.top];
  this.nextDemo();

  this.m_fpsLogger = new pixelLab.FpsLogger();
  this.m_limitFps = true;
  this._step();

  $(canvasContext.canvas).click(goog.bind(function(e) {
    var offset = new goog.math.Vec2(e.pageX - canvasContext.canvas.offsetLeft, e.pageY - canvasContext.canvas.offsetTop);
    if (Math.random() < 0.5) {
      Demo.createBall(this.m_world, offset.x, offset.y, 10);
    } else {
      Demo.createBox(this.m_world, offset.x, offset.y, 10, 10, false);
    }
  },
  this));
};
goog.inherits(Demo, goog.events.EventTarget);

/**
 @param {number=} opt_delta
*/
Demo.prototype.nextDemo = function(opt_delta) {
  if (this.m_demos.length == 0) {
    throw 'No demos to load';
  } else if (opt_delta === undefined) {
    // if delta is undefined, just randomize the demo
    this.m_initId = Math.floor(Math.random() * this.m_demos.length);
  } else {
    this.m_initId += opt_delta;
    while (this.m_initId < 0) {
      this.m_initId += this.m_demos.length;
    }
    this.m_initId %= this.m_demos.length;
  }

  this.m_world = Demo.createWorld();
  this.m_demos[this.m_initId](this.m_world);
};

/**
 @param {boolean=} opt_limitFps
 */
Demo.prototype.limitFps = function(opt_limitFps) {
  if (!(opt_limitFps === undefined)) {
    this.m_limitFps = !!opt_limitFps;
  }
  return this.m_limitFps;
};

/**
 @private
 */
Demo.prototype._step = function() {
  var ms = this.m_limitFps ? 1000 / 60 : 1;
  goog.global.setTimeout(goog.bind(this._step, this), ms);
  this.m_world.Step(Demo._secondsPerFrame, 1);
  if (!this.m_world.sleeping) {
    demoDraw.drawWorld(this.m_world, this.m_canvasContext);
  }
  var fps = Math.round(this.m_fpsLogger.AddInterval());
  this.dispatchEvent(new Demo.FrameEvent(fps, this.m_world.sleeping));
};

Demo.createWorld = function() {
  var worldAABB = new box2d.AABB();
  worldAABB.minVertex.Set(-1000, -1000);
  worldAABB.maxVertex.Set(1000, 1000);
  var gravity = new box2d.Vec2(0, 300);
  var doSleep = true;
  var world = new box2d.World(worldAABB, gravity, doSleep);
  Demo.createBox(world, 250, 305, 250, 5, true, true);
  Demo.createBox(world, 5, 185, 5, 125, true, true);
  Demo.createBox(world, 495, 185, 5, 125, true, true);
  return world;
};

/**
 @param {!box2d.World} world
 @param {number=} radius
 @return {!box2d.Body}
 */
Demo.createBall = function(world, x, y, radius) {
  radius = radius || 20;
  var ballSd = new box2d.CircleDef();
  ballSd.density = 1.0;
  ballSd.radius = radius;
  ballSd.restitution = 0.8;
  ballSd.friction = 0.9;
  var ballBd = new box2d.BodyDef();
  ballBd.AddShape(ballSd);
  ballBd.position.Set(x, y);
  return world.CreateBody(ballBd);
};

/**
 @param {!box2d.World} world
 @param {boolean=} fixed
 @param {boolean=} filled
 @return {!box2d.Body}
 */
Demo.createBox = function(world, x, y, width, height, fixed, filled) {
  if (typeof(fixed) == 'undefined') {
    fixed = true;
  }
  if (typeof(filled) == 'undefined') {
    filled = false;
  }
  var boxSd = new box2d.BoxDef();
  if (!fixed) {
    boxSd.density = 1.0;
  }
  if (filled) {
    boxSd.userData = 'filled';
  }
  boxSd.extents.Set(width, height);
  var boxBd = new box2d.BodyDef();
  boxBd.AddShape(boxSd);
  boxBd.position.Set(x, y);
  return world.CreateBody(boxBd);
};

/**
 @private
 @const
 @type {number}
 */
Demo._secondsPerFrame = 1.0 / 60;

/**
 @private
 @const
 @type {number}
 */
Demo._millisecondsPerFrame = Demo._secondsPerFrame * 1000;

//
// Events
//
/**
 * @param {number} fps
 * @constructor
 * @extends {goog.events.Event}
 */
Demo.FrameEvent = function(fps, sleeping) {
  goog.base(this, Demo.FrameEvent.Type);
  this.fps = fps;
  this.sleeping = sleeping;
};
goog.inherits(Demo.FrameEvent, goog.events.Event);

/**
 @const
 @type {string}
 */
Demo.FrameEvent.Type = 'Demo.FrameEventType';
