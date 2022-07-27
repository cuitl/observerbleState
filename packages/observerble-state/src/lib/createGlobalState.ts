import { useEffect, useState } from 'react'

import Observerble, { HookFn } from './Observerble'
import userObserverble, { DepsFn } from './userObserverble'

type ExposeProps<S> = {
  state: Observerble<S>['state']
  /** modify state */
  setState: Observerble<S>['set']
  /** state begin use */
  onTrap: (fn: HookFn) => void
  /** state begin out of use */
  onUnTrap: (fn: HookFn) => void
  /** before add a new observer */
  onTrack: (fn: HookFn) => void
  /** before remove a observer */
  onUnTrack: (fn: HookFn) => void
  /** state change & before emit to other observer */
  onTrigger: (fn: HookFn) => void
  /**
   * after state change
   */
  onChange: (fn: (state: S, prev: S) => void) => void
}

/**
 * create golobal share state
 * @param state init state
 * @param setup state created & hook for state use
 * @returns hook for react and control components update by using depsFn param
 */
export default function createGlobalState<S>(
  state: S,
  setup?: (state: ExposeProps<S>) => void,
) {
  const globalState = new Observerble<S>(state)

  /**
   * Hook for react components use to observe state
   * @param depsFn (custom|auto) judge state change to control component update
   * @returns [state, setState]
   */
  const hook = (depsFn?: DepsFn<S>) => userObserverble(globalState, depsFn)

  const exposeProps = {} as ExposeProps<S>

  Object.defineProperties(exposeProps, {
    state: {
      get() {
        return globalState.state
      },
    },
    setState: {
      get: () => globalState.set.bind(globalState),
    },
    onTrap: {
      get: () => globalState.on.bind(globalState, 'onTrap'),
    },
    onUnTrap: {
      get: () => globalState.on.bind(globalState, 'onUnTrap'),
    },
    onChange: {
      get: () => globalState.on.bind(globalState, 'onChange'),
    },
    onTrack: {
      get: () => globalState.on.bind(globalState, 'onTrack'),
    },
    onUnTrack: {
      get: () => globalState.on.bind(globalState, 'onUnTrack'),
    },
    onTrigger: {
      get: () => globalState.on.bind(globalState, 'onTrigger'),
    },
  })

  Object.assign(hook, exposeProps)

  setup?.(exposeProps)

  return Object.assign(hook, exposeProps)
  // return hook as typeof hook & ExposeProps<S>
}

/**
 * create simple share state
 * @param state init state
 * @returns hook for comp use & state 'get'|'set' & 'on' for state hook
 */
export const createSimpleGlobalState = <S>(state: S) => {
  const globalState = new Observerble<S>(state)

  const hook = () => {
    const [, forceUpdate] = useState([])

    useEffect(() => {
      return globalState.subscribe(() => {
        // console.log('state change from', prev, ' to ', state)
        forceUpdate([])
      })
    }, [])

    const { state, set } = globalState

    return [state, set] as [S, typeof set]
  }

  const { get, set, on } = globalState
  return Object.assign(hook, {
    get,
    set,
    on,
  })
}