import Observer from './Observer'

let _id = 0

export default class Subject<T extends Observer> {
  protected observers: T[] = []
  protected id = 0

  constructor(public name = '') {
    this.id = ++_id
  }

  addObserver(ob: T) {
    this.observers.push(ob)
  }

  removeObserver(ob?: T) {
    if (ob) {
      const index = this.observers.findIndex(o => o === ob)
      if (index > -1) {
        this.observers.splice(index, 1)
        return true
      }
    }
    return false
  }

  clear() {
    this.observers = []
  }

  emit(...args: any[]) {
    this.observers.forEach(ob => ob.update(this, ...args))
  }

  logObservers(...args: any[]) {
    console.log(...args, this.observers)
  }
}
