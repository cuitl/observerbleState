import Observer from './Observer'
import Subject from './Subject'

export type SetStateAction<S> = (prevState: S) => S

export interface Subscribe<S> {
  (prevState: S, state: S): void
}

export type Hook =
  | 'onTrap'
  | 'onUnTrap'
  | 'onTrack'
  | 'onUnTrack'
  | 'onTrigger'
  | 'onChange'

export interface HookFn {
  (...args: any[]): void
  hook?: Hook
}

export default class Observerble<S> extends Subject<SubscribeObserver<S>> {
  private hookMap: Record<Hook, HookFn[]> = {
    // state begin use
    onTrap: [],
    // state begin out of use
    onUnTrap: [],
    // state change
    onChange: [],
    // before add new ob
    onTrack: [],
    // before remove a ob
    onUnTrack: [],
    // before emit
    onTrigger: [],
  }

  constructor(private _state: S) {
    super('Observerble')
  }

  get state() {
    return this._state
  }

  get() {
    return this._state
  }

  set(state: S | SetStateAction<S>, deep = false) {
    const prevState = this.state
    const newState =
      typeof state === 'function'
        ? (state as SetStateAction<S>)(prevState)
        : state

    if (this.compare(prevState, newState, deep)) {
      this._state = newState

      this.invokeHook('onTrigger')

      this.emit(newState, prevState)

      this.invokeHook('onChange', newState, prevState)
    }
  }

  compare(prevState: S, newState: S, deep = false) {
    if (deep) {
      // compare deep
    }
    return !Object.is(prevState, newState)
  }

  subscribe(fn: Subscribe<S>, name = '') {
    const ob = new SubscribeObserver<S>(fn, name)
    this.addObserver(ob)

    return () => {
      this.removeObserver(ob)
    }
  }

  invokeHook(hook: Hook, ...args: any[]) {
    this.hookMap[hook].forEach(fn => fn(...args))
  }

  on(hook: Hook, fn: HookFn) {
    fn.hook = hook
    this.hookMap[hook].push(fn)
  }

  onObChange(prevLen: number, len: number) {
    if (prevLen === 0 && len > 0) {
      // onTrap
      this.invokeHook('onTrap')
      return
    }

    if (prevLen > 0 && len === 0) {
      // onUnTrap
      this.invokeHook('onUnTrap')
    }
  }

  addObserver(ob: SubscribeObserver<S>) {
    this.invokeHook('onTrack')
    const plen = this.observers.length
    super.addObserver(ob)
    this.onObChange(plen, this.observers.length)
  }

  removeObserver(ob: SubscribeObserver<S>) {
    this.invokeHook('onUnTrack')
    const plen = this.observers.length
    const hasRemove = super.removeObserver(ob)
    if (hasRemove) {
      this.onObChange(plen, this.observers.length)
    }
    return hasRemove
  }

  clear() {
    const plen = this.observers.length
    super.clear()
    this.onObChange(plen, 0)
  }
}

export class SubscribeObserver<S> extends Observer {
  sub?: Observerble<S>
  constructor(private fn: Subscribe<S>, name = '') {
    super(name)
  }

  update(sub: Observerble<S>, prevState: S, state: S) {
    this.fn(prevState, state)
    if (sub) {
      this.sub = sub
    }
  }
}
