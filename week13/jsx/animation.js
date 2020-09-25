const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start-time");
const PAUSE_START = Symbol("puase-start");
const PAUSE_TIME = Symbol("pause-time");

export class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }
  start() {
    let startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[TICK] = () => {
      let now = Date.now();
      for (let animation of this[ANIMATIONS]) {
        let t;

        if (this[START_TIME].get(animation) < startTime)
          t = now - startTime - this[PAUSE_TIME] - animation.delay;
        else
          t =
            now -
            this[START_TIME].get(animation) -
            this[PAUSE_TIME] -
            animation.delay;
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        }
        console.log("t animation.delay", t, animation.delay);
        if (t > 0) animation.reveive(t);
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    };
    this[TICK]();
  }

  pause() {
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER]);
  }
  resume() {
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    this[TICK]();
  }
  reset() {}
  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }
  remove(animation) {
    this[ANIMATIONS].delete(animation);
  }
  set rate(val) {}
  get rate() {}
}

export class Animation {
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    delay,
    timingFunction,
    template
  ) {
    timingFunction = timingFunction || ((v) => v);
    template = template || ((v) => v);
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
    this.delay = delay;
    this.template = template;
  }
  reveive(time) {
    console.log("reveive", time);
    let range = this.endValue - this.startValue;
    let progress = this.timingFunction(time / this.duration);
    this.object[this.property] = this.template(
      this.startValue + range * progress
    );
  }
}
