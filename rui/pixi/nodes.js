// @jsx h
import { Node as BaseNode, h, hook, compute } from 'rui'

// TODO treeshaking?
// import { Container as _Container } from '@pixi/display'
// import { Sprite as _Sprite } from '@pixi/sprite'
// import { Text as _Text } from '@pixi/text'
// import { Application as _Application } from '@pixi/app';
import * as PIXI from 'pixi.js'

export class PIXINode extends BaseNode {
  createAnchor() {
    return new BaseNode(new PIXI.Container(), { foo: 'bar' })
  }
  createText(text) {
    throw 'TODO'
  }
  updateText(el, text) {
  }
  applyProp(el, key, value) {
    const cur = el[key]
    // anchor
    if (cur instanceof PIXI.Point || cur instanceof PIXI.ObservablePoint) {
      if (Array.isArray(value)) {
        cur.set(...value)
      } else {
        cur.set(value)
      }
    } else if (key.slice(0, 2) === 'on') {
      // event
      // TODO better?
      const evtName = key.slice(2)
      el.interactive = true
      // https://github.com/pixijs/pixi.js/blob/0d830d9ab3b7a45853c5fa0fee60be5edf5d4650/packages/interaction/src/InteractionManager.js#L953
      el[evtName] = value
    } else {
      el[key] = value
    }
  }
  append(node) {
    this.el.addChild(node.el)
    super.append(node)
  }
  replace(oldNodes, newNodes) {
    const container = this.el
    const index = container.getChildIndex(oldNodes[0].el)
    oldNodes.forEach(({ el }) => container.removeChild(el))
    newNodes.forEach(({ el }, i) => container.addChildAt(el, index+i))
    return super.replace(oldNodes, newNodes)
  }
}

export function Node({ el, ...props }, children) {
  return new PIXINode(el, props, children)
}

export function Container(props, children) {
  return new PIXINode(new PIXI.Container(), props, children)
}

export function Sprite({ tex, ...props }, children) {
  const el = new PIXI.Sprite(tex)
  el.anchor.set(0.5) // default center
  return new PIXINode(el, props, children)
}

export function Text({ fontFamily='Arial', fontSize, fill, ...props }, children) {
  const el = new PIXI.Text('', {
    fontFamily,
    fontSize,
    fill,
  })
  el.anchor.set(0.5)

  const text = compute(() => children.map(c => typeof c === 'function' ? c() : c).join(''))
  return new PIXINode(el, { text, ...props })
}