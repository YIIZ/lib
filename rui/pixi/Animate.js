// @jsx h
import { h, value, compute, replace, hook, watch, isCompute } from 'rui'
import { Container, Sprite, Text } from 'lib/rui/pixi'

import { tween } from 'popmotion'

// TODO
// https://codesandbox.io/s/framer-motion-keyframes-ekks8?fontsize=14&module=%2Fsrc%2FExample.tsx
// TODO direct props and animating it?
export default function Animate({ N: Node, initial, animate, duration, ease, loop, yoyo, ...props }, children) {
  const newStyle = isCompute(animate) ? animate : compute(() => animate)
  const node = <Node {...props}>{...children}</Node>

  const [animating, setAnimating] = value(false)
  const animationDone = () => setAnimating(false)

  function apply(props) {
    // TODO? cache keys
    for (const [key, value] of Object.entries(props)) {
      node.applyProp(key, value)
    }
  }

  let lastStyle = initial
  let lastAction = null
  watch(newStyle, (style) => {
    if (!lastStyle) {
      lastStyle = style
      apply(style)
      return
    }
    if (lastAction) lastAction.stop()
    setAnimating(true)
    const action = tween({
      from: lastStyle,
      to: style,
      duration,
      yoyo,
      loop,
      ease,
    }).start({ update: apply, complete: animationDone })
    lastStyle = style
    lastAction = action
  })

  node.animating = animating
  return node
}