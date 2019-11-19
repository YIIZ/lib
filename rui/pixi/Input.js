// @jsx h
import { h, value, compute, hook, if as _if, each } from 'rui'
import { Sprite, Text, Container } from './nodes'

import DOMDummy from './DOMDummy'
import * as PIXI from 'pixi.js'
import { tween } from 'popmotion'
import * as easing from '@popmotion/easing'

function Caret(props) {
  const [alpha, setAlpha] = value(1)
  hook(() => {
    const play = tween({
      from: 0.8, to: 0.2, duration: 800,
      yoyo: Infinity,
      ease: easing.linear,
    }).start(setAlpha)
    return () => play.stop()
  })
  return <Sprite tex={PIXI.Texture.WHITE} alpha={alpha}
    width={4}
    {...props}
  />
}

export default function Input({ placeholder, ratio, fontSize, fill, fontFamily, ...props }, children) {
  const [text, setText] = value('')
  const usePlaceholder = compute(() => text().length < 1)
  const displayText = compute(() => usePlaceholder() ? placeholder : text())

  // select all on focus https://stackoverflow.com/a/4067488
  const selectAllText = (el) => el.setSelectionRange(0, el.value.length)

  const textNode = <Text fontSize={fontSize} fill={fill} fontFamily={fontFamily}>{displayText}</Text>
  // const caret = <Sprite tex={PIXI.Texture.WHITE} />

  const node = <DOMDummy tag="input"
    style="font-size: 1px;" ratio={ratio}
    onclick={({ target }) => selectAllText(target)}
    oninput={({ target }) => setText(target.value || placeholder)}
  >
    <Container {...props}>
      {...children}
      {_if(usePlaceholder, () => <Caret x={textNode.el.width*-0.5-10} height={textNode.el.height} />)}
      {textNode}
    </Container>
  </DOMDummy>

  // const { dom } = node
  node.value = text
  return node
}
