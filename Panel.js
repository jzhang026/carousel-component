import { create } from './createElement'

export class Panel {
  constructor () {
    this.position = 0
    this.children = []
    this.attributes = new Map
    this.root = null
  }
  setAttribute (name, value) {
    this.attributes.set(name, value)
  }
  appendChild (child) {
    this.children.push(child)
  }
  mountTo (parent) {
    const render = this.render()

    this.root = render.root
    render.mountTo(parent)
  }
  render () {
    return <div class='panel'>
             <h1 style="background:lightblue;">{this.attributes.get('title')}</h1>
             <div>
               {this.children}
             </div>
           </div>
  }
}
