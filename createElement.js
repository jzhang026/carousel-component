export function create(Cls, attributes, ...children) {
  let o;
  if (typeof Cls === "string") {
    o = new Wrapper(Cls);
  } else {
    o = new Cls({
      timer: {},
    });
  }

  for (const key in attributes) {
    o.setAttribute(key, attributes[key]);
  }
  let visit = (children) => {
    for (const child of children) {
      if (typeof child === "string") {
        child = new Text(child);
      }

      if (Array.isArray(child)) {
        visit(child);
        continue;
      }
      o.appendChild(child);
    }
  };

  visit(children);
  return o;
}
export class Wrapper {
  constructor(type) {
    this.children = [];
    this.root = document.createElement(type);
  }
  getAttribute(name) {
    return this[name];
  }
  setAttribute(name, value) {
    this[name] = value;
    this.root.setAttribute(name, value);

    if (name.match(/^on([\s\S]+)$/)) {
      let eventName = RegExp.$1.replace(/^[\s\S]/, (c) => c.toLowerCase());
      this.addEventListener(eventName, value);
    }

    if (name === "enableGesture") {
      value(this.root);
    }
  }
  get classList() {
    return this.root.classList;
  }
  appendChild(child) {
    this.children.push(child);
  }
  addEventListener(...arg) {
    this.root.addEventListener(...arg);
  }
  get style() {
    return this.root.style;
  }
  set style(v) {
    this.root.style = v;
  }
  set innerText(v) {
    this.root.innerText = v;
  }
  mountTo(parent) {
    parent.appendChild(this.root);
    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }
}
export class Text {
  constructor(text) {
    this.root = document.createTextNode(text);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
  getAttribute(name) {
    return this.root.getAttribute(name);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);

    if (name.match(/^on([\s\S]+)$/)) {
      let eventName = RegExp.$1.replace(/^[\s\S]/, (c) => c.toLowerCase());
      this.addEventListener(eventName, value);
    }

    if (name === "enableGesture") {
      value(this.root);
    }
  }
}
export class Div {
  constructor(config) {
    this.children = [];
    this.root = document.createElement("div");
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  appendChild(child) {
    this.children.push(child);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }
}
