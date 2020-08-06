import { create } from "../createElement";
export class TabPanel {
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
  select(index) {
    for (const view of this.childViews) {
      view.style.display = "none";
    }
    for (const view of this.titleViews) {
      view.classList.remove("selected");
    }

    this.childViews[index].style.display = "";
    this.titleViews[index].classList.add("selected");
  }
  render() {
    this.childViews = this.children.map((child) => (
      <div class="panel-item">{child}</div>
    ));
    this.titleViews = this.children.map((child, index) => (
      <span onClick={() => this.select(index)} style="margin-right:10px;">
        {child.getAttribute("title")}
      </span>
    ));
    setTimeout(() => {
      this.select(3);
    }, 16);
    return (
      <div class="panel">
        <div class="panel-title">{this.titleViews}</div>
        <div class="panel-body">{this.childViews}</div>
      </div>
    );
  }
}
