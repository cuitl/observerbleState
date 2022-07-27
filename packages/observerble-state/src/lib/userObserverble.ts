import { useEffect, useRef, useState } from 'react'

import Observerble from './Observerble'

export type DepsFn<S> = (newState: S, prevState: S) => boolean | any[]

export default function userObserverble<S>(
  globalState: Observerble<S>,
  depsFn?: DepsFn<S>,
) {
  const depsFnRef = useRef(depsFn)
  depsFnRef.current = depsFn
  const depsRef = useRef<any[]>([])

  const [, forceUpdate] = useState([])

  useEffect(() => {
    if (depsFnRef.current) {
      const deps = depsFnRef.current(globalState.state, globalState.state)
      if (Array.isArray(deps)) {
        // init deps
        depsRef.current = deps
      }
    }

    return globalState.subscribe((state, prev) => {
      if (depsFnRef.current) {
        const newDeps = depsFnRef.current(state, prev)
        // if return deps array, compare every dep changes
        if (Array.isArray(newDeps)) {
          const oldDeps = depsRef.current
          if (compare(oldDeps, newDeps)) {
            forceUpdate([])
          }
          // update prev deps
          depsRef.current = newDeps
        } else {
          // custom compare state change by depsFn which return bool to control the component update
          newDeps && forceUpdate([])
        }
        return
      }
      // 数据变动后组件强制刷新
      forceUpdate([])
    }, '__React_Comp__')
  }, [])

  const { state, set } = globalState

  return [state, set] as [S, typeof set]
}

function compare(oldDeps: unknown[], newDeps: unknown[]) {
  if (oldDeps.length !== newDeps.length) {
    return true
  }
  for (const index in newDeps) {
    if (oldDeps[index] !== newDeps[index]) {
      return true
    }
  }
  return false
}
