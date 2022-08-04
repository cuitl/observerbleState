import { useCallback, useEffect, useRef, useState } from 'react'

import Observerble from './Observerble'

export type DepsFn<S> = (newState: S, prevState: S) => boolean | any[]

const Observer_React_Comp_Name = '__React_Comp__'

/**
 * add a new observer(React component) for globalState
 * component observe globalState
 * @param globalState share state
 * @param depsFn deps|fn, fn: custom compare state, deps: auto compare state
 * @example
 * @returns [state, setState]
 */
export default function useObserverble<S>(
  globalState: Observerble<S>,
  depsFn?: DepsFn<S>,
) {
  const initRef = useRef(depsFn)
  if (!initRef.current) {
    // if (depsFn) {
    //   console.warn('depsFn must not be dynamic');
    // }

    // depsFn must not be dynamic
    // the hook calling sequence rely on depsFn's init value
    return useSimpleObserverble(globalState)
  }

  // if (!depsFn) {
  //   console.warn('depsFn must not be dynamic');
  // }

  const { initDeps, observer } = useDepsFn<S>(depsFn)

  useEffect(() => {
    initDeps(globalState)
    return globalState.subscribe(observer, Observer_React_Comp_Name)
  }, [])

  const { state, set } = globalState
  return [state, set.bind(globalState)] as [S, typeof set]
}

export function useObserverbleOld<S>(
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
      forceUpdate([])
    }, Observer_React_Comp_Name)
  }, [])

  const { state, set } = globalState

  return [state, set.bind(globalState)] as [S, typeof set]
}

export const useDepsFn = <S>(depsFn?: DepsFn<S>) => {
  const depsFnRef = useRef(depsFn)
  depsFnRef.current = depsFn
  const depsRef = useRef<any[]>([])

  const [, forceUpdate] = useState([])

  const initDeps = useCallback((globalState: Observerble<S>) => {
    if (depsFnRef.current) {
      const { state } = globalState
      const deps = depsFnRef.current(state, state)
      if (Array.isArray(deps)) {
        // init deps
        depsRef.current = deps
      }
    }
  }, [])

  const observer = useCallback((state: S, prev: S) => {
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
    forceUpdate([])
  }, [])

  return {
    initDeps,
    observer,
  }
}

export function useSimpleObserverble<S>(globalState: Observerble<S>) {
  const [, forceUpdate] = useState([])

  useEffect(() => {
    return globalState.subscribe(() => {
      forceUpdate([])
    }, Observer_React_Comp_Name)
  }, [])

  const { state, set } = globalState
  return [state, set.bind(globalState)] as [S, typeof set]
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
