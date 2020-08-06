import { create } from "../createElement";
export class ListView {
  constructor() {
    this.position = 0;
    this.children = [];
    this.attributes = new Map();
    this.root = null;
  }
  setAttribute(name, value) {
    this.attributes.set(name, value);
  }
  getAttribute(name) {
    return this[name];
  }
  appendChild(child) {
    this.children.push(child);
  }
  mountTo(parent) {
    const render = this.render();

    this.root = render.root;
    render.mountTo(parent);
  }
  render() {
    this.childViews = this.attributes.get("data").map(this.children[0]);
    return <div class="list-view">{this.childViews}</div>;
  }
}
