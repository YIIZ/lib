// @jsx h
import { h, take, value, compute, peek, if as _if } from 'rui'
import { sep, join, normalize } from 'path'

// TODO
// history?
// go(path, state)?
const make = (segments, onRoute, depth=0, dir='/') => {
  // base, ext?
  // https://nodejs.org/api/path.html#path_path_parse_path
  const name = compute(() => segments()[depth])
  // const path = compute(() => join(dir, `${name()}`))
  const next = () => make(segments, onRoute, depth+1, join(dir, `${name()}`))

  // TODO class
  const pathOf = (...paths) => join(dir, ...paths)
  const go = (...paths) => onRoute(pathOf(...paths))
  // TODO mutiple route by switch/case?
  const route = (match, N) => {
    const test = typeof match === 'function' ? match : n => n === match

    // TODO no builder, remove lazy next()
    return _if(() => test(name()), () => <N router={next}/>)
  }
  const router = { name, dir, next, go, pathOf, route }
  return router
}

export function useRouter(path_, onRoute_) {
  const [path, onRoute] = typeof path_ === 'undefined'
    ? value('/')
    : [path_, onRoute_]
  const segments = compute(() => normalize(`/${path()}/`).split(sep).slice(1, -1))
  return make(segments, onRoute)
}

export default useRouter
