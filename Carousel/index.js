import { create } from "../createElement";
import { Timeline, Animation } from "../animation/animation.js";
import { ease } from "../animation/timingFunctions.js";
import { enableGesture } from "../gesture/gesture";
import css from "./index.css";
window.create = create;
export class Carousel {
  constructor() {
    this.position = 0;
    this.timeline = new Timeline();
    this.timeline.start();
    this.children = [];
    this.parent = null;
    this.root = null;
    this.timer = null;
  }
  setAttribute(name, value) {
    this[name] = value;
  }

  mountTo(parent) {
    const render = this.render();
    this.root = render.root;
    this.parent = parent;
    render.mountTo(parent);

    this.loop();
  }
  reRender() {
    if (!this.parent) return;
    clearTimeout(this.timer);
    this.timeline.reset();
    this.position = 0;
    const render = this.render();
    this.parent.removeChild(this.root);

    this.root = render.root;
    render.mountTo(this.parent);
    this.loop();
  }
  appendChild(child) {
    this.children.push(child);
    this.reRender();
  }
  removeChild(index) {
    if (index >= this.children.length) return;

    this.children.splice(index, 1);
    this.reRender();
  }
  loop() {
    let run = () => {
      this.next();
      this.timer = setTimeout(run, 3000);
    };
    this.timer = setTimeout(run, 3000);
  }
  stop() {
    clearTimeout(this.timer);
  }

  next() {
    if (this.timeline.state !== this.timeline.STATE_START) return;
    let nextPosition = (this.position + 1) % this.children.length;

    let current = this.root.children[this.position];
    let next = this.root.children[nextPosition];

    current.style.zIndex = 2;
    next.style.zIndex = 1;

    let currentAnimation = new Animation({
      element: current.style,
      property: "transform",
      start: -100 * this.position,
      end: -100 - 100 * this.position,
      template: (v) => `translateX(${5 * v}px)`,
      duration: 1000,
      timingFunction: ease,
    });
    let nextAnimation = new Animation({
      element: next.style,
      property: "transform",
      start: 100 - 100 * nextPosition,
      end: -100 * nextPosition,
      template: (v) => `translateX(${5 * v}px)`,
      duration: 1000,
      timingFunction: ease,
    });

    this.timeline.add(currentAnimation);
    this.timeline.add(nextAnimation);
    this.position = nextPosition;
  }
  render() {
    const childViews = this.children.map((child, currentPosition) => {
      let offset;
      let reg = /translateX\(([\s\S]+)px\)/;
      let prevPosition =
        (currentPosition - 1 + this.children.length) % this.children.length;
      let nextPosition = (currentPosition + 1) % this.children.length;

      const onStart = () => {
        this.timeline.pause();
        this.stop();

        let current = this.root.children[currentPosition];
        let currentTransformValue = current.style.transform.match(reg)
          ? +current.style.transform.match(reg)[1]
          : 0;

        offset = currentTransformValue + 500 * currentPosition;
      };

      const onPan = (e) => {
        e = e.detail;

        let current = this.root.children[currentPosition];
        let prev = this.root.children[prevPosition];
        let next = this.root.children[nextPosition];

        let dx = e.clientX - e.startX;
        let currentTransformValue = -500 * currentPosition + offset + dx;
        let prevTransformValue = -500 - 500 * prevPosition + offset + dx;
        let nextTransformValue = 500 - 500 * nextPosition + offset + dx;

        current.style.transform = `translateX(${currentTransformValue}px)`;
        prev.style.transform = `translateX(${prevTransformValue}px)`;
        next.style.transform = `translateX(${nextTransformValue}px)`;
      };

      const onPanend = (e) => {
        e = e.detail;

        let direction = 0;
        const dx = e.clientX - e.startX;

        if (e.isFlick) {
          dx > 0 && (direction = 1);
          dx < 0 && (direction = -1);
        } else {
          dx + offset > 250 && (direction = 1);
          dx + offset < -250 && (direction = -1);
        }

        let current = this.root.children[currentPosition];
        let prev = this.root.children[prevPosition];
        let next = this.root.children[nextPosition];

        let currentAnimation = new Animation({
          element: current.style,
          property: "transform",
          start: -500 * currentPosition + offset + dx,
          end: -500 * currentPosition + direction * 500,
          template: (v) => `translateX(${v}px)`,
          duration: 1000,
          timingFunction: ease,
        });
        let prevAnimation = new Animation({
          element: prev.style,
          property: "transform",
          start: -500 - 500 * prevPosition + offset + dx,
          end: -500 - 500 * prevPosition + direction * 500,
          template: (v) => `translateX(${v}px)`,
          duration: 1000,
          timingFunction: ease,
        });
        let nextAnimation = new Animation({
          element: next.style,
          property: "transform",
          start: 500 - 500 * nextPosition + offset + dx,
          end: 500 - 500 * nextPosition + direction * 500,
          template: (v) => `translateX(${v}px)`,
          duration: 1000,
          timingFunction: ease,
        });
        this.timeline.reset();
        this.timeline.start();

        this.position =
          (this.position - direction + this.children.length) %
          this.children.length;

        this.timeline.add(currentAnimation);
        this.timeline.add(prevAnimation);
        this.timeline.add(nextAnimation);

        this.loop();
      };

      const item = (
        <div
          onPan={onPan}
          onPanend={onPanend}
          onStart={onStart}
          enableGesture={enableGesture}
          class="carousel-item"
        >
          {child}
        </div>
      );
      item.addEventListener("dragstart", (e) => e.preventDefault());

      return item;
    });

    return <div class="carousel">{childViews}</div>;
  }
}
