/**
 * @file observerble-state libaray entry js
 */
// import createGlobalState, {createSimpleGlobalState} from './createGlobalState'

export {
  default as createGlobalState,
  createSimpleGlobalState,
} from './createGlobalState'
export { default as Observerble, SubscribeObserver } from './Observerble'
export {
  useDepsFn,
  default as useObserverble,
  useSimpleObserverble,
} from './useObserverble'
