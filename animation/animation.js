export class Timeline {
  constructor() {
    this.STATE_PAUSE = "TIMELINE_PAUSE";
    this.STATE_START = "TIMELINE_START";
    this.STATE_INIT = "TIMELINE_INIT";

    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.addTimes = new Map();
    this.frameInstance = null;
    this.pauseTime = 0;
    this.state = this.STATE_INIT;
  }
  tick = () => {
    let t = Date.now() - this.startTime;
    let animations = this.animations;

    for (const animation of animations) {
      let {
        element,
        property,
        start,
        end,
        duration,
        template,
        timingFunction,
        delay,
      } = animation;
      let addTime = this.addTimes.get(animation);

      if (t < delay + addTime) continue;
      let progression = timingFunction((t - delay - addTime) / duration);
      if (t > duration + delay + addTime) {
        progression = 1;
        animations.delete(animation);
        this.finishedAnimations.add(animation);
      }

      let value = animation.valurFromProgression(progression);

      element[property] = template(value);
    }
    if (this.animations.size) {
      this.frameInstance = requestAnimationFrame(this.tick);
    } else {
      this.frameInstance = null;
    }
  };

  add(animation, addTime) {
    if (this.state === this.STATE_START && !this.frameInstance) {
      this.tick();
    }

    if (this.state === this.STATE_START) {
      addTime = addTime !== undefined ? addTime : Date.now() - this.startTime;

      this.addTimes.set(animation, addTime);
    } else if (this.state === this.STATE_INIT) {
      addTime = addTime !== undefined ? addTime : 0;

      this.addTimes.set(animation, addTime);
    } else {
      addTime = addTime !== undefined ? addTime : Date.now() - this.pauseTime;

      this.addTimes.set(animation, addTime);
    }
    this.animations.add(animation);
  }

  start() {
    if (this.state !== this.STATE_INIT) return;

    this.state = this.STATE_START;
    this.startTime = Date.now();
    this.tick();
  }
  restart() {
    if (this.state !== this.STATE_START) return;

    this.pause();
    for (const animation of this.finishedAnimations) {
      this.animations.add(animation);
    }
    this.frameInstance = null;
    this.startTime = Date.now();
    this.pauseTime = 0;
    this.state = this.STATE_START;
    this.tick();
  }
  reset() {
    if (this.state === this.STATE_START) return;

    this.pause();
    this.animations = new Set();
    this.addTimes = new Map();
    this.finishedAnimations = new Set();
    this.frameInstance = null;
    this.startTime = Date.now();
    this.pauseTime = 0;
    this.state = this.STATE_INIT;
    this.tick();
  }

  pause() {
    if (this.state !== this.STATE_START) return;

    this.state = this.STATE_PAUSE;
    this.pauseTime = Date.now();

    if (this.frameInstance) {
      cancelAnimationFrame(this.frameInstance);
      this.frameInstance = null;
    }
  }

  resume() {
    if (this.state !== this.STATE_PAUSE) return;

    this.state = this.STATE_START;
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }
}
/*
*{ element = '', property= '', start= '', end= '', delay= 0, template='', duration= '', timingFunction=(start, end) => {
        return t => start + t / duration * (end - start)
      }
*/
export class Animation {
  constructor({
    element = "",
    property = "",
    start = "",
    end = "",
    delay = 0,
    template = "",
    duration = "",
    timingFunction = (start, end) => {
      return (t) => start + (t / duration) * (end - start);
    },
  }) {
    this.element = element;
    this.property = property;
    this.start = start;
    this.end = end;
    this.template = template;
    this.delay = delay;
    this.duration = duration;
    this.timingFunction = timingFunction;
  }
  valurFromProgression(progression) {
    return this.start + progression * (this.end - this.start);
  }
}

export class ColorAnimation {
  constructor({
    element = "",
    property = "",
    start = "",
    end = "",
    delay = 0,
    template = "",
    duration = "",
    timingFunction = (start, end) => {
      return (t) => start + (t / duration) * (end - start);
    },
  }) {
    this.element = element;
    this.property = property;
    this.start = start;
    this.end = end;
    this.template = template || ((v) => `rgba(${v.r},${v.g},${v.b},${v.a})`);
    this.delay = delay;
    this.duration = duration;
    this.timingFunction = timingFunction;
  }
  valurFromProgression(progression) {
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a),
    };
  }
}

/*
  let animation = new Animation(object,property,start,end,duration,timingFunction)
 */
